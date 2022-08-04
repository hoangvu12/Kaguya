import CircleButton from "@/components/shared/CircleButton";
import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import TextIcon from "@/components/shared/TextIcon";
import { Media, MediaType } from "@/types/anilist";
import { createMediaDetailsUrl, numberWithCommas } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import Description from "./Description";
import Skeleton, { SkeletonItem } from "./Skeleton";

interface ShouldWatchProps {
  data: Media;
  isLoading?: boolean;
}

const ShouldWatch: React.FC<ShouldWatchProps> = ({ data, isLoading }) => {
  const { locale } = useRouter();

  const title = useMemo(() => getTitle(data, locale), [data, locale]);
  const description = useMemo(
    () => getDescription(data, locale),
    [data, locale]
  );

  const redirectUrl = useMemo(() => createMediaDetailsUrl(data), [data]);

  return !isLoading ? (
    <Link href={redirectUrl}>
      <a>
        <div className="group relative z-0 h-[200px] w-full cursor-pointer rounded-md md:h-[400px]">
          {data.bannerImage && (
            <Image
              src={data.bannerImage}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 35%"
              alt="Details banner"
              className="rounded-md"
            />
          )}

          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <CircleButton
              LeftIcon={AiFillPlayCircle}
              outline
              className="absolute left-2/3 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 md:block"
              iconClassName="w-16 h-16"
            />
          </div>

          <div className="absolute inset-0 z-0 bg-black/60 opacity-0 transition duration-300 group-hover:opacity-100"></div>
        </div>

        <div className="space-between !mt-8 flex flex-col gap-4 md:flex-row">
          <div className="shrink-0 md:w-2/6">
            <h1 className="text-2xl font-semibold uppercase line-clamp-2">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-8 text-lg">
              {data.averageScore && (
                <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                  <p>{data.averageScore}%</p>
                </TextIcon>
              )}

              <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                <p>{numberWithCommas(data.favourites)}</p>
              </TextIcon>

              <DotList>
                {data.genres.map((genre) => (
                  <span key={genre}>{convert(genre, "genre", { locale })}</span>
                ))}
              </DotList>
            </div>
          </div>
          <div className="h-full w-full">
            <Description
              description={description}
              className="text-base text-gray-300 line-clamp-4"
            />
          </div>
        </div>
      </a>
    </Link>
  ) : (
    <ShouldWatchSkeleton />
  );
};

const ShouldWatchSkeleton = () => (
  <Skeleton>
    <SkeletonItem className="h-full w-full" />
  </Skeleton>
);

export default React.memo(ShouldWatch) as typeof ShouldWatch;
