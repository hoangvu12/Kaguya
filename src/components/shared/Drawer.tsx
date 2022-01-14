import classNames from "classnames";
import { AnimatePresence, motion, Transition, Variants } from "framer-motion";
import React, { useImperativeHandle, useState } from "react";
import { ImCross } from "react-icons/im";
import Portal from "@/components/shared/Portal";

interface DrawerProps {
  button: React.ReactNode;
  className?: string;
  containerClassName?: string;
  buttonClassName?: string;
  overlayClassName?: string;
  children: React.ReactNode;
}

const overlayVariants: Variants = {
  enter: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },

  initial: {
    opacity: 0,
  },
};

const drawerVariants: Variants = {
  initial: {
    x: "-100%",
  },

  enter: {
    x: 0,
  },

  exit: {
    x: "-100%",
  },
};

const transition: Transition = {
  ease: "easeInOut",
};

export type DrawerRef = {
  close: () => void;
  open: () => void;
};

const Drawer = React.forwardRef<DrawerRef, DrawerProps>((props, ref) => {
  const {
    button,
    children,
    className,
    containerClassName,
    buttonClassName,
    overlayClassName,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  useImperativeHandle(
    ref,
    () => ({
      close: handleClose,
      open: handleOpen,
    }),
    []
  );

  return (
    <div className={classNames(containerClassName)}>
      <button className={classNames(buttonClassName)} onClick={handleOpen}>
        {button}
      </button>

      <Portal>
        <AnimatePresence exitBeforeEnter>
          {isOpen && (
            <React.Fragment>
              {/* Overlay */}
              <motion.div
                className={classNames(
                  "z-[9999] fixed inset-0 bg-black/80",
                  overlayClassName
                )}
                onClick={handleClose}
                variants={overlayVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={transition}
              />

              {/* Drawer */}
              <motion.div
                className={classNames(
                  "z-[9999] bg-background-900 y fixed top-0 w-[70vw] max-w-[360px] pb-16 md:pb-0 h-screen left-0",
                  className
                )}
                variants={drawerVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={transition}
              >
                <button
                  className="absolute right-4 top-3"
                  onClick={handleClose}
                >
                  <ImCross className="w-5 h-5 text-gray-500" />
                </button>

                {children}
              </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
});

Drawer.displayName = "Drawer";

export default Drawer;
