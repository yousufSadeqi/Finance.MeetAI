'use client';

import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";

interface Props {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0c0d0e] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-[#101213] border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
          >
            <Image
              src="/logo.png"
              alt="FinAI Logo"
              width={22}
              height={22}
            />
          </Link>
          <h4 className="text-lg font-medium truncate max-w-xs">
            {meetingName}
          </h4>
        </div>
      </div>

      {/* Main Speaker Layout - Centered */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <div className="max-w-6xl w-full h-full flex items-center justify-center">
          <SpeakerLayout />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center p-4 bg-[#101213] border-t border-white/10">
        <div className="rounded-full bg-[#1a1c1e] px-6 py-3 shadow-lg">
          <CallControls onLeave={onLeave} />
        </div>
      </div>
    </div>
  );
};
