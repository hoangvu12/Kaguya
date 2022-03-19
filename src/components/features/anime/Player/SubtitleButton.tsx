import ButtonTooltip from "@/components/shared/ButtonTooltip";
import { useVideoState } from "@/contexts/VideoStateContext";
import React from "react";
import { MdSubtitles, MdSubtitlesOff } from "react-icons/md";
import ControlsIcon from "./ControlsIcon";

const SubtitleButton = () => {
  const { state, setState } = useVideoState();

  const handleToggleSubtitle = () => {
    setState((prev) => ({
      ...prev,
      isSubtitleEnabled: !prev.isSubtitleEnabled,
    }));
  };

  return (
    !!state.subtitles?.length && (
      <ButtonTooltip
        reference={
          <ControlsIcon
            Icon={state.isSubtitleEnabled ? MdSubtitles : MdSubtitlesOff}
            onClick={handleToggleSubtitle}
          />
        }
        popupProps={{
          referenceClassName: "h-8 w-8",
          className: "rounded-sm",
        }}
        tooltip={state.isSubtitleEnabled ? "Tắt phụ đề" : "Bật phụ đề"}
      />
    )
  );
};

export default SubtitleButton;
