import classNames from "classnames";
import React from "react";
import BaseButton, { BaseButtonProps } from "./BaseButton";

const Button: React.FC<BaseButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <BaseButton
      className={classNames("px-3 py-2 rounded-md", className)}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

export default Button;
