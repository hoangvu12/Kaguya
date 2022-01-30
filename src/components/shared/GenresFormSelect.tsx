import React, { useCallback, useMemo } from "react";
import Select from "./Select";
import { GENRES } from "@/constants";
import TAGS from "@/tags.json";
import { Props } from "react-select";
import classNames from "classnames";

const genres = GENRES.map((genre) => ({
  value: genre.value as string,
  label: genre.label,
}));

const tags = TAGS.map((tag) => ({
  value: tag,
  label: tag,
}));

const groups = [
  { label: "Thể loại", options: genres },
  { label: "Tags", options: tags },
] as const;

const styles = {
  groupHeading: (provided) => {
    return {
      ...provided,
      fontSize: "90%",
      color: "#ccc",
      fontWeight: 600,
    };
  },
};

type OnChangeValue = {
  type: "TAGS" | "GENRES";
  value: string[];
};

interface GenresFormSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  onChange?: (values: OnChangeValue[]) => void;
  selectProps?: Omit<Props, "onChange">;
}

const GenresFormSelect: React.FC<GenresFormSelectProps> = ({
  value = [],
  onChange = () => {},
  selectProps,
  className,
  ...props
}) => {
  const selectValue = useMemo(
    () =>
      groups
        .map((group) => group.options)
        .flat()
        .filter((option) => value.includes(option.value)),
    [value]
  );

  const handleSelectChange = useCallback(
    (values: any) => {
      const tags = [];
      const genres = [];

      values.forEach(({ value }) => {
        const group = groups.find((group) =>
          group.options.find((option) => option.value === value)
        );

        if (group.label === "Tags") {
          tags.push(value);
        } else {
          genres.push(value);
        }
      });

      onChange([
        { type: "TAGS", value: tags },
        { type: "GENRES", value: genres },
      ]);
    },
    [onChange]
  );

  return (
    <div className={classNames("space-y-2", className)} {...props}>
      <p className="font-semibold">Thể loại</p>

      <Select
        value={selectValue}
        onChange={handleSelectChange}
        isMulti
        options={groups}
        placeholder="Thể loại"
        styles={styles}
        {...selectProps}
      />
    </div>
  );
};

export default React.memo(GenresFormSelect);
