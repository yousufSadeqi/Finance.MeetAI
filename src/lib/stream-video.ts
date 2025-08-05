import 'server-only';


import {StreamClient} from '@stream-io/node-sdk';


export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAMING_VIDEO_API_KEY!,
  process.env.STREAMING_VIDEO_SECRET_KEY!,
);
