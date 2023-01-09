import { Comment } from "@/types";
import { randomString } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@/contexts/AuthContext";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseAddCommentPayload {
  comment: string;
  topic: string;
  parentId: string | null;
  mentionedUserIds: string[];
}

const useCreateComment = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<Comment, PostgrestError, UseAddCommentPayload, any>(
    async ({
      comment,
      topic,
      parentId,
      mentionedUserIds,
    }: UseAddCommentPayload) => {
      if (!user) throw new Error("Please login to comment");

      const { data, error } = await supabaseClient
        .from<Comment>("sce_comments")
        .insert({
          comment,
          topic,
          parent_id: parentId,
          mentioned_user_ids: mentionedUserIds,
          user_id: user?.id,
        })
        .single();

      if (error) throw error;

      return data;
    },
    {
      onMutate: (data) => {
        queryClient.setQueryData<Comment[]>(
          ["comments", { topic: data.topic, parentId: data.parentId }],
          (comments) => {
            comments.push({
              comment: data.comment,
              topic: data.topic,
              parent_id: data.parentId,
              user_id: user?.id,
              mentioned_user_ids: data.mentionedUserIds,
              created_at: new Date().toUTCString(),
              id: randomString(9),
              replies_count: 0,
              user: {
                avatar: user?.avatarUrl,
                name: user?.name,
                id: user?.id,
                role: user?.role,
                username: user?.username,
              },
              reactions_metadata: [],
            });

            return comments;
          }
        );
      },
      onSuccess: (_, params) => {
        queryClient.invalidateQueries([
          "comments",
          { topic: params.topic, parentId: params.parentId },
        ]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useCreateComment;
