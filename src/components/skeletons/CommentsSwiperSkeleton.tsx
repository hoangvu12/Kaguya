import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";

const CommentsSwiperSkeleton = () => {
  const breakpoint = useBreakpoint();

  return (
    <Skeleton className="px-4 md:px-12">
      <SkeletonItem className="mb-4 h-8 w-52" />

      <SkeletonItem
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
        container
      >
        {[...new Array(breakpoint.items)].map((_, index) => (
          <SkeletonItem
            key={index}
            className="col-span-1 w-full rounded-lg aspect-w-1 aspect-h-1"
          />
        ))}
      </SkeletonItem>
    </Skeleton>
  );
};

export default CommentsSwiperSkeleton;
