import { Comment } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

interface UseCommentsQuery {
  topic: string;
  parentId: string | null;
}

const useComments = (query: UseCommentsQuery) => {
  const { topic, parentId } = query;

  return useSupabaseQuery(["comments", query], () => {
    const query = supabaseClient
      .from<Comment>("sce_comments_with_metadata")
      .select(
        "*,user:sce_display_users!user_id(*),reactions_metadata:sce_comment_reactions_metadata(*)"
      )
      .eq("topic", topic)
      .order("created_at", { ascending: true });

    if (parentId) {
      query.eq("parent_id", parentId);
    } else {
      query.is("parent_id", null);
    }

    return query;
  });
};

export default useComments;
