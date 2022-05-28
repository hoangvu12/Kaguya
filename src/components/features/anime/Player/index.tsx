import React, { useCallback, useMemo } from "react";
import NetPlayer, { NetPlayerProps } from "netplayer";
import { buildAbsoluteURL } from "url-toolkit";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import config from "@/config";
import { SKIP_TIME } from "@/constants";

const skipOPEDHotkey = () => ({
  fn: (videoEl: HTMLVideoElement) => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
  },
  hotKey: "shift+right",
  name: "skip-op/ed",
});

const Player = React.forwardRef<HTMLVideoElement, NetPlayerProps>(
  ({ hotkeys, ...props }, ref) => {
    const { PLAYER_TRANSLATIONS } = useConstantTranslation();

    const playerHotkeys = useMemo(
      () => [skipOPEDHotkey(), ...hotkeys],
      [hotkeys]
    );

    const handleHlsInit = useCallback((hls) => {
      // @ts-ignore
      hls.on("hlsFragLoading", (_, { frag }) => {
        if (
          !frag.baseurl.includes(config.proxyServerUrl) ||
          frag.relurl.includes("http")
        )
          return;

        const href = new URL(frag.baseurl);
        const targetUrl = href.searchParams.get("url");

        const url = buildAbsoluteURL(targetUrl, frag.relurl, {
          alwaysNormalize: true,
        });

        href.searchParams.set("url", url);

        frag.url = href.toString();
      });
    }, []);

    return (
      <NetPlayer
        ref={ref}
        i18n={PLAYER_TRANSLATIONS}
        hotkeys={playerHotkeys}
        onHlsInit={handleHlsInit}
        {...props}
      >
        {props.children}
      </NetPlayer>
    );
  }
);

Player.displayName = "Player";

export default Player;
