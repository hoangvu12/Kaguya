import Portal from "@/components/shared/Portal";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Episode } from "@/types";
import classNames from "classnames";
import React, { useMemo } from "react";
import { BrowserView } from "react-device-detect";
import EpisodesButton from "../../anime/Player/EpisodesButton";
import NextEpisodeButton from "../../anime/Player/NextEpisodeButton";
import SourceEpisodeSelector from "../../anime/SourceEpisodeSelector";

interface DesktopCustomControlsProps {
  episodes: Episode[];
  onEpisodeSelect: (episode: Episode) => void;
}

const DesktopCustomControls: React.FC<DesktopCustomControlsProps> = ({
  episodes,
  onEpisodeSelect,
}) => {
  const { room } = useRoomInfo();

  const sourceEpisodes = useMemo(
    () =>
      episodes.filter((episode) => episode.sourceId === room.episode.sourceId),
    [episodes, room.episode.sourceId]
  );

  const currentEpisode = useMemo(() => room.episode, [room.episode]);

  const currentEpisodeIndex = useMemo(
    () =>
      sourceEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === currentEpisode.sourceEpisodeId
      ),
    [currentEpisode.sourceEpisodeId, sourceEpisodes]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  return (
    <BrowserView renderWithFragment>
      <Portal selector=".right-controls-slot">
        {currentEpisodeIndex < sourceEpisodes.length - 1 && (
          <NextEpisodeButton onClick={() => onEpisodeSelect(nextEpisode)} />
        )}

        <EpisodesButton>
          <div className="w-[70vw] overflow-hidden">
            <SourceEpisodeSelector
              episodes={episodes}
              activeEpisode={currentEpisode}
              onEachEpisode={(episode) => (
                <button
                  key={episode.sourceEpisodeId}
                  className={classNames(
                    "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                    episode.sourceEpisodeId ===
                      currentEpisode?.sourceEpisodeId && "text-primary-300"
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
        </EpisodesButton>
      </Portal>
    </BrowserView>
  );
};

export default React.memo(DesktopCustomControls);
