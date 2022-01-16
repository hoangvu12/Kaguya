import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";

const CommentsSwiperSkeleton = () => {
  const breakpoint = useBreakpoint({
    1280: {
      items: 5,
    },
    1024: {
      items: 4,
    },
    768: {
      items: 3,
    },
    640: {
      items: 2,
    },
    0: {
      items: 2,
    },
  });

  return (
    <Skeleton className="px-4 md:px-12">
      <SkeletonItem className="mb-4 h-8 w-52" />

      <SkeletonItem
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-5"
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
