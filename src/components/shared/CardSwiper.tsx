import { Anime, Manga } from "@/types";
import React from "react";
import Card from "./Card";
import Swiper, { SwiperSlide } from "./Swiper";

interface CardSwiperProps {
  viewAllRedirect?: string;
  data: Anime[] | Manga[];
  type?: "anime" | "manga";
}

const CardSwiper: React.FC<CardSwiperProps> = (props) => {
  const { data, type = "anime" } = props;

  return (
    <Swiper speed={500}>
      {data.map((item, index) => (
        <SwiperSlide key={index}>
          <Card data={item} type={type} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardSwiper;
