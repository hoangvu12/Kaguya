import CommentInput from "@/components/shared/CommentInput";
import { Comment } from "@/types";
import {
  SupabaseInfiniteQueriesFunction,
  useSupaInfiniteQuery,
} from "@/utils/supabase";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { QueryKey, useQueryClient } from "react-query";
import CommentComponent from "../shared/Comment";

interface CommentsSectionProps {
  query: {
    queryKey: QueryKey;
    queryFn: SupabaseInfiniteQueriesFunction<Comment>;
  };
}

const CommentsSection: React.FC<CommentsSectionProps> = (props) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useSupaInfiniteQuery<Comment>(
    props.query.queryKey,
    props.query.queryFn,
    {
      onSuccess: (data) => {
        const comments = data.pages.map((page) => page.data).flat();

        comments.forEach((comment) => {
          queryClient.setQueryData(["comment", comment.id], comment);
        });
      },
    }
  );

  return (
    <div className="space-y-8">
      <div className="relative space-y-4">
        {isLoading ? (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : (
          data.pages
            .map(({ data }) => data)
            .flat()
            .map((comment) => (
              <CommentComponent comment={comment} key={comment.id} />
            ))
        )}
      </div>

      {/* <CommentInput /> */}
    </div>
  );
};

export default CommentsSection;
