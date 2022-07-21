import Avatar from "@/components/shared/Avatar";
import EmojiText from "@/components/shared/EmojiText";
import { ChatMessage } from "@/types";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useRoomInfo } from "@/contexts/RoomContext";

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

        <EmojiText
          className={classNames(
            "rounded-md p-2 bg-background-500 max-w-max",
            isUserMessage ? "ml-auto" : "mr-auto"
          )}
          text={message.body}
        />
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
