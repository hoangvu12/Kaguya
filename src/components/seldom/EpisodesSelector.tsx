import Swiper from "@/components/shared/Swiper";
import { Episode } from "@/types";
import { chunk } from "@/utils";
import classNames from "classnames";
import React, { useMemo } from "react";
import { Tab } from "react-tabs";
import ArrowSwiper, { SwiperProps, SwiperSlide } from "../shared/ArrowSwiper";
import ClientOnly from "../shared/ClientOnly";
import EpisodeCard from "../shared/EpisodeCard";

interface EpisodesProps {
  episodes: Episode[];
  onClick?: (index: number) => void;
  activeIndex?: number | null;
  chunkSwiperProps?: SwiperProps;
  swiperProps?: SwiperProps;
}

const Episodes: React.FC<EpisodesProps> = ({
  episodes,
  onClick,
  activeIndex,
  chunkSwiperProps,
  swiperProps,
}) => {
  const chunks = useMemo(() => chunk(episodes, 12), [episodes]);
  const [activeTabIndex, setActiveTabIndex] = React.useState(() => {
    const index = chunks.findIndex((chunk) =>
      chunk.some((episode) => episode.episodeIndex === activeIndex)
    );

    return index === -1 ? 0 : index;
  });

  const handleNavigateEpisode = (index: number) => () => onClick?.(index);

  return (
    <ClientOnly>
      <ArrowSwiper className="w-11/12 mx-auto" {...chunkSwiperProps}>
        {chunks.map((chunk, i) => {
          const firstEpisode = chunk[0];
          const lastEpisode = chunk[chunk.length - 1];

          const title =
            chunk.length === 1
              ? `${firstEpisode.name.replace("Tập", "")}`
              : `${firstEpisode.name.replace(
                  "Tập",
                  ""
                )} - ${lastEpisode.name.replace("Tập", "")}`;

          return (
            <SwiperSlide
              onClick={() => setActiveTabIndex(i)}
              key={i}
              className=""
            >
              <Tab
                className={classNames(
                  "text-gray-300 cursor-pointer mx-auto rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                  activeTabIndex === i
                    ? "bg-white text-black"
                    : "hover:text-white"
                )}
              >
                {title}
              </Tab>
            </SwiperSlide>
          );
        })}
      </ArrowSwiper>

      <Swiper
        className="mt-20"
        slidesPerView={3}
        slidesPerGroup={3}
        breakpoints={{}}
        onInit={(swiper) => {
          const index = chunks[activeTabIndex].findIndex(
            (episode) => episode.episodeIndex === activeIndex
          );

          swiper.slideTo(index || 0);
        }}
        {...swiperProps}
      >
        {chunks[activeTabIndex].map((episode) => (
          <SwiperSlide key={episode.id}>
            <EpisodeCard
              episode={episode}
              isActive={episode.episodeIndex === activeIndex}
              onClick={handleNavigateEpisode(episode.episodeIndex)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </ClientOnly>
  );
};

export default React.memo(Episodes);
