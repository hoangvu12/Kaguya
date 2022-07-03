import classNames from "classnames";
import React from "react";

const UploadSection = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classNames(
        "flex flex-col gap-y-4 md:flex-row md:justify-between md:gap-x-32",
        className
      )}
      {...props}
    ></div>
  );
};

const UploadSectionLeft: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={classNames("w-full md:w-1/3 grow-0", className)} {...props}>
    {children}
  </div>
);

const UploadSectionRight: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={classNames("w-full md:w-2/3 shrink-0", className)} {...props}>
    {children}
  </div>
);

UploadSection.Left = UploadSectionLeft;
UploadSection.Right = UploadSectionRight;

export default UploadSection;
