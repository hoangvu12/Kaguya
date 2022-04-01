import CommentAction, {
  CommentActionType,
} from "@/components/features/comment/CommentAction";
import CommentInput from "@/components/features/comment/CommentInput";
import EditingComment from "@/components/features/comment/EditingComment";
import Avatar from "@/components/shared/Avatar";
import DotList from "@/components/shared/DotList";
import EmojiPicker from "@/components/shared/EmojiPicker";
import EmojiText from "@/components/shared/EmojiText";
import { useUser } from "@/contexts/AuthContext";
import useComment from "@/hooks/useComment";
import { useCreateComment } from "@/hooks/useCreateComment";
import useDeleteComment from "@/hooks/useDeleteComment";
import useEditComment from "@/hooks/useEditComment";
import useReactComment from "@/hooks/useReactComment";
import dayjs from "@/lib/dayjs";
import { Comment as CommentType } from "@/types";
import { getMostOccuringEmojis } from "@/utils/emoji";
import { IEmojiData } from "emoji-picker-react";
import React, { useCallback, useMemo, useState } from "react";

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
  const createMutation = useCreateComment({ type: "reply", comment });

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [hasReacted, setHasReacted] = useState(() => {
    return comment.reactions?.some((reaction) => reaction.user_id === user?.id);
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleReplyClick = useCallback(() => {
    setShowReplyInput((prev) => !prev);
  }, []);

  const handleReactEmojiSelect = useCallback(
    (_: any, emoji: IEmojiData) => {
      setHasReacted(true);

      reactMutation.mutate({ emoji: emoji.emoji, type: "REACT" });
    },
    [reactMutation]
  );

  const handleUnReact = useCallback(() => {
    setHasReacted(false);

    reactMutation.mutate({ emoji: "", type: "UNREACT" });
  }, [reactMutation]);

  const handleActionSelect = useCallback(
    (type: CommentActionType) => {
      if (type === "DELETE") {
        deleteMutation.mutate();
      } else if (type === "EDIT") {
        setIsEditing(true);
      }
    },
    [deleteMutation, setIsEditing]
  );

  const handleEditSave = useCallback(
    (text: string) => {
      setIsEditing(false);

      editMutation.mutate(text);
    },
    [editMutation]
  );

  const handleReply = useCallback(
    (text: string) => {
      createMutation.mutate(text);
    },
    [createMutation]
  );

  const mostUsedEmojis = useMemo(
    () =>
      getMostOccuringEmojis(
        comment?.reactions?.length
          ? comment?.reactions.map((reaction) => reaction.emoji)
          : []
      ),
    [comment?.reactions]
  );

  return comment.user ? (
    !isEditing ? (
      <div className="flex space-x-2 group">
        <Avatar
          className="shrink-0"
          src={comment.user.user_metadata.avatar_url}
        />

        <div className="w-full">
          <div className="flex items-center space-x-2">
            <div className="relative inline-block p-3 mb-2 space-y-2 rounded-md bg-background-900">
              <DotList>
                <span className="text-lg">
                  {comment.user.user_metadata.name}
                </span>
                <span className="text-sm text-gray-300">
                  {dayjs(comment.created_at).fromNow()}
                </span>
              </DotList>

              <EmojiText text={comment.body} className="break-words" />

              {!!comment.reactions?.length && (
                <div className="flex gap-2 absolute -bottom-3 px-2 rounded-full reactions bg-background-800 -right-3">
                  <ul className="flex items-center">
                    {mostUsedEmojis.map((emoji) => (
                      <li className="-space-x-1.5" key={emoji}>
                        {emoji}
                      </li>
                    ))}
                  </ul>

                  <p>{comment.reactions.length}</p>
                </div>
              )}
            </div>

            {comment.user_id === user?.id && (
              <CommentAction onActionSelect={handleActionSelect} />
            )}
          </div>

          <div className="flex items-center px-3 space-x-4">
            {!hasReacted ? (
              <EmojiPicker
                reference={
                  <p className="text-sm text-gray-300 hover:underline">Thích</p>
                }
                placement="top"
                onEmojiClick={handleReactEmojiSelect}
                disableAutoFocus
                disableSearchBar
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

            {comment.is_edited && (
              <p className="text-gray-400 text-sm">Đã chỉnh sửa</p>
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
                onEnter={handleReply}
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
