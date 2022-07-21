import CommentInput from "@/components/features/comment/CommentInput";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Chat as ChatType, ChatEvent, ChatMessage } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Chat from "./Chat";

const ChatBar = () => {
  const { socket, basicRoomUser } = useRoomInfo();
  const [chats, setChats] = useState<ChatType[]>([]);
  const messageBottomRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleMessage = (message: ChatMessage) => {
      setChats((prev) => [...prev, { ...message, type: "message" }]);

      messageBottomRef.current?.scrollIntoView();
    };

    const handleEvent = (event: ChatEvent) => {
      setChats((prev) => [...prev, { ...event, type: "event" }]);

      console.log(event);

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
        { type: "message", user: basicRoomUser, body: text },
      ]);
    },
    [basicRoomUser, socket]
  );

  return (
    <div className="relative flex flex-col h-full">
      <div className="grow pb-4 space-y-2 overflow-y-auto no-scrollbar">
        {chats.map((chat, index) => (
          <Chat chat={chat} key={index} />
        ))}

        <div ref={messageBottomRef}></div>
      </div>

      <div className="sticky bottom-0 w-full bg-background-900">
        <CommentInput
          placeholder="Aa"
          needLogin={false}
          showAvatar={false}
          onEnter={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default React.memo(ChatBar);
