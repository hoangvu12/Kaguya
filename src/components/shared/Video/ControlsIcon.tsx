import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

export interface ControlsIconProps extends HTMLMotionProps<"button"> {
  Icon: React.ComponentType<{ width: any; height: any; size?: number }>;
  width?: any;
  height?: any;
  onClick?: () => void;
}

const ControlsIcon: React.FC<ControlsIconProps> = ({
  Icon,
  width = "2rem",
  height = "2rem",
  onClick,
  ...props
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.25 }}
      tabIndex={-1}
      {...props}
    >
      <Icon
        width={width}
        height={height}
        size={width.replace("rem", "") * 16}
      />
    </motion.button>
  );
};

export default React.memo(ControlsIcon);
