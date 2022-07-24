import { Comment } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const useComment = (commentId: string) => {
  return useSupabaseSingleQuery(
    ["comment", commentId],
    () =>
      supabaseClient
        .from<Comment>("sce_comments_with_metadata")
        .select(
          "*,user:sce_display_users!user_id(*),reactions_metadata:sce_comment_reactions_metadata(*)"
        )
        .eq("id", commentId)
        .single(),
    { staleTime: Infinity }
  );
};

export default useComment;
