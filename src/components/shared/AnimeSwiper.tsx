import { Anime } from "@/types";
import React from "react";
import AnimeCard from "./AnimeCard";
import Swiper, { SwiperSlide } from "./Swiper";

interface AnimeSwiperProps {
  viewAllRedirect?: string;
  data: Anime[];
}

const AnimeSwiper: React.FC<AnimeSwiperProps> = (props) => {
  const { data } = props;

  return (
    <Swiper slidesPerGroup={6} speed={500}>
      {data.map((anime, index) => (
        <SwiperSlide key={index}>
          <AnimeCard anime={anime} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default AnimeSwiper;
