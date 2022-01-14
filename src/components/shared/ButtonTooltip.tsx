import React from "react";
import CircleButton, {
  CircleButtonProps,
} from "@/components/shared/CircleButton";
import Popup, { PopupProps } from "@/components/shared/Popup";

interface ButtonTooltipProps extends CircleButtonProps {
  tooltip?: React.ReactNode;
  popupProps?: PopupProps;
}

const ButtonTooltip: React.FC<ButtonTooltipProps> = ({
  tooltip,
  popupProps,
  children,
  ...props
}) => {
  return (
    <Popup
      reference={
        <CircleButton secondary {...props}>
          {children}
        </CircleButton>
      }
      className="!py-1.5 !px-2 text-sm"
      placement="top"
      showArrow
      {...popupProps}
    >
      {tooltip}
    </Popup>
  );
};

export default React.memo(ButtonTooltip);
