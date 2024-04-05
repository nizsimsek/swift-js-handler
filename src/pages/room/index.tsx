import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Chat from "./components/chat";
import { MessageType } from "../../types";
import { LuCamera, LuCameraOff, LuMonitorUp, LuMonitorX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import Camera from "./components/camera";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

declare global {
  interface Window {
    webkit: object & {
      messageHandlers: object & {
        jsHandler: {
          postMessage: (message: string) => void;
        };
      };
    };
  }
}

const Room = () => {
  const { roomId } = useParams();
  const { toast } = useToast();
  const [uuid, setUuid] = useState<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const stream2Ref = useRef<MediaStream | null>(null);
  const desktopStreamRef = useRef<MediaStream | null>(null);

  const ws = useRef<WebSocket | null>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [desktopStarted, setDesktopStarted] = useState(false);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:1337");
      ws.current.onopen = () => {
        ws?.current?.send(
          JSON.stringify({
            type: "join",
            room: roomId,
          })
        );

        toast({
          title: "Connected",
          description: "Connected to the room",
          variant: "success",
        });
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { type, message, name } = data;

        switch (type) {
          case "message":
            setMessages((prev) => [...prev, { name, message }]);
            break;
          case "join":
            setMessages((prev) => [
              ...prev,
              { name: "Server", message: message },
            ]);
            break;
          case "new_user_join":
            setMessages((prev) => [
              ...prev,
              { name: "Server", message: `${name} joined the room` },
            ]);
            break;
          case "leave":
            setMessages((prev) => [
              ...prev,
              { name: "Server", message: message },
            ]);
            break;
          case "uuid":
            setUuid(data?.uuid);
            break;
          default:
            break;
        }
      };

      ws.current.onclose = () => {
        console.log("Disconnected from the server");
      };
    }
  }, [roomId, toast]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    ws?.current?.send(
      JSON.stringify({
        type: "message",
        room: roomId,
        message,
      })
    );

    setMessage("");
  };

  const startWebcam = async () => {
    if (webcamStarted) return;
    if (!navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Error",
        description: "Webcam is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    streamRef.current = stream;

    setWebcamStarted(true);

    window?.webkit?.messageHandlers?.jsHandler.postMessage("Webcam Share Started");
  };

  const stopWebcam = () => {
    streamRef?.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    setWebcamStarted(false);

    window?.webkit?.messageHandlers?.jsHandler.postMessage("Webcam Share Stoped");
  };

  const startScreenShare = async () => {
    if (desktopStarted) return;
    if (!navigator.mediaDevices.getDisplayMedia) {
      toast({
        title: "Error",
        description: "Screen sharing is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    desktopStreamRef.current = stream;
    setDesktopStarted(true);
  };

  const stopScreenShare = () => {
    desktopStreamRef?.current?.getTracks().forEach((track) => {
      track.stop();
    });

    desktopStreamRef.current = null;

    setDesktopStarted(false);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      <Card className="w-full h-1/3 lg:h-full flex flex-col flex-grow">
        <CardContent className="p-4 gap-4 grid grid-cols-1 md:grid-cols-2 w-full flex-auto overflow-y-auto content-center">
          {streamRef.current && (
            <Camera
              stream={streamRef.current as MediaStream}
              muted={true}
              uuid={uuid}
            />
          )}
          {stream2Ref.current && (
            <Camera
              stream={stream2Ref.current as MediaStream}
              muted={true}
              uuid={uuid}
            />
          )}
          {desktopStreamRef.current && (
            <Camera
              stream={desktopStreamRef.current as MediaStream}
              muted={true}
              uuid={uuid + " (Screen)"}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="default"
                  variant={webcamStarted ? "destructive" : "outline"}
                  onClick={() => {
                    webcamStarted ? stopWebcam() : startWebcam();
                  }}
                >
                  {webcamStarted ? (
                    <LuCameraOff className="w-5 h-5" />
                  ) : (
                    <LuCamera className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {webcamStarted ? "Stop webcam" : "Start webcam"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="default"
                  variant={desktopStarted ? "destructive" : "outline"}
                  onClick={() => {
                    desktopStarted ? stopScreenShare() : startScreenShare();
                  }}
                >
                  {desktopStarted ? (
                    <LuMonitorX className="w-5 h-5" />
                  ) : (
                    <LuMonitorUp className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {desktopStarted ? "Stop webcam" : "Start webcam"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
      <Chat
        messages={messages}
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};

export default Room;
