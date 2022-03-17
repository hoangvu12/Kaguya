import { useVideoState } from "@/contexts/VideoStateContext";
import { VideoSource } from "@/types";
import { parseNumbersFromString } from "@/utils";
import Hls from "hls.js";
import React, { MutableRefObject, useEffect, useRef } from "react";

export interface HlsPlayerProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: VideoSource[];
  hlsConfig?: Hls.Config;
}

const DEFAULT_HLS_CONFIG = {
  enableWorker: false,
};

const ReactHlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  ({ src, hlsConfig, ...props }, ref) => {
    const config = { ...DEFAULT_HLS_CONFIG, ...hlsConfig };

    const myRef = useRef<HTMLVideoElement>(null);
    const hls = useRef(new Hls(config));
    const { state, setState } = useVideoState();

    useEffect(() => {
      let _hls = hls.current;

      function _initPlayer() {
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
          _hls.loadSource(src[0].file);

          _hls.on(Hls.Events.MANIFEST_PARSED, () => {
            myRef?.current
              ?.play()
              .catch(() =>
                console.log(
                  "Unable to autoplay prior to user interaction with the dom."
                )
              );

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
          qualities: src.length ? notDuplicatedQualities : [],
          currentQuality: src[0].label,
        }));

        myRef.current.src = src[0].file;
      }

      return () => {
        if (_hls != null) {
          _hls.destroy();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState, src]);

    useEffect(() => {
      const videoRef = myRef.current;

      if (!videoRef) return;
      if (!state?.qualities.length) return;

      const currentQuality = state?.currentQuality;

      if (src[0].file.includes("m3u8")) {
        if (!hls?.current?.levels?.length) return;

        hls.current.currentLevel = hls.current.levels.findIndex(
          (level) => level.height === Number(currentQuality.replace("p", ""))
        );

        return;
      }

      const qualitySource = src.find(
        (source) => source.label === currentQuality
      );
      const beforeChangeTime = videoRef.currentTime;

      if (!qualitySource) return;

      const handleQualityChange = () => {
        videoRef.currentTime = beforeChangeTime;
      };

      // If sources includes playing source (before change to new source)
      // that mean user changing quality.
      if (src.some((source) => source.file === videoRef.currentSrc)) {
        videoRef.addEventListener("canplay", handleQualityChange, {
          once: true,
        });
      }

      videoRef.src = qualitySource?.file;

      return () => {
        videoRef.removeEventListener("canplay", handleQualityChange);
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
