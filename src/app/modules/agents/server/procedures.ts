import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema, agentsUpdateSchema } from "../schema";
import { z } from "zod";
import {and, count, desc, eq, getTableColumns, ilike, sql, } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
  update: protectedProcedure
  .input(agentsUpdateSchema)
  .mutation(async ({ ctx, input }) => {
    const [updatedAgent] = await db
      .update(agents)
      .set(input)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.session.user.id) // ✅ Correct ownership check
        )
      )
      .returning()

    if (!updatedAgent) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
    }

    return updatedAgent
  }),

  remove: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const [removedAgent] = await db
      .delete(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.session.user.id) // ✅ Correct user ownership check
        )
      )
      .returning();

    if (!removedAgent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }

    return removedAgent;
  }),




    // getOne: protectedProcedure
    getOne: protectedProcedure
    .input(z.object({id: z.string() }))
    .query(async ({input, ctx}) => {
    const [existingAgent] = await db
    .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5` // Example SQL to count meetings, replace with actual logic
    })
    .from(agents)
    .where(and(
      eq(agents.id, input.id),
      eq(agents.userId , ctx.session.user.id)  // recheck it
    )
  )

  if(!existingAgent){
    throw new TRPCError({code: 'NOT_FOUND', message: 'not found'})
  };
    return existingAgent;
  }),
//   // getMany: protectedProcedure
  getMany: protectedProcedure
  .input(z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish()
   })

) // Optional userId for filtering
  .query(async ({ctx, input}) => {
    const {search, page, pageSize} = input;
    const data = await db
    .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`10` // Example SQL to count meetings, replace with actual logic
    })
    .from(agents)
    .where(
      and(
        eq(agents.userId, ctx.session.user.id),
        search ? ilike(agents.name, `%${search}%`) : undefined // Use undefined instead of true
      )
    )
    .orderBy(desc(agents.createdAt), desc(agents.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

    const [total] = await db
    .select({ count: count() })
    .from(agents)
    .where(
        and(
            eq(agents.userId, ctx.session.user.id), // Filter by userId
            search ? ilike(agents.name, `%${search}%`) : undefined // Use undefined instead of true
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
  .input(agentsInsertSchema)
  .mutation(async ({ input, ctx }) => {
    const [createdAgent] = await db
      .insert(agents) 
      .values({
        ...input,
        userId: ctx.session.user.id, // correctly set userId here
        instruction: input.instructions, // ensure the property is named 'instruction'
      })
      .returning();

    return createdAgent;
  }),
});

// come back to this later
// export const agentsRouter = createTRPCRouter({
