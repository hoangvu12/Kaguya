import classNames from "classnames";
import React from "react";
import Dot from "@/components/shared/Dot";

interface DotListProps {
  className?: string;
  dotClassName?: string;
}

const DotList: React.FC<DotListProps> = ({
  children,
  className,
  dotClassName,
}) => {
  const childrenLength = React.Children.count(children);

  return (
    <div
      className={classNames(
        "flex line-clamp-1 items-center space-x-2",
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (!child) return null;

        if (index === childrenLength - 1) {
          return child;
        }

        return (
          <React.Fragment>
            {child}
            <Dot className={dotClassName} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DotList;
