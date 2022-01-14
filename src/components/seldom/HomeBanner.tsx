import BannerSwiper from "@/components/seldom/BannerSwiper";
import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import TextIcon from "@/components/shared/TextIcon";
import Button from "@/components/shared/Button";
import { Anime, DynamicData, Manga } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

const HomeBanner: React.FC<DynamicData<Anime[], Manga[]>> = ({
  data,
  type = "anime",
}) => {
  const router = useRouter();

  const [index, setIndex] = useState<number>(0);

  const activeSlide = data[index];

  const handleSlideChange: SwiperProps["onSlideChange"] = (swiper) => {
    setIndex(swiper.realIndex);
  };

  const handleClick = (ani_id: number) => () => {
    router.push(
      type === "anime" ? `/anime/details/${ani_id}` : `/manga/details/${ani_id}`
    );
  };

  const title = useMemo(() => getTitle(activeSlide), [activeSlide]);

  return (
    <React.Fragment>
      <BrowserView>
        <div className="group relative w-full h-[320px] md:h-[500px]">
          {activeSlide.banner_image && (
            <Image
              src={activeSlide.banner_image}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 35%"
              alt={title}
            />
          )}

          <div className="absolute inset-0 flex flex-col justify-center px-4 banner__overlay md:px-12">
            <div className="w-full md:w-[45%]">
              <h1 className="text-2xl font-bold uppercase md:text-4xl line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                {title}
              </h1>

              <div className="flex flex-wrap items-center mt-4 text-lg gap-x-8">
                {activeSlide.average_score && (
                  <TextIcon
                    LeftIcon={MdTagFaces}
                    iconClassName="text-green-300"
                  >
                    <p>{activeSlide.average_score}%</p>
                  </TextIcon>
                )}

                <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                  <p>{numberWithCommas(activeSlide.favourites)}</p>
                </TextIcon>

                <DotList>
                  {activeSlide.genres.slice(0, 3).map((genre) => (
                    <p key={genre}>{convert(genre, "genre")}</p>
                  ))}
                </DotList>
              </div>

              <p className="hidden mt-2 text-base md:block text-typography-secondary md:line-clamp-5">
                {activeSlide.description}
              </p>

              <Button
                primary
                LeftIcon={AiFillPlayCircle}
                onClick={handleClick(activeSlide.ani_id)}
                className="mt-4 md:hidden"
              >
                <p>Xem ngay</p>
              </Button>
            </div>
          </div>

          <CircleButton
            LeftIcon={AiFillPlayCircle}
            onClick={handleClick(activeSlide.ani_id)}
            outline
            className="absolute hidden -translate-x-1/2 -translate-y-1/2 opacity-0 md:block left-2/3 top-1/2 group-hover:opacity-100"
            iconClassName="w-16 h-16"
          />

          <div className="absolute bottom-0 w-full h-16 banner__overlay--down"></div>
        </div>
        <div className="w-full px-4 pb-12 md:px-12">
          <BannerSwiper onSlideChange={handleSlideChange} data={data} />
        </div>
      </BrowserView>

      <MobileView className="pt-16 pb-8 overflow-hidden">
        <Swiper hideNavigation breakpoints={{}} slidesPerView={1} loop>
          {data.map((slide, index) => {
            const title = getTitle(slide);

            return (
              <SwiperSlide
                key={index}
                className="p-4"
                onClick={handleClick(slide.ani_id)}
              >
                <div className="relative aspect-w-16 aspect-h-9 rounded-md">
                  <Image
                    src={slide.banner_image}
                    alt={slide.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />

                  <div className="absolute fixed-0 bg-gradient-to-b from-transparent via-black/60 to-black/80 flex items-end">
                    <div className="p-4">
                      <h1 className="text-xl font-bold uppercase line-clamp-1">
                        {title}
                      </h1>

                      <div className="flex flex-wrap items-center mt-4 text-lg gap-x-8">
                        {slide.average_score && (
                          <TextIcon
                            LeftIcon={MdTagFaces}
                            iconClassName="text-green-300"
                          >
                            <p>{slide.average_score}%</p>
                          </TextIcon>
                        )}
                        <TextIcon
                          LeftIcon={AiFillHeart}
                          iconClassName="text-red-400"
                        >
                          <p>{numberWithCommas(slide.favourites)}</p>
                        </TextIcon>
                        <DotList>
                          {slide.genres.slice(0, 3).map((genre) => (
                            <p key={genre}>{convert(genre, "genre")}</p>
                          ))}
                        </DotList>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </MobileView>
    </React.Fragment>
  );
};

export default HomeBanner;
