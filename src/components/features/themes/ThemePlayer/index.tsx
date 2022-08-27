import { CustomVideoStateContextProvider } from "@/contexts/CustomVideoStateContext";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import { useThemeSettings } from "@/contexts/ThemeSettingsContext";
import NetPlayer, { NetPlayerProps } from "netplayer";
import { HotKey } from "netplayer/dist/types";
import React, { useEffect, useMemo, useRef } from "react";
import Controls from "./Controls";
import Overlay from "./Overlay";

interface ThemePlayerProps extends NetPlayerProps {}

const ThemePlayer: React.FC<ThemePlayerProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { endMode } = useThemeSettings();
  const { refresh, isLoading } = useThemePlayer();

  useEffect(() => {
    if (!videoRef.current) return;

    if (isLoading) return;

    const videoEl = videoRef.current;

    if (endMode === "repeat") {
      videoRef.current.loop = true;
    }

    const handleVideoEnd = () => {
      if (endMode !== "refresh") return;

      if (endMode === "refresh") {
        refresh();
      }
    };

    videoEl.addEventListener("ended", handleVideoEnd);

    return () => {
      videoEl.removeEventListener("ended", handleVideoEnd);
    };
  }, [endMode, isLoading, refresh]);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoEl = videoRef.current;

    videoEl.autoplay = true;
  }, []);

  const hotkeys: HotKey[] = useMemo(
    () => [
      {
        fn: refresh,
        hotKey: "shift+n",
        name: "Refresh",
      },
    ],
    [refresh]
  );

  return (
    <CustomVideoStateContextProvider>
      <NetPlayer
        autoPlay
        components={{
          Controls,
          Overlay,
          MobileControls: Controls,
          MobileOverlay: Overlay,
        }}
        hotkeys={hotkeys}
        ref={videoRef}
        // @ts-ignore
        crossOrigin={null}
        {...props}
      >
        {props.children}
      </NetPlayer>
    </CustomVideoStateContextProvider>
  );
};

ThemePlayer.displayName = "Player";

export default ThemePlayer;
