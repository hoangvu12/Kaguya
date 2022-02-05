import { useVideoState } from "@/contexts/VideoStateContext";
import { Source } from "@/types";
import Storage from "@/utils/storage";
import Hls from "hls.js";
import React, { MutableRefObject, useEffect, useRef } from "react";

export interface HlsPlayerProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: Source[];
  autoPlay?: boolean;
}

const config = {
  enableWorker: false,
  xhrSetup: (xhr: any, url: string) => {
    xhr.open("GET", `/api/proxy?url=${url}`, true);
  },
};

const ReactHlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  ({ src, autoPlay, ...props }, ref) => {
    const myRef = useRef<HTMLVideoElement>(null);
    const hls = useRef(new Hls(config));
    const { state, setState } = useVideoState();

    useEffect(() => {
      if (!hls?.current?.levels) return;

      hls.current.currentLevel = hls.current.levels
        .sort((a, b) => b.bitrate - a.bitrate)
        .findIndex((level) => level.height === state?.currentQuality);
    }, [state?.currentQuality]);

    useEffect(() => {
      function _initPlayer() {
        if (hls.current != null) {
          hls.current.destroy();

          hls.current = new Hls(config);
        }

        if (myRef.current != null) {
          hls.current.attachMedia(myRef.current);
        }

        hls.current.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.current.loadSource(src[0].file);

          hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
            if (autoPlay) {
              myRef?.current
                ?.play()
                .catch(() =>
                  console.log(
                    "Unable to autoplay prior to user interaction with the dom."
                  )
                );
            }

            const levels = hls.current.levels
              .filter((level) => level.height)
              .sort((a, b) => b.height - a.height)
              .map((level) => `${level.height}p`);

            setState((prev) => ({
              ...prev,
              qualities: levels.length
                ? [
                    // @ts-ignore
                    ...new Set<number>(levels),
                  ]
                : [],
              currentQuality: levels[0],
            }));
          });
        });

        hls.current.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.current.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.current.recoverMediaError();
                break;
              default:
                _initPlayer();
                break;
            }
          }
        });
      }

      if (Hls.isSupported() && src[0].file.includes("m3u8")) {
        _initPlayer();
      } else {
        const notDuplicatedQualities = [
          // @ts-ignore
          ...new Set<string>(src.map((src) => src.label)),
        ];

        setState((prev) => ({
          ...prev,
          qualities: src.length ? notDuplicatedQualities : [],
          currentQuality: src[0].label,
        }));
      }

      myRef.current.autoplay = autoPlay;

      return () => {
        if (hls.current != null) {
          hls.current.destroy();
        }
      };
    }, [autoPlay, setState, src]);

    useEffect(() => {
      const quality = state?.currentQuality;
      const qualitySource = src.find((source) => source.label === quality);
      const beforeChangeTime = myRef.current.currentTime;

      if (!qualitySource) return;

      if (!myRef.current || qualitySource?.file.includes("m3u8")) return;

      const handleQualityChange = () => {
        myRef.current.currentTime = beforeChangeTime;
      };

      // If sources includes playing source (before change to new source)
      // that mean user changing quality.
      if (src.some((source) => source.file === myRef.current.currentSrc)) {
        myRef.current.addEventListener("canplay", handleQualityChange, {
          once: true,
        });
      }

      myRef.current.src = qualitySource?.file;

      return () => {
        myRef.current.removeEventListener("canplay", handleQualityChange);
      };
    }, [state, src]);
    return (
      <video
        className="hls-player"
        ref={(node) => {
          myRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as MutableRefObject<HTMLVideoElement>).current = node;
          }
        }}
        {...props}
      />
    );
  }
);

ReactHlsPlayer.displayName = "ReactHlsPlayer";

export default ReactHlsPlayer;
