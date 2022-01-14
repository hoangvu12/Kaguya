import React from "react";
import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";

const CardSkeleton = () => {
  return (
    <Skeleton>
      <SkeletonItem className="aspect-w-9 aspect-h-16"></SkeletonItem>
    </Skeleton>
  );
};

export default CardSkeleton;
