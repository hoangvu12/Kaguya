import { Options } from "@popperjs/core";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { usePopper } from "react-popper";
import Portal from "@/components/shared/Portal";
import useDevice from "@/hooks/useDevice";

interface PopupProps {
  reference?: React.ReactNode;
  options?: Options;
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

const Popup: React.FC<PopupProps> = (props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { isMobile } = useDevice();

  const [hover, setHover] = useState(false);

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
    placement: "right-start",
    ...props.options,
  });

  const handleMouseEnter = () => {
    if (isMobile) return;

    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <React.Fragment>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={setReferenceElement}
        className={classNames(hover && "relative z-10")}
      >
        {props.reference}
      </div>

      <AnimatePresence exitBeforeEnter>
        {hover && (
          <React.Fragment>
            <Portal>
              <motion.div
                variants={variants}
                animate="animate"
                exit="exit"
                initial="initial"
                transition={[0.83, 0, 0.17, 1]}
                ref={setPopperElement}
                style={styles.popper}
                className="popup z-50 relatve bg-background-900 p-4 rounded-md drop-shadow-lg"
                {...attributes.popper}
              >
                {props.children}

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
