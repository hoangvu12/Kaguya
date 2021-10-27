import classNames from "classnames";
import React from "react";
import BaseButton, { BaseButtonProps } from "./BaseButton";

const CircleButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    return (
      <BaseButton
        className={classNames(
          "p-2 rounded-full",
          className,
          props.primary
            ? "hover:bg-primary-500"
            : "hover:bg-white hover:text-black"
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </BaseButton>
    );
  }
);

export default CircleButton;
