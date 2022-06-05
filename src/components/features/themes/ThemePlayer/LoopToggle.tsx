import Toggle from "@/components/shared/Toggle";
import { useThemeSettings } from "@/contexts/ThemeSettingsContext";
import { ControlButton } from "netplayer";
import React, { useCallback, useMemo } from "react";

const LoopToggle = () => {
  const { endMode, setSetting } = useThemeSettings();

  const handleToggle = useCallback(
    (isOn: boolean) => {
      setSetting("endMode", !isOn ? "repeat" : "refresh");
    },
    [setSetting]
  );

  const isLoop = useMemo(() => endMode === "repeat", [endMode]);

  return (
    <ControlButton
      tooltip={
        isLoop
          ? "Play new video instead of looping"
          : "Loop video instead of playing new one"
      }
    >
      <Toggle onToggle={handleToggle} />
    </ControlButton>
  );
};

export default LoopToggle;
