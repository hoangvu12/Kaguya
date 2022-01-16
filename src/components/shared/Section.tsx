import classNames from "classnames";
import React from "react";

interface SectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, title, className }, ref) => {
    return (
      <div ref={ref} className={classNames("px-4 md:px-12", className)}>
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
