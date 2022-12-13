import classNames from "classnames";
import React from "react";
import ClientOnly from "./ClientOnly";

export interface SectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  hasPadding?: boolean;
  clientOnly?: boolean;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, title, className, hasPadding = true, clientOnly }, ref) => {
    const element = (
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

    return clientOnly ? <ClientOnly>{element}</ClientOnly> : element;
  }
);

Section.displayName = "Section";

export default Section;
