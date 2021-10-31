import useClickOutside from "@/hooks/useClickOutside";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import Input from "./Input";
import Portal from "./Portal";

interface SelectItem {
  value: string;
  placeholder: string;
}

interface SelectProps {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  defaultItem?: SelectItem;
  data: SelectItem[];
  onChange?: (item: SelectItem) => void;
}

const variants: Variants = {
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const emptyFn = () => {};

const Select: React.FC<SelectProps> = (props) => {
  const {
    label,
    labelClassName,
    containerClassName,
    inputClassName,
    data,
    defaultItem = { placeholder: "Tất cả", value: "" },
    onChange,
  } = props;

  const ref = useRef();
  const { isDesktop } = useDevice();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(defaultItem || data[0]);

  useEffect(() => {
    setQuery("");
    setIsOpen(false);
    onChange?.(activeItem);
  }, [activeItem, onChange]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  useClickOutside(ref, () => setIsOpen(false));

  const filteredItems = [defaultItem, ...data].filter(
    ({ value, placeholder }) => {
      const keyword = query.toLowerCase();

      return (
        value.includes(keyword) || placeholder.toLowerCase().includes(keyword)
      );
    }
  );

  return (
    <div ref={ref} className={classNames(containerClassName)}>
      {label && (
        <p className={classNames("mb-2 font-semibold", labelClassName)}>
          {label}
        </p>
      )}

      <div className="relative">
        <Input
          placeholder={activeItem.placeholder}
          className={classNames(
            "shadow appearance-none rounded w-full py-2 px-3 text-gray-300 placeholder-gray-300 bg-background-800 leading-tight focus:ring focus:ring-primary-500 focus:outline-none focus:shadow-outline",
            inputClassName
          )}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onClick={!isDesktop ? handleClick : emptyFn}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();

            handleToggle();
          }}
          className="absolute top-1/2 -translate-y-1/2 right-3"
          type="button"
        >
          <BsChevronExpand className="w-5 h-5" />
        </button>

        <AnimatePresence exitBeforeEnter>
          {isOpen &&
            (isDesktop ? (
              <motion.ul
                variants={variants}
                transition={{ ease: "linear" }}
                animate="enter"
                exit="exit"
                initial="exit"
                className="scroll-bar overflow-y-scroll max-h-[50vh] space-y-2 bg-background-800 absolute z-50 top-full mt-2 w-full p-2"
              >
                {filteredItems.length ? (
                  filteredItems.map((item, index) => (
                    <li
                      key={index}
                      className="cursor-pointer rounded-sm hover:bg-background-900 hover:text-primary-300 text-semibold p-2 transition duration-300"
                      onClick={() => setActiveItem(item)}
                    >
                      {item.placeholder}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-sm">Không tìm thấy kết quả</p>
                )}
              </motion.ul>
            ) : (
              <Portal>
                <motion.div
                  variants={variants}
                  animate="enter"
                  exit="exit"
                  initial="exit"
                  className="fixed z-50 inset-0 bg-black/60"
                ></motion.div>

                <motion.ul
                  variants={variants}
                  transition={{ ease: "linear" }}
                  animate="enter"
                  exit="exit"
                  initial="exit"
                  className="block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll w-[80vw] h-[60vh] bg-background-800 z-[9999] text-center"
                >
                  {filteredItems.length ? (
                    filteredItems.map((item, index) => (
                      <li
                        key={index}
                        className="text-2xl cursor-pointer rounded-sm hover:bg-background-900 hover:text-primary-300 text-semibold p-2 transition duration-300"
                        onClick={() => setActiveItem(item)}
                      >
                        {item.placeholder}
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-sm">
                      Không tìm thấy kết quả
                    </p>
                  )}
                </motion.ul>
              </Portal>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Select;
