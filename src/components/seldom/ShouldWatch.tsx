import { Anime, Manga } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import router from "next/router";
import React from "react";
import { AiFillPlayCircle, AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import TextIcon from "@/components/shared/TextIcon";
import Section from "./Section";
import Image from "@/components/shared/Image";

interface ShouldWatchProps {
  data: Anime | Manga;
  type?: "anime" | "manga";
}

const ShouldWatch: React.FC<ShouldWatchProps> = ({ data, type = "anime" }) => {
  const title =
    typeof data.title === "string" ? data.title : data.title.user_preferred;

  const redirectUrl =
    type === "anime"
      ? `/anime/details/${data.ani_id}`
      : `/manga/details/${data.ani_id}`;

  return (
    <Section title="Xem gì hôm nay?">
      <div
        className="cursor-pointer group relative z-0 w-full h-[200px] md:h-[400px] rounded-md"
        onClick={() => {
          router.push(redirectUrl);
        }}
      >
        <Image
          src={data.banner_image}
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

      <div className="!mt-8 flex flex-col md:flex-row items-center space-between space-y-4 md:space-x-8">
        <div className="flex-shrink-0">
          <h1 className="uppercase text-2xl">{title}</h1>

          <div className="text-lg mt-4 flex flex-wrap items-center gap-x-8">
            {data.average_score && (
              <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                <p>{data.average_score}%</p>
              </TextIcon>
            )}

            <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
              <p>{numberWithCommas(data.favourites)}</p>
            </TextIcon>

            <DotList>
              {data.genres.slice(0, 3).map((genre) => (
                <p key={genre}>{convert(genre, "genre")}</p>
              ))}
            </DotList>
          </div>
        </div>
        <p className="line-clamp-3 text-base text-gray-300">
          {data.description}
        </p>
      </div>
    </Section>
  );
};

export default ShouldWatch;
