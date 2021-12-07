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
        .select("*")
        .eq("id", commentId)
        .limit(1)
        .single(),

    options
  );
};

export default useComment;
