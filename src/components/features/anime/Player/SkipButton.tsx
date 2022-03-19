import React, { useCallback } from "react";
import Popup from "@/components/shared/Popup";
import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import { AiOutlineFastForward } from "react-icons/ai";
import { useVideo } from "@/contexts/VideoContext";
import { BrowserView, MobileView } from "react-device-detect";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";
import { SKIP_TIME } from "@/constants";

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
        <Popup
          portalSelector=".video-wrapper"
          placement="top"
          reference={
            <ControlsIcon Icon={AiOutlineFastForward} onClick={handleClick} />
          }
          referenceClassName="h-8 w-8"
        >
          <p className="rounded-sm">Bỏ qua OP/ED ({SKIP_TIME} giây)</p>
        </Popup>
      </BrowserView>
    </React.Fragment>
  );
};

export default React.memo(SkipButton);
