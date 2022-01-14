import CommentInput from "@/components/features/comment/CommentInput";
import { useCreateComment } from "@/hooks/useCreateComment";
import { Comment } from "@/types";
import {
  SupabaseInfiniteQueriesFunction,
  useSupaInfiniteQuery,
} from "@/utils/supabase";
import React, { useMemo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { QueryKey, useQueryClient } from "react-query";
import CommentComponent from "@/components/features/comment/Comment";
import InView from "@/components/shared/InView";

interface CommentsSectionProps {
  query: {
    queryKey: QueryKey;
    queryFn: SupabaseInfiniteQueriesFunction<Comment>;
  };
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
    useSupaInfiniteQuery<Comment>(props.query.queryKey, props.query.queryFn, {
      onSuccess: (data) => {
        const comments = data.pages.map((page) => page.data).flat();

        comments.forEach((comment) => {
          queryClient.setQueryData(["comment", comment.id], comment);
        });
      },
    });

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
