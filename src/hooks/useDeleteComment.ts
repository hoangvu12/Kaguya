import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import {
  InfiniteData,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "react-query";

type QueryData = InfiniteData<{
  data: Comment[];
}>;

const useDeleteComment = (
  comment: Comment,
  options?: Omit<
    UseMutationOptions<Comment[], unknown, void, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  const queryKey = ["comments", comment.anime_id || comment.manga_id];

  return useMutation(
    async () => {
      const { data, error } = await supabase
        .from<Comment>("comments")
        .delete()
        .match({
          id: comment.id,
        });

      if (error) throw error;

      return data;
    },
    {
      onMutate: () => {
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
              if (
                c.reply_comments?.some((rc) => rc.comment.id === comment.id)
              ) {
                c.reply_comments = c.reply_comments.filter(
                  (rc) => rc.comment.id !== comment.id
                );
              }

              return c;
            });
          } else {
            newComments = page.data.filter((c) => c.id !== comment.id);
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
      ...options,
    }
  );
};

export default useDeleteComment;
