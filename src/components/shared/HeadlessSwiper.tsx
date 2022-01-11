import classNames from "classnames";
import React, { MutableRefObject, useEffect } from "react";
import Swiper from "swiper";
import { SwiperSlide as ReactSwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import type SwiperClass from "swiper/types/swiper-class";
import type { SwiperOptions } from "swiper/types/swiper-options";

export type SwiperInstance = SwiperClass;

export interface SwiperProps extends React.HTMLAttributes<HTMLDivElement> {
  dir?: "ltr" | "rtl";
  className?: string;
  options?: SwiperOptions;
  onInit?: (swiper: SwiperClass) => void;
}

const HeadlessSwiper = React.forwardRef<SwiperInstance, SwiperProps>(
  ({ children, dir, className, options, onInit, ...props }, ref) => {
    useEffect(() => {
      const swiper = new Swiper(".headless-swiper", options);

      if (typeof ref === "function") {
        ref(swiper);
      } else if (ref) {
        (ref as MutableRefObject<SwiperClass>).current = swiper;
      }

      onInit?.(swiper);

      return () => {
        swiper.destroy(true, true);
      };
    }, [onInit, options, ref, dir]);

    return (
      <div
        className={classNames("headless-swiper", className)}
        dir={dir}
        {...props}
      >
        <div className="swiper-wrapper">{children}</div>
      </div>
    );
  }
);

HeadlessSwiper.displayName = "HeadlessSwiper";

export const SwiperSlide = ReactSwiperSlide;

export default React.memo(HeadlessSwiper);
