import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import { Anime } from "@/types";
import { isColorVisible, numberWithCommas } from "@/utils";
import { convert } from "@/utils/anime";
import { useRouter } from "next/router";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface TopAnimeCardProps {
  anime: Anime;
  rank: number;
}

const TopAnimeCard: React.FC<TopAnimeCardProps> = ({ anime, rank }) => {
  const router = useRouter();

  const color = isColorVisible(anime?.cover_image?.color || "#ffffff")
    ? anime.cover_image.color
    : "white";

  return (
    <div className="w-full h-[110px] grid grid-cols-12 gap-4">
      <div
        className="col-span-1 flex justify-center items-center font-semibold"
        style={{ color }}
      >
        <span className="text-3xl">#</span>
        <span className="text-4xl">{rank}</span>
      </div>
      <div className="flex col-span-11 space-x-4">
        <div
          className="cursor-pointer flex-shrink-0 relative h-full w-14"
          onClick={() => router.push(`/details/${anime.ani_id}`)}
        >
          <Image
            src={anime.cover_image.extra_large}
            layout="fill"
            objectFit="cover"
            alt={`${anime.title.user_preferred}`}
          />
        </div>
        <div className="flex-1 bg-background-900 md:grid grid-cols-12">
          <div className="col-span-4 flex items-center justify-center">
            <div
              className="py-2 flex flex-col justify-between w-full"
              style={{ color }}
            >
              <p className="text-xl line-clamp-1">
                {anime.title.user_preferred}
              </p>
              <p className="line-clamp-1 font-semibold">
                {anime.genres.join(", ")}
              </p>
            </div>
          </div>

          <div className="col-span-8 md:grid grid-cols-4 flex items-center space-x-4">
            <div className="col-span-1 md:flex items-center justify-center">
              <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                <p className="font-semibold">{anime.average_score}%</p>
              </TextIcon>
            </div>

            <div className="col-span-1 md:flex items-center justify-center">
              <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                <p className="font-semibold">
                  {numberWithCommas(anime.favourites)}
                </p>
              </TextIcon>
            </div>

            <div className="hidden sm:block col-span-1 md:flex items-center justify-center">
              <div className="flex space-x-2 lg:space-x-0 lg:flex-col">
                <p className="font-semibold">
                  {convert(anime.format, "format")}
                </p>
                <p>{anime.duration} phút</p>
              </div>
            </div>

            <div className="hidden sm:block col-span-1 md:flex items-center justify-center">
              <div className="flex space-x-2 lg:space-x-0 lg:flex-col">
                <p className="font-semibold">
                  {convert(anime.season, "season")} {anime.season_year}
                </p>
                <p>{convert(anime.status, "status")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopAnimeCard;
