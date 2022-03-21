import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import React, { useCallback, useEffect } from "react";
import ButtonNavigator from "./ButtonNavigator";

const ImageNavigator = () => {
  const {
    state: { activeImageIndex },
    setState,
  } = useReadPanel();
  const { direction } = useReadSettings();
  const { images } = useReadInfo();
  const { isMobile } = useDevice();

  const nextImage = useCallback(() => {
    if (direction === "vertical") return;

    const newIndex =
      activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1;

    setState((prev) => ({ ...prev, activeImageIndex: newIndex }));
  }, [direction, activeImageIndex, images?.length, setState]);

  const previousImage = useCallback(() => {
    if (direction === "vertical") return;

    const newIndex =
      activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1;

    setState((prev) => ({ ...prev, activeImageIndex: newIndex }));
  }, [direction, activeImageIndex, images?.length, setState]);

  const handleLeft = useCallback(() => {
    if (direction === "ltr") {
      previousImage();
    } else {
      nextImage();
    }
  }, [direction, nextImage, previousImage]);

  const handleRight = useCallback(() => {
    if (direction === "ltr") {
      nextImage();
    } else {
      previousImage();
    }
  }, [direction, nextImage, previousImage]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const allowedKeys = ["ArrowLeft", "ArrowRight"];

      if (!allowedKeys.includes(e.key)) return;

      if (e.key === "ArrowLeft") {
        handleLeft();
      } else if (e.key === "ArrowRight") {
        handleRight();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleLeft, handleRight]);

  useEffect(() => {
    if (isMobile || direction === "vertical") return;

    const container = document.querySelector(".content-container");

    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const widthPercent = 25;
      const width = (window.innerWidth * widthPercent) / 100;

      if (e.clientX < width) {
        handleLeft();
      } else if (e.clientX > window.innerWidth - width) {
        handleRight();
      }
    };

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [direction, handleLeft, handleRight, isMobile]);

  return <ButtonNavigator onLeft={handleLeft} onRight={handleRight} />;
};

export default React.memo(ImageNavigator);
