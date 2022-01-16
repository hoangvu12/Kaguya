import classNames from "classnames";
import React from "react";

interface DotProps {
  className?: string;
}

const Dot: React.FC<DotProps> = (props) => {
  return (
    <span
      className={classNames(
        "w-1.5 h-1.5 bg-background-200 rounded-full inline-block",
        props.className
      )}
    ></span>
  );
};

export default React.memo(Dot);
