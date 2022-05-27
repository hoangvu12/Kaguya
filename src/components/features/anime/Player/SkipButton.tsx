import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";
import { SKIP_TIME } from "@/constants";
import { ControlButton, useVideo } from "netplayer";
import React, { useCallback } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiOutlineFastForward } from "react-icons/ai";

const SkipButton = () => {
  const { videoEl } = useVideo();

  const handleClick = useCallback(() => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEl?.currentTime]);

  return (
    <React.Fragment>
      <MobileView>
        <MobileControlsIcon
          Icon={AiOutlineFastForward}
          title={"Skip OP/ED"}
          onClick={handleClick}
        />
      </MobileView>

      <BrowserView>
        <ControlButton tooltip={`Bỏ qua OP/ED (${SKIP_TIME} giây)`}>
          <ControlsIcon Icon={AiOutlineFastForward} onClick={handleClick} />
        </ControlButton>
      </BrowserView>
    </React.Fragment>
  );
};

export default React.memo(SkipButton);
