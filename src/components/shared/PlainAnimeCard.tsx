import React from "react";
import Image from "@/components/shared/Image";

import { Anime } from "@/types";

interface PlainAnimeCardProps {
  anime: Anime;
}

const PlainAnimeCard: React.FC<PlainAnimeCardProps> = ({ anime }) => {
  return (
    <div className="relative aspect-w-9 aspect-h-16">
      <Image
        src={anime.cover_image.extra_large}
        layout="fill"
        objectFit="cover"
        alt={`${anime.title.user_preferred} cover`}
      />
    </div>
  );
};

export default PlainAnimeCard;
