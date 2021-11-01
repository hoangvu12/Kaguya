import { useEffect, useRef } from "react";

const useDidMount = (fn: () => void, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) return fn();

    didMount.current = true;
  }, [didMount, fn]);
};

export default useDidMount;
