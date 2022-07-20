import CircleButton, {
  CircleButtonProps,
} from "@/components/shared/CircleButton";
import React from "react";

interface IconWithMutedProps extends CircleButtonProps {
  Icon: React.ComponentType<{ className: string }>;
  isMuted?: boolean;
}

const IconWithMuted: React.FC<IconWithMutedProps> = ({
  Icon,
  isMuted,
  ...props
}) => {
  return (
    <div className="relative">
      <CircleButton LeftIcon={Icon} secondary {...props} />

      {isMuted && (
        <div className="pointer-events-none w-1 h-8 rounded-full bg-red-500 border border-black rotate-45 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      )}
    </div>
  );
};

export default IconWithMuted;
