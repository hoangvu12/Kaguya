import React from "react";
import CircleButton, {
  CircleButtonProps,
} from "@/components/shared/CircleButton";
import Popup, { PopupProps } from "@/components/shared/Popup";

interface ButtonTooltipProps extends CircleButtonProps {
  tooltip?: React.ReactNode;
  popupProps?: PopupProps;
  reference?: React.ReactNode;
}

const ButtonTooltip: React.FC<ButtonTooltipProps> = ({
  tooltip,
  popupProps,
  children,
  reference,
  ...props
}) => {
  const buttonReference = reference || (
    <CircleButton secondary {...props}>
      {children}
    </CircleButton>
  );

  return (
    <Popup
      reference={buttonReference}
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
