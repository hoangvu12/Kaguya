import classNames from "classnames";
import React from "react";

interface Icon {
  className?: string;
}

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  containerClassName?: string;
  containerInputClassName?: string;
  labelClassName?: string;
  LeftIcon?: React.ComponentType<Icon>;
  RightIcon?: React.ComponentType<Icon>;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    containerClassName,
    containerInputClassName,
    labelClassName,
    LeftIcon,
    RightIcon,
    className,
    ...inputProps
  } = props;

  return (
    <div className={containerClassName}>
      {label && (
        <p className={classNames("mb-2 font-semibold", labelClassName)}>
          {label}
        </p>
      )}

      <div
        className={classNames(
          "shadow flex items-center space-x-2 bg-background-800 focus:ring focus:ring-primary-500 focus:shadow-outline rounded",
          LeftIcon || RightIcon ? "px-3 py-2" : "py-1",
          containerInputClassName
        )}
      >
        {LeftIcon && <LeftIcon className="w-6 h-6" />}

        <input
          ref={ref}
          className={classNames(
            "bg-transparent appearance-none w-full text-gray-300 focus:outline-none leading-tight",
            className
          )}
          {...inputProps}
        />

        {RightIcon && <RightIcon className="w-6 h-6" />}
      </div>
    </div>
  );
});

Input.displayName = "Input";

export default React.memo(Input);
