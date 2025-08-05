'use client'

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { ResponseDialog } from "@/components/response-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "../components/column";
import { EmptyState } from "@/components/empty-state";
import { UseAgentFilters } from "../../hooks/use-agents-fliters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";

export const AgentsViews = () => {
    const router = useRouter()

    const [filters, setFilters] = UseAgentFilters()

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable 
            data={data.data}
            columns={columns}
            onRowClick={(row) => router.push(`/agents/${row.id}`)}
            />
            <DataPagination
            page={filters.page}
            totalPages ={data.totalPages}
            onPageChange={(page) => setFilters({page})}
            
            />

            {
                data.data.length === 0 && (
                    <EmptyState
                    title="No Agents Found"
                    description="You can create a new agent by clicking the button below."
                    />
                )
            }
        </div> 
    );
}

export const AgentsViewsLoading = () => {
    return (
        <LoadingState 
            title='Loading Agents' 
            description="This may take a few seconds"
        />
    )
}

export const AgentsViewsError = () => {
    return (
        <ErrorState 
            title='Error Loading Agents' 
            description="Please try again later or contact support."
        />
    )
}