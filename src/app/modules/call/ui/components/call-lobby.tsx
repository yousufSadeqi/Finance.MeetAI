'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
    onJoin : () => void;
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
                        variant: 'initials',
                    })
            }  as StreamVideoParticipant
        }
        >

        </DefaultVideoPlaceholder>
    )
}

const AllowBrowerPermissions = () => {
    return (
        <p className='text-sm'>
            Please grant the browser permissions to use camera and microphone for the call.
        </p>
    )
}

export const CallLobby = ({onJoin}: Props) => {
    const {useCameraState, useMicrophoneState} = useCallStateHooks();

    const {hasBrowserPermission: hasMicPermission} = useMicrophoneState();
    const {hasBrowserPermission: hasCameraPermission} = useCameraState();

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission

    return (
        <div className='flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent'>
            <div className='py-4 px-8 flex flex-1 items-center justify-center'>
                <div className='flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm'>
                    <div className='flex flex-col gap-y-2 text-center'>
                        <h6 className='text-lg font-medium'>
                            Ready to join
                        </h6> 

                        <p className='text-sm'>
                            Set up your call before joinning
                        </p>
                    </div>
                    <VideoPreview 
                        DisabledVideoPreview={hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowerPermissions}
                    
                    />
                    <div className='flex gap-x-2'>
                        <ToggleVideoPreviewButton />
                        <ToggleAudioPreviewButton />

                    </div>
                    <div className='flex gap-x-2 justify-between w-full'>
                        <Button asChild variant='ghost'>
                            <Link href='/meetings'>
                            cancel
                            </Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                            
                        >
                            <LogInIcon/>
                            Join call   
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
