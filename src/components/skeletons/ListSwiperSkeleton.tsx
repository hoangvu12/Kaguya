import useBreakpoint from "@/hooks/useBreakpoint";
import React from "react";
import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import CardSkeleton from "@/components/skeletons/CardSkeleton";

const ListSwiperSkeleton = () => {
  const breakpoint = useBreakpoint();

  return (
    <Skeleton className="px-4 md:px-12">
      <SkeletonItem className="mb-4 h-8 w-52" />

      <SkeletonItem
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-5"
        container
      >
        {[...new Array(breakpoint.items)].map((_, index) => (
          <SkeletonItem key={index} className="col-span-1 w-full" container>
            <CardSkeleton />
          </SkeletonItem>
        ))}
      </SkeletonItem>
    </Skeleton>
  );
};

export default ListSwiperSkeleton;
