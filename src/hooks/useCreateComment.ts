import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import {
  PostgrestError,
  PostgrestFilterBuilder,
  PostgrestResponse,
} from "@supabase/postgrest-js";
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
  const queryKey = [
    "comments",
    options.type === "new"
      ? options.anime_id || options.manga_id
      : options.comment.anime_id || options.comment.manga_id,
  ];

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
        const data = queryClient.getQueryData<QueryData>(queryKey);

        if (options.type === "new") {
          data.pages[0].data.push({
            body,
            user_id: user.id,
            is_reply: false,
            anime_id: options.anime_id,
            manga_id: options.manga_id,
            id: Math.floor(Math.random() * 1000000),
            user,
            created_at: new Date(),
          });

          return queryClient.setQueryData<QueryData>(queryKey, data);
        }

        const newPages = data.pages.map((page) => {
          // If page does not contains the comment, return it as is
          if (!page.data.some((c) => c.id === options.comment.id)) {
            return page;
          }

          const newComments = page.data.map((c) => {
            // If comment contains reply comment, remove it from replies array
            if (c.id === options.comment.id) {
              (c.reply_comments || []).push({
                comment: {
                  body,
                  user_id: user.id,
                  is_reply: true,
                  id: Math.floor(Math.random() * 1000000),
                  user,
                  created_at: new Date(),
                },
              });
            }

            return c;
          });

          return { ...page, data: newComments };
        });

        queryClient.setQueryData<QueryData>(queryKey, {
          ...data,
          pages: newPages,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};
