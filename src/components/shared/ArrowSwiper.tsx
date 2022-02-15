import classNames from "classnames";
import React, { useRef, useState } from "react";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
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
  defaultActiveSlide?: number;
}

SwiperCore.use([Navigation]);

const breakpoints = {
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
};

const ArrowSwiper: React.FC<SwiperProps> = ({
  children,
  className,
  isOverflowHidden = false,
  defaultActiveSlide,
  ...props
}) => {
  const [swiper, setSwiper] = useState<SwiperInstance>(null);
  const [info, setInfo] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const slide = (index: number) => () => {
    swiper?.slideTo(index);
  };

  return (
    <ReactSwiper
      spaceBetween={20}
      className={classNames(
        isOverflowHidden ? "!overflow-hidden" : "!overflow-visible",
        className
      )}
      breakpoints={breakpoints}
      onInit={(swiper) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        swiper.params.navigation.prevEl = prevButtonRef.current;
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        swiper.params.navigation.nextEl = nextButtonRef.current;
        swiper.navigation.update();

        swiper.slideTo(defaultActiveSlide || 0, 0);

        setSwiper(swiper);
        setInfo({
          isBeginning: swiper?.isBeginning,
          isEnd: swiper?.isEnd,
        });
      }}
      onSlideChange={(swiper) => {
        setInfo({
          isBeginning: swiper?.isBeginning,
          isEnd: swiper?.isEnd,
        });
      }}
      {...props}
    >
      {children}

      <React.Fragment>
        <div className="flex items-center space-x-1 absolute top-1/2 -translate-y-1/2 -left-9 z-[9999]">
          <button
            className={classNames(
              "swiper-prev-all-button",
              info.isBeginning && "swiper-button-disabled"
            )}
            onClick={slide(0)}
          >
            <BiArrowToLeft className="w-6 h-6" />
          </button>

          <button className="swiper-prev-button" ref={prevButtonRef}>
            <BsChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-1 absolute top-1/2 -translate-y-1/2 -right-9 z-[9999]">
          <button className="swiper-next-button" ref={nextButtonRef}>
            <BsChevronRight className="w-6 h-6" />
          </button>

          <button
            className={classNames(
              "swiper-next-all-button",

              info.isEnd && "swiper-button-disabled"
            )}
            onClick={slide(swiper?.slides?.length)}
          >
            <BiArrowToRight className="w-6 h-6" />
          </button>
        </div>
      </React.Fragment>
    </ReactSwiper>
  );
};

export const SwiperSlide = ReactSwiperSlide;

export default ArrowSwiper;
