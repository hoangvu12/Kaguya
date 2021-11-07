import { useEffect } from "react";
import Router from "next/router";

const useBeforeLeave = (callback: () => any) => {
  useEffect(() => {
    window.addEventListener("beforeunload", callback);
    Router.events.on("routeChangeStart", callback);

    return () => {
      window.removeEventListener("beforeunload", callback);
      Router.events.off("routeChangeStart", callback);
    };
  }, [callback]);
};

export default useBeforeLeave;
