import React from "react";
import Skeleton from "../shared/Skeleton";
import TopAnimeCardSkeleton from "./TopAnimeCardSkeleton";

const TopAnimeListSkeleton = () => {
  return (
    <Skeleton className="space-y-10">
      <TopAnimeCardSkeleton />
      <TopAnimeCardSkeleton />
      <TopAnimeCardSkeleton />
      <TopAnimeCardSkeleton />
      <TopAnimeCardSkeleton />
    </Skeleton>
  );
};

export default TopAnimeListSkeleton;
