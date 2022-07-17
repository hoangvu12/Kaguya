import { useRoomPlayer } from "@/contexts/RoomPlayerContext";
import classNames from "classnames";
import {
  BackwardButton,
  ForwardButton,
  FullscreenButton,
  PlayPauseButton,
  SettingsButton,
  SubtitleButton,
  TimeIndicator,
  useInteract,
  useVideo,
  VolumeButton,
} from "netplayer";
import * as React from "react";
import EpisodesButton from "../../anime/Player/EpisodesButton";
import LocaleEpisodeSelector from "../../anime/Player/LocaleEpisodeSelector";
import NextEpisodeButton from "../../anime/Player/NextEpisodeButton";
import ProgressSlider from "../../anime/Player/ProgressSlider";
import SkipButton from "../../anime/Player/SkipButton";
import TimestampsButton from "../../anime/Player/TimestampsButton";

interface RoomPlayerControlsProps {
  rightControlsSlot?: React.ReactNode;
  leftControlsSlot?: React.ReactNode;
}

const RoomPlayerControls: React.FC<RoomPlayerControlsProps> = ({
  leftControlsSlot,
  rightControlsSlot,
}) => {
  const {
    setEpisode,
    episodes,
    currentEpisodeIndex,
    sourceId,
    anime,
    currentEpisode,
    isHost,
  } = useRoomPlayer();

  const sourceEpisodes = React.useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = React.useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

  return (
    <div
      className={classNames(
        "controls-container w-full p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
        !videoState.seeking && !isInteracting && !videoState.buffering
          ? "opacity-0 invisible"
          : "opacity-100 visible"
      )}
    >
      {isHost && (
        <div className="mb-4">
          <ProgressSlider />
        </div>
      )}

      <div className="w-full flex justify-between items-center text-white">
        <div className="flex items-center space-x-4">
          <PlayPauseButton />

          {isHost && (
            <React.Fragment>
              <BackwardButton />
              <ForwardButton />
            </React.Fragment>
          )}

          <VolumeButton />
          <TimeIndicator />
          {leftControlsSlot}
        </div>
        <div className="flex items-center space-x-4">
          {isHost ? (
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
                    onEachEpisode={(episode) => (
                      <button
                        key={episode.sourceEpisodeId}
                        className={classNames(
                          "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                          episode.sourceEpisodeId ===
                            currentEpisode?.sourceEpisodeId &&
                            "text-primary-300"
                        )}
                        onClick={() => setEpisode(episode)}
                      >
                        <div className="flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300">
                          <p>{episode.name}</p>
                        </div>
                      </button>
                    )}
                  />
                </div>
              </EpisodesButton>
            </React.Fragment>
          ) : null}

          {isHost && (
            <React.Fragment>
              <TimestampsButton />
              <SkipButton />
            </React.Fragment>
          )}

          <SubtitleButton />
          <SettingsButton />
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
};

export default RoomPlayerControls;
