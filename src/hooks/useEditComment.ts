import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import { PostgrestError, PostgrestResponse } from "@supabase/postgrest-js";
import { useMutation, useQueryClient } from "react-query";

const useEditComment = (comment: Comment) => {
  const queryClient = useQueryClient();
  const queryKey = ["comment", comment.id];

  return useMutation<PostgrestResponse<Comment>, PostgrestError, string, any>(
    async (body) => {
      return supabase
        .from<Comment>("comments")
        .update(
          {
            body,
            is_edited: true,
          },
          {
            returning: "minimal",
          }
        )
        .match({ id: comment.id });
    },

    {
      onMutate: (body) => {
        const comment = queryClient.getQueryData<Comment>(queryKey);

        if (comment.body === body) return;

        if (!comment) {
          throw new Error("Comment not found");
        }

        comment.body = body;

        queryClient.setQueryData(queryKey, comment);
      },

      onSettled: () => {
        queryClient.invalidateQueries(queryKey, {
          refetchInactive: true,
        });
      },
    }
  );
};

export default useEditComment;
