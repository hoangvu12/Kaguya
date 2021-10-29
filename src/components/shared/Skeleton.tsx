import classNames from "classnames";
import React from "react";

export interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <div className={classNames(props.className)}>{props.children}</div>;
};

interface SkeletonItemProps extends React.HTMLProps<HTMLDivElement> {
  container?: boolean;
  className?: string;
}

export const SkeletonItem: React.FC<SkeletonItemProps> = ({
  container,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        !container && "animate-pulse bg-white/20",
        className
      )}
      {...props}
    ></div>
  );
};

export default Skeleton;
