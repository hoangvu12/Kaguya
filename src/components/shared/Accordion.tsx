import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BiDownArrowAlt } from "react-icons/bi";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
}

const variants = {
  initial: {
    opacity: 0,
    height: 0,
  },
  enter: {
    opacity: 1,
    height: "auto",
  },
  exit: {
    opacity: 0,
    height: 0,
  },
};

const Accordion: React.FC<AccordionProps> = ({
  className,
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOnClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="accordion">
      <div
        className={classNames(
          "bg-background-800 flex items-center w-full px-4 rounded-md h-12 cursor-pointer",
          isOpen && "mb-4"
        )}
        onClick={handleOnClick}
      >
        <p>{title}</p>
      </div>

      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={classNames(className)}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
