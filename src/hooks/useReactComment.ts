import { useUser } from "@/contexts/AuthContext";
import { Comment } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";

type ReactType = "REACT" | "UNREACT";

type Variables = {
  type: ReactType;
  emoji: string;
};

type Response = {
  success: boolean;
};

type RequestBody = {
  comment_id: number;
} & Variables;

const useReactComment = (commentId: number) => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<
    AxiosResponse<Response, RequestBody>,
    AxiosError,
    Variables
  >(
    ({ emoji, type }) =>
      axios.post<Response, AxiosResponse<Response, RequestBody>>(
        "/api/comments/react",
        { comment_id: commentId, emoji, type }
      ),
    {
      onMutate: ({ emoji, type }) => {
        const comment = queryClient.getQueryData<Comment>([
          "comment",
          commentId,
        ]);

        if (!comment) return;

        if (!comment.reactions) {
          comment.reactions = [];
        }

        if (type === "REACT") {
          comment.reactions.push({
            emoji,
            user_id: user.id,
            id: Math.floor(Math.random() * 9999), // Random ID to workaround type check
          });
        } else if (type === "UNREACT") {
          comment.reactions = comment.reactions.filter(
            (reaction) => reaction.user_id !== user.id
          );
        }

        queryClient.setQueryData(["comment", commentId], comment);
      },
      onSettled: () => {
        queryClient.refetchQueries(["comment", commentId]);
      },
    }
  );
};

export default useReactComment;
