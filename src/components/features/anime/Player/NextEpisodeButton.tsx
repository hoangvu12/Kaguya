import NextIcon from "@/components/icons/NextIcon";
import React from "react";
import Popup from "@/components/shared/Popup";
import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import { useHotkeys } from "react-hotkeys-hook";

interface NextEpisodeButtonProps {
  className?: string;
  onClick?: () => void;
}

const NextEpisodeButton: React.FC<NextEpisodeButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  useHotkeys("shift+n", onClick, [onClick]);

  return (
    <Popup
      portalSelector=".video-wrapper"
      reference={<ControlsIcon Icon={NextIcon} onClick={onClick} />}
      referenceClassName="h-8"
      placement="top-start"
      offset={[-15, 15]}
      showArrow={false}
      type="hover"
      className={className}
    >
      <p className="rounded-sm">Tập tiếp theo</p>
    </Popup>
  );
};

export default React.memo(NextEpisodeButton);
