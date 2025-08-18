import React from 'react'
import VideoCall from './_components/video-call';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Video } from 'lucide-react';

const VideoCallPage = async ({searchParams}) => {
  const { sessionId, token } = await searchParams;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          Video Consultation
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          Connect with your healthcare provider in real-time
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="border-emerald-900/20 bg-muted/10 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4">
                <Video className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center">
                <Phone className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <VideoCall sessionId={sessionId} token={token} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoCallPage;