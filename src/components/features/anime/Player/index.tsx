import DesktopControls from "@/components/features/anime/Player/DesktopControls";
import HlsPlayer, {
  HlsPlayerProps,
} from "@/components/features/anime/Player/HlsPlayer";
import MobileControls from "@/components/features/anime/Player/MobileControls";
import Overlay from "@/components/features/anime/Player/Overlay";
import ClientOnly from "@/components/shared/ClientOnly";
import { VideoContextProvider } from "@/contexts/VideoContext";
import { VideoStateProvider } from "@/contexts/VideoStateContext";
import useDevice from "@/hooks/useDevice";
import useHandleTap from "@/hooks/useHandleTap";
import useVideoShortcut from "@/hooks/useVideoShortcut";
import { Subtitle, VideoSource } from "@/types";
import { parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { motion, TapHandlers } from "framer-motion";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { AiFillFastBackward, AiFillFastForward } from "react-icons/ai";
import VideoSubtitle from "./Subtitle";

const noop = () => {};
interface VideoProps extends HlsPlayerProps {
  src: VideoSource[];
  overlaySlot?: React.ReactNode;
  subtitles?: Subtitle[];
}

const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({ overlaySlot, ...props }, ref) => {
    const myRef = useRef<HTMLVideoElement>();
    const [refHolder, setRefHolder] = useState<HTMLVideoElement>(null);
    const [showControls, setShowControls] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isError, setIsError] = useState(false);
    const timeout = useRef<NodeJS.Timeout>(null);
    const { isMobile } = useDevice();

    const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
      const target = e.target as HTMLDivElement;

      if (!target.closest(".progress-control")) return;

      handleKeepControls(null);
    };

    const handleKeepControls = (e: any) => {
      if (!e) {
        startControlsCycle();

        return;
      }

      const target = e.target as HTMLDivElement;
      const videoOverlay = document.querySelector(".video-overlay");

      if (!videoOverlay) {
        startControlsCycle();

        return;
      }

      const shouldCloseControls =
        target.classList.contains("video-overlay") ||
        target.classList.contains("mobile-video-overlay");

      if (shouldCloseControls && isMobile) {
        setShowControls(false);

        return;
      }

      startControlsCycle();
    };

    const startControlsCycle = useCallback(() => {
      setShowControls(true);

      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }, []);

    const handleDoubleTap: TapHandlers["onTap"] = (e, info) => {
      const backwardIndicator = document.querySelector(".backward-indicator");
      const forwardIndicator = document.querySelector(".forward-indicator");

      const widthPercent = 45;
      const width = (window.innerWidth * widthPercent) / 100;

      const toggleIndicator = (indicator: Element) => {
        const toggle = () => {
          indicator.classList.toggle("opacity-0");
          indicator.classList.toggle("z-50");
        };

        setTimeout(toggle, 350);

        toggle();
      };

      if (info.point.x < width) {
        myRef.current.currentTime = myRef.current.currentTime - 10;

        toggleIndicator(backwardIndicator);
      } else if (info.point.x > window.innerWidth - width) {
        myRef.current.currentTime = myRef.current.currentTime + 10;

        toggleIndicator(forwardIndicator);
      }
    };

    const handleTap = useHandleTap({
      onTap: handleKeepControls,
      onDoubleTap: handleDoubleTap,
      tapThreshold: isMobile ? 250 : 0,
    });

    useEffect(() => {
      if (!myRef.current) return;

      setRefHolder(myRef.current);
    }, [ref, props.src]);

    useEffect(() => {
      const element = myRef.current;

      const handleWaiting = () => {
        setIsBuffering(true);
      };

      const handlePlaying = () => {
        setIsBuffering(false);
      };

      const handleError = (e) => {
        console.log("player error", e);

        setIsError(true);
      };

      const handleCanPlay = () => {
        setIsError(false);
      };

      element.addEventListener("waiting", handleWaiting);
      element.addEventListener("playing", handlePlaying);
      element.addEventListener("play", handlePlaying);
      element.addEventListener("error", handleError);
      element.addEventListener("canplay", handleCanPlay);

      return () => {
        element.removeEventListener("waiting", handleWaiting);
        element.removeEventListener("playing", handlePlaying);
        element.removeEventListener("play", handlePlaying);
        element.removeEventListener("error", handleError);
        element.removeEventListener("canplay", handleCanPlay);
      };
    }, []);

    useVideoShortcut(refHolder);

    useHotkeys("*", () => {
      handleKeepControls(null);
    });

    const defaultQualities = useMemo(
      () =>
        props.src
          .map((source) => source.label)
          .sort((b, a) => parseNumberFromString(b) - parseNumberFromString(a)),
      [props.src]
    );

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
      <VideoContextProvider el={refHolder}>
        <VideoStateProvider
          defaultQualities={defaultQualities}
          subtitles={props.subtitles}
        >
          <motion.div
            className={classNames(
              "video-wrapper w-full h-full relative overflow-hidden bg-black"
            )}
            onMouseMove={isMobile ? noop : handleKeepControls}
            onTouchMove={handleTouchMove}
            onTap={handleTap}
          >
            {/* Controls */}
            <motion.div
              variants={{
                show: { y: 0, opacity: 1 },
                hidden: { y: "100%", opacity: 0 },
              }}
              animate={showControls || isBuffering ? "show" : "hidden"}
              initial="hidden"
              exit="hidden"
              className="absolute bottom-0 z-50 w-full"
              transition={{ ease: "linear", duration: 0.2 }}
            >
              <ClientOnly>
                <BrowserView renderWithFragment>
                  <DesktopControls />
                </BrowserView>

                <MobileView renderWithFragment>
                  <MobileControls />
                </MobileView>
              </ClientOnly>
            </motion.div>

            <Overlay showControls={isBuffering || showControls}>
              {overlaySlot}
            </Overlay>
            <VideoSubtitle showControls={isBuffering || showControls} />

            <div
              className="backward-indicator bg-white/20 absolute left-0 w-[45vw] h-full flex flex-col items-center justify-center transition duration-300 opacity-0"
              style={{ borderRadius: "0% 20% 20% 0% / 50% 50% 50% 50%" }}
            >
              <AiFillFastBackward className="w-12 h-12" />
              <p className="rounded-full text-xl">-10 giây</p>
            </div>

            {isError && (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center space-y-8">
                <div className="space-y-4">
                  <p className="text-4xl font-semibold">｡゜(｀Д´)゜｡</p>
                  <p className="text-xl">
                    Đã có lỗi xảy ra ({myRef.current?.error?.message})
                  </p>
                </div>
              </div>
            )}

            <div
              className="forward-indicator bg-white/20 absolute right-0 w-[45vw] h-full flex flex-col items-center justify-center transition duration-300 opacity-0"
              style={{ borderRadius: "20% 0% 0% 20% / 50% 50% 50% 50%" }}
            >
              <AiFillFastForward className="w-12 h-12" />
              <p className="rounded-full text-xl">+10 giây</p>
            </div>

            <div className="w-full h-full">
              <HlsPlayer ref={playerRef} {...props} />
            </div>
          </motion.div>
        </VideoStateProvider>
      </VideoContextProvider>
    );
  }
);

Video.displayName = "Video";

export default React.memo(Video);
