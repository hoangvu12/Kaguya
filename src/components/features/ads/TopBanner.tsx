/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import nookies from "nookies";

const USER_COOKIE = "sb-access-token";

const TopBanner = () => {
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    const cookies = nookies.get(null);

    if (cookies?.[USER_COOKIE]) {
      setIsShow(false);

      return;
    }
  }, []);

  return isShow ? (
    <a
      className="top-banner-ads flex justify-center items-center my-4 md:my-8"
      href="https://cwin999.com/?a=31913"
    >
      <img
        src="https://dimg04.c-ctrip.com/images/0106b12000a52uc1746E2.gif?proc=autoorient"
        alt="top-banner"
      />
    </a>
  ) : null;
};

export default TopBanner;
