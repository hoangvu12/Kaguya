import { Anime, DynamicData, Manga } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import router from "next/router";
import React, { useMemo } from "react";
import { AiFillPlayCircle, AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import TextIcon from "@/components/shared/TextIcon";
import Section from "@/components/shared/Section";
import Image from "@/components/shared/Image";

const ShouldWatch: React.FC<DynamicData<Anime, Manga>> = ({
  data,
  type = "anime",
}) => {
  const title = useMemo(() => getTitle(data), [data]);

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

        <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <CircleButton
            LeftIcon={AiFillPlayCircle}
            outline
            className="absolute hidden -translate-x-1/2 -translate-y-1/2 opacity-0 md:block left-2/3 top-1/2 group-hover:opacity-100"
            iconClassName="w-16 h-16"
          />
        </div>

        <div className="absolute inset-0 z-0 transition duration-300 opacity-0 group-hover:opacity-100 bg-black/60"></div>
      </div>

      <div className="!mt-8 flex flex-col md:flex-row space-between space-y-4 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0 md:w-2/6">
          <h1 className="text-2xl font-semibold line-clamp-2 uppercase">
            {title}
          </h1>

          <div className="md:w-4/6 flex flex-wrap items-center mt-4 text-lg gap-x-8">
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
        <p className="text-base text-gray-300 line-clamp-3">
          {data.description}
        </p>
      </div>
    </Section>
  );
};

export default React.memo(ShouldWatch);
