import classNames from "classnames";
import { useState, useEffect, useCallback } from "react";

interface ToggleProps {
  onToggle?: (isOn: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ onToggle }) => {
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    onToggle?.(toggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  const handleToggle = useCallback(() => {
    setToggle((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center border-none focus:ring-0">
      <button
        className={classNames(
          "md:w-10 md:h-5 w-9 h-4 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 border-none focus:ring-0",
          toggle ? "bg-primary-500" : "bg-gray-400"
        )}
        onClick={handleToggle}
      >
        <div
          className={classNames(
            "bg-white md:w-4 md:h-4 h-3 w-3 rounded-full shadow-md transform duration-300 ease-in-out border-none focus:ring-0",
            toggle && "translate-x-full"
          )}
        ></div>
      </button>
    </div>
  );
};

export default Toggle;
