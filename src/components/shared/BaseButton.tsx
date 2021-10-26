import classNames from "classnames";
import React from "react";

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  LeftIcon?: React.ComponentType<{ className: string }>;
  RightIcon?: React.ComponentType<{ className: string }>;
  iconClassName?: string;
  as?: string | React.ComponentType<{ className: string }>;
  primary?: boolean;
  outline?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  className,
  iconClassName,
  LeftIcon,
  RightIcon,
  as: Component = "button",
  primary = false,
  outline = false,
  children,
  ...props
}) => {
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
    <Component
      className={classNames(
        "transition duration-300",
        className,
        buttonClassName
      )}
      {...props}
    >
      {LeftIcon && <LeftIcon className={iconClass} />}
      {children}
      {RightIcon && <RightIcon className={iconClass} />}
    </Component>
  );
};

export default BaseButton;
