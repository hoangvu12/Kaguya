import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import { Anime } from "@/types";
import { isColorVisible, numberWithCommas } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface TopCardProps {
  data: Anime;
  rank: number;
  type?: "manga" | "anime";
}

const TopCard: React.FC<TopCardProps> = ({ data, rank, type = "anime" }) => {
  const router = useRouter();

  const color = isColorVisible(data?.cover_image?.color || "#ffffff")
    ? data.cover_image.color
    : "white";

  const redirectUrl = useMemo(
    () =>
      type === "anime"
        ? `/anime/details/${data.ani_id}`
        : `/manga/details/${data.ani_id}`,
    [data.ani_id, type]
  );

  const title = useMemo(() => getTitle(data), [data]);

  return (
    <div className="w-full h-[110px] grid grid-cols-18 gap-4">
      <div
        className="col-span-2 flex justify-center items-center font-semibold"
        style={{ color }}
      >
        <span className="text-3xl">#</span>
        <span className="text-4xl">{rank}</span>
      </div>
      <div className="flex col-span-16 space-x-4 bg-background-900">
        <Link href={redirectUrl}>
          <a>
            <div className="cursor-pointer flex-shrink-0 relative h-full w-14">
              <Image
                src={data.cover_image.extra_large}
                layout="fill"
                objectFit="cover"
                alt={title}
              />
            </div>
          </a>
        </Link>
        <div className="flex-1 md:grid grid-cols-12">
          <div className="col-span-4 flex items-center justify-center">
            <Link href={redirectUrl}>
              <a>
                <div
                  className="py-2 flex flex-col justify-between w-full"
                  style={{ color }}
                >
                  <p className="text-xl line-clamp-1 cursor-pointer">{title}</p>
                  <p className="line-clamp-1 font-semibold">
                    {data.genres.join(", ")}
                  </p>
                </div>
              </a>
            </Link>
          </div>

          <div className="col-span-8 md:grid grid-cols-4 flex items-center space-x-4">
            <div className="col-span-1 md:flex items-center justify-center">
              <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                <p className="font-semibold">{data.average_score}%</p>
              </TextIcon>
            </div>

            <div className="col-span-1 md:flex items-center justify-center">
              <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                <p className="font-semibold">
                  {numberWithCommas(data.favourites)}
                </p>
              </TextIcon>
            </div>

            <div className="hidden sm:block col-span-1 md:flex items-center justify-center">
              <div className="flex space-x-2 lg:space-x-0 lg:flex-col">
                {data.format && (
                  <p className="font-semibold">
                    {convert(data.format, "format")}
                  </p>
                )}

                {data.duration && <p>{data.duration} phút</p>}
              </div>
            </div>

            <div className="hidden sm:block col-span-1 md:flex items-center justify-center">
              <div className="flex space-x-2 lg:space-x-0 lg:flex-col">
                {data.season && (
                  <p className="font-semibold">
                    {convert(data.season, "season")} {data.season_year}
                  </p>
                )}

                {data.status && <p>{convert(data.status, "status")}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopCard);
