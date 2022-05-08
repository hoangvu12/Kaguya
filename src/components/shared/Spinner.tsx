import classNames from "classnames";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  const iconClass =
    !className?.includes("w-") || !className?.includes("h-")
      ? classNames("w-16 h-16 animate-spin text-primary-500", className)
      : className;

  return <AiOutlineLoading3Quarters className={iconClass} />;
};

export default React.memo(Spinner);
