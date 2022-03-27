// https://github.com/hoangvu12/video-sync/blob/main/public/index.js

import { useUser } from "@/contexts/AuthContext";
import { useRoomInfo } from "@/contexts/RoomContext";
import { sleep } from "@/utils";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";

type VideoState = {
  type: "play" | "pause" | "timeupdate";
  currentTime: number;
  hostTime: number;
};

const TIME_SYNC_CYCLES = 10;
const PLAYING_THRESH = 1;

const getGlobalTime = (delta: number) => {
  const date = new Date();
  const time = date.getTime() / 1000;
  // delta is the correction parameter
  return time + delta;
};

const median = (values: number[]) => {
  const cloned = [...values];

  if (cloned.length === 0) {
    return 0;
  }

  cloned.sort((x, y) => x - y);

  const half = Math.floor(cloned.length / 2);

  if (cloned.length % 2) {
    return cloned[half];
  }

  return (cloned[half - 1] + cloned[half]) / 2.0;
};

const useVideoSync = () => {
  const { room, socket } = useRoomInfo();
  const playerRef = useRef<HTMLVideoElement>();
  const user = useUser();
  const overEstimates = useRef<number[]>([]);
  const underEstimates = useRef<number[]>([]);
  const overEstimate = useRef<number>(0);
  const underEstimate = useRef<number>(0);
  const correction = useRef<number>(0);
  const isPlaying = useRef(false);

  const isHost = useMemo(() => user?.id === room.hostUser.id, [user, room]);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    const handleCanPlay = () => {
      socket.on("currentTime", (currentTime: number) => {
        player.currentTime = currentTime;
      });
      
      socket.emit("getCurrentTime");
    };

    player.addEventListener("canplay", handleCanPlay, { once: true });

    return () => {
      socket.off("currentTime");
      player.removeEventListener("canplay", handleCanPlay);
    };
  }, [socket]);

  useEffect(() => {
    async function timeSync() {
      for (let i = 0; i < TIME_SYNC_CYCLES; i++) {
        await sleep(1000);
        socket.emit("getTimeSync-backward");
        await sleep(1000);
        socket.emit("getTimeSync-forward", getGlobalTime(0));
      }
    }

    timeSync();

    socket.on("timeSync-backward", (timeAtServer: number) => {
      const latestUnderEstimate = timeAtServer - getGlobalTime(0);

      underEstimates.current.push(latestUnderEstimate);
      underEstimate.current = median(underEstimates.current);
      correction.current = (underEstimate.current + overEstimate.current) / 2;

      console.log(
        `%c Updated val for under_estimate is ${underEstimate.current}`,
        "color:green"
      );

      console.log(
        `%c New correction time is ${correction.current} seconds`,
        "color:red; font-size:12px"
      );
    });

    socket.on("timeSync-forward", (latestOverEstimate: number) => {
      overEstimates.current.push(latestOverEstimate);
      overEstimate.current = median(overEstimates.current);
      correction.current = (underEstimate.current + overEstimate.current) / 2;

      console.log(
        `%c Updated val for over_estimate is ${overEstimate.current}`,
        "color:green"
      );

      console.log(
        `%c New correction time is ${correction.current} seconds`,
        "color:red; font-size:12px"
      );
    });

    return () => {
      socket.off("timeSync-backward");
      socket.off("timeSync-forward");
    };
  }, [socket, isHost]);

  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    const videoStateHandlers = {
      play: () => {
        player.play().catch(() => {
          isPlaying.current = false;
        });

        isPlaying.current = true;
      },
      pause: () => {
        player.pause();

        isPlaying.current = false;
      },
      timeupdate: (state: VideoState) => {
        if (!isPlaying.current) return;

        const proposedTime =
          state.currentTime -
          state.hostTime +
          getGlobalTime(correction.current);

        const gap = Math.abs(proposedTime - player.currentTime);

        console.log(
          `%cGap was ${proposedTime - player.currentTime}`,
          "font-size:12px; color:purple"
        );

        if (isPlaying.current) {
          if (gap > PLAYING_THRESH) {
            player.currentTime = proposedTime;
          }

          player.play();
        }
      },
    };

    const handleViewerPlay = () => {
      isPlaying.current = true;
    };

    const handleViewerPause = () => {
      isPlaying.current = false;
    };

    const handleHostPlay = () => {
      socket.emit("changeVideoState", { type: "play" });
      socket.emit("sendEvent", "play");
    };

    const handleHostPause = () => {
      socket.emit("changeVideoState", { type: "pause" });
      socket.emit("sendEvent", "pause");
    };

    const handleHostTimeUpdate = () => {
      socket.emit("changeVideoState", {
        type: "timeupdate",
        currentTime: player.currentTime,
        hostTime: getGlobalTime(correction.current),
      });
    };

    if (isHost) {
      player.addEventListener("play", handleHostPlay);
      player.addEventListener("pause", handleHostPause);
      player.addEventListener("timeupdate", handleHostTimeUpdate);
    } else {
      socket.on("videoState", (state: VideoState) => {
        videoStateHandlers[state.type](state);
      });

      player.addEventListener("play", handleViewerPlay);
      player.addEventListener("pause", handleViewerPause);
    }

    player
      .play()
      .then(() => {
        isPlaying.current = true;
      })
      .catch(() => {
        isPlaying.current = false;
      });

    return () => {
      socket.off("videoState");
      player.removeEventListener("play", handleViewerPlay);
      player.removeEventListener("pause", handleViewerPause);

      player.removeEventListener("play", handleHostPlay);
      player.removeEventListener("pause", handleHostPause);
      player.removeEventListener("timeupdate", handleHostTimeUpdate);
    };
  }, [socket, isHost]);

  return playerRef;
};

export default useVideoSync;
