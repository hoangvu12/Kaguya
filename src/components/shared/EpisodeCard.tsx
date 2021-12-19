import { Episode } from "@/types";
import React from "react";
import Image from "./Image";

interface EpisodeCardProps {
  episode: Episode;
  onClick?: () => void;
  isActive?: boolean;
  title?: string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  title,
  ...props
}) => {
  return (
    <div
      className="relative h-40 w-full hover:bg-white/20 cursor-pointer"
      {...props}
    >
      <Image
        src={episode?.thumbnail_image || "/error.png"}
        layout="fill"
        alt={episode.name}
        objectFit="cover"
        className="hover:scale-105 transition duration-300"
      />

      {isActive && (
        <div className="absolute left-4 top-4 bg-primary-500 p-2 rounded-md">
          Đang xem
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

      <div className="w-full absolute bottom-0 p-2 space-y-1">
        <p className="text-lg font-semibold">{episode.name}</p>
        {title && (
          <p className="text-base font-semibold text-gray-300">{title}</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(EpisodeCard);
