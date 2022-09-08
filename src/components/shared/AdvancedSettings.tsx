import classNames from "classnames";
import React from "react";
import { GoSettings } from "react-icons/go";
import Popup, { PopupProps } from "./Popup";

const AdvancedSettings: React.FC<PopupProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Popup
      reference={
        <GoSettings className="text-white p-2 rounded-sm bg-background-800 w-10 h-10 hover:bg-white/20 transition duration-300 border border-white/80" />
      }
      type="click"
      className={classNames("rounded-md p-8 !bg-background-900", className)}
      placement="bottom"
      {...props}
    >
      {children}
    </Popup>
  );
};

export default AdvancedSettings;
