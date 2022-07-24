import { CommentReactionMetadata } from "@/types";
import React from "react";
import CommentReaction from "./CommentReaction";

export interface CommentReactionsProps {
  reactionsMetadata: CommentReactionMetadata[];
  toggleReaction: (reactionType: string) => void;
}

export const CommentReactions: React.FC<CommentReactionsProps> = ({
  reactionsMetadata,
  toggleReaction,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {reactionsMetadata.map((reactionMetadata) => (
        <CommentReaction
          key={reactionMetadata.reaction_type}
          metadata={reactionMetadata}
          toggleReaction={toggleReaction}
        />
      ))}
    </div>
  );
};

export default CommentReactions;
