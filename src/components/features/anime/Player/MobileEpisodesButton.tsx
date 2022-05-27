import EpisodesIcon from "@/components/icons/EpisodesIcon";
import React, { Children, useCallback } from "react";
import Portal from "@/components/shared/Portal";
import MobileControlsIcon from "@/components/features/anime/Player/MobileControlsIcon";
import { useVideoProps } from "netplayer";

interface MobileEpisodesButtonProps {
  children(
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): React.ReactNode;
}

const MobileEpisodesButton: React.FC<MobileEpisodesButtonProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { i18n } = useVideoProps();

  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div>
      <MobileControlsIcon
        title={i18n.controls.episodes as string}
        Icon={EpisodesIcon}
        onClick={handleClick}
      />

      <Portal selector=".netplayer-container">
        {children(isOpen, setIsOpen)}
      </Portal>
    </div>
  );
};

export default MobileEpisodesButton;
