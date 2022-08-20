import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import DotList from "@/components/shared/DotList";
import Loading from "@/components/shared/Loading";
import TextIcon from "@/components/shared/TextIcon";
import CommentReplyContextProvider, {
  useCommentReply,
} from "@/contexts/CommentReplyContext";
import useComment from "@/hooks/useComment";
import useCreateReaction from "@/hooks/useCreateReaction";
import useDeleteComment from "@/hooks/useDeleteComment";
import useRemoveReaction from "@/hooks/useRemoveReaction";
import useUpdateComment from "@/hooks/useUpdateComment";
import { Comment } from "@/types";
import { getMentionedUserIds } from "@/utils/editor";
import { userEvent } from "@storybook/testing-library";
import { useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsArrowReturnRight, BsReplyFill } from "react-icons/bs";
import CommentReactions from "./CommentReactions";
import Comments from "./Comments";
import Editor from "./Editor";
import ReactionSelector from "./ReactionSelector";

interface CommentContainerProps {
  commentId: string;
}

interface CommentProps {
  comment: Comment;
}

const CommentContainer: React.FC<CommentContainerProps> = ({ commentId }) => {
  const { data: comment, isLoading } = useComment(commentId);

  return (
    <div className="relative">
      {isLoading ? (
        <Loading />
      ) : !comment.parent_id ? (
        <CommentReplyContextProvider>
          <CommentComponent comment={comment} />
        </CommentReplyContextProvider>
      ) : (
        <CommentComponent comment={comment} />
      )}
    </div>
  );
};

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const { locale } = useRouter();
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const commentReply = useCommentReply();

  const { user } = useUser();

  const { mutate: createReaction } = useCreateReaction();
  const { mutate: removeReaction } = useRemoveReaction();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment({
    topic: comment.topic,
    parentId: comment.parent_id,
  });

  const activeReactions = comment.reactions_metadata.reduce(
    (set, reactionMetadata) => {
      if (reactionMetadata.active_for_user) {
        set.add(reactionMetadata.reaction_type);
      }
      return set;
    },
    new Set<string>()
  );

  const handleUpdate = (content: string) => {
    updateComment({
      comment: content,
      id: comment.id,
      mentionedUserIds: getMentionedUserIds(content),
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteComment(comment.id);
  };

  const handleToggleActionMenu: (
    isShow: boolean
  ) => React.MouseEventHandler<HTMLDivElement> = (isShow) => () => {
    setShowActionMenu(isShow);
  };

  const handleReply = () => {
    commentReply?.setReplyingTo(comment);

    setShowReplies(!showReplies);
  };

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleReaction = (reactionType: string) => {
    if (!activeReactions.has(reactionType)) {
      createReaction({
        commentId: comment.id,
        reactionType,
      });
    } else {
      removeReaction({
        commentId: comment.id,
        reactionType,
      });
    }
  };

  return (
    <div
      className="relative flex gap-2 md:gap-4"
      onMouseEnter={handleToggleActionMenu(true)}
      onMouseLeave={handleToggleActionMenu(false)}
    >
      <Avatar src={comment.user.avatar} />

      <div className="grow">
        <DotList className="mb-1">
          <span className="font-semibold">{comment.user.name}</span>

          <span className="text-gray-400 text-sm">
            {dayjs(comment.created_at, { locale }).fromNow()}
          </span>
        </DotList>

        <div className="mb-4">
          <Editor
            readOnly={!isEditing}
            defaultContent={comment.comment}
            onSubmit={handleUpdate}
            className="max-w-[30rem]"
          />
        </div>

        {comment.reactions_metadata?.length ? (
          <CommentReactions
            reactionsMetadata={comment.reactions_metadata}
            toggleReaction={toggleReaction}
          />
        ) : null}

        {!showReplies && !comment.parent_id && comment.replies_count > 0 && (
          <TextIcon
            className="mt-4 hover:underline cursor-pointer"
            onClick={handleShowReplies}
            LeftIcon={BsArrowReturnRight}
          >
            {comment.replies_count} replies
          </TextIcon>
        )}

        {showReplies && !comment.parent_id && (
          <div className="mt-6">
            <Comments topic={comment.topic} parentId={comment.id} />
          </div>
        )}
      </div>

      <div
        className={classNames(
          "bg-background-800 items-center gap absolute -top-2 right-0",
          showActionMenu ? "flex" : "hidden"
        )}
      >
        <ReactionSelector toggleReaction={toggleReaction} />

        <Button
          iconClassName="w-5 h-5"
          secondary
          LeftIcon={AiFillEdit}
          onClick={handleEdit}
        />

        <Button
          iconClassName="w-5 h-5"
          secondary
          LeftIcon={BsReplyFill}
          onClick={handleReply}
        />

        {comment.user.id === user?.id && (
          <DeleteConfirmation
            reference={
              <Button
                iconClassName="w-5 h-5"
                className="hover:bg-red-500"
                secondary
                LeftIcon={AiFillDelete}
              />
            }
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CommentContainer;
