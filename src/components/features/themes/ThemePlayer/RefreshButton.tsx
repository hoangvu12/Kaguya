import RefreshIcon from "@/components/icons/RefreshIcon";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import { ControlButton } from "netplayer";
import React from "react";
import ControlsIcon from "../../anime/Player/ControlsIcon";

const RefreshButton = () => {
  const { refresh } = useThemePlayer();

  return (
    <ControlButton onClick={refresh} tooltip="Play new video (Shift+N)">
      <ControlsIcon Icon={RefreshIcon} />
    </ControlButton>
  );
};

export default React.memo(RefreshButton);
