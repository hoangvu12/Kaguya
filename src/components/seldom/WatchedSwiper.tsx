import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { Watched } from "@/types";
import React from "react";
import EpisodeCard from "@/components/shared/EpisodeCard";
import { useRouter } from "next/router";

interface WatchedSwiperProps extends SwiperProps {
  data: Watched[];
}

const WatchedSwiper: React.FC<WatchedSwiperProps> = ({ data, ...props }) => {
  const router = useRouter();

  return (
    <Swiper speed={500} {...props}>
      {data.map(({ anime, episode }, index) => (
        <SwiperSlide key={index}>
          <EpisodeCard
            onClick={() => {
              const episodeIndex =
                episode.name === "Full" ? 0 : Number(episode.name) - 1;

              router.push(`/anime/watch/${anime.ani_id}?index=${episodeIndex}`);
            }}
            episode={episode}
            title={anime.title.user_preferred}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default WatchedSwiper;
