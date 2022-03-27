import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import { PostgrestError } from "@supabase/postgrest-js";
import { InfiniteData, useMutation, useQueryClient } from "react-query";

type UseCreateCommentOptions =
  | {
      type: "new";
      anime_id?: number;
      manga_id?: number;
    }
  | {
      type: "reply";
      comment: Comment;
    };

type QueryData = InfiniteData<{
  data: Comment[];
}>;

export const useCreateComment = (options: UseCreateCommentOptions) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const queryKey =
    options.type === "new"
      ? ["comments", options.anime_id || options.manga_id]
      : ["comment", options.comment.id];

  return useMutation<Comment, PostgrestError, string, any>(
    async (body) => {
      const insertData: Comment = {
        body,
        user_id: user.id,
        is_reply: options.type === "reply",
        anime_id:
          options.type === "new" ? options.anime_id : options.comment.anime_id,
        manga_id:
          options.type === "new" ? options.manga_id : options.comment.manga_id,
      };

      const { data: createdComment, error: commentError } = await supabase
        .from<Comment>("comments")
        .insert(insertData)
        .limit(1)
        .single();

      if (commentError) {
        throw commentError;
      }

      if (options.type === "new") return createdComment;

      const { error: replyError } = await supabase
        .from("reply_comments")
        .insert({
          reply_id: createdComment.id,
          original_id: options.comment.id,
        });

      if (replyError) {
        const { error: deleteCommentError } = await supabase
          .from("comments")
          .delete({ returning: "minimal" })
          .match({ id: createdComment.id });

        if (deleteCommentError) {
          throw deleteCommentError;
        }

        throw replyError;
      }
      return createdComment;
    },
    {
      onMutate: (body) => {
        if (options.type === "new") {
          const data = queryClient.getQueryData<QueryData>(queryKey);

          data.pages[0].data.push({
            body,
            user_id: user.id,
            is_reply: false,
            anime_id: options.anime_id,
            manga_id: options.manga_id,
            id: Math.floor(Math.random() * 1000000),
            user,
            created_at: new Date().toString(),
          });

          return queryClient.setQueryData<QueryData>(queryKey, data);
        }

        const comment = queryClient.getQueryData<Comment>(queryKey);

        if (!comment) throw new Error("Comment not found");

        if (!comment?.reply_comments?.length) {
          comment.reply_comments = [];
        }

        comment.reply_comments.push({
          comment: {
            body,
            user_id: user.id,
            is_reply: true,
            id: Math.floor(Math.random() * 1000000),
            user,
            created_at: new Date().toString(),
          },
        });

        return queryClient.setQueryData<Comment>(queryKey, comment);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey, {
          refetchInactive: true,
        });
      },
    }
  );
};
