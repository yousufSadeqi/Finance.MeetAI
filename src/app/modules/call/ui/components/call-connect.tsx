'use client';

import { useTRPC } from '@/trpc/client';
import { StreamVideoClient, Call, CallingState, StreamVideo, StreamCall, DefaultVideoPlaceholder, StreamVideoParticipant } from '@stream-io/video-react-sdk';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {generateAvatarUri}  from '@/lib/avatar'; // Adjust the path as needed

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { CallUI } from './call-ui';
import { authClient } from '@/lib/auth-client';
import { LoaderIcon } from 'lucide-react';

interface Props {
    meetingId: string;
    meetingName?: string;
    userId: string; 
    userName: string;
    userImage?: string;
}


export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
    const trpc = useTRPC();

    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions()
    );

    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_STREAMING_VIDEO_API_KEY) return;

        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAMING_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage,
            },
            tokenProvider: async () => {
                const result = await generateToken();
                return result.token; 
            },
        });

        setClient(_client);

        return () => {
            _client.disconnectUser();
            setClient(undefined);
        };
    }, [userId, userName, userImage]);

    const call = useMemo<Call | undefined>(() => {
        if (!client) return undefined;
        return client.call('default', meetingId);
    }, [client, meetingId]);

    useEffect(() => {
        if (!call) return;
        call.camera.disable();
        call.microphone.disable();

        return () => {
            if (call.state.callingState !== CallingState.LEFT) {
                try { call.leave(); } catch {}
                try { call.endCall(); } catch {}
            }
        };
    }, [call]);

    if (!client) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        );
    }

    return (
        <StreamVideo client={client!}>
            <StreamCall call={call!}>
                <CallUI meetingName={meetingName ?? '' } />
            </StreamCall>
        </StreamVideo>
    );
};
