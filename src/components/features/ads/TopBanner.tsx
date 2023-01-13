/* eslint-disable @next/next/no-img-element */

import Script from "next/script";
import React, { useEffect, useState } from "react";
import nookies from "nookies";

const USER_COOKIE = "sb-access-token";

const TopBanner = () => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const cookies = nookies.get(null);

    const userCookie = cookies?.[USER_COOKIE];

    if (!userCookie) {
      setIsShow(true);
    }
  }, []);

  return isShow ? (
    <div className="my-4">
      <div id="zone18629245"></div>
      <Script id="pushtimize-banner">
        {`
          if (!window.PSTBanners) {(function() {var s = document.createElement("script");s.async = true;s.type = "text/javascript";s.src = 'https://api.trackpush.com/sdk/banner/v1.js?pid=QyD0YhFH-RJxSHM4XHVISQ';var n = document.getElementsByTagName("script")[0];n.parentNode.insertBefore(s, n);}());}var PSTBanners = window.PSTBanners || [];PSTBanners.push({zone:'zone18629245',options:{gamClick:'%%CLICK_URL_UNESC%%'}});
        `}
      </Script>
    </div>
  ) : null;
};

export default TopBanner;
