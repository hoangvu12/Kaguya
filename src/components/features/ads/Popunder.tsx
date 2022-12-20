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
        "https://bg4nxu2u5t.com/ERT/ERT.php?c=1944171",
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
