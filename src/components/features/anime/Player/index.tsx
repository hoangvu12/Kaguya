import config from "@/config";
import { SKIP_TIME } from "@/constants";
import { CustomVideoStateContextProvider } from "@/contexts/CustomVideoStateContext";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { Font, VideoSource } from "@/types";
import { createProxyUrl } from "@/utils";
import SubtitlesOctopus from "libass-wasm";
import NetPlayer, { NetPlayerProps } from "netplayer";
import React, { useCallback, useMemo, useRef } from "react";
import { buildAbsoluteURL } from "url-toolkit";
import Subtitle from "./Subtitle";

const skipOPEDHotkey = () => ({
  fn: (videoEl: HTMLVideoElement) => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
  },
  hotKey: "shift+right",
  name: "skip-op/ed",
});

interface PlayerProps extends NetPlayerProps {
  fonts?: Font[];
}

const Player = React.forwardRef<HTMLVideoElement, PlayerProps>(
  ({ hotkeys, components, subtitles, fonts, ...props }, ref) => {
    const { PLAYER_TRANSLATIONS } = useConstantTranslation();
    const subtitlesOctopusRef = useRef(null);

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

    const notAssSubtitles = useMemo(
      () => subtitles.filter((subtitle) => !subtitle.file.endsWith(".ass")),
      [subtitles]
    );

    const handleVideoInit = useCallback(
      (videoEl: HTMLVideoElement) => {
        if (subtitlesOctopusRef.current) {
          subtitlesOctopusRef.current.dispose();

          subtitlesOctopusRef.current = null;
        }

        if (!subtitles?.[0]?.file.endsWith(".ass")) return;

        const options = {
          video: videoEl,
          subUrl: subtitles[0].file,
          fonts,
          workerUrl: "/subtitles-octopus-worker.js",
          legacyWorkerUrl: "/subtitles-octopus-worker-legacy.js",
        };

        const instance = new SubtitlesOctopus(options);

        subtitlesOctopusRef.current = instance;
      },
      [fonts, subtitles]
    );

    const proxyBuilder = useCallback((url: string, source: VideoSource) => {
      if (url.includes(config.proxyServerUrl) || !source.useProxy) return url;

      const requestUrl = createProxyUrl(url, source.proxy);

      console.log("Proxying", url, "to", requestUrl);

      return requestUrl;
    }, []);

    return (
      <CustomVideoStateContextProvider>
        <NetPlayer
          ref={ref}
          i18n={PLAYER_TRANSLATIONS}
          hotkeys={playerHotkeys}
          onHlsInit={handleHlsInit}
          components={playerComponents}
          subtitles={notAssSubtitles}
          onInit={handleVideoInit}
          changeSourceUrl={proxyBuilder}
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
