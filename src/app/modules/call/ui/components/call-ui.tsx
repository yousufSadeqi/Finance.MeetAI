'use client';

import { StreamTheme, useCall, CallingState } from '@stream-io/video-react-sdk';
import { useEffect, useState, useCallback } from 'react';
import { CallLobby } from './call-lobby';
import { CallActive } from './call-active';
import { CallEnded } from './call-ended';

interface Props {
  meetingName: string;
}

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<'lobby' | 'call' | 'ended'>('lobby');

  const handleJoin = useCallback(async () => {
    if (!call) return;

    const state = call.state.callingState;
    if (state === CallingState.JOINED || state === CallingState.JOINING) {
      setShow('call');
      return;
    }

    try {
      await call.join({ create: true });
      setShow('call');
    } catch (err) {
      console.error('Failed to join call', err);
    }
  }, [call]);

  const handleLeave = useCallback(() => {
    if (!call) return;
    const state = call.state.callingState;

    // Only leave if not already left or ended
    if (state !== CallingState.LEFT && state !== CallingState.ENDED) {
      call.leave();
    }

    setShow('ended');
  }, [call]);

  // Listen for call state changes from SDK
  useEffect(() => {
    if (!call) return;

    const handleStateChange = () => {
      const state = call.state.callingState;
      if (state === CallingState.JOINED) {
        setShow('call');
      } else if (state === CallingState.LEFT || state === CallingState.ENDED) {
        setShow('ended');
      }
    };

    handleStateChange(); // run once immediately
    const unsubscribe = call.on('call.state_updated', handleStateChange);

    return () => {
      unsubscribe();
    };
  }, [call]);

  return (
    <StreamTheme>
      {show === 'lobby' && <CallLobby onJoin={handleJoin} />}
      {show === 'call' && (
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      )}
      {show === 'ended' && <CallEnded />}
    </StreamTheme>
  );
};
