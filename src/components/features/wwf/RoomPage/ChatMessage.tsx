import Avatar from "@/components/shared/Avatar";
import EmojiText from "@/components/shared/EmojiText";
import { useUser } from "@/contexts/AuthContext";
import { ChatMessage } from "@/types";
import classNames from "classnames";
import React, { useMemo } from "react";

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const user = useUser();

  const isUserMessage = useMemo(
    () => user?.id === message.user.id,
    [message.user.id, user?.id]
  );

  return (
    <div
      className={classNames(
        "flex gap-2 rounded-md",
        isUserMessage && "flex-row-reverse"
      )}
    >
      {!isUserMessage && (
        <Avatar
          className="!w-8 !h-8"
          src={message.user.user_metadata.avatar_url}
        />
      )}

      <div className="space-y-1">
        {!isUserMessage && (
          <p className={classNames("font-light text-sm")}>
            {message.user.user_metadata.name}
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
