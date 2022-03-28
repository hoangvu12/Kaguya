import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { useRoomInfo } from "@/contexts/RoomContext";
import { useRoomState } from "@/contexts/RoomStateContext";
import useDevice from "@/hooks/useDevice";
import { numberWithCommas } from "@/utils";
import { convert, getTitle } from "@/utils/data";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useMemo } from "react";
import { MobileView } from "react-device-detect";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import RoomPlayer from "./RoomPlayer";

const RoomWatchPanel = () => {
  const { room } = useRoomInfo();
  const { state, setState } = useRoomState();
  const { isMobile } = useDevice();

  const mediaTitle = useMemo(() => getTitle(room?.media), [room?.media]);

  return (
    <div
      className={classNames(
        `w-full md:w-[75%] bg-background-900 overflow-y-auto no-scrollbar`,
        isMobile && state.isChatBarOpen ? "h-[50%]" : "h-full"
      )}
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

        <MobileView className="py-4 bg-background-800 mt-8 flex justify-center w-full">
          <Button
            LeftIcon={MdOutlineChatBubbleOutline}
            secondary
            onClick={() => {
              setState((prev) => ({ ...prev, isChatBarOpen: true }));
            }}
          >
            <p>Mở trò chuyện</p>
          </Button>
        </MobileView>

        <div className="w-full text-center md:text-left flex flex-col md:flex-row mt-8 bg-background-800">
          <div className="pt-4 md:pt-0 w-[150px] shrink-0 mx-auto md:mx-0">
            <PlainCard
              src={room.media.coverImage.extraLarge}
              alt={mediaTitle}
            />
          </div>

          <div className="p-4 md:p-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RoomWatchPanel);
