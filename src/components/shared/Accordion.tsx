import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useCallback, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const contentVariants: Variants = {
  animate: {
    height: "auto",
  },
  initial: {
    height: 0,
  },
};

interface AccordionProps {
  label: string;
  buttonClassName?: string;
  labelSlot?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  label,
  buttonClassName,
  labelSlot,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <div>
      <button
        className={classNames("p-4 relative w-full", buttonClassName)}
        onClick={handleClick}
      >
        {label}

        {labelSlot}

        <FiChevronDown
          className={classNames(
            "absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 transition duration-300",
            expanded ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            variants={contentVariants}
            animate="animate"
            initial="initial"
            exit="initial"
            className="overflow-hidden"
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
