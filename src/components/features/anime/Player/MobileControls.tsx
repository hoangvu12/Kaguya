import FullscreenIcon from "@/components/icons/FullscreenIcon";
import useDidMount from "@/hooks/useDidMount";
import classNames from "classnames";
import React, { useCallback } from "react";
import screenfull from "screenfull";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";
// import ProgressControl from "@/components/features/anime/Player/ProgressControl";
import SkipButton from "@/components/features/anime/Player/SkipButton";
import dynamic from "next/dynamic";

const ProgressControl = dynamic(
  () => import("@/components/features/anime/Player/ProgressControl"),
  { ssr: false }
);

const MobileControls = () => {
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
          "z-40 relative w-full px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        )}
      >
        <ProgressControl />

        <div className="mobile-controls flex justify-evenly items-center py-6">
          <MobileControlsIcon
            title="Toàn màn hình"
            Icon={FullscreenIcon}
            onClick={handleToggleFullscreen}
          />

          <SkipButton />
        </div>
      </div>
    </React.Fragment>
  );
};

export default MobileControls;
