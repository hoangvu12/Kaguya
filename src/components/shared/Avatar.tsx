import React, { useState } from "react";
import Image from "@/components/shared/Image";
import classNames from "classnames";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, className }) => {
  const [isLoadFailed, setIsLoadFailed] = useState(false);

  const handleImageError = () => {
    setIsLoadFailed(true);
  };

  return (
    <div className={classNames("relative w-10 h-10 rounded-full", className)}>
      <Image
        onError={handleImageError}
        src={isLoadFailed ? "/fallback_profile.png" : src}
        alt="avatar"
        layout="fill"
        className="rounded-full"
      />
    </div>
  );
};

export default React.memo(Avatar);
