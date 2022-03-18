import NestedMenu from "@/components/shared/NestedMenu";
import { useVideo } from "@/contexts/VideoContext";
import useDevice from "@/hooks/useDevice";
import React from "react";
import { MdOutlineSpeed } from "react-icons/md";

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlaySpeedSelector = () => {
  const { videoEl } = useVideo();
  const { isMobile } = useDevice();

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
      {isMobile ? (
        <select
          className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-white bg-background-800 bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
        focus:text-white focus:bg-background-700 focus:border-primary-500 focus:outline-none"
          onChange={(e) => {
            const playSpeed = e.target.value as string;

            handleChangeSpeed(Number(playSpeed))();
          }}
        >
          {speeds.map((speed) => (
            <option
              selected={videoEl.playbackRate === speed}
              key={speed}
              value={speed}
            >
              {speed}x
            </option>
          ))}
        </select>
      ) : (
        speeds.map((speed) => (
          <NestedMenu.Item
            title={`${speed}x`}
            key={speed}
            itemKey={speed.toString()}
            onClick={handleChangeSpeed(speed)}
          />
        ))
      )}
    </NestedMenu.SubMenu>
  );
};

export default PlaySpeedSelector;
