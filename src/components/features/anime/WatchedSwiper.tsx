import EpisodeCard from "@/components/features/anime/EpisodeCard";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { Watched } from "@/types";
import { getTitle } from "@/utils/data";
import Link from "next/link";
import React from "react";

interface WatchedSwiperProps extends SwiperProps {
  data: Watched[];
}

const WatchedSwiper: React.FC<WatchedSwiperProps> = ({ data, ...props }) => {
  return (
    <Swiper speed={500} {...props}>
      {data.map(({ media, episode }, index) => {
        return (
          <SwiperSlide key={index}>
            <Link
              href={`/anime/watch/${media.id}/${episode.sourceId}/${episode.sourceEpisodeId}`}
            >
              <a>
                <EpisodeCard
                  episode={{
                    ...episode,
                    thumbnailImage:
                      media.bannerImage || media.coverImage.extraLarge,
                  }}
                  title={getTitle(media)}
                />
              </a>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(WatchedSwiper);
