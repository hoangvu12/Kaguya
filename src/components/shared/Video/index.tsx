import { VideoContextProvider } from "@/contexts/VideoContext";
import { VideoOptionsProvider } from "@/contexts/VideoOptionsContext";
import classNames from "classnames";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import HlsPlayer from "./HlsPlayer";
import Overlay from "./Overlay";

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  overlaySlot?: React.ReactNode;
}

const Video: React.FC<VideoProps> = ({ overlaySlot, ...props }) => {
  const ref = useRef<HTMLVideoElement>();
  const [refHolder, setRefHolder] = useState<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(true);
  const timeout = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!ref.current) return;

    setRefHolder(ref.current);
  }, [ref, props.src]);

  useEffect(() => {
    if (!showControls) return;

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout.current);
  }, [showControls]);

  return (
    <VideoContextProvider el={refHolder}>
      <VideoOptionsProvider>
        <div
          className={classNames("video-wrapper relative overflow-hidden")}
          onMouseMove={() => setShowControls(true)}
        >
          <div className="absolute inset-0 flex items-end z-10">
            <motion.div
              variants={{
                show: { y: 0, opacity: 1 },
                hidden: { y: "100%", opacity: 0 },
              }}
              animate={showControls ? "show" : "hidden"}
              initial="hidden"
              exit="hidden"
              className="w-full"
              transition={{ ease: "linear", duration: 0.2 }}
            >
              <Controls />
            </motion.div>
          </div>

          <Overlay>{overlaySlot}</Overlay>

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
