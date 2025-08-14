import React from 'react'
import VideoCall from './_components/video-call';
//import VideoCall from "./video-call-ui";

const VideoCallPage = async ({searchParams}) => {
  const { sessionId, token } = await searchParams;
  return <VideoCall sessionId={sessionId} token={token} />;
};

export default VideoCallPage;