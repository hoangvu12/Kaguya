import HeadlessSwiper, {
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import { useViewPanel } from "@/contexts/ReadContainerContext";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { SwiperOptions } from "swiper";
import "swiper/swiper.min.css";
import type SwiperClass from "swiper/types/swiper-class";
import ReadImage from "./ReadImage";

const HorizontalContainer: React.FC = () => {
  const { state, setState } = useReadPanel();
  const swiperRef = useRef<SwiperClass>();
  const { direction } = useReadSettings();
  const { images } = useReadInfo();

  const activeImage = useMemo(
    () => images[state.activeImageIndex],
    [state.activeImageIndex, images]
  );

  const swiperOptions: SwiperOptions = useMemo(
    () => ({
      direction: "horizontal",
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
    }),
    []
  );

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setState((prev) => ({ ...prev, activeImageIndex: swiper.realIndex }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwiperInit = useCallback(
    (swiper: SwiperClass) => {
      swiper.on("slideChange", handleSlideChange);
    },
    [handleSlideChange]
  );

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideToLoop(state.activeImageIndex);

    return;
  }, [state.activeImageIndex]);

  return (
    <React.Fragment>
      <BrowserView className="w-full h-full">
        <ReadImage
          className="mx-auto"
          image={activeImage}
          loadingClassName="!h-full"
        />
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
