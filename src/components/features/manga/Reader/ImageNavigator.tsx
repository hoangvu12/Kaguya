import { useReadContainer } from "@/contexts/ReadContainerContext";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import React, { useCallback, useEffect } from "react";
import ButtonNavigator from "./ButtonNavigator";
import ClickNavigator from "./ClickNavigator";

const ImageNavigator = () => {
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

  return (
    <React.Fragment>
      <ClickNavigator onLeft={handleLeft} onRight={handleRight} />
      <ButtonNavigator onLeft={handleLeft} onRight={handleRight} />
    </React.Fragment>
  );
};

export default React.memo(ImageNavigator);
