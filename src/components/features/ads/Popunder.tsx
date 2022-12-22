import React, { useEffect } from "react";
import nookies from "nookies";

const POPUNDER_COOKIE = "kaguya_popunder";
const USER_COOKIE = "sb-access-token";

const Popunder = () => {
  useEffect(() => {
    window.addEventListener("click", () => {
      const cookies = nookies.get(null, "");

      if (cookies[POPUNDER_COOKIE] || cookies[USER_COOKIE]) {
        return;
      }

      const pop = window.open(
        "https://txzaazmdhtw.com/SWC/SWC.php?c=1957946",
        "kaguya_popunder"
      );

      pop.blur();

      window.focus();

      nookies.set(null, POPUNDER_COOKIE, "1", {
        // 1 days
        maxAge: 1 * 24 * 60 * 60,
        path: "/",
      });
    });
  }, []);

  return null;
};

export default Popunder;
