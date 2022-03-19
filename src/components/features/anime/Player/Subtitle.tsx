import { useVideo } from "@/contexts/VideoContext";
import { useVideoState } from "@/contexts/VideoStateContext";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { parse } from "@plussub/srt-vtt-parser";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";

interface SubtitleProps {
  showControls?: boolean;
}

const variants = {
  animate: { bottom: "6rem" },
  exit: { bottom: "1rem" },
};

const Subtitle: React.FC<SubtitleProps> = ({ showControls }) => {
  const { state } = useVideoState();
  const { videoEl } = useVideo();
  const [currentText, setCurrentText] = useState<string>("");

  const subtitle = useMemo(
    () => state.subtitles?.find((sub) => sub.lang === state.currentSubtitle),
    [state.subtitles, state.currentSubtitle]
  );

  const { data, isLoading, isError } = useQuery(
    `${subtitle?.file}`,
    () => axios.get<string>(subtitle.file).then((response) => response.data),
    {
      enabled: !!subtitle?.file,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    if (!data) return;
    if (!videoEl) return;

    const { entries = [] } = parse(data);

    const handleSubtitle = () => {
      const currentTime = videoEl.currentTime * 1000;
      const currentEntry = entries.find(
        (entry) => entry.from <= currentTime && entry.to >= currentTime
      );

      setCurrentText(currentEntry?.text || "");
    };

    videoEl.addEventListener("timeupdate", handleSubtitle);

    return () => {
      videoEl.removeEventListener("timeupdate", handleSubtitle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (
    isLoading ||
    isError ||
    !subtitle?.file ||
    !currentText ||
    !state.isSubtitleEnabled
  )
    return null;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        variants={variants}
        animate={showControls ? "animate" : "exit"}
        exit="exit"
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        transition={{ ease: "linear", duration: 0.2 }}
      >
        <p className="bg-black/80 p-2 rounded-sm text-xl text-center">
          {currentText}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Subtitle;
