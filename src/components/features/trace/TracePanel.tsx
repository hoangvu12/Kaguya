import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import InfoItem from "@/components/shared/InfoItem";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { TraceImageResponse } from "@/hooks/useTraceImage";
import { numberWithCommas } from "@/utils";
import { getTitle, convert } from "@/utils/data";
import Link from "next/link";
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

  const handleCardClick = useCallback((index: number) => {
    setCardIndex(index);
  }, []);

  const card = useMemo(() => data.result[cardIndex], [cardIndex, data.result]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-[30%] space-y-4">
        <div className="bg-background-900 p-4 space-y-2">
          <span className="text-xl font-semibold">Ảnh của bạn</span>
          <span className="ml-3 text-sm text-gray-300">
            Đã tìm {numberWithCommas(data.frameCount)} ảnh.
          </span>

          <div>
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
      <div className="w-full md:w-[70%] bg-background-900 h-max space-y-4">
        <div className="w-full aspect-h-9 aspect-w-16">
          <video
            src={`${card.video}&size=l`}
            loop
            className="w-full object-contain"
            autoPlay
            muted
            controls
          />
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center md:text-left flex flex-col md:flex-row items-start gap-4">
            <div className="w-[183px] shrink-0 mx-auto md:mx-0">
              <PlainCard
                src={card.anime.coverImage.extraLarge}
                alt={getTitle(card.anime)}
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">{getTitle(card.anime)}</h1>

              <p className="text-gray-300">{card.anime.title.native}</p>

              <div className="flex flex-wrap items-center text-lg gap-x-8">
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

              <div className="flex space-x-8 overflow-x-auto snap-x snap-mandatory md:space-x-16">
                <InfoItem title="Quốc gia" value={card.anime.countryOfOrigin} />
                <InfoItem title="Số tập" value={card.anime.totalEpisodes} />

                {card.anime.duration && (
                  <InfoItem
                    title="Thời lượng"
                    value={`${card.anime.duration} phút`}
                  />
                )}

                <InfoItem
                  title="Tình trạng"
                  value={convert(card.anime.status, "status")}
                />

                <InfoItem
                  title="Giới hạn tuổi"
                  value={card.anime.isAdult ? "18+" : ""}
                />
              </div>

              <p className="text-gray-300 line-clamp-5">
                {card.anime.description}
              </p>

              <Link href={`/anime/details/${card.anime.id}`}>
                <a className="block">
                  <Button primary className="mx-auto md:mx-auto">
                    <p>Xem ngay</p>
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
