import NestedMenu from "@/components/shared/NestedMenu";
import Popup from "@/components/shared/Popup";
import React from "react";
import { FiSettings } from "react-icons/fi";
import ControlsIcon from "./ControlsIcon";
import PlaySpeedSelector from "./PlaySpeedSelector";
import QualitySelector from "./QualitySelector";

const Settings = () => {
  return (
    <Popup
      portalSelector=".video-wrapper"
      reference={<ControlsIcon whileTap={{ rotate: 360 }} Icon={FiSettings} />}
      referenceClassName="h-8"
      placement="top"
      offset={[0, 15]}
      showArrow
      type="click"
      className="w-96"
    >
      <NestedMenu>
        <PlaySpeedSelector />
        <QualitySelector />
      </NestedMenu>
    </Popup>
  );
};

export default Settings;
