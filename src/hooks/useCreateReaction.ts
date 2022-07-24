import { Comment, CommentReaction } from "@/types";
import { randomString } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseCreateReactionPayload {
  reactionType: string;
  commentId: string;
}

//https://github.com/malerba118/supabase-comments-extension

// Do a little surgery on the comment and manually increment the reaction count
// or add a new item to the array if the reaction was not previously in the
// reactions array.
const addOrIncrement = (reactionType: string, comment: Comment): Comment => {
  const isInArray = !!comment.reactions_metadata.find(
    (val) => val.reaction_type === reactionType
  );
  let newArray = [...comment.reactions_metadata];
  if (!isInArray) {
    newArray.push({
      comment_id: comment.id,
      reaction_type: reactionType,
      reaction_count: 1,
      active_for_user: true,
    });
  } else {
    newArray = newArray.map((item) => {
      if (item.reaction_type === reactionType) {
        return {
          ...item,
          reaction_count: item.reaction_count + 1,
          active_for_user: true,
        };
      } else {
        return item;
      }
    });
  }
  newArray.sort((a, b) => a.reaction_type.localeCompare(b.reaction_type));
  return {
    ...comment,
    reactions_metadata: newArray,
  };
};

const useCreateReaction = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation<
    CommentReaction,
    PostgrestError,
    UseCreateReactionPayload,
    any
  >(
    async ({ commentId, reactionType }: UseCreateReactionPayload) => {
      if (!user) throw new Error("Please login to react");

      const { data, error } = await supabaseClient
        .from<CommentReaction>("sce_comment_reactions")
        .insert({
          comment_id: commentId,
          reaction_type: reactionType,
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
          (comment) => addOrIncrement(data.reactionType, comment)
        );

        queryClient.setQueryData<CommentReaction[]>(
          [
            "comment-reactions",
            { commentId: data.commentId, reactionType: data.reactionType },
          ],
          (reactions) => {
            const newReactions = reactions?.length ? [...reactions] : [];

            newReactions.push({
              comment_id: data.commentId,
              created_at: new Date().toUTCString(),
              id: randomString(9),
              reaction_type: data.reactionType,
              user: {
                avatar: user?.user_metadata.avatar_url,
                name: user?.user_metadata.name,
                id: user?.id,
              },
              user_id: user.id,
            });

            return newReactions;
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
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useCreateReaction;
