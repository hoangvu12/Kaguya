import BREAKPOINTS from "@/constants/breakpoints";
import { useEffect, useMemo, useState } from "react";

const useBreakpoint = (
  breakpoints: typeof BREAKPOINTS = BREAKPOINTS,
  element?: Element
) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(element ? element.clientWidth : window.innerWidth);

    const handleResize = () => {
      setWidth(element ? element.clientWidth : window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [element]);

  const breakpoint = useMemo(
    () =>
      Object.keys(breakpoints)
        .sort((a, b) => Number(b) - Number(a))
        .find((breakpoint) => width >= Number(breakpoint)),
    [breakpoints, width]
  );

  return breakpoints[Number(breakpoint) as keyof typeof breakpoints];
};

export default useBreakpoint;
