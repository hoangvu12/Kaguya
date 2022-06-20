import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { Comment, Reaction } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";

type ReactType = "REACT" | "UNREACT";

type Variables = {
  type: ReactType;
  emoji: string;
};

type RequestBody = {
  comment_id: number;
} & Variables;

type ReactProps = {
  emoji: string;
  comment_id: number;
  type: ReactType;
  user_id: string;
};

const handleReact = async (data: ReactProps) => {
  const { emoji, comment_id, type, user_id } = data;

  if (!user_id) {
    throw new Error("Missing user id");
  }

  if (!comment_id || !type) {
    throw new Error("Missing comment_id or type");
  }

  if (type === "UNREACT") {
    const { error: removeError } = await supabase
      .from<Reaction>("comment_reactions")
      .delete({ returning: "minimal" })
      .match({
        comment_id,
        user_id: user_id,
      });

    if (removeError) {
      throw removeError;
    }

    return;
  }

  if (type !== "REACT") {
    throw new Error("Invalid type");
  }

  if (!emoji) {
    throw new Error("Missing emoji");
  }

  const { error: addReactError } = await supabase
    .from<Reaction>("comment_reactions")
    .insert({ emoji, comment_id, user_id: user_id });

  if (addReactError) {
    throw addReactError;
  }

  return;
};

const useReactComment = (commentId: number) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation<any, AxiosError, Variables>(
    ({ emoji, type }) =>
      handleReact({ emoji, type, comment_id: commentId, user_id: user.id }),
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
