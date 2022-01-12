import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";

interface ReadImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onVisible?: () => void;
}

const ReadImage: React.FC<ReadImageProps> = ({
  src,
  className,
  onLoad,
  onVisible,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const { fitMode } = useReadSettings();
  const ref = useRef<HTMLImageElement>(null);

  const entry = useIntersectionObserver(ref, {
    rootMargin: "0px 0px 10px 0px",
  });

  useEffect(() => {
    if (!entry?.isIntersecting) return;
    if (!ref.current) return;
    if (!ref.current.complete) return;

    onVisible?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.isIntersecting]);

  // I have to use img instead of Next/Image because I want to image calculate the height itself
  return (
    <React.Fragment>
      <AnimatePresence>
        {!loaded && (
          <motion.div
            animate="animate"
            initial="initial"
            exit="exit"
            variants={{
              animate: { opacity: 1 },
              initial: { opacity: 0 },
              exit: { opacity: 0 },
            }}
            className="flex items-center justify-center w-full h-60 text-gray-500"
          >
            <BsFillImageFill className="w-8 h-8 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* eslint-disable-next-line */}
      <img
        ref={ref}
        className={classNames(
          fitMode === "auto" && "w-auto h-auto",
          fitMode === "width" && "w-full h-auto",
          fitMode === "height" && "w-auto h-screen",
          className
        )}
        alt="Đọc truyện tại Kaguya"
        src={`/api/proxy?url=${encodeURIComponent(src)}`}
        onLoad={(e) => {
          setLoaded(true);

          onLoad?.(e);
        }}
        {...props}
      />
    </React.Fragment>
  );
};

export default React.memo(ReadImage);
