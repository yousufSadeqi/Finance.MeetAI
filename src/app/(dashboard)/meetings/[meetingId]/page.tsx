import { MeetingIdView, MeetingIdViewsError, MeetingIdViewsLoading } from "@/app/modules/meetings/ui/views/meeting-id-view";
import MeetingsView from "@/app/modules/meetings/ui/views/meetings-view";
import { auth } from "@/lib/auth";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{
        meetingId: string;
    }>
}
const page = async ({params}: Props) => {

    const {meetingId} = await params
    // Do not use useTRPC in server components

     const session = await auth.api.getSession({
            headers: await headers(), 
          }); 
        
          if(!session) {
            redirect('/sign-in'); 
          }
    const queryClient = getQueryClient();
    // void queryClient.prefetchQuery(
    //     trpc.meetings.getOne.queryOptions({id : meetingId})
    // )
    await queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    // todo prefect "meetings."
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingIdViewsLoading/>}>
                <ErrorBoundary fallback={<MeetingIdViewsError/>}>
                    <MeetingIdView meetingId={meetingId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>   
    );
}
 
export default page;