import Swiper, {
  SwiperInstance,
  SwiperSlide,
} from "@/components/shared/Swiper";
import SwiperCard from "@/components/shared/SwiperCard";
import { Media } from "@/types/anilist";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";

interface CardSwiperProps {
  data: Media[];
  onEachCard?: (data: Media, isHover: boolean) => React.ReactNode;
}

// Will take 3 times norma; card's width on hover
const HOVER_WIDTH = 3;

const noop = () => {};

const getVisibleIndex = (swiper: SwiperInstance) => {
  const { slides } = swiper;

  const visibleCards = slides
    .map((slide, index) => ({ slide, index }))
    .filter(({ slide }) => slide.classList.contains("swiper-slide-visible"));

  return {
    first: visibleCards[0].index,
    last: visibleCards[visibleCards.length - 1].index,
  };
};

const CardSwiper: React.FC<CardSwiperProps> = (props) => {
  const {
    data,
    onEachCard = (data, isHover) => (
      <SwiperCard isExpanded={isHover} data={data} />
    ),
  } = props;

  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [activeIndex, setActiveIndex] = useState(null);

  // I'm sorry for those who are reading this code
  // Even myself don't know why it works.
  // Please don't touch it

  const handleSlideHover = (index: number) => () => {
    if (!swiper) return;

    const currentSlide = swiper.slides[index] as HTMLElement;
    const nextSlide = swiper.slides[index + 1] as HTMLElement;

    currentSlide.classList.add("swiper-animating");

    // @ts-ignore
    const [originalWidth] = swiper.slidesSizesGrid as number[];

    let spaceBetween = 0;
    let slidesPerGroup = 1;

    const currentBreakpoint =
      swiper.params.breakpoints[swiper.currentBreakpoint];

    spaceBetween = currentBreakpoint.spaceBetween || swiper.params.spaceBetween;
    slidesPerGroup =
      currentBreakpoint.slidesPerGroup || swiper.params.slidesPerGroup;

    const isVisible = currentSlide.classList.contains("swiper-slide-visible");

    currentSlide.style.transition = "all 300ms";

    if (!isVisible) return;

    const { first: firstVisibleCardIndex, last: lastVisibleCardIndex } =
      getVisibleIndex(swiper);

    const nonPlaceholderSlides = swiper.slides.filter(
      (slide) => !slide.classList.contains("swiper-placeholder")
    );

    const shouldPushSlide =
      nonPlaceholderSlides.length - (HOVER_WIDTH - 1) >= slidesPerGroup &&
      (lastVisibleCardIndex - (HOVER_WIDTH - 1) < index ||
        lastVisibleCardIndex === index);

    if (shouldPushSlide) {
      if (!nextSlide) {
        // Add a placeholder slide to push current slide to the left
        const element = document.createElement("div");
        element.className = "swiper-slide swiper-placeholder";

        swiper.$wrapperEl[0].append(element);

        swiper.updateSlides();
      }

      const newTranslate =
        -1 *
        ((firstVisibleCardIndex + HOVER_WIDTH - 1) *
          (originalWidth + spaceBetween));

      // @ts-ignore
      swiper.setTransition(300);
      swiper.setTranslate(newTranslate);
    }

    setActiveIndex(index);

    currentSlide.style.width = `${
      originalWidth * HOVER_WIDTH - 1 + spaceBetween
    }px`;
  };

  const handleSlideLeave = (index: number) => () => {
    if (!swiper) return;

    const currentSlide = swiper.slides[index] as HTMLElement;
    const nextSlide = swiper.slides[index + 1] as HTMLElement;

    // @ts-ignore
    const [originalWidth] = swiper.slidesSizesGrid as number[];

    currentSlide.style.width = `${originalWidth}px`;

    let spaceBetween = 0;
    let slidesPerGroup = 1;

    const currentBreakpoint =
      swiper.originalParams.breakpoints[swiper.currentBreakpoint];

    spaceBetween =
      currentBreakpoint.spaceBetween || swiper.originalParams.spaceBetween;
    slidesPerGroup =
      currentBreakpoint.slidesPerGroup || swiper.originalParams.slidesPerGroup;

    const isAnimating = currentSlide.classList.contains("swiper-animating");

    if (!isAnimating) return;

    const { first: firstVisibleCardIndex } = getVisibleIndex(swiper);

    const revertTranslate = () => {
      // @ts-ignore
      const minTranslate = swiper.minTranslate();
      // @ts-ignore
      const maxTranslate = swiper.maxTranslate();

      let newTranslate =
        -1 *
        ((firstVisibleCardIndex - (HOVER_WIDTH - 1)) *
          (originalWidth + spaceBetween));

      if (newTranslate > minTranslate) newTranslate = minTranslate;
      else if (newTranslate < maxTranslate) newTranslate = maxTranslate;

      // @ts-ignore
      swiper.setTransition(300);
      swiper.setTranslate(newTranslate);
    };

    const nonPlaceholderSlides = swiper.slides.filter(
      (slide) => !slide.classList.contains("swiper-placeholder")
    );

    if (nonPlaceholderSlides.length <= slidesPerGroup) {
      if (
        index === nonPlaceholderSlides.length - 1 ||
        index >= nonPlaceholderSlides.length - (HOVER_WIDTH - 1)
      ) {
        revertTranslate();
      }
    } else if (
      index ===
        // @ts-ignore
        slidesPerGroup * (swiper.snapIndex + 1) - 1 ||
      index >=
        // @ts-ignore
        slidesPerGroup * (swiper.snapIndex + 1) - (HOVER_WIDTH - 1)
    ) {
      revertTranslate();
    } else if (index > slidesPerGroup) {
      if (
        index === nonPlaceholderSlides.length - 1 ||
        index >= nonPlaceholderSlides.length - (HOVER_WIDTH - 1)
      ) {
        revertTranslate();
      }
    }

    currentSlide.classList.remove("swiper-animating");

    if (nextSlide?.classList.contains("swiper-placeholder")) {
      swiper.slides.eq(swiper.slides.length - 1).remove();
      swiper.update();
    }

    setActiveIndex(null);
  };

  return (
    <Swiper
      onSwiper={(swiper) => {
        setSwiper(swiper);
      }}
      speed={500}
      watchSlidesVisibility
    >
      {data.map((item, index) => {
        let debounceTimeout: NodeJS.Timeout = null;

        const debounce = (fn: (...args: any[]) => void, wait: number) => {
          return (...args: any[]) => {
            const later = () => {
              debounceTimeout = null;
              fn(...args);
            };

            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(later, wait);
          };
        };

        return (
          <SwiperSlide
            onMouseEnter={
              isMobile ? noop : debounce(handleSlideHover(index), 300)
            }
            onMouseLeave={
              isMobile ? noop : debounce(handleSlideLeave(index), 300)
            }
            key={index}
          >
            {onEachCard(item, activeIndex === index)}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(CardSwiper);
