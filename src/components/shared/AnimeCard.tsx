import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import Popup from "@/components/shared/Popup";
import TextIcon from "@/components/shared/TextIcon";
import { Anime } from "@/types";
import { isColorVisible, numberWithCommas } from "@/utils";
import { convert } from "@/utils/anime";
import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, className }) => {
  const primaryColor =
    anime.cover_image.color &&
    isColorVisible(anime.cover_image.color, "#3a3939")
      ? anime.cover_image.color
      : "white";

  return (
    <Popup
      reference={
        <Link href={`/details/${anime.ani_id}`}>
          <a>
            <div
              className={classNames(
                "cursor-pointer aspect-w-9 aspect-h-16",
                className
              )}
            >
              <Image
                src={anime.cover_image.extra_large}
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
                alt={`${anime.title.user_preferred} card`}
              />
            </div>
          </a>
        </Link>
      }
    >
      <div className="flex items-center justify-between space-x-8 max-w-[500px]">
        <div>
          <p className="text-lg font-semibold">{anime.title.user_preferred}</p>
          <p className="text-base" style={{ color: primaryColor }}>
            {anime.studios.slice(0, 2).join(", ")}
          </p>
        </div>

        <div className="space-y-2 self-start">
          <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
            <p>{anime.average_score}%</p>
          </TextIcon>

          <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
            <p>{numberWithCommas(anime.favourites)}</p>
          </TextIcon>
        </div>
      </div>

      <DotList className="mt-2">
        {anime.genres.slice(0, 3).map((genre) => (
          <p
            className="text-base font-semibold"
            style={{
              color: primaryColor,
            }}
            key={genre}
          >
            {convert(genre, "genre")}
          </p>
        ))}
      </DotList>
    </Popup>
  );
};

export default AnimeCard;
