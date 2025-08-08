'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const CallEnded = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-sidebar-accent p-4">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-xl p-10 shadow-lg border border-white/10 max-w-md w-full">
        {/* Icon */}
        <div className="bg-green-500/10 p-4 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center">
          <h6 className="text-xl font-semibold">
            Call Ended
          </h6>
          <p className="text-sm text-gray-400 mt-1">
            Your meeting has ended. A summary will be ready shortly.
          </p>
        </div>

        {/* Action Button */}
        <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
          <Link href="/meetings">
            Back to Meetings
          </Link>
        </Button>
      </div>
    </div>
  );
};
