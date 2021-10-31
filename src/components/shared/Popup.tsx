import { Options, Placement } from "@popperjs/core";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { usePopper } from "react-popper";
import Portal from "@/components/shared/Portal";
import useDevice from "@/hooks/useDevice";

interface PopupProps {
  reference?: React.ReactNode;
  options?: Options;
  type?: "hover" | "click";
  placement?: Placement;
}

const variants = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },
};

const emptyFn = () => {};

const Popup: React.FC<PopupProps> = (props) => {
  const {
    children,
    options,
    reference,
    type = "hover",
    placement = "right-start",
  } = props;

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { isMobile } = useDevice();

  const [active, setActive] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "arrow",
        options: {
          element: arrowElement,
          padding: 20,
        },
      },
      {
        name: "offset",
        options: {
          offset: [10, 13],
        },
      },
    ],
    placement,
    ...options,
  });

  const handleMouseEnter = () => {
    if (isMobile) return;

    setActive(true);
  };

  const handleMouseLeave = () => {
    setActive(false);
  };

  const handleToggle = () => {
    setActive((prev) => !prev);
  };

  const handleDisable = () => {
    setActive(false);
  };

  const isHover = type === "hover";

  return (
    <React.Fragment>
      <div
        onClick={!isHover ? handleToggle : emptyFn}
        onMouseEnter={isHover ? handleMouseEnter : emptyFn}
        onMouseLeave={isHover ? handleMouseLeave : emptyFn}
        ref={setReferenceElement}
        className={classNames(active && "cursor-pointer relative z-10")}
      >
        {reference}
      </div>

      <AnimatePresence exitBeforeEnter>
        {active && (
          <React.Fragment>
            <Portal>
              {!isHover && (
                <div className="fixed inset-0" onClick={handleDisable}></div>
              )}

              <motion.div
                variants={variants}
                animate="animate"
                exit="exit"
                initial="initial"
                transition={[0.83, 0, 0.17, 1]}
                ref={setPopperElement}
                style={styles.popper}
                className="popup z-50 relative bg-background-900 p-4 rounded-md drop-shadow-lg max-w-[40vw]"
                {...attributes.popper}
              >
                {children}

                <div
                  className="popup__arrow"
                  ref={setArrowElement}
                  style={styles.arrow}
                />
              </motion.div>
            </Portal>
          </React.Fragment>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Popup;
