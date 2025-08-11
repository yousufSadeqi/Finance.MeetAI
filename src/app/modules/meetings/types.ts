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
}; 

export type StreamTransctipItem = {
    speaker_id: string,
    type: string, 
    text: string, 
    start_ts: number,
    stop_ts: number,
};