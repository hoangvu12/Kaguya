import Avatar from "@/components/shared/Avatar";
import DotList from "@/components/shared/DotList";
import TextIcon from "@/components/shared/TextIcon";
import { useRoomInfo } from "@/contexts/RoomContext";
import { numberWithCommas } from "@/utils";
import { getTitle } from "@/utils/data";
import dayjs from "dayjs";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import RoomPlayer from "./RoomPlayer";

const RoomWatchPanel = () => {
  const { room } = useRoomInfo();

  return (
    <div
      style={{ width: "75%" }}
      className="h-full bg-background-900 overflow-y-auto"
    >
      <RoomPlayer />

      <div className="px-4 py-6 w-full flex items-center justify-between">
        <div className="flex gap-2">
          <Avatar
            className="!w-16 !h-16"
            src={room.hostUser.user_metadata.avatar_url}
          />

          <div className="space-y-1">
            <h1 className="font-semibold text-xl">
              [{room.episode.name}] - {getTitle(room.media)}
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
    </div>
  );
};

export default React.memo(RoomWatchPanel);
