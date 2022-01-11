import HeadlessSwiper, {
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { SwiperOptions } from "swiper";
import "swiper/swiper.min.css";
import type SwiperClass from "swiper/types/swiper-class";
import Button from "../shared/Button";
import ReadImage from "./ReadImage";

interface ReadImagesProps {
  images: string[];
  isSidebarOpen?: boolean;
}

const ReadImages: React.FC<ReadImagesProps> = ({
  images,
  isSidebarOpen = false,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { direction } = useReadSettings();
  const { chapterIndex, chapters, setChapterIndex } = useReadInfo();
  const { isMobile } = useDevice();
  const swiperRef = useRef<SwiperClass>();

  const nextImage = () => {
    if (direction === "vertical") return;

    setActiveImageIndex(
      activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1
    );
  };

  const previousImage = () => {
    if (direction === "vertical") return;

    setActiveImageIndex(
      activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1
    );
  };

  useHotkeys("right", direction === "ltr" ? nextImage : previousImage, [
    images,
    activeImageIndex,
    direction,
    nextImage,
    previousImage,
  ]);

  useHotkeys("left", direction === "ltr" ? previousImage : nextImage, [
    images,
    activeImageIndex,
    direction,
    nextImage,
    previousImage,
  ]);

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveImageIndex(swiper.realIndex);
  };

  const swiperOptions: SwiperOptions = useMemo(
    () => ({
      direction: "horizontal",
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
    }),
    []
  );

  const handleSwiperInit = useCallback((swiper: SwiperClass) => {
    setActiveImageIndex(swiper.realIndex);

    swiper.on("slideChange", handleSlideChange);
  }, []);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideToLoop(activeImageIndex);
  }, [activeImageIndex]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {direction === "vertical" ? (
        <div className="h-full">
          {images.map((image, index) => (
            <ReadImage
              className="mx-auto"
              key={index}
              data-index={index}
              src={image}
            />
          ))}

          {chapterIndex < chapters.length - 1 && (
            <div className="w-full h-60 p-8">
              <button
                onClick={() => {
                  setChapterIndex(chapterIndex + 1);
                }}
                className="w-full h-full border-2 border-dashed border-gray-600 text-gray-600 hover:border-white hover:text-white transition duration-300 flex items-center justify-center"
              >
                <p className="text-2xl">Chapter tiếp theo</p>
              </button>
            </div>
          )}
        </div>
      ) : (
        <React.Fragment>
          <BrowserView className="w-full h-full">
            <ReadImage className="mx-auto" src={images[activeImageIndex]} />
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
                  key={image}
                >
                  <ReadImage src={image} />
                </SwiperSlide>
              ))}
            </HeadlessSwiper>
          </MobileView>
        </React.Fragment>
      )}

      <AnimatePresence initial={!isMobile}>
        {direction !== "vertical" && (!isMobile || isSidebarOpen) && (
          <motion.div
            animate={{ opacity: !isMobile ? 0 : 1 }}
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className={classNames(
              "w-11/12 md:w-4/6 z-50 flex items-center justify-between bottom-5 rounded-md p-2 bg-background-800",
              isMobile ? "fixed" : "sticky"
            )}
          >
            <Button
              secondary
              LeftIcon={HiOutlineArrowNarrowLeft}
              onClick={direction === "ltr" ? previousImage : nextImage}
            >
              {isMobile ? null : direction === "ltr" ? (
                <p>Ảnh trước</p>
              ) : (
                <p>Ảnh tiếp theo</p>
              )}
            </Button>

            <p>
              {activeImageIndex + 1} / {images.length}
            </p>

            <Button
              secondary
              RightIcon={HiOutlineArrowNarrowRight}
              onClick={direction === "ltr" ? nextImage : previousImage}
            >
              {isMobile ? null : direction === "ltr" ? (
                <p>Ảnh tiếp theo</p>
              ) : (
                <p>Ảnh trước</p>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ReadImages);
