import { BaseButtonProps } from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import axios from "axios";
import classNames from "classnames";
import { useVideo } from "netplayer";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery } from "react-query";

export type SkipType = "ed" | "op" | "mixed-ed" | "mixed-op" | "recap";

export interface Interval {
  startTime: number;
  endTime: number;
}

export interface SkipTimeStamp {
  interval: Interval;
  skipType: SkipType;
  skipId: string;
  episodeLength: number;
}

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
    return "OP";
  }

  if (skipType === "ed") {
    return "ED";
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
  const { data: timestamps, isLoading: timestampLoading } = useQuery<
    SkipTimeStamp[]
  >(
    `timestamps-${episode}-${malId}`,
    () => getTimestamps(episode, malId, videoEl?.duration),
    { enabled: !!videoEl?.duration }
  );
  const [timestamp, setTimeStamp] = useState<SkipTimeStamp>(null);

  useEffect(() => {
    if (!timestamps?.length) return;

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
  }, [episode, malId, timestamps, videoEl]);

  const timeStampName = useMemo(
    () => (timestamp?.skipType ? getTypeName(timestamp.skipType) : null),
    [timestamp?.skipType]
  );

  const handleClick = useCallback(() => {
    if (!timestamp) return;

    const { endTime } = timestamp.interval;

    videoEl.currentTime = endTime;
  }, [timestamp, videoEl]);

  return timestamp && !timestampLoading ? (
    <Button
      outline
      className={classNames("bg-white/30 hover:bg-white/20", className)}
      onClick={handleClick}
      {...props}
    >
      Skip {timeStampName}
    </Button>
  ) : null;
};

export default React.memo(TimestampSkipButton);
