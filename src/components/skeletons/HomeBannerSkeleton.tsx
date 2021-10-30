import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";
import BannerSwiperSkeleton from "./BannerSwiperSkeleton";

const HomeBannerSkeleton = () => {
  return (
    <Skeleton className="pb-12">
      <SkeletonItem className="relative w-full h-[500px]" container>
        <SkeletonItem
          className="absolute inset-0 flex flex-col justify-center px-4 md:px-12"
          container
        >
          <SkeletonItem className="w-full md:w-[45%]" container>
            <SkeletonItem className="h-14 w-11/12 rounded-sm" />
            <SkeletonItem
              className="mt-4 flex items-center space-x-4"
              container
            >
              <SkeletonItem className="h-7 w-24 rounded-sm" />
              <SkeletonItem className="h-7 w-24 rounded-sm" />
              <SkeletonItem className="h-7 w-24 rounded-sm" />
            </SkeletonItem>
            <SkeletonItem className="mt-4 h-32 w-full rounded-sm" />
          </SkeletonItem>
        </SkeletonItem>
      </SkeletonItem>
      <SkeletonItem className="mt-8" container>
        <BannerSwiperSkeleton />
      </SkeletonItem>
    </Skeleton>
  );
};

export default HomeBannerSkeleton;
