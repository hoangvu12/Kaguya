import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import {
  InfiniteData,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "react-query";

const useDeleteComment = (
  comment: Comment,
  options?: Omit<
    UseMutationOptions<Comment[], unknown, void, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  const queryKey = ["comment", comment.id];

  return useMutation(
    async () => {
      const { data, error } = await supabase
        .from<Comment>("comments")
        .delete({ returning: "minimal" })
        .match({
          id: comment.id,
        });

      if (error) throw error;

      return data;
    },
    {
      onMutate: () => {
        queryClient.setQueryData(queryKey, {});
      },

      onError: () => {
        queryClient.invalidateQueries(queryKey, { refetchInactive: true });
      },
      ...options,
    }
  );
};

export default useDeleteComment;
