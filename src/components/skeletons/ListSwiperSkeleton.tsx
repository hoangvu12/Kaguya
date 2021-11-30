import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";
import AnimeCardSkeleton from "./AnimeCardSkeleton";

const AnimeSwiperSkeleton = () => {
  const breakpoint = useBreakpoint();

  return (
    <Skeleton>
      <SkeletonItem className="ml-6 mb-4 h-8 w-52" />

      <SkeletonItem className="mx-4 flex flex-wrap" container>
        {[...new Array(breakpoint.items)].map((_, index) => (
          <SkeletonItem
            key={index}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2"
            container
          >
            <AnimeCardSkeleton />
          </SkeletonItem>
        ))}
      </SkeletonItem>
    </Skeleton>
  );
};

export default AnimeSwiperSkeleton;
