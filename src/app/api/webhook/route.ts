import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { streamVideo } from "@/lib/stream-video";
import {
  CallEndedEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscription
} from "@stream-io/node-sdk";
import { CallRecordingReadyEvent, CallTranscriptionReadyEvent } from "@stream-io/video-react-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const eventType = (payload as Record<string, unknown>)?.type as string;

  // ---------------------------
  // Handle call.session_started
  // ---------------------------
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId as string;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call session started event" },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or already completed/cancelled" },
        { status: 404 }
      );
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date()
      })
      .where(eq(meetings.id, meetingId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id
    });

    await realtimeClient.updateSession({
      instructions: existingAgent.instruction
    });
  }

  // -------------------------------------------
  // Handle call.session_participant_left
  // -------------------------------------------
  else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid?.split(":")[1];

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call session participant left event" },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  }

  // -------------------------------------------
  // Handle call.session_ended
  // -------------------------------------------
  else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId as string;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call session ended event" },
        { status: 400 }
      );
    }

    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date()
      })
      .where(
        and(
          eq(meetings.id, meetingId),
          eq(meetings.status, "active") // ✅ fixed typo here
        )
      );
  }else if(eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid?.split(":")[1]; 

    const [updateMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl:event.call_transcription.url
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updateMeeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }
    await inngest.send({
      name: 'meetings/processing',
      data: {
        meetingId: updateMeeting.id, 
        transcriptUrl: updateMeeting.transcriptUrl,
      }, 
    })

  }else if(eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid?.split(":")[1]; 

    await db
      .update(meetings)
      .set({
        recordingUrl:event.call_recording.url
      })
      .where(eq(meetings.id, meetingId))
    }

 
  return NextResponse.json({ status: "success" });
}
