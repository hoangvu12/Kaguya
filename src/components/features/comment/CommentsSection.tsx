import CommentComponent from "@/components/features/comment/Comment";
import CommentInput from "@/components/features/comment/CommentInput";
import InView from "@/components/shared/InView";
import { useCreateComment } from "@/hooks/useCreateComment";
import supabase from "@/lib/supabase";
import { Comment } from "@/types";
import { useSupaInfiniteQuery } from "@/utils/supabase";
import React, { useMemo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQueryClient } from "react-query";

interface CommentsSectionProps {
  anime_id?: number;
  manga_id?: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = (props) => {
  const queryClient = useQueryClient();

  const createCommentMutation = useCreateComment({
    type: "new",
    anime_id: props.anime_id,
    manga_id: props.manga_id,
  });

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useSupaInfiniteQuery<Comment>(
      ["comments", props.anime_id ? props.anime_id : props.manga_id],
      (from, to) => {
        let db = supabase
          .from<Comment>("comments")
          .select(
            `
              *,
              user:user_id(*),
              reply_comments!original_id(
                comment:reply_id(
                  *,
                  user:user_id(*),
                  reactions:comment_reactions(*)
                )
              ),
              reactions:comment_reactions(*)
            `
          )

          .is("is_reply", false)
          .order("created_at", { ascending: true })
          .range(from, to);

        if (props.anime_id) {
          db = db.eq("anime_id", props.anime_id);
        }

        if (props.manga_id) {
          db = db.eq("manga_id", props.manga_id);
        }

        return db;
      },
      {
        onSuccess: (data) => {
          const comments = data.pages.map((page) => page.data).flat();

          comments.forEach((comment) => {
            queryClient.setQueryData(["comment", comment.id], comment);
          });
        },
      }
    );

  const handleInputSubmit = (text: string) => {
    createCommentMutation.mutate(text);
  };

  const comments = useMemo(
    () => data?.pages?.map(({ data }) => data).flat(),
    [data]
  );

  return (
    <div className="space-y-8">
      <div className="relative space-y-4">
        {isLoading ? (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : (
          <React.Fragment>
            {!!comments.length ? (
              comments.map((comment) => (
                <CommentComponent comment={comment} key={comment.id} />
              ))
            ) : (
              <p className="text-center text-gray-300 text-sm">
                Hãy là người đầu tiên bày tỏ suy nghĩ về bộ này!
              </p>
            )}

            {hasNextPage && <InView onInView={fetchNextPage} />}
          </React.Fragment>
        )}
      </div>

      <CommentInput onEnter={handleInputSubmit} />
    </div>
  );
};

export default React.memo(CommentsSection);
