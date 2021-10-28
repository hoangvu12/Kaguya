import React, { useState } from "react";

import BannerSwiper from "@/components/seldom/BannerSwiper";
import Image from "@/components/shared/Image";
import { SwiperProps } from "@/components/shared/Swiper";
import TextIcon from "@/components/shared/TextIcon";
import CircleButton from "@/components/shared/CircleButton";

import anime from "@/data.json";
import { Anime } from "@/types";

import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import DotList from "../shared/DotList";
import { useRouter } from "next/dist/client/router";

const trendingAnime = anime
  .sort((a, b) => b.trending - a.trending)
  .slice(0, 15);

const HomeBanner = () => {
  const router = useRouter();
  const [activeAnime, setActiveAnime] = useState<Anime>(
    trendingAnime[0] as any
  );

  const handleSlideChange: SwiperProps["onSlideChange"] = (swiper) => {
    setActiveAnime(trendingAnime[swiper.realIndex] as any);
  };

  return (
    <React.Fragment>
      <div className="group relative w-full h-[500px]">
        {activeAnime.banner_image && (
          <Image
            src={activeAnime.banner_image}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 35%"
            alt={`${activeAnime.title.user_preferred} banner`}
          />
        )}

        <div className="banner__overlay absolute inset-0 flex flex-col justify-center px-12">
          <div className="w-[45%]">
            <h1 className="text-4xl uppercase font-bold">
              {activeAnime.title.user_preferred}
            </h1>

            <div className="text-lg mt-4 flex items-center space-x-8">
              <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                <p>{activeAnime.average_score}%</p>
              </TextIcon>

              <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                <p>{activeAnime.favourites}</p>
              </TextIcon>

              <DotList>
                {activeAnime.genres.slice(0, 3).map((genre) => (
                  <p key={genre}>{genre}</p>
                ))}
              </DotList>
            </div>

            <p className="mt-2 text-base text-typography-secondary line-clamp-5">
              {activeAnime.description}
            </p>
          </div>
        </div>

        <CircleButton
          LeftIcon={AiFillPlayCircle}
          onClick={() => {
            router.push(`/details/${activeAnime.ani_id}`);
          }}
          outline
          className="absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
          iconClassName="w-16 h-16"
        />

        <div className="banner__overlay--down absolute bottom-0 h-16 w-full"></div>
      </div>
      <div className="px-12 pb-12 w-full">
        <BannerSwiper
          onSlideChange={handleSlideChange}
          data={trendingAnime as any}
        />
      </div>
    </React.Fragment>
  );
};

export default HomeBanner;
