import React from "react";
import Popup from "../Popup";
import ControlsIcon from "./ControlsIcon";
import { AiOutlineFastForward } from "react-icons/ai";
import { useVideo } from "@/contexts/VideoContext";
import { BrowserView, MobileView } from "react-device-detect";
import MobileControlsIcon from "./MobileControlsIcon";
import { SKIP_TIME } from "@/constants";

const SkipButton = () => {
  const { videoEl } = useVideo();

  const handleClick = () => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
  };

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

export default SkipButton;
