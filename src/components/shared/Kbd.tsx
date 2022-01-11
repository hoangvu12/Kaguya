import classNames from "classnames";
import React from "react";

const Kbd: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <kbd
      className={classNames(
        "px-2 py-1 rounded-sm border border-gray-300 bg-background-800",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
};

export default Kbd;
