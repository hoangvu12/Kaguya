import EpisodesIcon from "@/components/icons/EpisodesIcon";
import FullscreenIcon from "@/components/icons/FullscreenIcon";
import NextIcon from "@/components/icons/NextIcon";
import { useVideoOptions } from "@/contexts/VideoOptionsContext";
import useDidMount from "@/hooks/useDidMount";
import useEventListener from "@/hooks/useEventListener";
import classNames from "classnames";
import React, { useCallback, useEffect } from "react";
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import screenfull from "screenfull";
import CircleButton from "../CircleButton";
import MobileControlsIcon from "./MobileControlsIcon";
import ProgressControl from "./ProgressControl";

const MobileControls = () => {
  const { options, setOptions } = useVideoOptions();

  const handleLockClick = useCallback(() => {
    setOptions((prev) => ({ ...prev, isLocked: !prev.isLocked }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnterFullScreen = useCallback(() => {
    if (!screenfull.isEnabled) return;

    const videoWrapper = document.querySelector(".video-wrapper");

    screenfull
      .request(videoWrapper)
      .then(() => {
        screen.orientation.lock("landscape");
      })
      .catch((err) => console.log(err));
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!screenfull.isEnabled) return;

    if (!screenfull.isFullscreen) {
      handleEnterFullScreen();
    } else {
      screenfull.exit();
    }
  }, [handleEnterFullScreen]);

  useDidMount(handleEnterFullScreen);

  return (
    <React.Fragment>
      <div
        className={classNames(
          "z-40 relative w-full px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          options.isLocked && "hidden"
        )}
      >
        <ProgressControl />

        <div className="mobile-controls flex justify-evenly items-center py-6">
          <MobileControlsIcon
            title="Khóa"
            Icon={AiOutlineLock}
            onClick={handleLockClick}
          />

          <MobileControlsIcon
            title="Toàn màn hình"
            Icon={FullscreenIcon}
            onClick={handleToggleFullscreen}
          />
        </div>
      </div>

      <CircleButton
        primary
        className={classNames(
          "absolute left-1/2 -translate-x-1/2 bottom-5 !p-4",
          !options.isLocked && "hidden"
        )}
        iconClassName="w-8 h-8"
        LeftIcon={AiOutlineUnlock}
        onClick={handleLockClick}
      />
    </React.Fragment>
  );
};

export default MobileControls;
