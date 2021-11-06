import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";
import AnimeCard from "./AnimeCard";

const AnimeListSkeleton = () => {
  return (
    <Skeleton className="flex flex-wrap -my-8">
      {new Array(15).fill(null).map((_, index) => (
        <SkeletonItem
          container
          className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 snap-mandatory my-8"
          key={index}
        >
          <AnimeCard />
        </SkeletonItem>
      ))}
    </Skeleton>
  );
};

export default AnimeListSkeleton;
