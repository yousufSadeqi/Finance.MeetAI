'use client'

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { SearchFilter } from "./meeting-search-filter";
import { MeetingsStatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { UseMeetingsFilters } from "../../hooks/use-meetings-fliters";

export const MeetingsListHeader = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = UseMeetingsFilters();

    const isAnyFilterModified = !! filters.status || !!filters.search || !!filters.agentId 

    const onClearFilters = () => {
        setFilters({
            status:null,
            agentId:"", 
            search: '', 
            page: 1, 
        })
    }

    return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl ">My Meetings</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon />
                    New Meeting
                </Button>
            </div>
                <div className="flex flex-wrap items-center gap-2 p-1">
                <SearchFilter />
                <MeetingsStatusFilter />
                <AgentIdFilter />
                {isAnyFilterModified && (
                    <Button
                    variant="ghost"
                    onClick={onClearFilters}
                    className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 transition-all shadow-sm px-3 py-1.5 rounded-lg w-auto min-w-0"
                    title="Clear all filters"
                    >
                    <XCircleIcon className="size-4 text-red-500" />
                    <span className="font-medium">Clear</span>
                    </Button>
                )}
                </div>

        </div>
        </>
    );
}