import { useUser } from "@/contexts/AuthContext";
import useComment from "@/hooks/useComment";
import useDeleteComment from "@/hooks/useDeleteComment";
import useEditComment from "@/hooks/useEditComment";
import useReactComment from "@/hooks/useReactComment";
import dayjs from "@/lib/dayjs";
import { Comment as CommentType } from "@/types";
import { getMostOccuringEmojis } from "@/utils/emoji";
import { EmojiData } from "emoji-mart";
import React, { useState } from "react";
import CommentAction, { CommentActionType } from "../seldom/CommentAction";
import EditingComment from "../seldom/EditingComment";
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
  const deleteMutation = useDeleteComment(comment);
  const editMutation = useEditComment(comment);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [hasReacted, setHasReacted] = useState(() => {
    return comment.reactions?.some((reaction) => reaction.user_id === user?.id);
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleActionSelect = (type: CommentActionType) => {
    if (type === "DELETE") {
      deleteMutation.mutate();
    } else if (type === "EDIT") {
      setIsEditing(true);
    }
  };

  const handleEditSave = (text: string) => {
    setIsEditing(false);

    editMutation.mutate(text);
  };

  const mostUsedEmojis = getMostOccuringEmojis(
    comment?.reactions?.length
      ? comment?.reactions.map((reaction) => reaction.emoji)
      : []
  );

  return comment.user ? (
    !isEditing ? (
      <div className="flex space-x-2 group">
        <Avatar src={comment.user.user_metadata.avatar_url} />

        <div className="w-full">
          <div className="flex items-center space-x-2">
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

            {comment.user_id === user?.id && (
              <div className="hidden group-hover:block">
                <CommentAction onActionSelect={handleActionSelect} />
              </div>
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

          {!!comment.reply_comments?.length && (
            <div className="mt-3 space-y-4">
              {comment.reply_comments.map(({ comment }) => (
                <Comment key={comment.id} comment={comment} level={level + 1} />
              ))}
            </div>
          )}

          {showReplyInput && (
            <div className="mt-4">
              <CommentInput
                placeholder="Trả lời bình luận."
                onEnter={(text) => {
                  console.dir(`text: ${text}`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    ) : (
      <EditingComment
        comment={comment}
        onLeave={() => setIsEditing(false)}
        onSave={handleEditSave}
      />
    )
  ) : null;
};

export default React.memo(Comment);
