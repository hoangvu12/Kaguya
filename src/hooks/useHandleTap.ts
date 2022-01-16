import { TapHandlers, TapInfo } from "framer-motion";
import { useRef } from "react";

interface UseHandleTapProps {
  onTap?: TapHandlers["onTap"];
  onDoubleTap?: TapHandlers["onTap"];
  tapThreshold?: number;
  doubleTapCondition?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: TapInfo
  ) => boolean;
}

const useHandleTap = ({
  onTap,
  onDoubleTap,
  tapThreshold = 300,
  doubleTapCondition = () => true,
}: UseHandleTapProps) => {
  const lastTap = useRef(0);
  const timeout = useRef<NodeJS.Timeout>();

  const handleTap: TapHandlers["onTap"] = (...args) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    const now = new Date().getTime();
    const timeFromLastTap = now - lastTap.current;

    if (
      timeFromLastTap <= tapThreshold &&
      timeFromLastTap > 0 &&
      doubleTapCondition?.(...args)
    ) {
      onDoubleTap?.(...args);

      clearTimeout(timeout.current);
    } else {
      timeout.current = setTimeout(() => {
        onTap?.(...args);
      }, tapThreshold);
    }

    lastTap.current = new Date().getTime();
  };

  return handleTap;
};

export default useHandleTap;
