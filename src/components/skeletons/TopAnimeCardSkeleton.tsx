import React from "react";
import Skeleton, { SkeletonItem } from "../shared/Skeleton";

const TopAnimeCardSkeleton = () => {
  return (
    <Skeleton>
      <SkeletonItem className="h-[110px] w-full" />
    </Skeleton>
  );
};

export default TopAnimeCardSkeleton;
