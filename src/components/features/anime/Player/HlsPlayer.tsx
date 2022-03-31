import webConfig from "@/config";
import { useVideoState } from "@/contexts/VideoStateContext";
import { VideoSource } from "@/types";
import { parseNumberFromString } from "@/utils";
import classNames from "classnames";
import type Hls from "hls.js";
import type { Fragment } from "hls.js";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { buildAbsoluteURL } from "url-toolkit";

export interface HlsPlayerProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: VideoSource[];
  hlsConfig?: Partial<Hls["config"]>;
  proxyBuilder?: (url: string, source: VideoSource) => string;
}

const DEFAULT_HLS_CONFIG: Partial<Hls["config"]> = {
  enableWorker: false,
};

const handleFragmentProxy = (fragment: Fragment) => {
  if (
    !fragment.baseurl.includes(webConfig.proxyServerUrl) ||
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
};

const ReactHlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  (
    { src, hlsConfig, className, proxyBuilder = (url) => url, ...props },
    ref
  ) => {
    const config = useMemo(
      () => ({ ...DEFAULT_HLS_CONFIG, ...hlsConfig }),
      [hlsConfig]
    );

    const myRef = useRef<HTMLVideoElement>(null);
    const hls = useRef<Hls>(null);
    const { state, setState } = useVideoState();

    const initQuality = useCallback(
      () => {
        const sortedQualities = src
          .filter((src) => src.label)
          .map((src) => src.label)
          .sort((a, b) => parseNumberFromString(b) - parseNumberFromString(a));

        const notDuplicatedQualities: string[] = [
          // @ts-ignore
          ...new Set<string>(sortedQualities),
        ];

        setState((prev) => ({
          ...prev,
          qualities: notDuplicatedQualities,
          currentQuality: sortedQualities[0],
        }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [src]
    );

    const initPlayer = useCallback(
      async (source: VideoSource) => {
        async function _initHlsPlayer() {
          const { default: Hls } = await import("hls.js");

          if (hls.current !== null) {
            hls.current.destroy();
          }

          let _hls: Hls = new Hls({
            xhrSetup: (xhr, url) => {
              let requestUrl = "";

              if (!source.useProxy) {
                requestUrl = url;
              } else {
                requestUrl = proxyBuilder(url, source);
              }

              xhr.open("GET", requestUrl, true);
            },
            ...config,
          });
          hls.current = _hls;

          if (myRef.current != null) {
            _hls.attachMedia(myRef.current);
          }

          _hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            _hls.loadSource(source.file);

            _hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
              myRef?.current
                ?.play()
                .catch(() =>
                  toast.error(
                    "Trình duyệt không hỗ trợ tự động phát video. Vui lòng bấm vào nút phát để bắt đàu video."
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

            _hls.on(Hls.Events.FRAG_LOADING, (_, { frag }) => {
              handleFragmentProxy(frag);
            });
          });

          _hls.on(Hls.Events.ERROR, function (event, data) {
            console.log("ERROR:", event, data);

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

        if (source.file.includes("m3u8")) {
          _initHlsPlayer();
        } else {
          myRef.current.src = source.file;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [src]
    );

    useEffect(() => {
      let _hls = hls.current;

      initPlayer(src[0]);

      // If the sources have multiple m3u8 urls, then we have to handle quality ourself (because hls.js only handle quality with playlist url).
      // Same with the sources that have multiple mp4 urls.
      if (!src[0].file.includes("m3u8") || src.length > 1) {
        initQuality();
      }

      return () => {
        if (_hls !== null) {
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

      // If the sources contain only one m3u8 url, then it maybe is a playlist.
      if (src[0].file.includes("m3u8") && src.length === 1) {
        // Check if the playlist gave us qualities.
        if (!hls?.current?.levels?.length) return;

        // Handle changing quality.
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
        className={classNames("hls-player", className)}
        ref={playerRef}
        autoPlay
        preload="metadata"
        {...props}
      />
    );
  }
);

ReactHlsPlayer.displayName = "ReactHlsPlayer";

export default React.memo(ReactHlsPlayer) as typeof ReactHlsPlayer;
