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
          "https://augailou.com/4/5547870",
          "kaguya_popunder"
        );

        pop.blur();

        window.focus();

        nookies.set(null, POPUNDER_COOKIE, "1", {
          // 3 hours
          maxAge: 3 * 60 * 60,
          path: "/",
        });
      }
    });
  }, []);

  return null;
};

export default Popunder;
