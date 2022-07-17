import { useRoomPlayer } from "@/contexts/RoomPlayerContext";
import classNames from "classnames";
import {
  FullscreenButton,
  TimeIndicator,
  useInteract,
  useVideo,
} from "netplayer";
import * as React from "react";
import { BsArrowLeft } from "react-icons/bs";
import LocaleEpisodeSelector from "../../anime/Player/LocaleEpisodeSelector";
import MobileEpisodesButton from "../../anime/Player/MobileEpisodesButton";
import MobileNextEpisode from "../../anime/Player/MobileNextEpisode";
import ProgressSlider from "../../anime/Player/ProgressSlider";
import SkipButton from "../../anime/Player/SkipButton";

const RoomPlayerMobileControls: React.FC = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

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

  return (
    <div
      className={classNames(
        "mobile-controls-container w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
        !videoState.seeking && !isInteracting && !videoState.buffering
          ? "opacity-0 invisible"
          : "opacity-100 visible"
      )}
    >
      <div className="px-4 flex w-full items-center justify-between">
        <TimeIndicator />

        <div className="w-4 h-4">
          <FullscreenButton />
        </div>
      </div>
      {isHost && (
        <div className="px-4 w-full mt-2">
          <ProgressSlider />
        </div>
      )}
      <div className="flex justify-evenly items-center py-6">
        {isHost && <SkipButton />}

        {isHost ? (
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
                  </div>
                )
              }
            </MobileEpisodesButton>

            {currentEpisodeIndex < sourceEpisodes.length - 1 && (
              <MobileNextEpisode onClick={() => setEpisode(nextEpisode)} />
            )}
          </React.Fragment>
        ) : null}
      </div>{" "}
    </div>
  );
};

export default React.memo(RoomPlayerMobileControls);
