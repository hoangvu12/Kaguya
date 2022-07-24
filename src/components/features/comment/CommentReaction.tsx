import Avatar from "@/components/shared/Avatar";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import useCommentReactions from "@/hooks/useCommentReactions";
import { CommentReactionMetadata } from "@/types";
import clsx from "clsx";
import { FC, useState } from "react";
import Reaction from "./Reaction";

const CommentReactionsModal = ({
  visible,
  commentId,
  reactionType,
  onClose,
}: any) => {
  const { isLoading, data } = useCommentReactions(
    {
      commentId,
      reactionType,
    },
    { enabled: visible }
  );

  return (
    <div className="fixed inset-0 -z-10">
      <Modal className="md:w-1/3 w-11/12" defaultValue={true} onClose={onClose}>
        <div className="max-h-[320px] overflow-y-auto space-y-3 w-full">
          <h1 className="font-semibold text-xl">Reactions</h1>

          {isLoading && (
            <div className="relative w-full h-10">
              <Loading className="w-6 h-6" />
            </div>
          )}
          {data?.map((commentReaction) => (
            <div className="flex items-center gap-2" key={commentReaction.id}>
              <Avatar
                className="shrink-0"
                src={commentReaction?.user?.avatar}
              />

              <p>{commentReaction?.user?.name || "Unknown"}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export interface CommentReactionProps {
  metadata: CommentReactionMetadata;
  toggleReaction: (reactionType: string) => void;
}

const CommentReaction: FC<CommentReactionProps> = ({
  metadata,
  toggleReaction,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {showDetails && (
        <CommentReactionsModal
          commentId={metadata.comment_id}
          reactionType={metadata.reaction_type}
          onClose={() => setShowDetails(false)}
        />
      )}

      <div
        className={clsx(
          "flex items-center space-x-2 py-1 px-2 rounded-full bg-background-600",
          metadata.active_for_user
            ? "ring-2 ring-primary-500"
            : "hover:ring-2 hover:ring-gray-600"
        )}
      >
        <div
          tabIndex={0}
          className={"cursor-pointer"}
          onClick={() => {
            toggleReaction(metadata.reaction_type);
          }}
        >
          <Reaction className="w-4 h-4" type={metadata.reaction_type} />
        </div>

        <p className="pr-1 text-xs dark:text-[color:var(--sce-accent-50)] text-[color:var(--sce-accent-900)]">
          <span className="cursor-pointer" onClick={() => setShowDetails(true)}>
            {metadata.reaction_count}
          </span>
        </p>
      </div>
    </>
  );
};

export default CommentReaction;
