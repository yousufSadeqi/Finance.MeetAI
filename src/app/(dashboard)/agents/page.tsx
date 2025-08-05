import { AgentsViews, AgentsViewsError, AgentsViewsLoading } from "@/app/modules/agents/ui/views/agents-views";
import { LoadingState } from "@/components/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Agent } from "http";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { ListHeader } from "@/app/modules/agents/ui/components/list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UseAgentFilters } from "@/app/modules/agents/hooks/use-agents-fliters";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "@/app/modules/agents/params";


interface Props {
    searchParams : Promise<SearchParams>
}

const page = async ({searchParams} : Props) => {


    // filter for search
    const params = await loadSearchParams(searchParams);

    // const [filters] = UseAgentFilters()
    
    const session = await auth.api.getSession({
        headers: await headers(), 
      }); 
    
      if(!session) {
        redirect('/sign-in'); 
      }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        // ...filters  can use this one as well but for the security reasons this is better
        ...params,
    }));

    return (
        <>
        <ListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewsLoading/>}>
                <ErrorBoundary fallback={<AgentsViewsError/>}>
                    <AgentsViews/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    );
}
 
export default page;