import classNames from "classnames";
import React from "react";
import Image from "@/components/shared/Image";

const Logo: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={classNames("relative flex mx-auto h-24 w-24 mb-8", className)}
      {...props}
    >
      <Image src="/logo.png" layout="fill" objectFit="contain" alt="logo" />
    </div>
  );
};

export default React.memo(Logo);
