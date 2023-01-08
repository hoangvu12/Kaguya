import { Comment } from "@/types";
import { MediaType } from "@/types/anilist";
import { useSupabaseQuery } from "@/utils/supabase";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQueryClient } from "react-query";

interface UseCommentsQuery {
  topic?: string;
  parentId?: string;
  type?: MediaType;
}

const useComments = (query: UseCommentsQuery) => {
  const { topic, parentId = null, type } = query;

  const queryClient = useQueryClient();

  return useSupabaseQuery(
    ["comments", { topic, parentId }],
    () => {
      const query = supabaseClient
        .from<Comment>("sce_comments_with_metadata")
        .select(
          "*,user:sce_display_users!user_id(*),reactions_metadata:sce_comment_reactions_metadata(*)"
        )
        .order("created_at", { ascending: true });

      if (topic) {
        query.eq("topic", topic);
      } else if (type) {
        query.like("topic", `${type.toLowerCase()}%`);
      }

      if (parentId) {
        query.eq("parent_id", parentId);
      } else {
        query.is("parent_id", null);
      }

      return query;
    },
    {
      onSuccess: (comments) => {
        comments.forEach((comment) => {
          queryClient.setQueryData(["comment", comment.id], comment);
        });
      },
    }
  );
};

export default useComments;
