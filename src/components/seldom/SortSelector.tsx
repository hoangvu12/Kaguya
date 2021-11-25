import { SORTS } from "@/constants";
import { convert } from "@/utils/data";
import React, { useState } from "react";
import { RiArrowUpDownFill } from "react-icons/ri";
import Popup from "../shared/Popup";
import TextIcon from "../shared/TextIcon";

interface SortSelectorProps {
  onChange?: (item: string) => void;
  defaultValue?: string;
}

const SortSelector: React.FC<SortSelectorProps> = (props) => {
  const { onChange, defaultValue = "average_score" } = props;
  const [activeItem, setActiveItem] = useState(defaultValue);

  const handleClick = (item: string) => {
    setActiveItem(item);

    onChange(item);
  };

  return (
    <Popup
      type="click"
      reference={
        <TextIcon
          className="cursor-pointer text-gray-300 text-sm"
          LeftIcon={RiArrowUpDownFill}
          iconClassName="w-5 h-5"
        >
          <p>{convert(activeItem, "sort")}</p>
        </TextIcon>
      }
      placement="bottom-start"
    >
      <div className="space-y-2">
        {SORTS.map((sort, index) => (
          <p
            key={index}
            className="cursor-pointer text-sm text-gray-300 hover:text-primary-300 transition duration-300"
            onClick={() => handleClick(sort)}
          >
            {convert(sort, "sort")}
          </p>
        ))}
      </div>
    </Popup>
  );
};

export default SortSelector;
