import Input from "@/components/shared/Input";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Chat as ChatType, ChatEvent, ChatMessage } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import isHotKey from "is-hotkey";
import Chat from "./Chat";

const ChatBar = () => {
  const { socket, roomUser } = useRoomInfo();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [message, setMessage] = useState("");
  const messageBottomRef = useRef<HTMLDivElement>();
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    const handleMessage = (message: ChatMessage) => {
      setChats((prev) => [...prev, { ...message, type: "message" }]);

      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.volume = 0.2;

        audioRef.current.currentTime = 0;

        audioRef.current.play();
      }

      messageBottomRef.current?.scrollIntoView();
    };

    const handleEvent = (event: ChatEvent) => {
      setChats((prev) => [...prev, { ...event, type: "event" }]);

      messageBottomRef.current?.scrollIntoView();
    };

    socket.on("message", handleMessage);
    socket.on("event", handleEvent);

    return () => {
      socket.off("message", handleMessage);
      socket.off("event", handleEvent);
    };
  }, [socket]);

  const handleSendMessage = useCallback(
    (text: string) => {
      socket.emit("sendMessage", text);

      setChats((prev) => [
        ...prev,
        { type: "message", user: roomUser, body: text },
      ]);
    },
    [roomUser, socket]
  );

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isHotKey("Enter", e)) {
        handleSendMessage(message);
        setMessage("");

        messageBottomRef.current?.scrollIntoView();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleSendMessage, message]);

  return (
    <React.Fragment>
      <audio ref={audioRef} src="/sounds/notification.mp3">
        Your browser does not support the
        <code>audio</code> element.
      </audio>

      <div className="relative flex h-full flex-col">
        <div className="no-scrollbar grow space-y-2 overflow-y-auto pb-4">
          {chats.map((chat, index) => (
            <Chat chat={chat} key={index} />
          ))}

          <div ref={messageBottomRef}></div>
        </div>

        <div className="sticky bottom-0 w-full bg-background-900">
          <Input
            value={message}
            placeholder="Aa"
            className="bg-background-800 px-3 py-2"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;

              setMessage(target.value);
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(ChatBar);
