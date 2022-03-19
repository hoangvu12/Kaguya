import { ReadContainerContextProvider } from "@/contexts/ReadContainerContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import React from "react";
import HorizontalContainer from "./HorizontalContainer";
import ImageNavigator from "./ImageNavigator";
import VerticalContainer from "./VerticalContainer";

const ReadContainer: React.FC = () => {
  const { direction } = useReadSettings();

  return (
    <ReadContainerContextProvider>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {direction === "vertical" ? (
          <VerticalContainer />
        ) : (
          <HorizontalContainer />
        )}

        <ImageNavigator />
      </div>
    </ReadContainerContextProvider>
  );
};

export default React.memo(ReadContainer);
