import { useEffect } from "react";
import Router, { useRouter } from "next/router";

const useBeforeLeave = (
  callback: () => any,
  isAllowed: (currentUrl: string, navigateUrl: string) => any
) => {
  const router = useRouter();

  useEffect(() => {
    const currentUrl = router.asPath;

    const handleRouteChange = (url: string) => {
      if (isAllowed(currentUrl, url)) {
        callback();
      }
    };

    window.addEventListener("beforeunload", callback);
    Router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", callback);
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [callback, router, isAllowed]);
};

export default useBeforeLeave;
