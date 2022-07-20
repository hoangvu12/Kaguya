import { useRoomPlayer } from "@/contexts/RoomPlayerContext";
import classNames from "classnames";
import {
  FullscreenButton,
  TimeIndicator,
  useInteract,
  useVideo,
} from "netplayer";
import * as React from "react";
import ProgressSlider from "../../anime/Player/ProgressSlider";

const RoomPlayerMobileControls: React.FC = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

  const { isHost } = useRoomPlayer();

  return (
    <div
      className={classNames(
        "mobile-controls-container pb-2 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
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
    </div>
  );
};

export default React.memo(RoomPlayerMobileControls);
