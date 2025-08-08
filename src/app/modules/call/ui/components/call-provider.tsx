'use client';

import { authClient } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";
import { CallConnect } from "./call-connect";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
    meetingId: string;
    meetingName?: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
    const { data, isPending } = authClient.useSession();

    if (isPending || !data) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        );
    }

    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image ?? generateAvatarUri({ seed: data.user.id, variant: 'initials' })}
        />
    );
};
