import { Media, MediaType } from "@/types/anilist";
import { convert, getTitle } from "@/utils/data";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import DotList from "./DotList";
import PlainCard from "./PlainCard";

interface HorizontalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Media;
  type?: MediaType;
  redirectUrl?: string;
}

const HorizontalCard = ({
  data,
  type,
  className,
  redirectUrl = type === MediaType.Anime
    ? `/anime/details/${data.id}`
    : `/manga/details/${data.id}`,
  ...props
}: HorizontalCardProps) => {
  const { locale } = useRouter();

  const title = useMemo(() => getTitle(data, locale), [data, locale]);

  return (
    <div
      className={classNames("flex items-center space-x-2 h-24 py-2", className)}
      {...props}
    >
      <div className="shrink-0 w-12">
        <Link href={redirectUrl}>
          <a>
            <PlainCard src={data.coverImage.extraLarge} alt={title} />
          </a>
        </Link>
      </div>

      <div className="space-y-1 self-start">
        <Link href={redirectUrl}>
          <a>
            <p className="text-white font-semibold line-clamp-1 hover:text-primary-300 transition duration-300">
              {title}
            </p>
          </a>
        </Link>

        <DotList className="text-sm text-gray-300">
          {data.format && <span>{convert(data.format, "format")}</span>}

          {"season" in data && "seasonYear" in data && (
            <span>
              {convert(data.season, "season", { locale })} {data.seasonYear}
            </span>
          )}

          {data.status && (
            <span>{convert(data.status, "status", { locale })}</span>
          )}
        </DotList>

        <DotList className="text-sm text-gray-300">
          {data.genres?.map((genre) => (
            <span key={genre}>{convert(genre, "genre", { locale })}</span>
          ))}
        </DotList>
      </div>
    </div>
  );
};

export default React.memo(HorizontalCard);
