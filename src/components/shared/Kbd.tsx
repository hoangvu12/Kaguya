import React from "react";

const Kbd: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  ...props
}) => {
  return (
    <kbd className="p-2 rounded-lg bg-background-800" {...props}>
      {children}
    </kbd>
  );
};

export default Kbd;
