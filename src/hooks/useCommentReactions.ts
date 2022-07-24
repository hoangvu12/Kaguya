import { CommentReaction } from "@/types";
import { SupabaseQueryOptions, useSupabaseQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQueryClient } from "react-query";

interface UseCommentReactionsQuery {
  commentId: string;
  reactionType: string;
}

const useCommentReactions = (
  { commentId, reactionType }: UseCommentReactionsQuery,
  options: SupabaseQueryOptions<CommentReaction>
) => {
  const queryClient = useQueryClient();

  return useSupabaseQuery<CommentReaction>(
    ["comment-reactions", { commentId, reactionType }],
    () => {
      return supabaseClient
        .from("sce_comment_reactions")
        .select("*,user:sce_display_users!user_id(*)")
        .eq("comment_id", commentId)
        .eq("reaction_type", reactionType);
    },
    {
      staleTime: Infinity,
      onSuccess: (data) => {
        data?.forEach((commentReaction) => {
          queryClient.setQueryData(
            ["users", commentReaction.user_id],
            commentReaction.user
          );
        });
      },
      ...options,
    }
  );
};

export default useCommentReactions;
