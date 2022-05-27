import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";
import { SKIP_TIME } from "@/constants";
import { ControlButton, useVideo, useVideoProps } from "netplayer";
import React, { useCallback } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiOutlineFastForward } from "react-icons/ai";

const SkipButton = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();

  const handleClick = useCallback(() => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl?.currentTime]);

  return (
    <React.Fragment>
      <MobileView>
        <MobileControlsIcon
          Icon={AiOutlineFastForward}
          title={i18n.controls.skipOPED as string}
          onClick={handleClick}
        />
      </MobileView>

      <BrowserView>
        <ControlButton tooltip={i18n.controls.skipOPED}>
          <ControlsIcon Icon={AiOutlineFastForward} onClick={handleClick} />
        </ControlButton>
      </BrowserView>
    </React.Fragment>
  );
};

export default React.memo(SkipButton);
