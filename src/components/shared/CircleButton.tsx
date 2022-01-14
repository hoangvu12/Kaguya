import classNames from "classnames";
import React from "react";
import BaseButton, { BaseButtonProps } from "@/components/shared/BaseButton";

export interface CircleButtonProps extends BaseButtonProps {
  secondary?: boolean;
}

const CircleButton = React.forwardRef<HTMLButtonElement, CircleButtonProps>(
  (props, ref) => {
    const { children, className, secondary, ...rest } = props;

    return (
      <BaseButton
        className={classNames(
          "p-2 rounded-full",
          className,
          props.primary
            ? "hover:bg-primary-500"
            : props.secondary
            ? "bg-transparent hover:bg-white/20"
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

CircleButton.displayName = "CircleButton";

export default CircleButton;
