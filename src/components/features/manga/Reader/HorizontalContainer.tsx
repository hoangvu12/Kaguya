import HeadlessSwiper, {
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef } from "react";
import { BrowserView, isMobile, MobileView } from "react-device-detect";
import { SwiperOptions } from "swiper";
import "swiper/swiper.min.css";
import ReadImage from "./ReadImage";
import type SwiperClass from "swiper/types/swiper-class";

const swiperOptions: SwiperOptions = {
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 8,
  loop: false,
};

const HorizontalContainer: React.FC = () => {
  const { state, setState } = useReadPanel();
  const { direction } = useReadSettings();
  const { images } = useReadInfo();
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass>();

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const activeImage: HTMLImageElement = document.querySelector(
      `img[data-index="${state.activeImageIndex}"]`
    );

    const imageLeft = activeImage.offsetLeft + activeImage.offsetWidth;
    const containerLeft = container.offsetLeft + container.offsetWidth;

    const x =
      imageLeft -
      containerLeft -
      activeImage.width / 2 +
      container.clientWidth / 2;

    container.scroll({
      left: x,
      behavior: "smooth",
    });
  }, [state.activeImageIndex]);

  const updateSwiperPosition = useCallback(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideTo(state.activeImageIndex);
  }, [state.activeImageIndex]);

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      setState((prev) => ({ ...prev, activeImageIndex: swiper.realIndex }));
    },
    [setState]
  );

  const handleSwiperInit = useCallback(
    (swiper: SwiperClass) => {
      swiper.on("slideChange", handleSlideChange);
    },
    [handleSlideChange]
  );

  useEffect(() => {
    updatePosition();
    setTimeout(updatePosition, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMobile) {
      updateSwiperPosition();
    } else {
      updatePosition();
    }
  }, [direction, updatePosition, updateSwiperPosition]);

  return (
    <React.Fragment>
      <BrowserView renderWithFragment>
        <div
          ref={containerRef}
          className={classNames(
            "snap-x snap-mandatory overflow-x-auto flex items-center space-x-2 transition duration-300 no-scrollbar",
            direction === "ltr" ? "flex-row" : "flex-row-reverse"
          )}
        >
          {images.map((image, index) => (
            <ReadImage
              containerClassName={"shrink-0 snap-center"}
              className={classNames(
                state.activeImageIndex === index ? "opacity-100" : "opacity-10",
                "transform duration-300"
              )}
              image={image}
              key={image.image + index}
              data-index={index}
            />
          ))}
        </div>
      </BrowserView>

      <MobileView className="w-full h-full">
        <HeadlessSwiper
          options={swiperOptions}
          onInit={handleSwiperInit}
          ref={swiperRef}
          className="w-full h-full"
          dir={direction === "rtl" ? "rtl" : "ltr"}
        >
          {images.map((image) => (
            <SwiperSlide
              className="w-full h-full flex items-center"
              key={image.image}
            >
              <ReadImage image={image} />
            </SwiperSlide>
          ))}
        </HeadlessSwiper>
      </MobileView>
    </React.Fragment>
  );
};

export default React.memo(HorizontalContainer);
