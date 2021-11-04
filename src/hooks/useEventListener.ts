import { useRef, useEffect } from "react";

function useEventListener(
  eventName: keyof WindowEventMap | keyof DocumentEventMap | string,
  handler: (event: any) => any,
  element?: any
) {
  const savedHandler = useRef<(event: any) => any>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!element) element = window;

    const isSupported = element && element.addEventListener;

    if (!isSupported) return;

    const eventListener = (event: any) => {
      if (!savedHandler.current) return;

      savedHandler.current(event);
    };

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName]);
}

export default useEventListener;
