import { Anime, Manga } from "@/types";
import React from "react";
import Card from "@/components/shared/Card";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";

type CardSwiperProps =
  | {
      type: "anime";
      data: Anime[];
      onEachCard?: (card: Anime) => React.ReactNode;
    }
  | {
      type: "manga";
      data: Manga[];
      onEachCard?: (card: Manga) => React.ReactNode;
    };

const CardSwiper: React.FC<CardSwiperProps> = (props) => {
  const {
    data,
    type = "anime",
    onEachCard = (data) => <Card data={data} type={type} />,
  } = props;

  return (
    <Swiper speed={500}>
      {data.map((item, index) => (
        <SwiperSlide key={index}>{onEachCard(item)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default React.memo(CardSwiper);
