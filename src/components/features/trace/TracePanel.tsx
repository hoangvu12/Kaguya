import Button from "@/components/shared/Button";
import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import InfoItem from "@/components/shared/InfoItem";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { TraceImageResponse } from "@/hooks/useTraceImage";
import { createMediaDetailsUrl, numberWithCommas } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import { ImageType } from "react-images-uploading";
import TraceCard from "./TraceCard";

interface TracePanelProps {
  data: TraceImageResponse;
  image?: ImageType;
}

const TracePanel: React.FC<TracePanelProps> = ({ data, image }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const { locale } = useRouter();
  const { t } = useTranslation("trace");

  const handleCardClick = useCallback((index: number) => {
    setCardIndex(index);
  }, []);

  const card = useMemo(() => data.result[cardIndex], [cardIndex, data.result]);
  const title = useMemo(
    () => getTitle(card.anime, locale),
    [card.anime, locale]
  );
  const description = useMemo(
    () => getDescription(card.anime, locale),
    [card.anime, locale]
  );

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      <div className="w-full space-y-4 md:w-[30%]">
        <div className="bg-background-900 p-4">
          <p className="text-xl font-semibold">{t("your_image")}</p>
          <p className="text-sm text-gray-300">
            {t("num_of_found_images", {
              num: numberWithCommas(data.frameCount),
            })}
          </p>

          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.dataURL} alt="Search image" />
          </div>
        </div>

        {data.result.slice(0, 5).map((result, index) => (
          <TraceCard
            data={result}
            key={index}
            onClick={() => handleCardClick(index)}
            isActive={index === cardIndex}
          />
        ))}
      </div>
      <div className="h-max w-full space-y-4 bg-background-900 md:w-[70%]">
        <div className="aspect-h-9 aspect-w-16 w-full">
          <video
            src={`${card.video}&size=l`}
            loop
            className="w-full object-contain"
            autoPlay
            muted
            controls
          />
        </div>

        <div className="space-y-8 p-8">
          <div className="flex flex-col items-start gap-4 text-center md:flex-row md:text-left">
            <div className="mx-auto w-[183px] shrink-0 md:mx-0">
              <PlainCard src={card.anime.coverImage.extraLarge} alt={title} />
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">{title}</h1>

              <p className="text-gray-300">{card.anime.title.native}</p>

              <div className="flex flex-wrap items-center gap-x-8 text-lg">
                {card.anime.averageScore && (
                  <TextIcon
                    LeftIcon={MdTagFaces}
                    iconClassName="text-green-300"
                  >
                    <p>{card.anime.averageScore}%</p>
                  </TextIcon>
                )}

                <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                  <p>{numberWithCommas(card.anime.favourites)}</p>
                </TextIcon>

                <DotList>
                  {card.anime.genres.map((genre) => (
                    <span key={genre}>{convert(genre, "genre")}</span>
                  ))}
                </DotList>
              </div>

              <div className="flex snap-x snap-mandatory space-x-8 overflow-x-auto md:space-x-16">
                <InfoItem
                  title={t("common:country")}
                  value={card.anime.countryOfOrigin}
                />
                <InfoItem
                  title={t("common:total_episodes")}
                  value={card.anime.episodes}
                />

                {card.anime.duration && (
                  <InfoItem
                    title={t("common:duration")}
                    value={`${card.anime.duration} ${t("common:minutes")}`}
                  />
                )}

                <InfoItem
                  title={t("common:status")}
                  value={convert(card.anime.status, "status", { locale })}
                />

                <InfoItem
                  title={t("common:age_rated")}
                  value={card.anime.isAdult ? "18+" : ""}
                />
              </div>

              <Description
                description={description}
                className="text-gray-300 line-clamp-5"
              />

              <Link href={createMediaDetailsUrl(card.anime)}>
                <a className="block">
                  <Button primary className="mx-auto md:mx-auto">
                    <p>{t("common:watch_now")}</p>
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TracePanel);
