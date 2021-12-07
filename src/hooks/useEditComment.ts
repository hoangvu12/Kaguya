import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import { PostgrestResponse } from "@supabase/postgrest-js";
import { InfiniteData, useMutation, useQueryClient } from "react-query";

type QueryData = InfiniteData<{
  data: Comment[];
}>;

const useEditComment = (comment: Comment) => {
  const queryClient = useQueryClient();
  const queryKey = ["comments", comment.anime_id || comment.manga_id];

  return useMutation<any, any, string, any>(
    async (body) => {
      return supabase
        .from<Comment>("comments")
        .update({
          body,
        })
        .match({ id: comment.id });
    },

    {
      onMutate: (body) => {
        const data = queryClient.getQueryData<QueryData>(queryKey);

        const newPages = data.pages.map((page) => {
          // If page does not contains the comment, return it as is
          if (
            !page.data.some(
              (c) =>
                c.id === comment.id ||
                c.reply_comments?.some((rc) => rc.comment.id === comment.id)
            )
          ) {
            return page;
          }

          let newComments: Comment[];

          if (comment.is_reply) {
            newComments = page.data.map((c) => {
              // If comment contains reply comment, remove it from replies array
              c.reply_comments?.map((rc) => {
                if (rc.comment.id === comment.id) {
                  rc.comment.body = body;
                }

                return rc;
              });

              return c;
            });
          } else {
            newComments = page.data.map((c) => {
              if (c.id === comment.id) {
                c.body = body;
              }

              return c;
            });
          }

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

export default useEditComment;
