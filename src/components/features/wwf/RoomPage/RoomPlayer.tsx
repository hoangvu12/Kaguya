import CircleButton from "@/components/shared/CircleButton";
import ClientOnly from "@/components/shared/ClientOnly";
import config from "@/config";
import { useUser } from "@/contexts/AuthContext";
import { useRoomInfo } from "@/contexts/RoomContext";
import { useFetchSource } from "@/hooks/useFetchSource";
import useVideoSync from "@/hooks/useVideoSync";
import { Episode } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
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
  const [showPlaybox, setShowPlaybox] = useState(false);

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

  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    const handlePlay = () => {
      player
        .play()
        .then(() => {
          setShowPlaybox(false);
        })
        .catch(() => {
          setShowPlaybox(true);
        });
    };

    player.addEventListener("canplay", handlePlay, { once: true });

    return () => {
      player.removeEventListener("canplay", handlePlay);
    };
  }, [playerRef]);

  const handlePlay = useCallback(() => {
    const player = playerRef.current;

    if (!player) return;

    player.play();

    setShowPlaybox(false);
  }, [playerRef]);

  const proxyBuilder = useCallback(
    (url: string) => {
      if (url.includes(config.proxyServerUrl)) return url;

      const encodedUrl = encodeURIComponent(url);

      const requestUrl = `${config.proxyServerUrl}/?url=${encodedUrl}&source_id=${room.episode.sourceId}`;

      return requestUrl;
    },
    [room.episode.sourceId]
  );

  return (
    <div className="relative aspect-w-16 md:aspect-h-7 aspect-h-9">
      <div>
        <Player
          ref={playerRef}
          src={isLoading ? blankVideo : data.sources}
          subtitles={data?.subtitles || []}
          className="object-contain w-full h-full"
          proxyBuilder={proxyBuilder}
        />
      </div>

      {showPlaybox && (
        <div className="z-50 absolute bg-black/80 flex items-center justify-center w-full h-full">
          <CircleButton
            LeftIcon={AiFillPlayCircle}
            outline
            iconClassName="w-16 h-16"
            onClick={handlePlay}
          />
        </div>
      )}

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
