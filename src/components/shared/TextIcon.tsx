import classNames from "classnames";
import React from "react";

interface IconProps {
  className?: string;
}

interface TextIconProps {
  LeftIcon?: React.ComponentType<IconProps>;
  RightIcon?: React.ComponentType<IconProps>;
  iconClassName?: string;
  className?: string;
  as?: string | React.ComponentType<{ className: string }>;
}

const TextIcon: React.FC<TextIconProps> = ({
  iconClassName,
  LeftIcon,
  RightIcon,
  as: Component = "div",
  children,
  className,
}) => {
  const iconClass =
    !iconClassName?.includes("w-") || !iconClassName?.includes("h-")
      ? classNames("w-6 h-6", iconClassName)
      : iconClassName;

  return (
    <Component className={classNames("flex items-center space-x-1", className)}>
      {LeftIcon && <LeftIcon className={iconClass} />}
      {children}
      {RightIcon && <RightIcon className={iconClass} />}
    </Component>
  );
};

export default TextIcon;
