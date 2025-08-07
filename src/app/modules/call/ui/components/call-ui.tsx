'use client';

import { StreamTheme, useCall } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { CallLobby } from './call-lobby';

interface Props {
    meetingName: string;
}

export const CallUI = ({ meetingName }: Props) => {
    const call = useCall();
    const [show, setShow] = useState<'lobby' | 'call' | 'ended'>('lobby');

    const handleJoin = async () => {
        if (!call) return;
        await call.join();
        setShow('call');
    };

    const handleLeave = () => {
        if (!call) return;
        call.endCall();
        setShow('ended');
    };

    // Auto-join
    useEffect(() => {
        if (call && show === 'lobby') {
            handleJoin();
        }
    }, [call, show]);

    return (
        <StreamTheme>
            {show === 'lobby' && <CallLobby onJoin={handleJoin}/>}
            {show === 'call' && (
                <div>
                    <p>Call with {meetingName}</p>
                    <button onClick={handleLeave}>Leave</button>
                </div>
            )}
            {show === 'ended' && <p>Call ended</p>}
        </StreamTheme>
    );
};
