import classNames from "classnames";
import React from "react";

interface DetailsSectionProps {
  title: string;
  className?: string;
  containerClassName?: string;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({
  title,
  children,
  className,
  containerClassName,
}) => {
  return (
    <div className={classNames("space-y-4", containerClassName)}>
      <p className="font-semibold text-2xl">{title}</p>

      <div className={classNames(className)}>{children}</div>
    </div>
  );
};

export default DetailsSection;
