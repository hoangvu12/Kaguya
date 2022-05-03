import classNames from "classnames";
import React from "react";

interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  description: string;
}

const Description: React.FC<DescriptionProps> = ({
  description,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames("prose !max-w-full", className)}
      dangerouslySetInnerHTML={{ __html: description }}
      {...props}
    />
  );
};

export default React.memo(Description);
