import classNames from "classnames";
import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import isHotKey from "is-hotkey";
export interface BaseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  LeftIcon?: React.ComponentType<{ className: string }>;
  RightIcon?: React.ComponentType<{ className: string }>;
  iconClassName?: string;
  primary?: boolean;
  outline?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
  ) => void;
  shortcutKey?: string;
  isLoading?: boolean;
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
      disabled = false,
      children,
      onClick,
      shortcutKey,
      isLoading,
      ...rest
    } = props;

    useEffect(() => {
      if (!shortcutKey) return;

      const handleShortcutKey = (e: KeyboardEvent) => {
        if (isHotKey(shortcutKey, { byKey: true })(e)) {
          onClick?.(null);
        }
      };

      window.addEventListener("keypress", handleShortcutKey);

      return () => {
        window.removeEventListener("keypress", handleShortcutKey);
      };
    }, [onClick, shortcutKey]);

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
        buttonClassName = "border-solid border-2 border-white";
      } else {
        buttonClassName = "bg-white";
      }
    }

    return (
      <button
        type="button"
        className={classNames(
          "transition duration-300",
          (isLoading || disabled) && "text-gray-300 cursor-not-allowed",
          className,
          buttonClassName,
          (LeftIcon || RightIcon || isLoading) && "gap-x-2"
        )}
        onClick={(e) => {
          if (disabled) return;

          onClick?.(e);
        }}
        ref={ref}
        {...rest}
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters
            className={classNames(iconClass, "animate-spin")}
          />
        ) : (
          LeftIcon && <LeftIcon className={iconClass} />
        )}
        {children}
        {RightIcon && <RightIcon className={iconClass} />}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";

export default BaseButton;
