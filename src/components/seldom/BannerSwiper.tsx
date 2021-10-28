import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { Anime } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import PlainAnimeCard from "../shared/PlainAnimeCard";

interface BannerSwiperProps extends SwiperProps {
  data: Anime[];
}

const slideVariants = {
  enter: {
    opacity: 1,
    y: -40,
    speed: 300,
  },
  exit: {
    opacity: 0.2,
    y: 0,
  },
};

const BannerSwiper: React.FC<BannerSwiperProps> = ({ data, ...props }) => {
  return (
    <Swiper
      slidesPerGroup={1}
      centerInsufficientSlides
      centeredSlides
      loop
      {...props}
    >
      {data.map((anime) => (
        <SwiperSlide key={anime.ani_id}>
          {({ isActive }) => (
            <motion.div
              variants={slideVariants}
              className="w-full"
              animate={isActive ? "enter" : "exit"}
            >
              <PlainAnimeCard anime={anime} />
            </motion.div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerSwiper;
