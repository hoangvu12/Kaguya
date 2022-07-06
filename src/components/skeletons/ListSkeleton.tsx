import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import classNames from "classnames";
import React, { useMemo } from "react";

interface ListSkeletonProps {
  className?: string;
  children?: () => React.ReactNode;
}

const defaultClassName =
  "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7";

const ListSkeleton: React.FC<ListSkeletonProps> = ({
  className = "",
  children,
}) => {
  const validClassName = useMemo(
    () => (className.includes("grid-cols") ? className : defaultClassName),
    [className]
  );

  return (
    <Skeleton className={classNames("grid gap-4", validClassName)}>
      {new Array(15).fill(null).map((_, index) => (
        <SkeletonItem container className="col-span-1" key={index}>
          {children ? children() : <CardSkeleton />}
        </SkeletonItem>
      ))}
    </Skeleton>
  );
};

export default React.memo(ListSkeleton);
