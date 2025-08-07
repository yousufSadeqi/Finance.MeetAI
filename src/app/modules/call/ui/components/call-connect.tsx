'use client';

import { useTRPC } from '@/trpc/client';
import { StreamVideoClient, Call, CallingState, StreamVideo, StreamCall, DefaultVideoPlaceholder, StreamVideoParticipant } from '@stream-io/video-react-sdk';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {generateAvatarUri}  from '@/lib/avatar'; 

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { CallUI } from './call-ui';
import { authClient } from '@/lib/auth-client';

interface Props {
    meetingId: string;
    meetingName?: string;
    userId: string; 
    userName: string;
    userImage?: string;
}

const DisabledVideoPreview = () => {
    const {data} = authClient.useSession();

    return (
        <DefaultVideoPlaceholder
            participant={{
                name: data?.user.name ?? 'Unknown User',
                image:
                    data?.user.image ??
                    generateAvatarUri({
                        seed: data?.user.id ?? 'unknown',
                        varaint: 'initials',
                    })
            }  as StreamVideoParticipant
        }
        >

        </DefaultVideoPlaceholder>
    )
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
    const trpc = useTRPC();

    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions()
    );

    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) return;

        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
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
            _client.disconnectUser(); // ✅ FIXED: call disconnectUser
            setClient(undefined);
        };
    }, [userId, userName, userImage, generateToken]);

    const [call , setCall] = useState<Call | undefined>(undefined);

    useEffect(() => {
    if (!client) return;

    let _call: Call;

    const setupCall = async () => {
        _call = client.call('default', meetingId);
        _call.camera.disable(); 
        _call.microphone.disable();

        await _call.join(); // ✅ Ensures the call is fully ready
        setCall(_call);
    };

    setupCall();

    return () => {
        if (_call && _call.state.callingState !== CallingState.LEFT) {
            _call.leave();
            _call.endCall();
            setCall(undefined);
        } 
    };
}, [client, meetingId]);

    // just for now
    // if (!client || !call) {
    //     return (
    //         <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
    //             <LoaderIcon className="size-6 animate-spin text-white" />
    //         </div>
    //     );
    // }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI meetingName={meetingName ?? '' } />
            </StreamCall>
        </StreamVideo>
    );
};
