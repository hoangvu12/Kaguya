import Loading from "@/components/shared/Loading";
import TransLink from "@/components/shared/TransLink";
import { useCommentReply } from "@/contexts/CommentReplyContext";
import useComments from "@/hooks/useComments";
import useCreateComment from "@/hooks/useCreateComment";
import { getMentionedUserIds } from "@/utils/editor";
import { useUser } from "@supabase/auth-helpers-react";
import { Editor as EditorType } from "@tiptap/react";
import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import CommentComponent from "./Comment";
import Editor from "./Editor";

interface CommentState {
  defaultContent?: string;
}

interface CommentsProps {
  parentId?: string;
  topic: string;
}

const Comments: React.FC<CommentsProps> = ({ parentId = null, topic }) => {
  const { t } = useTranslation("comment");
  const { data: comments, isLoading } = useComments({ parentId, topic });
  const [commentState, setCommentState] = useState<CommentState>({});
  const commentReply = useCommentReply();
  const { user } = useUser();
  const editorRef = useRef<EditorType>(null);

  const { mutate: createComment, isLoading: createCommentLoading } =
    useCreateComment();

  useEffect(() => {
    if (!commentReply?.replyingTo) {
      setCommentState({ defaultContent: null });
    } else {
      setCommentState({
        defaultContent: `<span data-type="mention" data-id="${commentReply.replyingTo.user.id}" data-label="${commentReply.replyingTo.user.name}" contenteditable="false"></span><span>&nbsp</span>`,
      });
    }
  }, [commentReply?.replyingTo]);

  const handleEditorSubmit = (content: string) => {
    createComment({
      topic,
      parentId,
      mentionedUserIds: getMentionedUserIds(content),
      comment: content,
    });

    setCommentState({ defaultContent: null });

    editorRef.current?.commands?.clearContent();
    commentReply?.setReplyingTo(null);
  };

  return (
    <div className="relative space-y-4 mb-4">
      {isLoading ? (
        <Loading className="py-4 w-8 h-8" />
      ) : (
        comments &&
        comments.map((comment) => (
          <CommentComponent key={comment.id} commentId={comment.id} />
        ))
      )}

      {user ? (
        <Editor
          ref={editorRef}
          placeholder={t("comment_placeholder")}
          defaultContent={commentState.defaultContent}
          autofocus={!!commentReply?.replyingTo}
          onSubmit={handleEditorSubmit}
          isLoading={createCommentLoading}
        />
      ) : (
        <p className="p-2 bg-background-800 text-gray-300">
          <Trans i18nKey="comment:need_login_msg">
            Bạn phải{" "}
            <TransLink
              href="/login"
              className="text-primary-300 hover:underline"
            >
              đăng nhập
            </TransLink>{" "}
            dể bình luận.
          </Trans>
        </p>
      )}
    </div>
  );
};

export default Comments;
