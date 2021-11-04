import { useVideoOptions } from "@/contexts/VideoOptionsContext";
import React from "react";
import { FiSettings } from "react-icons/fi";
import { FcCheckmark } from "react-icons/fc";
import Popup from "../Popup";
import ControlsIcon from "./ControlsIcon";

const QualitiesSelector = () => {
  const { options, setOptions } = useVideoOptions();

  const handleQualityChange = (qualitiy: number) => () => {
    setOptions((prev) => ({ ...prev, currentQuality: qualitiy }));
  };

  return options?.qualities.length ? (
    <Popup
      portalSelector=".video-wrapper"
      reference={<ControlsIcon whileTap={{ rotate: 360 }} Icon={FiSettings} />}
      referenceClassName="h-8"
      placement="top-start"
      offset={[-15, 15]}
      showArrow
      type="click"
      className="!p-0 w-40 !py-4 text-center"
    >
      <p className="mb-8">Chất lượng</p>

      <ul className="space-y-2">
        {options?.qualities.map((quality) => (
          <li
            className="relative cursor-pointer py-2 hover:bg-white/20 transition duration-300 text-white"
            onClick={handleQualityChange(quality)}
            key={quality}
          >
            {options.currentQuality === quality && (
              <FcCheckmark className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-5" />
            )}
            {quality}p
          </li>
        ))}
      </ul>
    </Popup>
  ) : null;
};

export default React.memo(QualitiesSelector);
