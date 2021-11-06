import { Episode } from "@/types";
import React from "react";
import Image from "./Image";

interface EpisodeCardProps {
  episode: Episode;
  onClick?: () => void;
  isActive?: boolean;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  ...props
}) => {
  return (
    <React.Fragment>
      <div
        className="relative h-40 w-full hover:bg-white/20 cursor-pointer p-4"
        {...props}
      >
        <Image
          src={episode?.thumbnail_image || "/error.png"}
          layout="fill"
          alt={episode.name}
          objectFit="cover"
        />

        {isActive && (
          <div className="absolute bottom-4 bg-primary-500 p-2 rounded-md">
            Đang xem
          </div>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold">Tập {episode.name}</p>
    </React.Fragment>
  );
};

export default EpisodeCard;
