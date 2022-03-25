import CommentInput from "@/components/features/comment/CommentInput";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Chat as ChatType, ChatEvent, ChatMessage } from "@/types";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Chat from "./Chat";

const ChatBar = () => {
  const { socket } = useRoomInfo();
  const [chats, setChats] = useState<ChatType[]>([]);
  const messageBottomRef = useRef<HTMLDivElement>();

  useEffect(() => {
    socket.on("message", (message: ChatMessage) => {
      setChats((prev) => [...prev, { ...message, type: "message" }]);

      messageBottomRef.current?.scrollIntoView();
    });

    socket.on("event", (event: ChatEvent) => {
      setChats((prev) => [...prev, { ...event, type: "event" }]);
    });

    return () => {
      socket.off("message");
      socket.off("event");
    };
  }, [socket]);

  const handleSendMessage = useCallback(
    (text: string) => {
      socket.emit("sendMessage", text);
    },
    [socket]
  );

  return (
    <div
      style={{ width: "25%" }}
      className="flex flex-col p-4 h-full bg-background-800"
    >
      <p className="text-center font-medium py-2 border-b border-gray-600">
        Trò chuyện
      </p>

      <div className="grow py-4 space-y-2 overflow-y-auto no-scrollbar">
        {chats.map((chat, index) => (
          <Chat chat={chat} key={index} />
        ))}

        <div ref={messageBottomRef}></div>
      </div>

      <CommentInput
        placeholder="Nhập tin nhắn"
        needLoginMessage={
          <p className="text-gray-300">
            Bạn phải{" "}
            <Link href="/login">
              <a className="text-primary-300 hover:underline">đăng nhập</a>
            </Link>{" "}
            dể nhắn tin.
          </p>
        }
        showAvatar={false}
        onEnter={handleSendMessage}
      />
    </div>
  );
};

export default React.memo(ChatBar);
