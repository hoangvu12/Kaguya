import { VideoContextProvider } from "@/contexts/VideoContext";
import { VideoOptionsProvider } from "@/contexts/VideoOptionsContext";
import useDevice from "@/hooks/useDevice";
import useVideoShortcut from "@/hooks/useVideoShortcut";
import { Source } from "@/types";
import classNames from "classnames";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import ClientOnly from "../ClientOnly";
import DesktopControls from "./DesktopControls";
import HlsPlayer from "./HlsPlayer";
import MobileControls from "./MobileControls";
import Overlay from "./Overlay";
interface VideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: Source[];
  overlaySlot?: React.ReactNode;
  onKeyNextEpisode: () => void;
  onKeyPreviousEpisode: () => void;
}

const Video: React.FC<VideoProps> = ({
  overlaySlot,
  onKeyNextEpisode,
  onKeyPreviousEpisode,
  ...props
}) => {
  const ref = useRef<HTMLVideoElement>();
  const [refHolder, setRefHolder] = useState<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const timeout = useRef<NodeJS.Timeout>(null);
  const { isMobile } = useDevice();

  const handleKeepControls = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | null
  ) => {
    if (!e) {
      startControlsCycle();

      return;
    }

    const target = e.target as HTMLDivElement;

    if (target.classList.contains("video-overlay") && isMobile) {
      setShowControls(false);
    } else {
      startControlsCycle();
    }
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

  useEffect(() => {
    if (!ref.current) return;

    setRefHolder(ref.current);
  }, [ref, props.src]);

  useEffect(() => {
    const element = ref.current;

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    element.addEventListener("waiting", handleWaiting);
    element.addEventListener("playing", handlePlaying);
    element.addEventListener("play", handlePlaying);

    return () => {
      element.removeEventListener("waiting", handleWaiting);
      element.removeEventListener("playing", handlePlaying);
      element.removeEventListener("play", handlePlaying);
    };
  }, []);

  useVideoShortcut(refHolder, {
    onNextEpisode: onKeyNextEpisode,
    onPreviousEpisode: onKeyPreviousEpisode,
  });

  useHotkeys("*", () => {
    handleKeepControls(null);
  });

  const defaultQualities = useMemo(
    () => props.src.map((source) => source.label),
    [props.src]
  );

  return (
    <VideoContextProvider el={refHolder}>
      <VideoOptionsProvider defaultQualities={defaultQualities}>
        <div
          className={classNames("video-wrapper relative overflow-hidden")}
          onMouseMove={isMobile ? () => {} : handleKeepControls}
          onClick={handleKeepControls}
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
              <BrowserView>
                <DesktopControls />
              </BrowserView>

              <MobileView>
                <MobileControls />
              </MobileView>
            </ClientOnly>
          </motion.div>

          <Overlay showControls={showControls || isBuffering}>
            {overlaySlot}
          </Overlay>

          <div className="w-full h-screen">
            <HlsPlayer ref={ref} {...props} />
          </div>
        </div>
      </VideoOptionsProvider>
    </VideoContextProvider>
  );
};

Video.displayName = "Video";

export default Video;
