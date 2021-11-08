import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";
import EpisodeCardSkeleton from "./EpisodeCardSkeleton";

const WatchedSwiperSkeleton = () => {
  const breakpoint = useBreakpoint();

  return (
    <Skeleton className="md:px-6 space-y-4">
      <SkeletonItem className="ml-6 mb-4 h-8 w-52" />

      <SkeletonItem className="mx-4 flex flex-wrap" container>
        {[...new Array(breakpoint.items - 1)].map((_, index) => (
          <SkeletonItem
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2"
            container
          >
            <EpisodeCardSkeleton />
          </SkeletonItem>
        ))}
      </SkeletonItem>
    </Skeleton>
  );
};

export default WatchedSwiperSkeleton;
