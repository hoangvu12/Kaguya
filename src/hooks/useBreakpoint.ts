import BREAKPOINTS from "@/constants/breakpoints";
import { useEffect, useState } from "react";

const useBreakpoint = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const breakpoint = Object.keys(BREAKPOINTS)
    .sort((a, b) => Number(b) - Number(a))
    .find((breakpoint) => screenWidth >= Number(breakpoint));

  return BREAKPOINTS[Number(breakpoint) as keyof typeof BREAKPOINTS];
};

export default useBreakpoint;
