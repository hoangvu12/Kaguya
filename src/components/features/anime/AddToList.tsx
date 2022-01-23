import Select from "@/components/shared/Select";
import React from "react";

const styles = {
  control: (provided, state) => {
    return {
      ...provided,
      borderWidth: "0px",
      backgroundColor: state.theme.colors.primary,
      flexGrow: 1,
      cursor: "pointer",
    };
  },
  placeholder: (provided) => {
    return {
      ...provided,
      color: "white",
    };
  },
  dropdownIndicator: (provided) => {
    return {
      ...provided,
      color: "white",
      ":hover": {
        color: "white",
      },
    };
  },
};

const components = {
  IndicatorSeparator: () => null,
};

const options = [
  {
    value: "watching",
    label: "Đang xem",
  },
  {
    value: "planning",
    label: "Dự định xem",
  },
  {
    value: "completed",
    label: "Đã xem",
  },
];

const AddToList = () => {
  return (
    <Select
      placeholder="Thêm vào"
      styles={styles}
      className="grow z-50"
      options={options}
      isClearable={false}
      isSearchable={false}
      components={components}
    />
  );
};

export default React.memo(AddToList);
