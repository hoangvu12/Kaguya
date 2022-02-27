import ReadImage from "@/components/features/manga/Reader/ReadImage";
import Button from "@/components/shared/Button";
import HeadlessSwiper, {
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import { ImageSource } from "@/types";
import classNames from "classnames";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
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

interface ReadImagesProps {
  images: ImageSource[];
  isSidebarOpen?: boolean;
}

const ReadImages: React.FC<ReadImagesProps> = ({
  images,
  isSidebarOpen = false,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { direction } = useReadSettings();
  const { currentChapterIndex, chapters, setChapter } = useReadInfo();
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

  const handleChangeChapter = (index: number) => () => {
    setChapter(chapters[index]);
  };

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
    swiper.on("slideChange", handleSlideChange);
  }, []);

  useEffect(() => {
    if (direction !== "vertical") {
      if (!swiperRef.current) return;

      swiperRef.current.slideToLoop(activeImageIndex);

      return;
    }

    const currentImageElement: HTMLImageElement = document.querySelector(
      `[data-index="${activeImageIndex}"]`
    );

    if (!currentImageElement) return;

    // https://stackoverflow.com/questions/63197942/scrollintoview-not-working-properly-with-lazy-image-load
    currentImageElement.closest("div")?.scrollIntoView();

    setTimeout(() => {
      currentImageElement.closest("div")?.scrollIntoView();
    }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {direction === "vertical" ? (
        <div className="w-full h-full">
          {images.map((image, index) => (
            <div className="image-container mx-auto" key={index}>
              <ReadImage
                onVisible={() => {
                  setActiveImageIndex(index);
                }}
                className="mx-auto"
                image={image}
                data-index={index}
              />
            </div>
          ))}

          {currentChapterIndex < chapters.length - 1 && (
            <div className="w-full h-60 p-8">
              <button
                onClick={handleChangeChapter(currentChapterIndex + 1)}
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
            <ReadImage className="mx-auto" image={images[activeImageIndex]} />
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
