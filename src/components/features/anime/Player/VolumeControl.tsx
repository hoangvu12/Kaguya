import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import VolumeFullIcon from "@/components/icons/VolumeFullIcon";
import VolumeMutedIcon from "@/components/icons/VolumeMutedIcon";
import { useVideo } from "@/contexts/VideoContext";
import React, { useState } from "react";
import { TimeSeekSlider } from "react-time-seek-slider";
import "react-time-seek-slider/lib/ui-time-seek-slider.css";

const VolumeControl: React.FC = () => {
  const { state, videoEl } = useVideo();

  const volume = (volume: number) => () => {
    if (!volume && volume !== 0) return;

    videoEl.volume = volume;
  };

  const handleVolumeChange = (volume: number) => {
    if (!volume && volume !== 0) return;

    videoEl.volume = volume;
  };

  return (
    <div className="flex items-center space-x-4">
      {state.volume > 0 ? (
        <ControlsIcon Icon={VolumeFullIcon} onClick={volume(0)} />
      ) : (
        <ControlsIcon Icon={VolumeMutedIcon} onClick={volume(0.5)} />
      )}

      <div className="w-20">
        <TimeSeekSlider
          max={1}
          currentTime={state.volume}
          onSeeking={handleVolumeChange}
          offset={0}
          hideHoverTime
        />
      </div>
    </div>
  );
};

export default React.memo(VolumeControl);
