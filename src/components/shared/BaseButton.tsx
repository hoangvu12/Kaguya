import classNames from "classnames";
import React from "react";

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  LeftIcon?: React.ComponentType<{ className: string }>;
  RightIcon?: React.ComponentType<{ className: string }>;
  iconClassName?: string;
  primary?: boolean;
  outline?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    const {
      className,
      iconClassName,
      LeftIcon,
      RightIcon,
      primary = false,
      outline = false,
      children,
      ...rest
    } = props;

    // If class name contains 'w-' or 'h-' then override default className
    const iconClass =
      !iconClassName?.includes("w-") || !iconClassName?.includes("h-")
        ? classNames("w-6 h-6", iconClassName)
        : iconClassName;

    let buttonClassName;

    if (primary) {
      if (outline) {
        buttonClassName = "border-2 border-primary-500";
      } else {
        buttonClassName = "bg-primary-500";
      }
    } else {
      if (outline) {
        buttonClassName = "border-2 border-white";
      } else {
        buttonClassName = "bg-white";
      }
    }

    return (
      <button
        className={classNames(
          "transition duration-300",
          className,
          buttonClassName
        )}
        ref={ref}
        {...rest}
      >
        {LeftIcon && <LeftIcon className={iconClass} />}
        {children}
        {RightIcon && <RightIcon className={iconClass} />}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";

export default BaseButton;
