import React from "react";
import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";

const EpisodeCardSkeleton = () => {
  return (
    <Skeleton>
      <SkeletonItem className="aspect-w-16 aspect-h-9"></SkeletonItem>
    </Skeleton>
  );
};

export default EpisodeCardSkeleton;
