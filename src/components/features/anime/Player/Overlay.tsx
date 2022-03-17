import ClientOnly from "@/components/shared/ClientOnly";
import classNames from "classnames";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import DesktopOverlay from "./DesktopOverlay";
import MobileOverlay from "./MobileOverlay";
import Settings from "./Settings";

const variants = { show: { opacity: 1 }, hide: { opacity: 0 } };

interface OverlayProps {
  showControls: boolean;
}

const Overlay: React.FC<OverlayProps & HTMLMotionProps<"div">> = ({
  className,
  showControls,
  ...props
}) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {showControls && (
        <motion.div
          variants={variants}
          initial="hide"
          animate="show"
          exit="hide"
          className={classNames(
            "video-overlay absolute inset-0 w-full z-30",
            className
          )}
          {...props}
        >
          <ClientOnly>
            <BrowserView renderWithFragment>
              <DesktopOverlay />
            </BrowserView>

            <MobileView renderWithFragment>
              <MobileOverlay />

              <div className="absolute top-10 right-10">
                <Settings />
              </div>
            </MobileView>
          </ClientOnly>

          <div className="absolute z-50">{props.children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
