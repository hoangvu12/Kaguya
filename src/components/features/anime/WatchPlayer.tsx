import { useWatchPlayer } from "@/contexts/WatchContext";
import { parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { NetPlayerProps, useInteract } from "netplayer";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Player from "./Player";
import Controls from "./Player/Controls";
import EpisodesButton from "./Player/EpisodesButton";
import LocaleEpisodeSelector from "./Player/LocaleEpisodeSelector";
import MobileControls from "./Player/MobileControls";
import MobileEpisodesButton from "./Player/MobileEpisodesButton";
import MobileNextEpisode from "./Player/MobileNextEpisode";
import MobileOverlay from "./Player/MobileOverlay";
import NextEpisodeButton from "./Player/NextEpisodeButton";
import Overlay from "./Player/Overlay";
import TimestampSkipButton from "./Player/TimestampSkipButton";

export interface WatchPlayerProps extends NetPlayerProps {
  videoRef?: React.ForwardedRef<HTMLVideoElement>;
}

const PlayerControls = React.memo(() => {
  const {
    setEpisode,
    episodes,
    currentEpisodeIndex,
    sourceId,
    anime,
    currentEpisode,
  } = useWatchPlayer();

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
      }
    />
  );
});

PlayerControls.displayName = "PlayerControls";

const PlayerMobileControls = React.memo(() => {
  const {
    setEpisode,
    episodes,
    currentEpisodeIndex,
    sourceId,
    anime,
    currentEpisode,
  } = useWatchPlayer();

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
      }
    />
  );
});

PlayerMobileControls.displayName = "PlayerMobileControls";

const PlayerOverlay = React.memo(() => {
  const router = useRouter();
  const { isInteracting } = useInteract();
  const { currentEpisode, anime } = useWatchPlayer();

  return (
    <Overlay>
      <BsArrowLeft
        className={classNames(
          "absolute w-10 h-10 transition-al duration-300 cursor-pointer top-10 left-10 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={router.back}
      />

      {anime.idMal && (
        <TimestampSkipButton
          className="absolute right-4 bottom-20"
          episode={parseNumberFromString(currentEpisode.name)}
          malId={anime.idMal}
        />
      )}
    </Overlay>
  );
});

PlayerOverlay.displayName = "PlayerOverlay";

const PlayerMobileOverlay = React.memo(() => {
  const router = useRouter();
  const { isInteracting } = useInteract();
  const { currentEpisode, anime } = useWatchPlayer();

  return (
    <React.Fragment>
      <MobileOverlay>
        <BsArrowLeft
          className={classNames(
            "absolute w-8 h-8 transition-all duration-300 cursor-pointer top-4 left-4 hover:text-gray-200",
            isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          onClick={router.back}
        />
      </MobileOverlay>

      {anime.idMal && (
        <TimestampSkipButton
          className="absolute right-4 bottom-20"
          episode={parseNumberFromString(currentEpisode.name)}
          malId={anime.idMal}
        />
      )}
    </React.Fragment>
  );
});

PlayerMobileOverlay.displayName = "PlayerMobileOverlay";

const WatchPlayer: React.FC<WatchPlayerProps> = ({ videoRef, ...props }) => {
  const { setEpisode, episodes, currentEpisodeIndex, sourceId } =
    useWatchPlayer();

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  const hotkeys = useMemo(
    () => [
      {
        fn: () => {
          if (currentEpisodeIndex < sourceEpisodes.length - 1) {
            setEpisode(nextEpisode);
          }
        },
        hotKey: "shift+n",
        name: "next-episode",
      },
    ],
    [currentEpisodeIndex, nextEpisode, setEpisode, sourceEpisodes.length]
  );

  const components = useMemo(
    () => ({
      Controls: PlayerControls,
      MobileControls: PlayerMobileControls,
      Overlay: PlayerOverlay,
      MobileOverlay: PlayerMobileOverlay,
    }),
    []
  );

  return (
    <Player
      ref={videoRef}
      components={components}
      hotkeys={hotkeys}
      autoPlay
      {...props}
    />
  );
};

WatchPlayer.displayName = "WatchPlayer";

export default React.memo(WatchPlayer);
