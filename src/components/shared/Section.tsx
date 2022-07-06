import classNames from "classnames";
import React from "react";

export interface SectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  hasPadding?: boolean;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, title, className, hasPadding = true }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          hasPadding && "px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36",
          className
        )}
      >
        {title && (
          <h1 className="uppercase text-2xl font-semibold mb-4">{title}</h1>
        )}

        {children}
      </div>
    );
  }
);

Section.displayName = "Section";

export default React.memo(Section);
