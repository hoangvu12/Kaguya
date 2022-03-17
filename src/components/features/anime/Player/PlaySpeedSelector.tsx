import NestedMenu from "@/components/shared/NestedMenu";
import { useVideo } from "@/contexts/VideoContext";
import React from "react";
import { MdOutlineSpeed } from "react-icons/md";

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlaySpeedSelector = () => {
  const { videoEl } = useVideo();

  const handleChangeSpeed = (speed: number) => () => {
    videoEl.playbackRate = speed;
  };

  return (
    <NestedMenu.SubMenu
      title="Tốc độ phát"
      Icon={MdOutlineSpeed}
      menuKey="play-speed"
      activeItemKey={videoEl.playbackRate.toString()}
    >
      {speeds.map((speed) => (
        <NestedMenu.Item
          title={`${speed}x`}
          key={speed}
          itemKey={speed.toString()}
          onClick={handleChangeSpeed(speed)}
        />
      ))}
    </NestedMenu.SubMenu>
  );
};

export default PlaySpeedSelector;
