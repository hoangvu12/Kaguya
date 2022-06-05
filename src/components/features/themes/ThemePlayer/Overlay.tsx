import PlayerOverlay from "@/components/features/anime/Player/Overlay";
import Loading from "@/components/shared/Loading";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import React from "react";
import ProgressSlider from "./ProgressSlider";

const Overlay = () => {
  const { isLoading } = useThemePlayer();

  return (
    <PlayerOverlay className="relative">
      <div className="w-full absolute top-0 z-50">
        <ProgressSlider />
      </div>

      {isLoading && <Loading />}
    </PlayerOverlay>
  );
};

export default Overlay;
