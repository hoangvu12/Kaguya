import Select from "@/components/shared/Select";
import { READ_STATUS, WATCH_STATUS } from "@/constants";
import useModifySourceStatus from "@/hooks/useModifySourceStatus";
import useSourceStatus from "@/hooks/useSourceStatus";
import { Anime, Manga } from "@/types";
import React from "react";
import { AiFillPlusCircle, AiOutlineLoading3Quarters } from "react-icons/ai";

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
  dropdownIndicator: (provided) => {
    return {
      ...provided,
      color: "white",
      ":hover": {
        color: "white",
      },
    };
  },
  singleValue: (provided) => {
    return {
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    };
  },
  placeholder: (provided) => {
    return {
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    };
  },
};

const components = {
  IndicatorSeparator: () => null,
  DropdownIndicator: () => null,
};

interface SourceStatusProps<T> {
  type: T;
  source: T extends "anime" ? Anime : Manga;
}

const SourceStatus = <T extends "anime" | "manga">(
  props: SourceStatusProps<T>
) => {
  const { source, type } = props;

  const { data: status, isLoading } = useSourceStatus(type, source);
  const statusMutation = useModifySourceStatus(type, source);

  const options = type === "anime" ? WATCH_STATUS : READ_STATUS;

  const onChange = ({ value }) => {
    statusMutation.mutate(value);
  };

  return isLoading ? (
    <div className="grow z-50 bg-primary-500 flex items-center justify-center py-2 rounded-md">
      <AiOutlineLoading3Quarters className="w-6 h-6 text-white animate-spin" />
    </div>
  ) : (
    <Select
      placeholder={
        <div className="flex items-center space-x-2">
          <AiFillPlusCircle className="w-6 h-6" />

          <p>Danh sách</p>
        </div>
      }
      styles={styles}
      className="grow z-50"
      options={options}
      isClearable={false}
      isSearchable={false}
      components={components}
      onChange={onChange}
      defaultValue={
        status?.status
          ? // @ts-ignore
            options.find((option) => option.value === status.status)
          : null
      }
    />
  );
};

export default React.memo(SourceStatus) as typeof SourceStatus;
