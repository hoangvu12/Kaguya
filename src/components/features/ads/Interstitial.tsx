import React, { useEffect, useState } from "react";
import nookies from "nookies";
import Script from "next/script";

const INTERSTITIAL_COOKIE = "kaguya_interstitial";
const USER_COOKIE = "sb-access-token";

const Interstitial = () => {
  // const [isShow, setIsShow] = useState(false);

  // useEffect(() => {
  //   const cookies = nookies.get(null);
  //   let shownTime = 0;

  //   shownTime = Number(cookies?.[INTERSTITIAL_COOKIE]);

  //   shownTime = isNaN(shownTime) ? 0 : shownTime;

  //   if (shownTime >= 3 || cookies?.[USER_COOKIE]) {
  //     return;
  //   }

  //   nookies.set(null, INTERSTITIAL_COOKIE, String(shownTime + 1), {
  //     // 3 hours
  //     maxAge: 3 * 60 * 60,
  //     path: "/",
  //   });

  //   setIsShow(true);
  // }, []);

  // No ads
  return null;
};

export default Interstitial;
