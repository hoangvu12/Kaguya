import { Comment } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseUpdateCommentPayload {
  id: string;
  comment: string;
  mentionedUserIds: string[];
}

const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, PostgrestError, UseUpdateCommentPayload, any>(
    async (payload: UseUpdateCommentPayload) => {
      const { data, error } = await supabaseClient
        .from<Comment>("sce_comments")
        .update({
          mentioned_user_ids: payload.mentionedUserIds,
          comment: payload.comment,
        })
        .match({ id: payload.id })
        .single();

      if (error) throw error;

      return data;
    },
    {
      onMutate: (payload) => {
        queryClient.setQueryData<Comment>(
          ["comment", payload.id],
          (comment) => ({
            ...comment,
            comment: payload.comment,
            mentioned_user_ids: payload.mentionedUserIds,
          })
        );
      },
      onSettled: (data) => {
        queryClient.invalidateQueries(["comment", data.id]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useUpdateComment;
