"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff, PhoneOff, User, Video, VideoOff } from "lucide-react";
//import { initialize } from "next/dist/server/lib/render-server";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const VideoCall = ({ sessionId, token }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const sessionRef = useRef(null);  
  const publisherRef = useRef(null);

  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  const handleScriptLoad = () => {
    setScriptLoaded(true);

    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }

    initializeSession();
  };
  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    try {
      sessionRef.current = window.OT.initSession(appId, sessionId);

      sessionRef.current.on("streamCreated", (event) => {
        sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "100%",
          },
          (error) => {
            if (error) {
              toast.error("Failed connecting to other participant's stream");
            }
          }
        );
      });

      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);

        publisherRef.current = window.OT.initPublisher(
          "publisher",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
            aspectRatio: "16:9",
            fitMode: "contain"
          }, 
          (error) => {
            if (error) {
              console.error("Publisher error:", error);
              toast.error("Error initializing your camera and microphone");
            } else {
              console.log(
                "Publisher initialized successfully- you should see your video now"
              );
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
      });

      sessionRef.current.connect(token, (error) => {
        if (error) {
          toast.error("Error connecting to video session");
        } else {
          if (publisherRef.current) {
            sessionRef.current.publish(publisherRef.current, (error) => {
              if (error) {
                console.log("Error publishing your stream:", error);
                toast.error("Error publishing your stream");
              } else {
                console.log("Stream published successfully");
              }
            });
          }
        }
      });
    } catch (error) {
        toast.error("Failed to initialize video call");
        setIsLoading(false);
    }
  };
const toggleVideo = ( ) => {
  if (publisherRef.current){
    publisherRef.current.publishVideo(!isVideoEnabled);
    setIsVideoEnabled((prev) => !prev);
  }
};

const toggleAudio = ( ) => {
  if (publisherRef.current){
    publisherRef.current.publishAudio(!isAudioEnabled);
    setIsAudioEnabled((prev) => !prev);
  }
};

const endCall = () => {
  if (publisherRef.current) {
    publisherRef.current.destroy();
    publisherRef.current = null;
  }


if (sessionRef.current) {
    sessionRef.current.disconnect();
    sessionRef.current = null;
  }

  router.push("/appointments");
};

useEffect(() => {
return () => {
  if (publisherRef.current) {
    publisherRef.current.destroy();
  
  }
  if (sessionRef.current) {
    sessionRef.current.disconnect();
  }

};
}, []);
  if (!sessionId || !token || !appId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Invalid Video Call
        </h1>
        <p className="text-muted-foreground mb-6">
          Missing required parameters for the video call.
        </p>
        <Button
          onClick={() => router.push("/appointments")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video call script");
          setIsLoading(false);
        }}
      />

      <style jsx>{`
        #publisher {
          aspect-ratio: 16/9;
          min-height: 400px;
        }
        #publisher video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          border-radius: 0.5rem;
        }
        #subscriber {
          aspect-ratio: 16/9;
          min-height: 400px;
        }
        #subscriber video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          border-radius: 0.5rem;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Video Consultation
          </h1>
          <p className="text-muted-foreground">
            {isConnected
              ? "Connected"
              : isLoading
              ? "Connecting..."
              : "Connection Failed"}
          </p>
        </div>

        {isLoading && !scriptLoaded ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-emerald-400 animate-spin mb-4" />
            <p className="text-white text-lg">
              Loading Video call components...
            </p>
            </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-emerald-900/20 rounded-lg overflow-hidden">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                  You
                </div>

                <div
                  className="w-full h-[400px] md:h-[500px] bg-muted/30 relative"
                  id="publisher"
                >
                  {!scriptLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-muted/20 rounded-full p-8">
                        <User className="h-12 w-12 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-emerald-900/20 rounded-lg overflow-hidden">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                  Other Participant
                </div>

                <div
                  className="w-full h-[400px] md:h-[500px] bg-muted/30 relative"
                  id="subscriber"
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-muted/20 rounded-full p-8">
                      <User className="h-12 w-12 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Button 
              variant="outline"
              size="lg" 
              onClick={toggleVideo}
              className={ ` rounded-full p-4 h-14 w-14 ${
                isVideoEnabled
                ? "border-emerald-900/30"
                : "bg-red-900/20 border-red-900 text-red-400"

              } `}
              disabled={!publisherRef.current}
               >
                {isVideoEnabled ? <Video /> :<VideoOff/>}
               </Button>

               <Button 
              variant="outline"
              size="lg" 
              onClick={toggleAudio}
              className={ ` rounded-full p-4 h-14 w-14 ${
                isAudioEnabled
                ? "border-emerald-900/30"
                : "bg-red-900/20 border-red-900 text-red-400"

              } `}
              disabled={!publisherRef.current}
               >
                {isAudioEnabled ? <Mic /> :<MicOff />}
               </Button>
             
             <Button 
             variant="destructive"
             size="lg"
             onClick={endCall}
             className="rounded-full p-4 h-14 w-14 bg-red-600 hover:bg-red-700"
             >
              <PhoneOff />
             </Button>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              {isVideoEnabled ? "Camera on" : "Camera off"}
              {isAudioEnabled ? "Microphone on" : "Microphone off"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              When you're finished with your Consultaion,click the red button to end the call
            </p>
             </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoCall;
