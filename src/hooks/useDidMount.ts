import { useEffect } from "react";
import useHandlerSetterRef from "@/hooks/useHandlerSetterRef";
import { CallbackSetter, Noop } from "@/types";

/**
 * Returns a callback setter for a function to be performed when the component did mount.
 */
const useDidMount = <T extends (...args: any[]) => any = Noop>(
  callback?: T
): CallbackSetter<T> => {
  const [handler, setHandler] = useHandlerSetterRef<T>(callback);

  useEffect(() => {
    if (handler.current) {
      handler.current();
    }
  }, [handler]);

  return setHandler;
};

export default useDidMount;
