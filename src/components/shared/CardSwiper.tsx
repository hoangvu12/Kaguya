import Card from "@/components/shared/Card";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";
import { Media } from "@/types/anilist";
import React from "react";

interface CardSwiperProps {
  data: Media[];
  onEachCard?: (data: Media) => React.ReactNode;
}

const CardSwiper: React.FC<CardSwiperProps> = (props) => {
  const { data, onEachCard = (data) => <Card data={data} /> } = props;

  return (
    <Swiper speed={500}>
      {data.map((item, index) => (
        <SwiperSlide key={index}>{onEachCard(item)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default React.memo(CardSwiper);
