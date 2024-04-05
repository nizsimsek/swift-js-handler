import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLink, LuMoreVertical, LuSend } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ChatProps } from "@/types";
import { useEffect, useRef } from "react";

const Chat = ({ messages, sendMessage, message, setMessage }: ChatProps) => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  return (
    <Card className="w-full lg:w-1/3 h-96 lg:min-w-80 lg:h-full lg:flex-auto flex flex-col">
      <CardHeader className="flex items-center flex-row w-full px-4 py-2">
        <CardTitle className="text-center">Chat</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" variant="outline" size="default">
              <LuMoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mx-6">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="hover:cursor-copy"
                onClick={() => {
                  if (navigator.canShare()) {
                    navigator.share({
                      title: "Join the room",
                      url: window.location.href,
                    });
                  } else if (navigator.clipboard) {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => {
                        toast({
                          title: "Copied",
                          description: "Invite link copied",
                          variant: "default",
                          duration: 2000,
                        });
                      })
                      .catch(() => {
                        toast({
                          title: "Error!",
                          description: "Failed to copy invite link",
                          variant: "destructive",
                          duration: 2000,
                        });
                      });
                  } else {
                    toast({
                      title: "Error!",
                      description: "Your browser does not support this feature",
                      variant: "destructive",
                      duration: 2000,
                    });
                  }
                }}
              >
                <Button
                  variant="ghost"
                  className="h-auto p-0 hover:cursor-copy"
                >
                  <LuLink className="h-4 w-4 mr-2" />
                  Copy Invite Link
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-auto w-full overflow-y-auto py-0 px-4">
        <ScrollArea className="w-full h-full" viewportRef={scrollRef}>
          {messages?.map((msg, index) => {
            return (
              <div className="flex flex-col gap-1" key={index}>
                {msg?.name == messages[index - 1]?.name ? (
                  <span className="text-sm">{msg?.message}</span>
                ) : (
                  <div className="flex flex-col gap-1 mt-1" key={index}>
                    <span className="font-bold">{msg?.name}</span>
                    <span className="text-sm">{msg?.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter className="w-full p-2 rounded-b-lg flex gap-2">
        <Input
          type="text"
          placeholder="Mesajınız.."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button variant="outline" size="default" onClick={sendMessage}>
          <LuSend className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Chat;
