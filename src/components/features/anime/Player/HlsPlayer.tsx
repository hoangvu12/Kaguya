import { useVideoState } from "@/contexts/VideoStateContext";
import { Subtitle, VideoSource } from "@/types";
import { parseNumbersFromString } from "@/utils";
import type Hls from "hls.js";
import { buildAbsoluteURL } from "url-toolkit";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import webConfig from "@/config";
import classNames from "classnames";

export interface HlsPlayerProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: VideoSource[];
  hlsConfig?: Partial<Hls["config"]>;
}

const DEFAULT_HLS_CONFIG: Partial<Hls["config"]> = {
  enableWorker: false,
};

const ReactHlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  ({ src, hlsConfig, className, ...props }, ref) => {
    const config = useMemo(
      () => ({ ...DEFAULT_HLS_CONFIG, ...hlsConfig }),
      [hlsConfig]
    );

    const myRef = useRef<HTMLVideoElement>(null);
    const hls = useRef<Hls>(null);
    const { state, setState } = useVideoState();

    const initQuality = useCallback(
      (source: VideoSource) => {
        const notDuplicatedQualities = [
          // @ts-ignore
          ...new Set<string>(
            src
              .filter((src) => src.label)
              .map((src) => src.label)
              .sort(
                (a, b) =>
                  parseNumbersFromString(b)[0] - parseNumbersFromString(a)[0]
              )
          ),
        ];

        setState((prev) => ({
          ...prev,
          qualities: notDuplicatedQualities.length
            ? notDuplicatedQualities
            : [],
          currentQuality: source.label,
        }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [src]
    );

    const initPlayer = useCallback(
      async (source: VideoSource) => {
        const { default: Hls } = await import("hls.js");
        let _hls = new Hls(config);

        function _initHlsPlayer() {
          if (_hls != null) {
            _hls.destroy();

            const newHls = new Hls(config);

            hls.current = newHls;
            _hls = newHls;
          }

          if (myRef.current != null) {
            _hls.attachMedia(myRef.current);
          }

          _hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            _hls.loadSource(source.file);

            _hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
              data.levels.forEach((level) => {
                level.details.fragments.forEach((fragment) => {
                  if (
                    !fragment.baseurl.includes(webConfig.nodeServerUrl) ||
                    fragment.relurl.includes("http")
                  )
                    return;

                  const href = new URL(fragment.baseurl);
                  const targetUrl = href.searchParams.get("url");

                  const url = buildAbsoluteURL(targetUrl, fragment.relurl, {
                    alwaysNormalize: true,
                  });

                  href.searchParams.set("url", url);

                  fragment.url = href.toString();
                });
              });

              myRef?.current
                ?.play()
                .catch(() =>
                  console.log(
                    "Unable to autoplay prior to user interaction with the dom."
                  )
                );

              if (src.length > 1) return;

              if (!_hls.levels?.length) return;

              const levels: string[] = _hls.levels
                .sort((a, b) => b.height - a.height)
                .filter((level) => level.height)
                .map((level) => `${level.height}p`);

              setState((prev) => ({
                ...prev,
                qualities: levels,
                currentQuality: levels[0],
              }));
            });
          });

          _hls.on(Hls.Events.ERROR, function (event, data) {
            console.log("ERROR:", data);

            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  _hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  _hls.recoverMediaError();

                  break;
              }
            }
          });
        }

        if (Hls.isSupported() && src[0].file.includes("m3u8")) {
          _initHlsPlayer();
        } else {
          myRef.current.src = src[0].file;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [src]
    );

    useEffect(() => {
      let _hls = hls.current;

      initPlayer(src[0]);

      if (!src[0].file.includes("m3u8") || src.length > 1) {
        initQuality(src[0]);
      }

      return () => {
        if (_hls != null) {
          _hls.destroy();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    useEffect(() => {
      const videoRef = myRef.current;

      if (!videoRef) return;
      if (!state?.qualities.length) return;

      const currentQuality = state?.currentQuality;

      if (src[0].file.includes("m3u8") && src.length === 1) {
        if (!hls?.current?.levels?.length) return;

        hls.current.currentLevel = hls.current.levels.findIndex(
          (level) => level.height === Number(currentQuality.replace("p", ""))
        );

        return;
      }

      const beforeChangeTime = videoRef.currentTime;

      const qualitySource = src.find(
        (source) => source.label === state.currentQuality
      );

      if (!qualitySource) return;

      const handleQualityChange = () => {
        videoRef.currentTime = beforeChangeTime;
      };

      videoRef.addEventListener("canplay", handleQualityChange, {
        once: true,
      });

      initPlayer(qualitySource);

      return () => {
        videoRef.removeEventListener("canplay", handleQualityChange);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.currentQuality]);

    const playerRef = useCallback(
      (node) => {
        myRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as MutableRefObject<HTMLVideoElement>).current = node;
        }
      },
      [ref]
    );

    return (
      <video
        className={classNames("hls-player w-full h-full", className)}
        ref={playerRef}
        autoPlay
        crossOrigin="anonymous"
        preload="metadata"
        {...props}
      />
    );
  }
);

ReactHlsPlayer.displayName = "ReactHlsPlayer";

export default React.memo(ReactHlsPlayer) as typeof ReactHlsPlayer;
