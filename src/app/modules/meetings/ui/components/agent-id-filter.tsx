import { useState } from "react"
import { UseMeetingsFilters } from "../../hooks/use-meetings-fliters"
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "@/components/command-select";
import { Divide } from "lucide-react";
import { GeneratedAvatar } from "@/components/avatar-generator";

export const AgentIdFilter = () => {
    const [filters, setFilters] = UseMeetingsFilters();

    const trpc = useTRPC()
    const [agentSearch, setAgentSearch] = useState("");
    const {data} = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100, 
            search: agentSearch,
        }),
    );
    return (
        <CommandSelect 
            className="h-9"
            placeholder="Agent"
            options={(data?.data ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id, 
                children: (
                <div className="flex items-center gap-x-2">
                    <GeneratedAvatar 
                    seed={agent.name}
                    variant="botttsNeutral"
                    className="size-4"
                    />
                    <span>{agent.name}</span>
                </div>
                )
            }))}
            onSelect={(value) => {
                setFilters({agentId: value})
            }}
            onSearch={setAgentSearch}
            value={filters.agentId ?? ''}
            />

    )
}