import Image from "@/components/shared/Image";
import { ImageProps } from "next/image";
import React from "react";

const PlainCard: React.FC<ImageProps> = (props) => {
  return (
    <div className="relative aspect-w-2 aspect-h-3">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        width={193}
        height={290}
        objectFit="cover"
        quality={35}
        {...props}
      />
    </div>
  );
};

export default React.memo(PlainCard);
