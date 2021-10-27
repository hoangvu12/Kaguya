import React from "react";
import Image from "@/components/shared/Image";

const DetailsBanner = ({ image }: { image?: string }) => {
  return (
    <div className="relative z-0 w-full h-[300px] before:absolute before:inset-0 before:bg-black/60 before:z-10">
      {image && <Image src={image} layout="fill" objectFit="cover" />}
    </div>
  );
};

export default DetailsBanner;
