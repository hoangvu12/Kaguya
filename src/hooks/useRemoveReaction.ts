import { Comment, CommentReaction } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseRemoveReactionPayload {
  reactionType: string;
  commentId: string;
}

// Do a little surgery on the comment and manually decrement the reaction count
// or remove the item from the array if the reaction count was only 1
const removeOrDecrement = (reactionType: string, comment: Comment): Comment => {
  let newReactionsMetadata = [...comment.reactions_metadata];

  newReactionsMetadata = newReactionsMetadata.map((item) => {
    if (item.reaction_type === reactionType) {
      return {
        ...item,
        reaction_count: item.reaction_count - 1,
        active_for_user: false,
      };
    }

    return item;
  });

  newReactionsMetadata = newReactionsMetadata.filter((item) => {
    return item.reaction_count > 0;
  });

  newReactionsMetadata.sort((a, b) =>
    a.reaction_type.localeCompare(b.reaction_type)
  );

  return {
    ...comment,
    reactions_metadata: newReactionsMetadata,
  };
};

const useRemoveReaction = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation<
    CommentReaction,
    PostgrestError,
    UseRemoveReactionPayload,
    any
  >(
    async ({ reactionType, commentId }: UseRemoveReactionPayload) => {
      if (!user) throw new Error("Please login to react");

      const { data, error } = await supabaseClient
        .from<CommentReaction>("sce_comment_reactions")
        .delete({ returning: "representation" })
        .match({
          reaction_type: reactionType,
          comment_id: commentId,
          user_id: user.id,
        })
        .single();

      if (error) throw error;

      return data;
    },

    {
      onMutate: (data) => {
        queryClient.setQueryData<Comment>(
          ["comment", data.commentId],
          (comment) => removeOrDecrement(data.reactionType, comment)
        );

        queryClient.setQueryData<CommentReaction[]>(
          [
            "comment-reactions",
            { commentId: data.commentId, reactionType: data.reactionType },
          ],
          (reactions) => {
            if (!reactions?.length) return [];

            return reactions.filter(
              (reaction) =>
                reaction.user_id !== user.id &&
                reaction.reaction_type !== data.reactionType
            );
          }
        );
      },
      onSettled: (_, __, params) => {
        queryClient.invalidateQueries(["comment", params.commentId]);
        queryClient.invalidateQueries([
          "comment-reactions",
          { commentId: params.commentId, reactionType: params.reactionType },
        ]);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );
};

export default useRemoveReaction;
