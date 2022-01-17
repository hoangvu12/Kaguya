import classNames from "classnames";
import React, { useRef } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import SwiperCore, { Navigation } from "swiper";
import {
  Swiper as ReactSwiper,
  SwiperSlide as ReactSwiperSlide,
} from "swiper/react";
import "swiper/swiper.min.css";
import type SwiperClass from "swiper/types/swiper-class";

export type SwiperInstance = SwiperClass;
export interface SwiperProps extends React.ComponentProps<typeof ReactSwiper> {
  isOverflowHidden?: boolean;
}

SwiperCore.use([Navigation]);

const ArrowSwiper: React.FC<SwiperProps> = ({
  children,
  isOverflowHidden = false,
  ...props
}) => {
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <ReactSwiper
      spaceBetween={20}
      className={classNames(
        isOverflowHidden ? "!overflow-hidden" : "!overflow-visible"
      )}
      breakpoints={{
        1280: {
          slidesPerView: 7,
          slidesPerGroup: 7,
        },
        1024: {
          slidesPerView: 6,
          slidesPerGroup: 6,
        },
        768: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
        640: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        0: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
      }}
      onInit={(swiper) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        swiper.params.navigation.prevEl = prevButtonRef.current;
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        swiper.params.navigation.nextEl = nextButtonRef.current;
        swiper.navigation.update();
      }}
      {...props}
    >
      {children}

      <button
        ref={prevButtonRef}
        className="absolute top-1/2 -translate-y-1/2 -left-5 z-[9999]"
      >
        <BsChevronLeft className="w-6 h-6" />
      </button>

      <button
        ref={nextButtonRef}
        className="absolute top-1/2 -translate-y-1/2 -right-5 z-[9999]"
      >
        <BsChevronRight className="w-6 h-6" />
      </button>
    </ReactSwiper>
  );
};

export const SwiperSlide = ReactSwiperSlide;

export default ArrowSwiper;
