import PlainAnimeCard from "@/components/shared/PlainAnimeCard";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import useDevice from "@/hooks/useDevice";
import { Anime } from "@/types";
import { motion } from "framer-motion";
import React from "react";

interface BannerSwiperProps extends SwiperProps {
  data: Anime[];
}

const BannerSwiper: React.FC<BannerSwiperProps> = ({ data, ...props }) => {
  const { isDesktop } = useDevice();

  return (
    <Swiper
      slidesPerGroup={1}
      centerInsufficientSlides
      centeredSlides
      loop
      slidesPerView={2}
      breakpoints={{
        1280: {
          slidesPerView: 6,
        },
        1024: {
          slidesPerView: 5,
        },
        768: {
          slidesPerView: 4,
        },
        640: {
          slidesPerView: 3,
        },
      }}
      {...props}
    >
      {data.map((anime) => (
        <SwiperSlide key={anime.ani_id}>
          {({ isActive }) => (
            <motion.div
              variants={{
                enter: {
                  opacity: 1,
                  y: isDesktop ? -40 : 0,
                  speed: 300,
                },
                exit: {
                  opacity: 0.2,
                  y: 0,
                },
              }}
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
