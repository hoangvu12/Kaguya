import Avatar from "@/components/shared/Avatar";
import { useRoomInfo } from "@/contexts/RoomContext";
import { ChatMessage } from "@/types";
import classNames from "classnames";
import React, { useMemo } from "react";

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { basicRoomUser } = useRoomInfo();

  const isUserMessage = useMemo(
    () => basicRoomUser.userId === message.user.userId,
    [basicRoomUser.userId, message.user.userId]
  );

  return (
    <div
      className={classNames(
        "flex gap-2 rounded-md",
        isUserMessage && "flex-row-reverse"
      )}
    >
      {!isUserMessage && (
        <Avatar className="!w-8 !h-8" src={message.user.avatarUrl} />
      )}

      <div className="space-y-1">
        {!isUserMessage && (
          <p className={classNames("font-light text-sm")}>
            {message.user.name}
          </p>
        )}

        <p className="p-2 rounded-md bg-background-700">{message.body}</p>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
