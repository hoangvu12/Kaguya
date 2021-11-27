import useClickOutside from "@/hooks/useClickOutside";
import useDevice from "@/hooks/useDevice";
import useDidMount from "@/hooks/useDidMount";
import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsChevronExpand } from "react-icons/bs";
import ClientOnly from "./ClientOnly";
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
  defaultValue?: string;
  data: SelectItem[];
  onChange?: (item: SelectItem["value"]) => void;
  value?: string;
}

const variants: Variants = {
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const defaultOptionItem = { placeholder: "Tất cả", value: "" };

const Select: React.FC<SelectProps> = (props) => {
  const {
    label,
    labelClassName,
    containerClassName,
    inputClassName,
    data,
    defaultItem = defaultOptionItem,
    defaultValue,
    onChange,
    value = data[0].value,
  } = props;
  const customDefaultItem = data.find((item) => item.value === defaultValue);

  const ref = useRef();
  const { isDesktop, isMobile } = useDevice();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    customDefaultItem || defaultItem
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const handleInputChange = useCallback((e: any) => {
    setQuery(e.target.value);
  }, []);

  const handleItemChange = useCallback(
    (item) => {
      setIsOpen(false);
      onChange?.(item.value);
      setActiveItem(item);
      setQuery(item.placeholder);
    },
    [onChange]
  );

  useClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    setActiveItem(data.find((item) => item.value === value));
  }, [value, data]);

  // If mobile, don't filter the data
  const filteredItems = useMemo<SelectItem[]>(
    () =>
      [defaultItem, ...data].filter(({ value, placeholder }) => {
        if (!value || !placeholder) return false;

        if (isMobile) return true;

        const keyword = query.toLowerCase();

        return (
          value.includes(keyword) || placeholder.toLowerCase().includes(keyword)
        );
      }),
    [data, query, isMobile, defaultItem]
  );

  return (
    <div className={classNames(containerClassName)}>
      {label && (
        <p className={classNames("mb-2 font-semibold", labelClassName)}>
          {label}
        </p>
      )}

      <div className="relative" ref={ref}>
        {!isMobile ? (
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
          />
        ) : (
          <ClientOnly>
            <button
              type="button"
              className={classNames(
                "shadow appearance-none rounded w-52 h-10 py-2 px-3 text-gray-300 placeholder-gray-300 bg-background-800 leading-tight focus:ring focus:ring-primary-500 focus:outline-none focus:shadow-outline",
                inputClassName
              )}
              onClick={handleToggle}
            ></button>

            <p className="absolute left-0 top-1/2 -translate-y-1/2 line-clamp-1 px-3">
              {activeItem.placeholder}
            </p>
          </ClientOnly>
        )}

        <button
          onClick={handleToggle}
          className="absolute top-1/2 -translate-y-1/2 right-3"
          type="button"
        >
          <BsChevronExpand className="w-5 h-5" />
        </button>

        <AnimatePresence exitBeforeEnter>
          {isOpen &&
            (isDesktop ? (
              <SelectItems
                className="scroll-bar overflow-y-scroll max-h-[50vh] space-y-2 bg-background-800 absolute z-50 top-full mt-2 w-full p-2"
                items={filteredItems}
                onChange={handleItemChange}
              />
            ) : (
              <Portal>
                <motion.div
                  variants={variants}
                  animate="enter"
                  exit="exit"
                  initial="exit"
                  className="fixed z-50 inset-0 bg-black/60"
                ></motion.div>

                <SelectItems
                  className="block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll w-[80vw] h-[60vh] bg-background-800 z-[9999] text-center"
                  items={filteredItems}
                  onChange={handleItemChange}
                />
              </Portal>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface SelectItemsProps {
  items: SelectItem[];
  className?: string;
  onChange: (item: SelectItem) => any;
}

const SelectItems: React.FC<SelectItemsProps> = ({
  items,
  className,
  onChange,
}) => {
  const handleItemClick = (item) => () => onChange(item);

  return (
    <motion.ul
      variants={variants}
      transition={{ ease: "linear" }}
      animate="enter"
      exit="exit"
      initial="exit"
      className={className}
    >
      {items.length ? (
        items.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer rounded-sm hover:bg-background-900 hover:text-primary-300 text-semibold p-2 transition duration-300"
            onClick={handleItemClick(item)}
          >
            {item.placeholder}
          </li>
        ))
      ) : (
        <p className="text-center text-sm">Không tìm thấy kết quả</p>
      )}
    </motion.ul>
  );
};

export default React.memo(Select);
