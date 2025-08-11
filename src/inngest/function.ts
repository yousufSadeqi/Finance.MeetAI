import { inngest } from "./client";
import JSONL from "jsonl-parse-stringify";
import {createAgent, openai, TextMessage} from "@inngest/agent-kit"

import { StreamTransctipItem } from "@/app/modules/meetings/types";
import { db } from "@/db";
import { agents, user } from "@/db/schema";
import { inArray } from "drizzle-orm";

const summarizer = createAgent({
  name: 'summarizer',
  system: `
    You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY}),
});

export const meetingsProcessing = inngest.createFunction(
  
  {id : 'meetings/processing'},
  {event: 'meetings/processing'},
  async ({event, step}) => {
    const response = await step.run("fetch-transcipt", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    }); 

    const transcrpt = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTransctipItem>(response);
    })

    const transcriptWithSpeaker = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcrpt.map((item) => item.speaker_id)),
      ]

      const userSpeakers = await db
      .select()
      .from(user)
      .where(inArray(user.id, speakerIds))
      .then((users) => {
        users.map((user) => ({
          ...user, 
        }))
      })

      const agentSpeaker = await db
      .select()
      .from(agents)
      .where(inArray(agents.id, speakerIds))
      .then((agents) => 
        agents.map((agent) => ({
          ...agent,
          // name: agent.name ?? agent.id, // Fallback to id if name is not set
        }))
      )

      const speakers = [...userSpeakers, ...agentSpeaker];

      return transcript.map((items) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === items.speaker_id
        )

        if(!speaker) {
          return {
            ...items,
            user: {
              name: 'Unknown',
            }
          }
        }
        return {
          ...items,
          user: {
            name: speaker.name
          }
        }
      })

     })
  }
);