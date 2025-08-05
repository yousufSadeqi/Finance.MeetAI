import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { agents } from '@/db/schema';
import { agentsRouter } from '@/app/modules/agents/server/procedures';
import { meetingsRouter } from '@/app/modules/meetings/server/procedures';
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;