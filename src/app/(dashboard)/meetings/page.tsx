import { loadSearchParams } from "@/app/modules/meetings/params";
import { MeetingsListHeader } from "@/app/modules/meetings/ui/components/meeting-list-header";
import MeetingsView, { MeetingsViewsError, MeetingsViewsLoading } from "@/app/modules/meetings/ui/views/meetings-view";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  searchParams: Promise<SearchParams>
}

const page = async ({searchParams}: Props) => {
    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
        headers: await headers(), 
      }); 
    
      if(!session) {
        redirect('/sign-in'); 
      }
    
      // PreFetching
      
      const queryClient = getQueryClient();
      void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
          ...filters
        }
        )
      )
    return ( 
      <>
      <MeetingsListHeader/>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewsLoading/>}>
          <ErrorBoundary fallback={<MeetingsViewsError/>}>
            <MeetingsView/>
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
      </>
     );
}
 


export default page;
