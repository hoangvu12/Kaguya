import Input from "@/components/shared/Input";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Chat as ChatType, ChatEvent, ChatMessage } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import isHotKey from "is-hotkey";
import Chat from "./Chat";

const ChatBar = () => {
  const { socket, roomUser } = useRoomInfo();
  const [chats, setChats] = useState<ChatType[]>([]);
  const messageBottomRef = useRef<HTMLDivElement>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleMessage = (message: ChatMessage) => {
      setChats((prev) => [...prev, { ...message, type: "message" }]);

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
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleSendMessage, message]);

  return (
    <div className="relative flex flex-col h-full">
      <div className="grow pb-4 space-y-2 overflow-y-auto no-scrollbar">
        {chats.map((chat, index) => (
          <Chat chat={chat} key={index} />
        ))}

        <div ref={messageBottomRef}></div>
      </div>

      <div className="sticky bottom-0 w-full bg-background-900">
        <Input
          placeholder="Aa"
          className="bg-background-800"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;

            setMessage(target.value);
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(ChatBar);
