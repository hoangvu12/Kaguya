import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { Anime } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

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
              className="relative w-full aspect-w-9 aspect-h-16"
              animate={isActive ? "enter" : "exit"}
            >
              <Image
                objectFit="cover"
                layout="fill"
                className="rounded-md"
                src={anime.cover_image.extra_large}
                alt={`${anime.title.user_preferred} card`}
              />
            </motion.div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerSwiper;
