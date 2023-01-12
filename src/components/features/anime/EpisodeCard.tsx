import { Episode } from "@/types";
import React, { useMemo } from "react";
import Image from "@/components/shared/Image";

interface EpisodeCardProps {
  episode: Episode;
  isActive?: boolean;
  title?: string;
  watchedTime?: number;
  duration?: number;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  title,
  watchedTime,
  duration = 0,
  ...props
}) => {
  const watchProgressPercent = useMemo(
    () => (duration === 0 ? 0 : (watchedTime / duration) * 100),
    [watchedTime, duration]
  );

  return (
    <div
      className="relative h-40 w-full hover:bg-white/20 cursor-pointer"
      {...props}
    >
      <Image
        src={episode?.thumbnail || "/error.png"}
        layout="fill"
        alt={episode.name}
        objectFit="cover"
        className="hover:scale-105 transition duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

      <div className="w-full absolute bottom-0 p-2 space-y-1">
        <p className="text-lg font-semibold">{episode.name}</p>
        {title && (
          <p className="text-base line-clamp-1 font-semibold text-gray-300">
            {title}
          </p>
        )}
      </div>

      <div
        className="absolute bottom-0 h-1 bg-primary-500"
        style={{ width: `${watchProgressPercent}%` }}
      />
    </div>
  );
};

export default React.memo(EpisodeCard);
