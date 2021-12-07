import { useUser } from "@/contexts/AuthContext";
import useComment from "@/hooks/useComment";
import useReactComment from "@/hooks/useReactComment";
import dayjs from "@/lib/dayjs";
import { Comment as CommentType } from "@/types";
import { getMostOccuringEmojis } from "@/utils/emoji";
import { EmojiData } from "emoji-mart";
import React, { useEffect, useMemo, useState } from "react";
import Avatar from "./Avatar";
import CommentInput from "./CommentInput";
import DotList from "./DotList";
import EmojiPicker from "./EmojiPicker";
import EmojiText from "./EmojiText";

interface CommentProps {
  comment: CommentType;
  level?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment: initialComment,
  level = 1,
}) => {
  const user = useUser();

  const { data: comment } = useComment(initialComment.id, {
    enabled: false,
    initialData: initialComment,
  });

  const reactMutation = useReactComment(comment.id);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [hasReacted, setHasReacted] = useState(() => {
    return comment.reactions?.some((reaction) => reaction.user_id === user?.id);
  });

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleReactEmojiSelect = (emoji: EmojiData) => {
    setHasReacted(true);

    reactMutation.mutate({ emoji: emoji.colons, type: "REACT" });
  };

  const handleUnReact = () => {
    setHasReacted(false);

    reactMutation.mutate({ emoji: "", type: "UNREACT" });
  };

  const mostUsedEmojis = useMemo(
    () =>
      getMostOccuringEmojis(
        comment?.reactions.map((reaction) => reaction.emoji)
      ),
    [comment.reactions]
  );

  return comment.user ? (
    <div className="flex space-x-2">
      <Avatar src={comment.user.user_metadata.avatar_url} />

      <div className="w-full">
        <div className="relative inline-block p-3 mb-2 space-y-2 rounded-md bg-background-900">
          <DotList>
            <p className="text-lg">{comment.user.user_metadata.name}</p>
            <p className="text-sm text-gray-300">
              {dayjs(comment.created_at).fromNow()}
            </p>
          </DotList>

          <EmojiText text={comment.body} disabled className="break-words" />

          {!!comment.reactions?.length && (
            <EmojiText
              disabled
              text={`<p class="-space-x-2 inline">${mostUsedEmojis
                .slice(0, 2)
                .join("")}</p> ${comment.reactions.length}`}
              className="absolute bottom-0 px-2 rounded-lg reactions -right-3 bg-background-900"
            />
          )}
        </div>

        <div className="flex items-center px-3 space-x-4">
          {!hasReacted ? (
            <EmojiPicker
              reference={
                <p className="text-sm text-gray-300 hover:underline">Thích</p>
              }
              placement="right"
              onSelect={handleReactEmojiSelect}
            />
          ) : (
            <button
              onClick={handleUnReact}
              className="text-sm text-primary-500 hover:underline"
            >
              Đã thích
            </button>
          )}

          {level === 1 && (
            <button
              onClick={handleReplyClick}
              className="text-sm text-gray-300 hover:underline"
            >
              Trả lời
            </button>
          )}
        </div>

        {comment.reply_comments?.length && (
          <div className="mt-3 space-y-4">
            {comment.reply_comments.map(({ comment }) => (
              <Comment key={comment.id} comment={comment} level={level + 1} />
            ))}
          </div>
        )}

        {showReplyInput && (
          <div className="mt-4">
            <CommentInput placeholder="Trả lời bình luận." />
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default React.memo(Comment);
