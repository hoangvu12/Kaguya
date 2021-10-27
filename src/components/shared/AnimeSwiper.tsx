import React from "react";
import Swiper, { SwiperSlide } from "./Swiper";

import data from "@/data.json";
import { randomElements } from "@/utils";
import AnimeCard from "./AnimeCard";

interface AnimeSwiperProps {
  title: string;
  viewAllRedirect?: string;
}

// const randomAnime = randomElements(data, 1);

// console.log(randomAnime);

const AnimeSwiper: React.FC<AnimeSwiperProps> = (props) => {
  const { title } = props;

  return (
    <div className="px-12 space-y-4">
      <h1 className="uppercase text-2xl font-semibold">{title}</h1>

      <Swiper slidesPerGroup={6} speed={500}>
        {data.slice(0, 10).map((anime, index) => (
          <SwiperSlide key={index}>
            <AnimeCard anime={anime} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnimeSwiper;
