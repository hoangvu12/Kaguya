import React, { useCallback, useMemo } from "react";
import NetPlayer, { NetPlayerProps } from "netplayer";
import { buildAbsoluteURL } from "url-toolkit";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import config from "@/config";
import { SKIP_TIME } from "@/constants";
import { CustomVideoStateContextProvider } from "@/contexts/CustomVideoStateContext";
import Subtitle from "./Subtitle";

const skipOPEDHotkey = () => ({
  fn: (videoEl: HTMLVideoElement) => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
  },
  hotKey: "shift+right",
  name: "skip-op/ed",
});

const Player = React.forwardRef<HTMLVideoElement, NetPlayerProps>(
  ({ hotkeys, components, ...props }, ref) => {
    const { PLAYER_TRANSLATIONS } = useConstantTranslation();

    const playerComponents = useMemo(
      () => ({ ...components, Subtitle }),
      [components]
    );

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
      <CustomVideoStateContextProvider>
        <NetPlayer
          ref={ref}
          i18n={PLAYER_TRANSLATIONS}
          hotkeys={playerHotkeys}
          onHlsInit={handleHlsInit}
          components={playerComponents}
          {...props}
        >
          {props.children}
        </NetPlayer>
      </CustomVideoStateContextProvider>
    );
  }
);

Player.displayName = "Player";

export default Player;
