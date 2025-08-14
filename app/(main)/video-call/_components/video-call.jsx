"use client";

import { Button } from "@/components/ui/button";
//import { initialize } from "next/dist/server/lib/render-server";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useRef, useState } from "react";
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

  const appId = process.env.NEXT_PUBLIC_VONAGE_APP_ID;

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
            videoSource: isVideoEnabled,
            audioSource: isAudioEnabled,
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
      </div>
    </>
  );
};

export default VideoCall;
