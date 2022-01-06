import classNames from "classnames";
import React from "react";

interface SectionProps {
  title: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, title, className }) => {
  return (
    <div className={classNames("px-4 md:px-12 space-y-4", className)}>
      <h1 className="uppercase text-2xl font-semibold">{title}</h1>

      {children}
    </div>
  );
};

export default Section;
