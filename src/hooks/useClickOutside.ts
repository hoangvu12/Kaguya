import React, { useEffect } from "react";

const useClickOutside = (
  ref: React.MutableRefObject<any>,
  callback: () => void
) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useClickOutside;
