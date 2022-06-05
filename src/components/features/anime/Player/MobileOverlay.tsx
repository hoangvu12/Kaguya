import SliderIcon from "@/components/icons/SliderIcon";
import TextIcon from "@/components/shared/TextIcon";
import classNames from "classnames";
import {
  useInteract,
  useVideoProps,
  useVideo,
  BackwardButton,
  PlayPauseButton,
  ForwardButton,
  SettingsButton,
  MobileVolumeSlider,
} from "netplayer";
import * as React from "react";
import MobileTimestampsButton from "./MobileTimestampsButton";

interface MobileOverlayProps {}

const MobileOverlay: React.FC<MobileOverlayProps> = ({ children }) => {
  const { isInteracting } = useInteract();
  const { i18n } = useVideoProps();
  const { videoState } = useVideo();

  const shouldOverlayVisible = React.useMemo(
    () => isInteracting || videoState.seeking || videoState.buffering,
    [isInteracting, videoState.buffering, videoState.seeking]
  );

  return (
    <div
      className={classNames(
        "mobile-overlay",
        "w-full h-full bg-black/80 transition-all duration-300 relative",
        !shouldOverlayVisible ? "invisible opacity-0" : "visible opacity-100"
      )}
    >
      <TextIcon
        LeftIcon={SliderIcon}
        className={classNames(
          "absolute left-1/2 -translate-x-1/2 mt-4 transition-all duration-300",
          !videoState.seeking ? "invisible opacity-0" : "visible opacity-100"
        )}
        iconClassName="!w-10 !h-10"
      >
        {i18n.controls.sliderDragMessage}
      </TextIcon>

      <div className="w-[max-content] h-[90%]">
        <MobileVolumeSlider />
      </div>

      <div
        className={classNames(
          "transition-all duration-300",
          videoState.seeking ? "opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        <div className="absolute w-full top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-full flex items-center justify-evenly pointer-events-none">
            <div
              className={classNames(
                "w-12 h-12",
                shouldOverlayVisible
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              )}
            >
              <BackwardButton />
            </div>

            <div
              className={classNames(
                "w-16 h-16",
                shouldOverlayVisible
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              )}
            >
              <PlayPauseButton />
            </div>

            <div
              className={classNames(
                "w-12 h-12",
                shouldOverlayVisible
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              )}
            >
              <ForwardButton />
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 w-8 h-8">
          <SettingsButton />
        </div>

        <div className="absolute top-4 right-16 w-8 h-8">
          <MobileTimestampsButton />
        </div>
      </div>

      {children}
    </div>
  );
};

export default React.memo(MobileOverlay);
