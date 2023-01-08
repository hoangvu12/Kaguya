import Script from "next/script";
import nookies from "nookies";
import { useEffect, useState } from "react";

const POPUNDER_COOKIE = "kaguya_popunder";

const USER_COOKIE = "sb-access-token";

const Popunder = () => {
  // const [isShow, setIsShow] = useState(false);

  // useEffect(() => {
  //   const cookies = nookies.get(null);

  //   if (cookies[USER_COOKIE]) return;

  //   nookies.set(null, POPUNDER_COOKIE, "1", {
  //     // 1 hour
  //     maxAge: 1 * 60 * 60,
  //     path: "/",
  //   });

  //   setIsShow(true);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("click", () => {
  //     const cookies = nookies.get(null, "");

  //     if (cookies[USER_COOKIE]) {
  //       return;
  //     }

  //     if (!cookies[POPUNDER_COOKIE]) {
  //       const pop = window.open(
  //         "https://expressalike.com/ix11ckfx?key=74c92179396e4e64485963798b0f0996",
  //         "kaguya_popunder"
  //       );

  //       pop.blur();

  //       window.focus();

  //       nookies.set(null, POPUNDER_COOKIE, "1", {
  //         // 3 hours
  //         maxAge: 3 * 60 * 60,
  //         path: "/",
  //       });
  //     }
  //   });
  // }, []);

  // return isShow ? (
  //   <Script
  //     data-cfasync="false"
  //     src="//dnks065sb0ww6.cloudfront.net/?ssknd=974102"
  //   ></Script>
  // ) : null;

  return (
    <Script
      type="text/javascript"
      src="https://popunderstar.com/integration/lib.js?w=1447&frequency=1800"
    ></Script>
  );
};

export default Popunder;
