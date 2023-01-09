import Skeleton, { SkeletonItem } from "@/components/shared/Skeleton";
import classNames from "classnames";
import React, { useMemo } from "react";

interface UserListSkeletonProps {
  className?: string;
  children?: () => React.ReactNode;
}

const defaultClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

const UserListSkeleton: React.FC<UserListSkeletonProps> = ({
  className = "",
}) => {
  const validClassName = useMemo(
    () => (className.includes("grid-cols") ? className : defaultClassName),
    [className]
  );

  return (
    <Skeleton className={classNames("grid gap-4", validClassName)}>
      {new Array(15).fill(null).map((_, index) => (
        <SkeletonItem className="col-span-1 w-full h-[72px]" key={index} />
      ))}
    </Skeleton>
  );
};

export default React.memo(UserListSkeleton);
