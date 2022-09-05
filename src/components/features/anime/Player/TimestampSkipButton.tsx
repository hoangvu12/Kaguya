import { BaseButtonProps } from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import { useCustomVideoState } from "@/contexts/CustomVideoStateContext";
import { SkipTimeStamp, SkipType } from "@/types";
import axios from "axios";
import classNames from "classnames";
import { useVideo } from "netplayer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

interface TimestampSkipButtonProps extends BaseButtonProps {
  episode: number;
  malId: number;
}

const getTimestamps = async (
  episode: number,
  malId: number,
  episodeLength: number
): Promise<SkipTimeStamp[]> => {
  const { data } = await axios.get<any>(
    `https://api.aniskip.com/v2/skip-times/${malId}/${episode}`,
    {
      params: {
        types: ["ed", "mixed-ed", "mixed-op", "op", "recap"],
        episodeLength,
      },
    }
  );

  return data?.results || ([] as SkipTimeStamp[]);
};

const getTypeName = (skipType: SkipType) => {
  if (skipType === "op") {
    return "Opening";
  }

  if (skipType === "ed") {
    return "Ending";
  }

  if (skipType === "mixed-ed") {
    return "Mixed ED";
  }

  if (skipType === "mixed-op") {
    return "Mixed OP";
  }

  if (skipType === "recap") {
    return "Recap";
  }
};

const TimestampSkipButton: React.FC<TimestampSkipButtonProps> = ({
  episode,
  malId,
  className,
  ...props
}) => {
  const { videoEl } = useVideo();
  const { setState } = useCustomVideoState();
  const { data: timestamps, isLoading: timestampLoading } = useQuery<
    SkipTimeStamp[]
  >(
    `timestamps-${episode}-${malId}`,
    () => getTimestamps(episode, malId, videoEl?.duration),
    { enabled: !!videoEl?.duration }
  );
  const [timestamp, setTimeStamp] = useState<SkipTimeStamp>(null);

  useEffect(() => {
    if (!timestamps?.length) return null;

    const composedTimestamps = timestamps.map((ts) => ({
      startTime: ts.interval.startTime,
      endTime: ts.interval.endTime,
      title: getTypeName(ts.skipType),
    }));

    setState((prev) => ({
      ...prev,
      timestamps: composedTimestamps,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamps]);

  useEffect(() => {
    if (!timestamps?.length) {
      setTimeStamp(null);

      return;
    }

    if (!videoEl) return;

    const handleProgress = () => {
      const currentTime = videoEl?.currentTime;

      const timestamp = timestamps?.find(
        (ts) =>
          ts.interval.startTime <= currentTime &&
          ts.interval.endTime >= currentTime
      );

      setTimeStamp(timestamp);
    };

    videoEl.addEventListener("timeupdate", handleProgress);

    return () => {
      videoEl.removeEventListener("timeupdate", handleProgress);
    };
  }, [episode, malId, timestamps, videoEl]);

  const timeStampName = useMemo(
    () => (timestamp?.skipType ? getTypeName(timestamp.skipType) : null),
    [timestamp?.skipType]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      if (!timestamp) return;

      const { endTime } = timestamp.interval;

      videoEl.currentTime = endTime;
    },
    [timestamp, videoEl]
  );

  return timestamp && !timestampLoading ? (
    <Button
      className={classNames(
        "font-semibold tracking-wider uppercase text-white/90 hover:text-white border border-solid border-white/80 hover:border-white bg-zinc-800/80 hover:bg-zinc-800/60",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      Skip {timeStampName}
    </Button>
  ) : null;
};

export default React.memo(TimestampSkipButton);
