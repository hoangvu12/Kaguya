import React from "react";
import Image from "@/components/shared/Image";

const DetailsBanner = ({ image }: { image?: string }) => {
  return (
    <div className="relative z-0 w-full h-[200px] md:h-[400px]">
      {image && (
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 35%"
          alt="Details banner"
        />
      )}

      <div className="banner__overlay absolute inset-0 z-10"></div>
    </div>
  );
};

export default DetailsBanner;
