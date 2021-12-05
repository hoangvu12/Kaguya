import React from "react";
import Image from "@/components/shared/Image";
import classNames from "classnames";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, className }) => {
  return (
    <div className={classNames("relative w-10 h-10 rounded-full", className)}>
      <Image src={src} alt="avatar" layout="fill" className="rounded-full" />
    </div>
  );
};

export default Avatar;
