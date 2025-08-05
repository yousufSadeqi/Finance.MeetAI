'use client'

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/avatar-generator";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { error } from "console";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agents-dialog";

interface Props {
    agentId: string;
}

export const AgentIdView = ({agentId} : Props) => {
    const router = useRouter()
    const queryClient = useQueryClient();
    const trpc = useTRPC()

    const [updateAgentDialog, setUpdateAgentDialog] = useState(false)

    const {data} = useSuspenseQuery(trpc.agents.getOne.queryOptions({id: agentId}))

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess : async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
                router.push('/agents')
            },
            onError: (error) => {
                toast.error(error.message)
            }
        }),
    );

    const [removeConfirmation, confirmRemove] = useConfirm(
        'Are you sure',
        `The following action will remove ${data.meetingCount} associated meetings`
    )

    const handleRemoveAgent = async () => {
        const ok = await confirmRemove();

        if (!ok) return ;

        await removeAgent.mutateAsync({id: agentId})
    }

    return (
        <>
        {removeConfirmation()}

        {/* TOdo the updateAgentDialog is not working prop so fix it later */}
        <UpdateAgentDialog
            open={updateAgentDialog}
            onOpenChange={setUpdateAgentDialog}
            initialValues={data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader
                agentId = {agentId}
                agentName = {data.name}
                onEdit= {() => {setUpdateAgentDialog(true)}}
                onRemove= {handleRemoveAgent}
            />
            <div className="bg-whiter rounded-lg border">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={data.name}
                            className="size-10"
                        />
                        <h2 className="text-2xl font-medium">
                            {data.name}
                        </h2>
                    </div>
                    <Badge
                        variant='outline'
                        className="flex items-center gap-x-2 [&>svg]:size-4"
                    >
                        <VideoIcon />
                        {data.meetingCount} {data.meetingCount === 1 ? 'meeting' : 'meetings'}
                    </Badge>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">Instructions</p>
                        <p className="text-neutral-800">{data.instruction}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


export const AgentIdViewsLoading = () => {
    return (
        <LoadingState 
            title='Loading Agent' 
            description="This may take a few seconds"
        />
    )
}

export const AgentIdViewsError = () => {
    return (
        <ErrorState 
            title='Error Loading Agent' 
            description="Please try again later or contact support."
        />
    )
}
