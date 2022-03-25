import React from "react";
import { SkeletonItem } from "../shared/Skeleton";
import ListSkeleton from "./ListSkeleton";

const RoomListSkeleton = () => {
  return (
    <ListSkeleton className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 !gap-x-4 !gap-y-8">
      {() => <SkeletonItem className="aspect-w-16 aspect-h-9" />}
    </ListSkeleton>
  );
};

export default React.memo(RoomListSkeleton);
