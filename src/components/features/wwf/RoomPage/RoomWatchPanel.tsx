import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { useRoomInfo } from "@/contexts/RoomContext";
import { numberWithCommas } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useMemo } from "react";
import { AiOutlineUser } from "react-icons/ai";
import RoomPlayer from "./RoomPlayer";

const RoomWatchPanel = () => {
  const { room } = useRoomInfo();

  const mediaTitle = useMemo(() => getTitle(room.media), [room.media]);

  return (
    <div
      style={{ width: "75%" }}
      className="h-full bg-background-900 overflow-y-auto"
    >
      <RoomPlayer />

      <div className="px-4 py-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2">
            <Avatar
              className="!w-16 !h-16"
              src={room.hostUser.user_metadata.avatar_url}
            />

            <div className="space-y-1">
              <h1 className="font-semibold text-xl">
                {room.title || mediaTitle}
              </h1>

              <DotList>
                <span className="font-medium text-lg text-gray-200">
                  {room.hostUser.user_metadata.name}
                </span>

                <span className="text-sm text-gray-300">
                  {dayjs(new Date(room.created_at)).fromNow()}
                </span>
              </DotList>
            </div>
          </div>

          <TextIcon className="text-primary-300" LeftIcon={AiOutlineUser}>
            <p>{numberWithCommas(room.users.length)}</p>
          </TextIcon>
        </div>

        <div className="w-full flex mt-8 bg-background-800">
          <div className="w-[150px]">
            <PlainCard
              src={room.media.coverImage.extraLarge}
              alt={mediaTitle}
            />
          </div>

          <div className="p-8">
            <Link href={`/anime/details/${room.media.id}`}>
              <a>
                <h1 className="text-2xl font-semibold hover:text-primary-300 transition duration-300">
                  [{room.episode.name}] - {mediaTitle}
                </h1>
              </a>
            </Link>

            <DotList className="mt-2">
              {room.media.genres.map((genre) => (
                <span key={genre}>{convert(genre, "genre")}</span>
              ))}
            </DotList>

            <p className="mt-4 line-clamp-4 text-gray-300">
              {room.media.description}
            </p>

            <Link href={`/anime/details/${room.media.id}`}>
              <a className="flex">
                <Button primary className="w-[max-content] mt-8">
                  <p>Tìm hiểu thêm</p>
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RoomWatchPanel);
