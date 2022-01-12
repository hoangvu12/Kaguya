import React, { useEffect } from "react";
import ReactSelect, { Props, components } from "react-select";

const MoreSelectedBadge = ({ items }) => {
  const title = items.join(", ");
  const length = items.length;
  const label = `+${length}`;

  return (
    <p title={title} className="p-1 text-sm bg-background-700 rounded-sm">
      {label}
    </p>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 1;
  const overflow = getValue()
    .slice(maxToShow)
    .map((x: any) => x.label);

  return index < maxToShow ? (
    // @ts-ignore
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};

const Select = React.forwardRef<any, Props>((props, ref) => {
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement>();

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  return (
    <ReactSelect
      ref={ref}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "#ef4444",
          primary75: "#f87171",
          primary50: "#fca5a5",
          primary20: "#fecaca",
        },
      })}
      styles={{
        control: (provided) => {
          return {
            ...provided,
            backgroundColor: "#1a1a1a",
            minWidth: "12rem",
            maxWidth: "14rem",
          };
        },
        menu: (provided) => {
          return { ...provided, backgroundColor: "#1a1a1a" };
        },
        singleValue: (provided) => {
          return { ...provided, color: "#fff" };
        },
        option: (provided, state) => {
          return {
            ...provided,
            backgroundColor: state.isFocused
              ? "rgba(255,255,255,0.2)"
              : provided.backgroundColor,
          };
        },
        multiValue: (provided) => {
          return {
            ...provided,
            backgroundColor: "#262626",
            maxWidth: "70%",
          };
        },
        multiValueLabel: (provided) => {
          return { ...provided, color: "white" };
        },
        multiValueRemove: (provided) => {
          return {
            ...provided,
            color: "gray",
            ":hover": {
              backgroundColor: "transparent",
              color: "white",
            },
            transition: "all 300ms",
          };
        },

        input: (provided) => {
          return { ...provided, color: "white" };
        },
      }}
      hideSelectedOptions={false}
      noOptionsMessage={() => "Không còn lựa chọn"}
      components={{ MultiValue }}
      isClearable
      menuPortalTarget={portalTarget}
      {...props}
    />
  );
});

Select.displayName = "Select";

export default React.memo(Select);
