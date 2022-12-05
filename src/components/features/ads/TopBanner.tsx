/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import nookies from "nookies";
import Script from "next/script";

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
    <React.Fragment>
      <div id="zone13156172"></div>

      <Script id="banner-pustimize">
        {`
          if (!window.PSTBanners) {(function() {var s = document.createElement("script");s.async = true;s.type = "text/javascript";s.src = 'https://api.trackpush.com/sdk/banner/v1.js?pid=QyD0YhFH-RJxSHM4XHVISQ';var n = document.getElementsByTagName("script")[0];n.parentNode.insertBefore(s, n);}());}var PSTBanners = window.PSTBanners || [];PSTBanners.push({zone:'zone13156172'});        
        `}
      </Script>
    </React.Fragment>
  ) : null;
};

export default TopBanner;
