import useEventListener from "@/hooks/useEventListener";
import { Comment } from "@/types";
import React from "react";
import CommentInput from "@/components/features/comment/CommentInput";

interface EditingCommentProps {
  comment: Comment;
  onLeave?: () => void;
  onSave?: (text: string) => void;
}

const EditingComment: React.FC<EditingCommentProps> = ({
  comment,
  onLeave,
  onSave,
}) => {
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();

      onLeave?.();
    }
  });

  return (
    <React.Fragment>
      <CommentInput defaultText={comment.body} onEnter={onSave} />
      <p className="text-sm text-gray-300">
        Bấm ESC để{" "}
        <button onClick={onLeave} className="text-primary-500 hover:underline">
          thoát
        </button>
        .
      </p>
    </React.Fragment>
  );
};

export default React.memo(EditingComment);
