import React, { useRef } from "react";
import {
  Swiper as ReactSwiper,
  SwiperSlide as ReactSwiperSlide,
} from "swiper/react";
import type SwiperClass from "swiper/types/swiper-class";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";
import CircleButton from "./CircleButton";

export type SwiperInstance = SwiperClass;
export interface SwiperProps extends React.ComponentProps<typeof ReactSwiper> {}

const Swiper: React.FC<SwiperProps> = ({ children, ...props }) => {
  const swiperNavigationRef = useRef<HTMLDivElement>(null);

  const handleReady: ReactSwiper["onSwiper"] = (swiper) => {
    const prevButton = swiperNavigationRef.current.querySelector(
      ".swiper-button-prev"
    );
    const nextButton = swiperNavigationRef.current.querySelector(
      ".swiper-button-next"
    );

    if (swiper.isBeginning && !swiper.params.loop) {
      prevButton.classList.add("swiper-button-disabled");
    } else {
      prevButton.classList.remove("swiper-button-disabled");
    }

    if (swiper.isEnd && !swiper.params.loop) {
      nextButton.classList.add("swiper-button-disabled");
    } else {
      nextButton.classList.remove("swiper-button-disabled");
    }
    prevButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop) return;
      swiper.slidePrev();
    });

    nextButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (swiper.isEnd && !swiper.params.loop) return;
      swiper.slideNext();
    });
  };

  return (
    <ReactSwiper
      spaceBetween={20}
      slidesPerView={6}
      onSwiper={handleReady}
      {...props}
    >
      {children}

      <div
        slot="container-end"
        ref={swiperNavigationRef}
        className="swiper-navigation absolute right-0 bottom-full mb-4 flex space-x-4"
      >
        <CircleButton
          outline
          LeftIcon={FiChevronLeft}
          className="swiper-button-prev flex items-center justify-center"
        />
        <CircleButton
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
