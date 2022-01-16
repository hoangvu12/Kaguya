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
      {data.map(({ anime, episode }, index) => {
        const episodeIndex = anime.episodes.findIndex(
          (e) => e.id === episode.id
        );

        return (
          <SwiperSlide key={index}>
            <Link href={`/anime/watch/${anime.ani_id}?index=${episodeIndex}`}>
              <a>
                <EpisodeCard
                  episode={{
                    ...episode,
                    thumbnail_image:
                      episode.thumbnail_image ||
                      anime.banner_image ||
                      anime.cover_image.extra_large,
                  }}
                  title={getTitle(anime)}
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
