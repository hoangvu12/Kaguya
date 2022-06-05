import MarkIcon from "@/components/icons/MarkIcon";
import Button from "@/components/shared/Button";
import {
  Timestamp,
  useCustomVideoState,
} from "@/contexts/CustomVideoStateContext";
import { convertTime } from "@/utils";
import { Popover, ControlButton, useVideoProps, useVideo } from "netplayer";
import React from "react";
import ControlsIcon from "./ControlsIcon";
import TimestampsPanel from "./TimestampsPanel";

interface TimestampsButtonProps {
  className?: string;
}

const TimestampsButton: React.FC<TimestampsButtonProps> = ({ className }) => {
  const { i18n } = useVideoProps();
  const { state } = useCustomVideoState();

  return state?.timestamps?.length ? (
    <Popover
      portalSelector=".netplayer-container"
      reference={
        <ControlButton className={className} tooltip={i18n.controls.timestamps}>
          <ControlsIcon Icon={MarkIcon} />
        </ControlButton>
      }
      position="top"
      overflowElement=".netplayer-container"
    >
      <TimestampsPanel />
    </Popover>
  ) : null;
};

export default React.memo(TimestampsButton);
