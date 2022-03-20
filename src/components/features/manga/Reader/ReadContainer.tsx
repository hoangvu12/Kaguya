import { ReadContainerContextProvider } from "@/contexts/ReadContainerContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import React from "react";
import HorizontalContainer from "./HorizontalContainer";
import ImageNavigator from "./ImageNavigator";
import VerticalContainer from "./VerticalContainer";

const ReadContainer: React.FC = () => {
  const { direction, zoom } = useReadSettings();
  const { isMobile } = useDevice();

  return (
    <ReadContainerContextProvider>
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

        <ImageNavigator />
      </div>
    </ReadContainerContextProvider>
  );
};

export default React.memo(ReadContainer);
