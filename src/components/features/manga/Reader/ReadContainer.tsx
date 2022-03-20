import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import React from "react";
import HorizontalContainer from "./HorizontalContainer";
import VerticalContainer from "./VerticalContainer";

const ReadContainer: React.FC = () => {
  const { direction, zoom } = useReadSettings();
  const { isMobile } = useDevice();

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <div
        className="h-full"
        style={{ width: isMobile ? "100%" : `${zoom * 100}%` }}
      >
        {direction === "vertical" ? (
          <VerticalContainer />
        ) : (
          <HorizontalContainer />
        )}
      </div>
    </div>
  );
};

export default React.memo(ReadContainer);
