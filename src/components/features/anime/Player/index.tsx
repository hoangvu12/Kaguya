import config from "@/config";
import { SKIP_TIME } from "@/constants";
import { CustomVideoStateContextProvider } from "@/contexts/CustomVideoStateContext";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { Font, VideoSource } from "@/types";
import { createProxyUrl } from "@/utils";
import SubtitlesOctopus from "libass-wasm";
import NetPlayer, { NetPlayerProps } from "netplayer";
import Hls from "netplayer/dist/types/hls.js";
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

export interface PlayerProps extends NetPlayerProps {
  fonts?: Font[];
}

const corsServers = [config.proxyServerUrl, "https://corsproxy.io"];

const Player = React.forwardRef<HTMLVideoElement, PlayerProps>(
  (
    { hotkeys = [], components = [], subtitles = [], fonts = [], ...props },
    ref
  ) => {
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

    const handleHlsInit = useCallback((hls: Hls, source: VideoSource) => {
      // @ts-ignore
      hls.on("hlsManifestParsed", (_, info) => {
        info.levels.forEach((level) => {
          if (!level?.url?.length) return;

          level.url = level.url.map((url) => {
            if (!corsServers.some((server) => url.includes(server))) return url;

            if (url.includes("corsproxy")) {
              const targetUrl = decodeURIComponent(
                url.replace("https://corsproxy.io/", "")
              );

              const finalUrl = buildAbsoluteURL(source.file, targetUrl, {
                alwaysNormalize: true,
              });

              return `https://corsproxy.io/?${encodeURIComponent(finalUrl)}`;
            } else if (url.includes(config.proxyServerUrl)) {
              const targetUrl = decodeURIComponent(
                url.replace(config.proxyServerUrl + "/", "")
              );

              const href = new URL(source.file);
              const baseUrl = href.searchParams.get("url");

              const finalUrl = buildAbsoluteURL(baseUrl, targetUrl, {
                alwaysNormalize: true,
              });

              return createProxyUrl(finalUrl, source.proxy);
            }
          });
        });
      });

      // @ts-ignore
      hls.on("hlsFragLoading", (_, { frag }) => {
        if (
          !corsServers.some((server) => frag.url.includes(server)) ||
          frag.relurl.includes("http")
        )
          return;

        if (frag.url.includes(config.proxyServerUrl)) {
          const href = new URL(frag.baseurl);
          const targetUrl = href.searchParams.get("url");

          const url = buildAbsoluteURL(targetUrl, frag.relurl, {
            alwaysNormalize: true,
          });

          href.searchParams.set("url", url);

          frag.url = href.toString();

          // Free CORS server
        } else if (frag.url.includes("corsproxy")) {
          const targetUrl = decodeURIComponent(
            frag.baseurl.replace("https://corsproxy.io/?", "")
          );

          const url = buildAbsoluteURL(targetUrl, frag.relurl, {
            alwaysNormalize: true,
          });

          frag.url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        }
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
          fonts: fonts.map((font) => font?.file),
          workerUrl: "/subtitles-octopus-worker.js",
          legacyWorkerUrl: "/subtitles-octopus-worker-legacy.js",
        };

        const instance = new SubtitlesOctopus(options);

        subtitlesOctopusRef.current = instance;
      },
      [fonts, subtitles]
    );

    const proxyBuilder = useCallback((url: string, source: VideoSource) => {
      if (
        corsServers.some((server) => url.includes(server)) ||
        (!source.useProxy && !source.usePublicProxy)
      )
        return url;

      const requestUrl = createProxyUrl(
        url,
        source.proxy,
        source.usePublicProxy
      );

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
