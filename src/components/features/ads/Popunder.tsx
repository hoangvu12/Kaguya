import nookies from "nookies";
import { useEffect } from "react";

const POPUNDER_COOKIE = "kaguya_popunder";

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
          "https://www.highcpmrevenuenetwork.com/s0dzhz43?key=00598fec8df5e116c292f9f8bc3a7ae9",
          "kaguya_popunder"
        );

        pop.blur();

        window.focus();

        nookies.set(null, POPUNDER_COOKIE, "1", {
          // 7 days
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });
      }
    });
  }, []);

  return null;
};

export default Popunder;
