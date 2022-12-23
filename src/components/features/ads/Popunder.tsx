import React, { useEffect } from "react";
import nookies from "nookies";

const POPUNDER_COOKIE = "kaguya_popunder";
const POPUNDER_2_COOKIE = "kaguya_popunder_2";

const USER_COOKIE = "sb-access-token";

const Popunder = () => {
  useEffect(() => {
    window.addEventListener("click", () => {
      const cookies = nookies.get(null, "");

      if (cookies[USER_COOKIE]) {
        return;
      }

      if (!cookies[POPUNDER_COOKIE]) {
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
      } else if (!cookies[POPUNDER_2_COOKIE]) {
        const pop = window.open(
          "https://titlerwilhelm.com/iKCkliQLULWeSQav/59532",
          "kaguya_popunder_2"
        );

        pop.blur();

        window.focus();

        nookies.set(null, POPUNDER_2_COOKIE, "1", {
          // 1 days
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });
      }
    });
  }, []);

  return null;
};

export default Popunder;
