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
    <div
      className="h-40 w-full grid grid-cols-10 gap-x-4 hover:bg-white/20 cursor-pointer p-4"
      {...props}
    >
      <div className="relative col-span-7">
        <Image
          src={episode?.thumbnail_image || "/error.png"}
          layout="fill"
          alt={episode.name}
          objectFit="cover"
        />
      </div>

      <div className="col-span-3 flex flex-col items-center justify-center space-y-4">
        <p>Tập {episode.name}</p>

        {isActive && (
          <div className="bg-primary-500 p-2 rounded-md">Đang xem</div>
        )}
      </div>
    </div>
  );
};

export default EpisodeCard;
