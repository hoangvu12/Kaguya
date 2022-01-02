import { useVideo } from "@/contexts/VideoContext";
import { parseTime } from "@/utils";
import React, { useCallback, useEffect, useState } from "react";
import { Slider, Direction } from "react-player-controls";
import ProgressBar, { Bar } from "./ProgressBar";

const ProgressControl = () => {
  const { state, videoEl } = useVideo();
  const [progress, setProgress] = useState(0);
  const [intent, setIntent] = useState(0);
  const [buffer, setBuffer] = useState(0);

  const handleProgressSeek = useCallback(
    (percent) => {
      videoEl.currentTime = percent * videoEl.duration;

      videoEl.play();
    },
    [videoEl]
  );

  const handleProgress = useCallback((percent) => {
    setProgress(percent);
    setIntent(0);
  }, []);

  const handleIntent = useCallback((percent) => {
    setIntent(percent);
  }, []);

  useEffect(() => {
    // https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded

    videoEl.addEventListener("progress", function () {
      const buffer = this.buffered;

      if (!buffer.length) return;

      const bufferPercentage = buffer.end(buffer.length - 1) / this.duration;

      setBuffer(bufferPercentage);
    });
  }, [videoEl]);

  return (
    <div className="flex items-center space-x-4">
      <ProgressBar
        value={videoEl.currentTime / videoEl.duration}
        onChangeEnd={handleProgressSeek}
        onChange={handleProgress}
        onIntent={handleIntent}
        onIntentEnd={() => setIntent(0)}
        className="w-full h-2 group"
      >
        {({ backgroundBar, playedBar, handle }) => (
          <React.Fragment>
            {backgroundBar}

            <Bar
              className="bg-white/40"
              style={{ width: `${intent * 100}%` }}
            />

            <Bar
              className="bg-white/60"
              style={{ width: `${buffer * 100}%` }}
            />

            {playedBar}

            {handle}

            {intent > 0 && (
              <p
                className="absolute -translate-x-1/2 -top-8"
                style={{
                  left: `${intent * 100}%`,
                }}
              >
                {parseTime(intent * state.duration)}
              </p>
            )}
          </React.Fragment>
        )}
      </ProgressBar>

      <div className="flex text-gray-300 space-x-2 items-center justify-between">
        <p>{parseTime(state.currentTime)}</p>
        <p>/</p>
        <p>{parseTime(state.duration)}</p>
      </div>
    </div>
  );
};

export default ProgressControl;
