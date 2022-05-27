import config from "@/config";
import { useUser } from "@/contexts/AuthContext";
import { useRoomInfo } from "@/contexts/RoomContext";
import {
  RoomPlayerContextProvider,
  useRoomPlayer,
} from "@/contexts/RoomPlayerContext";
import { useFetchSource } from "@/hooks/useFetchSource";
import useVideoSync from "@/hooks/useVideoSync";
import { Episode, VideoSource } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import classNames from "classnames";
import { useInteract } from "netplayer";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Player from "../../anime/Player";
import Controls from "../../anime/Player/Controls";
import EpisodesButton from "../../anime/Player/EpisodesButton";
import LocaleEpisodeSelector from "../../anime/Player/LocaleEpisodeSelector";
import MobileControls from "../../anime/Player/MobileControls";
import MobileEpisodesButton from "../../anime/Player/MobileEpisodesButton";
import MobileNextEpisode from "../../anime/Player/MobileNextEpisode";
import MobileOverlay from "../../anime/Player/MobileOverlay";
import NextEpisodeButton from "../../anime/Player/NextEpisodeButton";
import Overlay from "../../anime/Player/Overlay";

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const PlayerControls = () => {
  const {
    setEpisode,
    episodes,
    currentEpisodeIndex,
    sourceId,
    anime,
    currentEpisode,
    isHost,
  } = useRoomPlayer();

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  return (
    <Controls
      rightControlsSlot={
        isHost ? (
          <React.Fragment>
            {currentEpisodeIndex < sourceEpisodes.length - 1 && (
              <NextEpisodeButton onClick={() => setEpisode(nextEpisode)} />
            )}

            <EpisodesButton>
              <div className="w-[70vw] overflow-hidden bg-background-900 p-4">
                <LocaleEpisodeSelector
                  mediaId={anime.id}
                  episodes={episodes}
                  activeEpisode={currentEpisode}
                  episodeLinkProps={{ shallow: true, replace: true }}
                />
              </div>
            </EpisodesButton>
          </React.Fragment>
        ) : null
      }
    />
  );
};

const PlayerMobileControls = () => {
  const {
    setEpisode,
    episodes,
    currentEpisodeIndex,
    sourceId,
    anime,
    currentEpisode,
    isHost,
  } = useRoomPlayer();

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  return (
    <MobileControls
      controlsSlot={
        isHost ? (
          <React.Fragment>
            <MobileEpisodesButton>
              {(isOpen, setIsOpen) =>
                isOpen && (
                  <div
                    className={classNames(
                      "w-full px-2 fixed inset-0 z-[9999] flex flex-col justify-center bg-background"
                    )}
                  >
                    <BsArrowLeft
                      className="absolute w-8 h-8 transition duration-300 cursor-pointer left-3 top-3 hover:text-gray-200"
                      onClick={() => setIsOpen(false)}
                    />

                    <div>
                      <LocaleEpisodeSelector
                        mediaId={anime.id}
                        episodes={episodes}
                        activeEpisode={currentEpisode}
                        episodeLinkProps={{ shallow: true, replace: true }}
                      />
                    </div>
                  </div>
                )
              }
            </MobileEpisodesButton>

            {currentEpisodeIndex < sourceEpisodes.length - 1 && (
              <MobileNextEpisode onClick={() => setEpisode(nextEpisode)} />
            )}
          </React.Fragment>
        ) : null
      }
    />
  );
};

const PlayerOverlay = () => {
  const router = useRouter();
  const { isInteracting } = useInteract();

  return (
    <Overlay>
      <BsArrowLeft
        className={classNames(
          "absolute w-10 h-10 transition-al duration-300 cursor-pointer top-10 left-10 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={router.back}
      />
    </Overlay>
  );
};

const PlayerMobileOverlay = () => {
  const router = useRouter();
  const { isInteracting } = useInteract();

  return (
    <MobileOverlay>
      <BsArrowLeft
        className={classNames(
          "absolute w-10 h-10 transition-all duration-300 cursor-pointer top-10 left-10 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={router.back}
      />
    </MobileOverlay>
  );
};

const RoomPlayer = () => {
  const playerRef = useVideoSync();
  const { room, socket } = useRoomInfo();
  const user = useUser();
  const { data, isLoading } = useFetchSource(room.episode);

  const isHost = useMemo(() => user?.id === room?.hostUserId, [user, room]);

  const episodes = useMemo(
    () =>
      room.media.sourceConnections.flatMap((connection) => connection.episodes),
    [room.media?.sourceConnections]
  );

  const sourceEpisodes = useMemo(
    () =>
      episodes.filter((episode) => episode.sourceId === room.episode.sourceId),
    [episodes, room.episode.sourceId]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      sourceEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === room.episode.sourceEpisodeId
      ),
    [sourceEpisodes, room.episode.sourceEpisodeId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
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

  const proxyBuilder = useCallback(
    (url: string, source: VideoSource) => {
      if (url.includes(config.proxyServerUrl) || !source.useProxy) return url;

      const encodedUrl = encodeURIComponent(url);

      const requestUrl = `${config.proxyServerUrl}/?url=${encodedUrl}&source_id=${room.episode.sourceId}`;

      return requestUrl;
    },
    [room.episode.sourceId]
  );

  return (
    <RoomPlayerContextProvider
      value={{
        anime: room.media,
        currentEpisode: room.episode,
        currentEpisodeIndex: currentEpisodeIndex,
        episodes: sortedEpisodes,
        sourceId: room.episode.sourceId,
        sources: data?.sources,
        setEpisode: handleNavigateEpisode,
        isHost,
      }}
    >
      <div className="relative aspect-w-16 md:aspect-h-7 aspect-h-9">
        <div>
          <Player
            ref={playerRef}
            sources={isLoading ? blankVideo : data.sources}
            subtitles={data?.subtitles || []}
            className="object-contain w-full h-full"
            changeSourceUrl={proxyBuilder}
            components={{
              Controls: PlayerControls,
              MobileControls: PlayerMobileControls,
              Overlay: PlayerOverlay,
              MobileOverlay: PlayerMobileOverlay,
            }}
            hotkeys={[
              {
                fn: () => {
                  if (currentEpisodeIndex < sourceEpisodes.length - 1) {
                    handleNavigateEpisode(nextEpisode);
                  }
                },
                hotKey: "shift+n",
                name: "next-episode",
              },
            ]}
            autoPlay
          />
        </div>
      </div>
    </RoomPlayerContextProvider>
  );
};

export default React.memo(RoomPlayer);
