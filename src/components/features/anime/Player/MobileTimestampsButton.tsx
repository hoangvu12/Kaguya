import MarkIcon from "@/components/icons/MarkIcon";
import { ControlButton, Dialog } from "netplayer";
import React from "react";
import TimestampsPanel from "./TimestampsPanel";

const MobileTimestampsButton = () => {
  return (
    <Dialog
      portalSelector=".netplayer-container"
      reference={
        <ControlButton tooltip="Timestamps">
          <MarkIcon />
        </ControlButton>
      }
    >
      <TimestampsPanel />
    </Dialog>
  );
};

export default React.memo(MobileTimestampsButton);
