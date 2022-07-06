import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Section from "../shared/Section";

const CommentsSwiperSkeleton = () => {
  const breakpoint = useBreakpoint({
    1536: {
      items: 6,
    },
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
    <Section>
      <Skeleton>
        <SkeletonItem className="mb-4 h-8 w-52" />

        <SkeletonItem
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 md:gap-5"
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
    </Section>
  );
};

export default CommentsSwiperSkeleton;
