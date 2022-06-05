import React from "react";
import PlayerProgressSlider from "@/components/features/anime/Player/ProgressSlider";
import classNames from "classnames";
import { isDesktop } from "react-device-detect";

const ProgressSlider = () => {
  return (
    <PlayerProgressSlider
      hideDot
      className={classNames(
        isDesktop ? "!h-1 hover:!h-3" : "!h-3",
        "transition-all duration-300"
      )}
      innerClassName={classNames(
        isDesktop ? "!h-1 hover:!h-3" : "!h-3",
        "transition-all duration-300"
      )}
    />
  );
};

export default ProgressSlider;
