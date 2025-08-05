import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]['data'];
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];

export enum MeetingsStatus {
    Upcoming = 'upcoming',
    Active = 'active',
    Completed = 'completed',
    Processing = 'processing',
    Cancelled = 'cancelled',
} 