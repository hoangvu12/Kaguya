import classNames from "classnames";
import React from "react";

export interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  description: string;
}

const Description = React.forwardRef<HTMLDivElement, DescriptionProps>(
  ({ description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames("prose !max-w-full", className)}
        dangerouslySetInnerHTML={{ __html: description }}
        {...props}
      />
    );
  }
);

Description.displayName = "Description";

export default Description;
