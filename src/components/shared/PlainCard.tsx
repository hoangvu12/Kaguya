import React from "react";
import Image from "@/components/shared/Image";

import { Anime, Manga } from "@/types";

interface PlainCardProps {
  data: Anime | Manga;
}

const PlainCard: React.FC<PlainCardProps> = ({ data }) => {
  const title =
    typeof data.title === "string" ? data.title : data.title.user_preferred;

  return (
    <div className="relative aspect-w-9 aspect-h-16">
      <Image
        src={data.cover_image.extra_large}
        layout="fill"
        objectFit="cover"
        alt={data.vietnamese_title || title}
      />
    </div>
  );
};

export default PlainCard;
