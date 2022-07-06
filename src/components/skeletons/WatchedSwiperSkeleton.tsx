import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import EpisodeCardSkeleton from "@/components/skeletons/EpisodeCardSkeleton";
import Section from "../shared/Section";

const WatchedSwiperSkeleton = () => {
  const breakpoint = useBreakpoint({
    "1536": {
      items: 5,
    },
    1280: {
      items: 4,
    },
    1024: {
      items: 3,
    },
    768: {
      items: 2,
    },
    640: {
      items: 1,
    },
    0: {
      items: 1,
    },
  });

  return (
    <Section>
      <Skeleton>
        <SkeletonItem className="mb-4 h-8 w-52" />

        <SkeletonItem
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 md:gap-5"
          container
        >
          {[...new Array(breakpoint.items)].map((_, index) => (
            <SkeletonItem
              key={index}
              className="w-full col-span-1 aspect-w-16 aspect-h-9"
              container
            >
              <EpisodeCardSkeleton />
            </SkeletonItem>
          ))}
        </SkeletonItem>
      </Skeleton>
    </Section>
  );
};

export default WatchedSwiperSkeleton;
