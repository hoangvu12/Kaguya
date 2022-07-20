import React, { useState } from "react";
import Image from "@/components/shared/Image";
import classNames from "classnames";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, className, ...props }) => {
  const [isLoadFailed, setIsLoadFailed] = useState(false);

  const handleImageError = () => {
    setIsLoadFailed(true);
  };

  return (
    <div
      className={classNames(
        "shrink-0 relative w-10 h-10 rounded-full",
        className
      )}
      {...props}
    >
      <Image
        onError={handleImageError}
        src={isLoadFailed || !src ? "/fallback_profile.png" : src}
        alt="avatar"
        layout="fill"
        className="rounded-full"
      />
    </div>
  );
};

export default React.memo(Avatar);
