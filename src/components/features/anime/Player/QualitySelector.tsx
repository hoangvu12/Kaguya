import NestedMenu from "@/components/shared/NestedMenu";
import { useVideoState } from "@/contexts/VideoStateContext";
import React from "react";
import { MdOutlineHighQuality } from "react-icons/md";

const QualitiesSelector = () => {
  const { state, setState } = useVideoState();

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
      {state?.qualities.map((quality) => (
        <NestedMenu.Item
          title={quality}
          key={quality}
          itemKey={quality}
          onClick={handleQualityChange(quality)}
        />
      ))}
    </NestedMenu.SubMenu>
  );
};

export default React.memo(QualitiesSelector);
