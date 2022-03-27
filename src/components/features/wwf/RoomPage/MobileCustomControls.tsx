import Portal from "@/components/shared/Portal";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Episode } from "@/types";
import classNames from "classnames";
import React, { useMemo } from "react";
import { MobileView } from "react-device-detect";
import { BsArrowLeft } from "react-icons/bs";
import MobileEpisodesButton from "../../anime/Player/MobileEpisodesButton";
import MobileNextEpisode from "../../anime/Player/MobileNextEpisode";
import SourceEpisodeSelector from "../../anime/SourceEpisodeSelector";

interface MobileCustomControlsProps {
  episodes: Episode[];
  onEpisodeSelect: (episode: Episode) => void;
}

const MobileCustomControls: React.FC<MobileCustomControlsProps> = ({
  episodes,
  onEpisodeSelect,
}) => {
  const { room } = useRoomInfo();

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
    [room.episode.sourceEpisodeId, sourceEpisodes]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  return (
    <MobileView renderWithFragment>
      <Portal selector=".mobile-controls">
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
                  <SourceEpisodeSelector
                    episodes={episodes}
                    activeEpisode={room.episode}
                    onEachEpisode={(episode) => (
                      <button
                        key={episode.sourceEpisodeId}
                        className={classNames(
                          "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                          episode.sourceEpisodeId ===
                            room.episode?.sourceEpisodeId && "text-primary-300"
                        )}
                        onClick={() => onEpisodeSelect(episode)}
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
          <MobileNextEpisode onClick={() => onEpisodeSelect(nextEpisode)} />
        )}
      </Portal>
    </MobileView>
  );
};

export default React.memo(MobileCustomControls);
