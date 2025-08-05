'use client'

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { CancelledState } from "../components/cancelled-state";
import { UpComingState } from "../components/up-coming-state";
import { ActiveState } from "../components/active-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );
    
    const [updateMeetingDialog, setUpdateMeetingDialogOpen] = useState(false)

    const queryClient = useQueryClient();
    const router = useRouter();

    // Confirmation modal
    const [RemoveConfirmation, confirmRemove] = useConfirm(
        'Are you sure?',
        'This action will permanently delete the meeting.'
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );
                router.push('/meetings');
                toast.success("Meeting deleted successfully.");
            },
            onError: (err: unknown) => {
                console.error(err);
                toast.error("Failed to delete meeting. Please try again.");
            },
        })
    );

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({ id: meetingId });
    };

    const isActive = data.status === 'active'
    const isCompleted = data.status === 'completed'
    const isCancelled = data.status === 'cancelled'
    const isProcessing = data.status === 'processing'
    const isUpComing = data.status === 'upcoming'

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog 
                open={updateMeetingDialog}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onRemove={handleRemoveMeeting}
                />
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {isCancelled && <CancelledState/>}
                    {isCompleted && <div>isCompleted</div>}
                    {isProcessing && <ProcessingState/>}
                    {isUpComing && <UpComingState
                        meetingId={meetingId}
                        onCancelMeeting={() => {}}
                        isCancelling={false}
                    />}
                    {isActive && <div><ActiveState
                        meetingId={meetingId}
                    />  </div>}
                </pre>
            </div>
        </>
    );
};

export const MeetingIdViewsLoading = () => {
    return (
        <LoadingState
            title="Loading Meeting"
            description="This may take a few seconds"
        />
    );
};

export const MeetingIdViewsError = () => {
    return (
        <ErrorState
            title="Error Loading Meeting"
            description="Please try again later or contact support."
        />
    );
};
