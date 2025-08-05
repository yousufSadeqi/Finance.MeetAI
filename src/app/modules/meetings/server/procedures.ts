import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {and, count, desc, eq, getTableColumns, ilike, sql, } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schema";
import { MeetingsStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatar } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({

    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([
          {
            id: ctx.session.user.id,
            name: ctx.session.user.name,
            role: 'admin',
            image:
              ctx.session.user.image ??
              generateAvatar({ seed: ctx.session.user.id, variant: "initials" }),
          }
        ]);

        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
        const issuedAt = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

        const token = streamVideo.generateUserToken({
          user_id: ctx.session.user.id,
          exp: expirationTime,
          validity_in_seconds: issuedAt,
        });

        return { token }; // ✅ FIXED
      }),


    // getOne: protectedProcedure
    getOne: protectedProcedure
    .input(z.object({id: z.string() }))
    .query(async ({input, ctx}) => {
    const [existingMeeeting] = await db
    .select({
        ...getTableColumns(meetings),
        agent: agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
    })
    .from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(and(
      eq(meetings.id, input.id),
      eq(meetings.userId , ctx.session.user.id)  // recheck it
    )
  )

  if(!existingMeeeting){
    throw new TRPCError({code: 'NOT_FOUND', message: 'not found'})
  };
    return existingMeeeting;
  }),
//   // getMany: protectedProcedure
  getMany: protectedProcedure
  .input(z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish(),
    agentId: z.string().nullish(),
    status:z.enum([
      MeetingsStatus.Upcoming,
      MeetingsStatus.Active,
      MeetingsStatus.Completed,
      MeetingsStatus.Processing,
      MeetingsStatus.Cancelled,
    ]).nullish(),  
   })

) // Optional userId for filtering
  .query(async ({ctx, input}) => {
    const {search, page, pageSize, status, agentId} = input;
    const data = await db
    .select({
        ...getTableColumns(meetings),
        agent:agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
    })
    .from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(
      and(
        eq(meetings.userId, ctx.session.user.id),
        search ? ilike(meetings.name, `%${search}%`) : undefined, // Use undefined instead of true
        status ? eq(meetings.status, status) : undefined,
        agentId ? eq(meetings.agentId, agentId) : undefined,
      )
    )
    .orderBy(desc(meetings.createdAt), desc(meetings.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);


    const [total] = await db
    .select({ count: count() })
    .from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(
        and(
            eq(meetings.userId, ctx.session.user.id), // Filter by userId
            search ? ilike(meetings.name, `%${search}%`) : undefined, // Use undefined instead of true
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,  
        )
    )

    const totalPages = Math.ceil(total.count / pageSize); 

    return {
        data,
        totalCount: total.count,
        totalPages,
    }
  }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeetings] = await db
        .insert(meetings) 
        .values({
          ...input,
          userId: ctx.session.user.id, // correctly set userId here
        })
        .returning();

        const call = streamVideo.video.call('default', createdMeetings.id )
        
        await call.create({
          data:{
            created_by_id: ctx.session.user.id,
            custom: {
              meetingId: createdMeetings.id,
              meetingName: createdMeetings.name,
            },
            settings_override: {
              transcription:{
                language: 'en',
                mode: 'auto-on',
                closed_caption_mode: 'auto-on'
              },
              recording: {
                mode: 'auto-on',
                quality: '1080p',
              }
            }
          }
        })

        const [existingAgent] = await db
        .select().from(agents).where(eq(agents.id, createdMeetings.agentId))

        if (!existingAgent) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
        }

        await streamVideo.upsertUsers([
          {
            id: existingAgent.id,
            name: existingAgent.name,
            role: 'user',
            image: 
              existingAgent.name ??
              generateAvatar({seed: existingAgent.id, variant: "botttsNeutral" }),
          }
        ])


      return createdMeetings;
    }),
    update: protectedProcedure
      .input(meetingsUpdateSchema)
      .mutation(async ({ ctx, input }) => {
        const [updatedMeeting] = await db
          .update(meetings)
          .set(input)
          .where(
            and(
              eq(meetings.id, input.id),
              eq(meetings.userId, ctx.session.user.id) // ✅ Correct ownership check
            )
          )
          .returning()
    
        if (!updatedMeeting) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
        }
    
        return updatedMeeting
      }),
      remove: protectedProcedure
      .input(z.object({id: z.string()}))
      .mutation(async ({ ctx, input }) => {
        const [removedMeeting] = await db
          .delete(meetings)
          .where(
            and(
              eq(meetings.id, input.id),
              eq(meetings.userId, ctx.session.user.id) // ✅ Correct ownership check
            )
          )
          .returning()
    
        if (!removedMeeting) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
        }
    
        return removedMeeting
      }),
});

// come back to this later
// export const agentsRouter = createTRPCRouter({
