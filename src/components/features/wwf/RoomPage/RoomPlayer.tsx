import ClientOnly from "@/components/shared/ClientOnly";
import { useUser } from "@/contexts/AuthContext";
import { useRoomInfo } from "@/contexts/RoomContext";
import { useFetchSource } from "@/hooks/useFetchSource";
import useVideoSync from "@/hooks/useVideoSync";
import { Episode } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import React, { useCallback, useMemo } from "react";
import Player from "../../anime/Player";
import DesktopCustomControls from "./DesktopCustomControls";
import MobileCustomControls from "./MobileCustomControls";

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const RoomPlayer = () => {
  const playerRef = useVideoSync();
  const { room, socket } = useRoomInfo();
  const user = useUser();
  const { data, isLoading } = useFetchSource(room.episode);

  const isHost = useMemo(() => user?.id === room?.hostUserId, [user, room]);

  const episodes = useMemo(
    () =>
      room.media.sourceConnections.flatMap((connection) =>
        connection.episodes.map((episode) => ({
          ...episode,
          sourceConnection: connection,
        }))
      ),
    [room.media?.sourceConnections]
  );

  const sortedEpisodes = useMemo(() => sortMediaUnit(episodes), [episodes]);

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => {
      socket.emit(
        "changeEpisode",
        `${episode.sourceId}-${episode.sourceEpisodeId}`
      );

      socket.emit("sendEvent", "changeEpisode");
    },
    [socket]
  );

  return (
    <div className="aspect-w-16 aspect-h-7">
      <div>
        <Player
          ref={playerRef}
          src={isLoading ? blankVideo : data.sources}
          className="object-contain w-full h-full"
        />
      </div>

      {isHost && (
        <ClientOnly>
          <DesktopCustomControls
            episodes={sortedEpisodes}
            onEpisodeSelect={handleNavigateEpisode}
          />

          <MobileCustomControls
            episodes={sortedEpisodes}
            onEpisodeSelect={handleNavigateEpisode}
          />
        </ClientOnly>
      )}
    </div>
  );
};

export default React.memo(RoomPlayer);
