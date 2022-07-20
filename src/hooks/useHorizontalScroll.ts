import { useEffect, useRef } from "react";

const useHorizontalScroll = <T extends HTMLElement>() => {
  const elRef = useRef<T>();

  useEffect(() => {
    const el = elRef.current;

    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      if (
        !(el.scrollLeft === 0 && e.deltaY < 0) &&
        !(
          el.scrollWidth - el.clientWidth - Math.round(el.scrollLeft) === 0 &&
          e.deltaY > 0
        )
      ) {
        e.preventDefault();
      }

      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "smooth",
      });
    };

    el.addEventListener("wheel", onWheel);

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return elRef;
};

export default useHorizontalScroll;
