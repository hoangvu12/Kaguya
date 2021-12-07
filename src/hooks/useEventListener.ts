import { useRef, useEffect } from "react";

function useEventListener(
  eventName: keyof WindowEventMap | keyof DocumentEventMap | string,
  handler: (event: any) => any,
  element?: string | Element | Window
) {
  const savedHandler = useRef<(event: any) => any>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!element) element = window;

    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    const isSupported = element && element.addEventListener;

    if (!isSupported) return;

    const eventListener = (event: any) => {
      if (!savedHandler.current) return;

      savedHandler.current(event);
    };

    element.addEventListener(eventName, eventListener);

    return () => {
      if (typeof element !== "object") return;
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

export default useEventListener;
