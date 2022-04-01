import { GENRES } from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "@/components/shared/Image";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";

interface GenresSelectorProps extends SwiperProps {
  type?: "anime" | "manga";
}

const GenresSelector: React.FC<GenresSelectorProps> = ({
  type = "anime",
  ...props
}) => {
  const { isMobile } = useDevice();

  return (
    <Swiper
      direction={isMobile ? "horizontal" : "vertical"}
      spaceBetween={20}
      breakpoints={{
        1280: {
          slidesPerView: 5,
          slidesPerGroup: 5,
        },
        1024: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        640: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        0: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
      }}
      isOverflowHidden={!isMobile}
      freeMode
      {...props}
    >
      {GENRES.map((genre) => (
        <SwiperSlide key={genre.value}>
          <Link href={`/browse?type=${type}&genres=${genre.value}`}>
            <a>
              <div
                className={classNames(
                  "group relative w-full",
                  isMobile && "aspect-w-16 aspect-h-9",
                  !isMobile && "h-full"
                )}
              >
                <Image
                  src={genre.thumbnail}
                  alt={genre.value}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md group-hover:scale-105 transition duration-300"
                />

                <div className="h-full w-full flex items-center justify-center absolute inset-0 bg-black/60">
                  <p className="text-center uppercase text-xl font-bold tracking-widest text-gray-300 group-hover:text-white transition duration-300">
                    {genre.value}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default React.memo(GenresSelector);
