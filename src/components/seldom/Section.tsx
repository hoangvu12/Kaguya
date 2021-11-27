import classNames from "classnames";
import React from "react";

interface AnimeSectionProps {
  title: string;
  className?: string;
}

const AnimeSection: React.FC<AnimeSectionProps> = (props) => {
  const { children, title, className } = props;

  return (
    <div className={classNames("px-4 md:px-12 space-y-4", className)}>
      <h1 className="uppercase text-2xl font-semibold">{title}</h1>

      {children}
    </div>
  );
};

export default AnimeSection;
