import Button from "@/components/shared/Button";
import { useReadContainer } from "@/contexts/ReadContainerContext";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";

const ImageNavigator = () => {
  const { isMobile } = useDevice();
  const {
    state: { isSidebarOpen },
  } = useReadPanel();
  const {
    state: { activeImageIndex },
    setState,
  } = useReadContainer();
  const { direction } = useReadSettings();
  const { images } = useReadInfo();

  const nextImage = useCallback(() => {
    if (direction === "vertical") return;

    const newIndex =
      activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1;

    setState((prev) => ({ ...prev, activeImageIndex: newIndex }));
  }, [direction, activeImageIndex, images.length, setState]);

  const previousImage = useCallback(() => {
    if (direction === "vertical") return;

    const newIndex =
      activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1;

    setState((prev) => ({ ...prev, activeImageIndex: newIndex }));
  }, [direction, activeImageIndex, images.length, setState]);

  useHotkeys("right", direction === "ltr" ? nextImage : previousImage, [
    images,
    activeImageIndex,
    direction,
  ]);

  useHotkeys("left", direction === "ltr" ? previousImage : nextImage, [
    images,
    activeImageIndex,
    direction,
  ]);

  return (
    <AnimatePresence initial={!isMobile}>
      {direction !== "vertical" && (!isMobile || isSidebarOpen) && (
        <motion.div
          animate={{ opacity: !isMobile ? 0 : 1 }}
          whileHover={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          className={classNames(
            "w-11/12 md:w-4/6 z-50 flex items-center justify-between bottom-5 rounded-md p-2 bg-background-800 fixed"
          )}
        >
          <Button
            secondary
            LeftIcon={HiOutlineArrowNarrowLeft}
            onClick={direction === "ltr" ? previousImage : nextImage}
          >
            {isMobile ? null : direction === "ltr" ? (
              <p>Ảnh trước</p>
            ) : (
              <p>Ảnh tiếp theo</p>
            )}
          </Button>

          <p>
            {activeImageIndex + 1} / {images.length}
          </p>

          <Button
            secondary
            RightIcon={HiOutlineArrowNarrowRight}
            onClick={direction === "ltr" ? nextImage : previousImage}
          >
            {isMobile ? null : direction === "ltr" ? (
              <p>Ảnh tiếp theo</p>
            ) : (
              <p>Ảnh trước</p>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageNavigator;
