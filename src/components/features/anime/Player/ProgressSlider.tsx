import { useCustomVideoState } from "@/contexts/CustomVideoStateContext";
import { convertTime } from "@/utils";
import classNames from "classnames";
import { Slider, ThumbnailHover, useVideo } from "netplayer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isDesktop } from "react-device-detect";

interface ProgressSliderProps {
  className?: string;
  innerClassName?: string;
  hideDot?: boolean;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({
  className,
  innerClassName,
  hideDot,
}) => {
  const { videoEl, setVideoState } = useVideo();
  const { state } = useCustomVideoState();
  const [bufferPercent, setBufferPercent] = useState(0);
  const [hoverPercent, setHoverPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded
  useEffect(() => {
    if (!videoEl) return;

    const handleProgressBuffer = () => {
      const buffer = videoEl.buffered;

      if (!buffer.length) return;
      if (!videoEl.duration) return;

      const bufferedTime = buffer.end(buffer.length - 1);
      const bufferedPercent = (bufferedTime / videoEl.duration) * 100;

      setBufferPercent(bufferedPercent);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
    };

    videoEl.addEventListener("progress", handleProgressBuffer);
    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoEl.removeEventListener("progress", handleProgressBuffer);
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoEl]);

  const currentPercent = useMemo(() => {
    if (!videoEl?.duration) return 0;

    return (currentTime / videoEl.duration) * 100;
  }, [currentTime, videoEl?.duration]);

  const handlePercentIntent = useCallback((percent: number) => {
    setHoverPercent(percent);
  }, []);

  const handlePercentChange = useCallback(
    (percent: number) => {
      if (!videoEl?.duration) return;

      const newTime = (percent / 100) * videoEl.duration;

      videoEl.currentTime = newTime;

      if (videoEl.paused) {
        videoEl.play();
      }

      setVideoState({ seeking: false });
      setCurrentTime(newTime);
    },
    [setVideoState, videoEl]
  );

  const handleDragStart = useCallback(() => {
    setVideoState({ seeking: true });
  }, [setVideoState]);

  const handleDragEnd = useCallback(() => {
    setVideoState({ seeking: true });
  }, [setVideoState]);

  const handlePercentChanging = useCallback(
    (percent) => {
      if (!videoEl?.duration) return;

      if (!videoEl.paused) {
        videoEl.pause();
      }

      const newTime = (percent / 100) * videoEl.duration;

      setVideoState({ seeking: true });
      setCurrentTime(newTime);
    },
    [setVideoState, videoEl]
  );

  const hoverTimestamp = useMemo(() => {
    if (!videoEl?.duration) return;

    const hoverTime = (hoverPercent / 100) * videoEl.duration;

    const timestamp = state.timestamps.find((timestamp) => {
      return timestamp.startTime <= hoverTime && hoverTime <= timestamp.endTime;
    });

    return timestamp;
  }, [hoverPercent, state?.timestamps, videoEl?.duration]);

  return (
    <Slider
      className={classNames(
        "w-full h-1.5 cursor-pointer flex flex-col justify-end",
        isDesktop ? "h-1.5" : "h-6",
        className
      )}
      onPercentIntent={handlePercentIntent}
      onPercentChange={handlePercentChange}
      onPercentChanging={handlePercentChanging}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={classNames("w-full h-1 relative", innerClassName)}>
        <Slider.Bar className="bg-white/50" percent={hoverPercent} />
        <Slider.Bar className="bg-white/40" percent={bufferPercent} />

        {state?.timestamps?.map((ts, index) => {
          const startPercent = (ts.startTime / videoEl.duration) * 100;
          const endPercent = (ts.endTime / videoEl.duration) * 100;

          return (
            <Slider.Bar
              className="h-2 w-2 absolute bg-primary-700 rounded-full"
              style={{
                left: `${startPercent}%`,
                width: `${endPercent - startPercent}%`,
              }}
              key={index}
            />
          );
        })}

        <Slider.Bar className="bg-primary-500" percent={currentPercent} />
        <Slider.Bar className="bg-white/20" />

        {!hideDot && (
          <Slider.Dot
            className="h-3.5 w-3.5 absolute bg-primary-500 rounded-full"
            percent={currentPercent}
          />
        )}

        <ThumbnailHover hoverPercent={hoverPercent} />

        {!!hoverPercent && videoEl?.duration && (
          <div
            className="bg-black/80 text-white py-1 px-2 absolute bottom-full mb-3 -translate-x-1/2 space-y-2 text-center"
            style={{ left: hoverPercent + "%" }}
          >
            {hoverTimestamp && (
              <p className="text-base font-medium text-primary-300">
                {hoverTimestamp.title}
              </p>
            )}

            <p>{convertTime((hoverPercent / 100) * videoEl.duration)}</p>
          </div>
        )}
      </div>
    </Slider>
  );
};

export default React.memo(ProgressSlider);
