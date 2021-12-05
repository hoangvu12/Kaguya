import { customEmojis } from "@/utils/emoji";
import { Emoji as EmojiMart, EmojiProps } from "emoji-mart";
import React from "react";

const Emoji: React.FC<EmojiProps> = ({ emoji, ...props }) => {
  if (typeof emoji === "string") {
    const customEmoji = customEmojis.find(
      (customEmoji) => customEmoji.colons === emoji
    );

    if (customEmoji) {
      emoji = customEmoji;
    }
  }

  return <EmojiMart set="facebook" size={24} {...props} emoji={emoji} />;
};

export default React.memo(Emoji);
