import classNames from "classnames";
import {
  BackwardButton,
  ForwardButton,
  FullscreenButton,
  PlayPauseButton,
  SettingsButton,
  useInteract,
  useVideo,
} from "netplayer";
import * as React from "react";
import LoopToggle from "./LoopToggle";
import RefreshButton from "./RefreshButton";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import DotList from "@/components/shared/DotList";

const Controls: React.FC = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();
  const { theme } = useThemePlayer();

  return (
    <div
      className={classNames(
        "controls-container w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-300",
        !videoState.seeking && !isInteracting && !videoState.buffering
          ? "opacity-0 invisible"
          : "opacity-100 visible"
      )}
    >
      <div className="w-full flex justify-between items-center text-white">
        <div className="flex items-center space-x-4">
          <RefreshButton />
          <LoopToggle />

          {theme && (
            <DotList>
              <span>
                {theme.song.title} - {theme.type}{" "}
                {theme.episode && `(Episode ${theme.episode})`}
              </span>

              <span>{theme.name}</span>
            </DotList>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <PlayPauseButton />
          <BackwardButton />
          <ForwardButton />
          <SettingsButton />
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
};

export default Controls;
