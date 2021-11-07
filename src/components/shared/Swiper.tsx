import React, { useRef } from "react";
import {
  Swiper as ReactSwiper,
  SwiperSlide as ReactSwiperSlide,
} from "swiper/react";
import { Navigation } from "swiper";
import type SwiperClass from "swiper/types/swiper-class";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";
import CircleButton from "./CircleButton";
import { NavigationOptions } from "swiper/types";

export type SwiperInstance = SwiperClass;
export interface SwiperProps extends React.ComponentProps<typeof ReactSwiper> {}

const Swiper: React.FC<SwiperProps> = ({ children, ...props }) => {
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <ReactSwiper
      spaceBetween={20}
      breakpoints={{
        1280: {
          slidesPerView: 6,
          slidesPerGroup: 6,
        },
        1024: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
        768: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        640: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        0: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
      }}
      modules={[Navigation]}
      onInit={(swiper) => {
        (swiper.params.navigation as NavigationOptions).prevEl =
          prevButtonRef.current;
        (swiper.params.navigation as NavigationOptions).nextEl =
          nextButtonRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }}
      {...props}
    >
      {children}

      <div
        slot="container-end"
        className="swiper-navigation absolute right-0 bottom-full mb-4 flex space-x-4"
      >
        <CircleButton
          ref={prevButtonRef}
          outline
          LeftIcon={FiChevronLeft}
          className="swiper-button-prev flex items-center justify-center"
        />
        <CircleButton
          ref={nextButtonRef}
          outline
          LeftIcon={FiChevronRight}
          className="swiper-button-next flex items-center justify-center"
        />
      </div>
    </ReactSwiper>
  );
};

export const SwiperSlide = ReactSwiperSlide;

export default Swiper;
