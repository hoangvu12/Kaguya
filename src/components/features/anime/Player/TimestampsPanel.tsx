import Button from "@/components/shared/Button";
import {
  Timestamp,
  useCustomVideoState,
} from "@/contexts/CustomVideoStateContext";
import { convertTime } from "@/utils";
import { useVideo } from "netplayer";
import React from "react";

const TimestampsPanel = () => {
  const { state } = useCustomVideoState();
  const { videoEl } = useVideo();

  const handleTimestampClick = (timestamp: Timestamp) => () => {
    if (!videoEl) return;

    videoEl.currentTime = timestamp.startTime;
  };

  return state?.timestamps?.length ? (
    <div className="bg-background-900 min-w-[15rem] py-3">
      {state.timestamps.map((timestamp, index) => {
        const isActive =
          videoEl?.currentTime >= timestamp.startTime &&
          videoEl?.currentTime <= timestamp.endTime;

        return (
          <Button
            secondary
            key={index}
            className="w-full flex justify-between items-center gap-2 px-4 py-1 rounded-none"
            onClick={handleTimestampClick(timestamp)}
          >
            <div className="flex gap-2 items-center">
              {isActive && (
                <span className="shrink-0 bg-primary-500 w-2 h-2 rounded-full" />
              )}

              <p>{timestamp.title}</p>
            </div>

            <p className="p-1 bg-zinc-700 text-white">
              {convertTime(timestamp.startTime)}
            </p>
          </Button>
        );
      })}
    </div>
  ) : null;
};

export default React.memo(TimestampsPanel);
