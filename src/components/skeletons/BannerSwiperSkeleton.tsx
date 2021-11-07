import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";
import AnimeCardSkeleton from "./AnimeCardSkeleton";

const BannerSwiperSkeleton = () => {
  const breakpoint = useBreakpoint();

  return (
    <Skeleton>
      <SkeletonItem className="flex justify-between space-x-4" container>
        {[...new Array(breakpoint.items)].map((_, index) => (
          <SkeletonItem
            key={index}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
            container
          >
            <AnimeCardSkeleton />
          </SkeletonItem>
        ))}
      </SkeletonItem>
    </Skeleton>
  );
};

export default BannerSwiperSkeleton;
