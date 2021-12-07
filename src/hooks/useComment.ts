import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import {
  SupabaseSingleQueryOptions,
  useSupabaseSingleQuery,
} from "@/utils/supabase";

const useComment = (
  commentId: number,
  options?: SupabaseSingleQueryOptions<Comment>
) => {
  return useSupabaseSingleQuery<Comment>(
    ["comment", commentId],
    () =>
      supabase
        .from<Comment>("comments")
        .select(
          `
          *,
          user:user_id(*),
          reply_comments!original_id(
            comment:reply_id(
              *,
              user:user_id(*),
              reactions:comment_reactions(*)
            )
          ),
          reactions:comment_reactions(*)
          `
        )
        .eq("id", commentId)
        .limit(1)
        .single(),

    options
  );
};

export default useComment;
