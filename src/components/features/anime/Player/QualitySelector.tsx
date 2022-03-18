import NestedMenu from "@/components/shared/NestedMenu";
import { useVideoState } from "@/contexts/VideoStateContext";
import useDevice from "@/hooks/useDevice";
import React from "react";
import { MdOutlineHighQuality } from "react-icons/md";

const QualitiesSelector = () => {
  const { state, setState } = useVideoState();
  const { isMobile } = useDevice();

  const handleQualityChange = (qualitiy: string) => () => {
    setState((prev) => ({ ...prev, currentQuality: qualitiy }));
  };

  return (
    <NestedMenu.SubMenu
      title="Chất lượng"
      Icon={MdOutlineHighQuality}
      menuKey="quality"
      activeItemKey={state.currentQuality}
    >
      {isMobile ? (
        <select
          className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-white bg-background-800 bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
        focus:text-white focus:bg-background-700 focus:border-primary-500 focus:outline-none"
          onChange={(e) => {
            const quality = e.target.value as string;

            handleQualityChange(quality)();
          }}
        >
          {state?.qualities.map((quality) => (
            <option
              selected={quality === state.currentQuality}
              key={quality}
              value={quality}
            >
              {quality}
            </option>
          ))}
        </select>
      ) : (
        state?.qualities.map((quality) => (
          <NestedMenu.Item
            title={quality}
            key={quality}
            itemKey={quality}
            onClick={handleQualityChange(quality)}
          />
        ))
      )}
    </NestedMenu.SubMenu>
  );
};

export default React.memo(QualitiesSelector);
