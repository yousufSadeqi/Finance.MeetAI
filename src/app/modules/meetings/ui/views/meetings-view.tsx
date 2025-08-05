'use client'

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { UseMeetingsFilters } from "../../hooks/use-meetings-fliters";
import { DataPagination } from "@/components/data-pagination";


const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter()
    const [filters, setFilters] = UseMeetingsFilters();

    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }));

    return ( 
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                data={data.data}
                columns={columns}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination
                page={filters.page} 
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({page})}
            
            />
            {
                 data.data.length === 0 && (
                <EmptyState
                    title="No Meetings Available"
                    description="You haven’t created any meetings yet. Click the button below to schedule your first meeting."
                />
            ) 
        }
        </div>
     );
}

export const MeetingsViewsLoading = () => {
    return (
        <LoadingState 
            title='Loading Meetings' 
            description="This may take a few seconds"
        />
    )
}

export const MeetingsViewsError = () => {
    return (
        <ErrorState 
            title='Error Loading Meetings' 
            description="Please try again later or contact support."
        />
    )
}
export default MeetingsView;