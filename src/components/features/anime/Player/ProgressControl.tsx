import { useVideo } from "@/contexts/VideoContext";
import { parseTime } from "@/utils";
import React, { useCallback, useEffect, useState } from "react";
import { TimeSeekSlider } from "react-time-seek-slider";
import "react-time-seek-slider/lib/ui-time-seek-slider.css";

const ProgressControl = () => {
  const { state, videoEl } = useVideo();
  const [buffer, setBuffer] = useState(0);

  const handleProgressSeek = useCallback(
    (time) => {
      videoEl.currentTime = time;

      videoEl.play();
    },
    [videoEl]
  );

  useEffect(() => {
    // https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded

    const handleProgressBuffer = () => {
      if (!videoEl) return;

      const buffer = videoEl.buffered;

      if (!buffer.length) return;

      setBuffer(buffer.end(buffer.length - 1));
    };

    videoEl.addEventListener("progress", handleProgressBuffer);

    return () => {
      videoEl.removeEventListener("progress", handleProgressBuffer);
    };
  }, [videoEl]);

  return (
    <div className="progress-control flex items-center space-x-4">
      <TimeSeekSlider
        max={videoEl.duration}
        currentTime={videoEl.currentTime}
        progress={buffer}
        onSeeking={handleProgressSeek}
        offset={0}
      />

      <div className="flex text-white space-x-2 items-center justify-center w-40 select-none">
        <p>
          {parseTime(state.currentTime || 0)} / {parseTime(state.duration || 0)}
        </p>
      </div>
    </div>
  );
};

export default ProgressControl;
