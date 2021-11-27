import BannerSwiper from "@/components/seldom/BannerSwiper";
import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import { SwiperProps } from "@/components/shared/Swiper";
import TextIcon from "@/components/shared/TextIcon";
import { Anime, Manga, Title } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import Button from "../shared/Button";

interface HomeBannerProps {
  data: Anime[] | Manga[];
  type?: "anime" | "manga";
}

const HomeBanner: React.FC<HomeBannerProps> = ({ data, type = "anime" }) => {
  const router = useRouter();

  const [index, setIndex] = useState<number>(0);

  const activeSlide = data[index];

  const handleSlideChange: SwiperProps["onSlideChange"] = (swiper) => {
    setIndex(swiper.realIndex);
  };

  const handleClick = () => {
    router.push(
      type === "anime"
        ? `/details/${activeSlide.ani_id}`
        : `/manga/details/${activeSlide.ani_id}`
    );
  };

  const title =
    typeof activeSlide.title === "string"
      ? activeSlide.title
      : activeSlide.title.user_preferred;

  return (
    <React.Fragment>
      <div className="group relative w-full h-[320px] md:h-[500px]">
        {activeSlide.banner_image && (
          <Image
            src={activeSlide.banner_image}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 35%"
            alt={`${title} banner`}
          />
        )}

        <div className="banner__overlay absolute inset-0 flex flex-col justify-center px-4 md:px-12">
          <div className="w-full md:w-[45%]">
            <h1 className="text-2xl md:text-4xl uppercase font-bold line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
              {title}
            </h1>

            <div className="text-lg mt-4 flex flex-wrap items-center gap-x-8">
              {activeSlide.average_score && (
                <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
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

            <p className="hidden md:block mt-2 text-base text-typography-secondary md:line-clamp-5">
              {activeSlide.description}
            </p>

            <Button
              primary
              LeftIcon={AiFillPlayCircle}
              onClick={handleClick}
              className="md:hidden mt-4"
            >
              <p>Xem ngay</p>
            </Button>
          </div>
        </div>

        <CircleButton
          LeftIcon={AiFillPlayCircle}
          onClick={handleClick}
          outline
          className="hidden md:block absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
          iconClassName="w-16 h-16"
        />

        <div className="banner__overlay--down absolute bottom-0 h-16 w-full"></div>
      </div>
      <div className="px-4 md:px-12 pb-12 w-full">
        <BannerSwiper onSlideChange={handleSlideChange} data={data} />
      </div>
    </React.Fragment>
  );
};

export default HomeBanner;
