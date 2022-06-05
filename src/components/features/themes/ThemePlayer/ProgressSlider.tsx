import React from "react";
import PlayerProgressSlider from "@/components/features/anime/Player/ProgressSlider";

const ProgressSlider = () => {
  return (
    <PlayerProgressSlider
      hideDot
      className="!h-1 hover:!h-3 transition-all duration-300"
      innerClassName="!h-1 hover:!h-3 transition-all duration-300"
    />
  );
};

export default ProgressSlider;
