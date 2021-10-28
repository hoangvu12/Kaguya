import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";
import AnimeCard from "./AnimeCard";

const BannerSwiperSkeleton = () => {
  return (
    <Skeleton>
      <SkeletonItem className="flex justify-between space-x-4" container>
        <SkeletonItem
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          container
        >
          <AnimeCard />
        </SkeletonItem>
        <SkeletonItem
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          container
        >
          <AnimeCard />
        </SkeletonItem>
        <SkeletonItem
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          container
        >
          <AnimeCard />
        </SkeletonItem>
        <SkeletonItem
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          container
        >
          <AnimeCard />
        </SkeletonItem>
        <SkeletonItem
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          container
        >
          <AnimeCard />
        </SkeletonItem>
        <SkeletonItem
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          container
        >
          <AnimeCard />
        </SkeletonItem>
      </SkeletonItem>
    </Skeleton>
  );
};

export default BannerSwiperSkeleton;
