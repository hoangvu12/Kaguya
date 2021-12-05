import React from "react";
import CommentInput from "@/components/shared/CommentInput";
import { Emoji } from "emoji-mart";
import { NimbleEmojiIndex } from "emoji-mart";
import { customEmojis } from "@/utils/emoji";

const CommentsSection = () => {
  return (
    <div>
      <CommentInput />

      <Emoji emoji={customEmojis[0]} size={24} />
    </div>
  );
};

export default CommentsSection;
