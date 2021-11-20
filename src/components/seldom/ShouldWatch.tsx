import { Anime } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert } from "@/utils/anime";
import router from "next/router";
import React from "react";
import { AiFillPlayCircle, AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import TextIcon from "@/components/shared/TextIcon";
import AnimeSection from "./AnimeSection";
import Image from "@/components/shared/Image";

interface ShouldWatchProps {
  anime: Anime;
}

const ShouldWatch: React.FC<ShouldWatchProps> = ({ anime }) => {
  return (
    <AnimeSection title="Xem gì hôm nay?">
      <div
        className="cursor-pointer group relative z-0 w-full h-[200px] md:h-[400px] rounded-md"
        onClick={() => {
          router.push(`/details/${anime.ani_id}`);
        }}
      >
        <Image
          src={anime.banner_image}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 35%"
          alt="Details banner"
          className="rounded-md"
        />

        <div className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <CircleButton
            LeftIcon={AiFillPlayCircle}
            outline
            className="hidden md:block absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
            iconClassName="w-16 h-16"
          />
        </div>

        <div className="absolute z-0 inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-black/60"></div>
      </div>

      <div className="!mt-8 flex items-center space-between space-x-8">
        <div className="flex-shrink-0">
          <h1 className="uppercase text-2xl">{anime.title.user_preferred}</h1>

          <div className="text-lg mt-4 flex flex-wrap items-center gap-x-8">
            <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
              <p>{anime.average_score}%</p>
            </TextIcon>

            <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
              <p>{numberWithCommas(anime.favourites)}</p>
            </TextIcon>

            <DotList>
              {anime.genres.slice(0, 3).map((genre) => (
                <p key={genre}>{convert(genre, "genre")}</p>
              ))}
            </DotList>
          </div>
        </div>
        <p className="line-clamp-3 text-base text-gray-300">
          {anime.description}
        </p>
      </div>
    </AnimeSection>
  );
};

export default ShouldWatch;
