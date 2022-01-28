import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import React from "react";

const ListSkeleton = () => {
  return (
    <Skeleton className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {new Array(15).fill(null).map((_, index) => (
        <SkeletonItem container className="col-span-1" key={index}>
          <CardSkeleton />
        </SkeletonItem>
      ))}
    </Skeleton>
  );
};

export default React.memo(ListSkeleton);
