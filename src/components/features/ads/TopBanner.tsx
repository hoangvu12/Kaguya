import { useRouter } from "next/router";
import Script from "next/script";
import nookies from "nookies";
import { useEffect, useState } from "react";

const USER_COOKIE = "sb-access-token";

const TopBanner = () => {
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get(null);

    const userCookie = cookies?.[USER_COOKIE];

    if (!userCookie) {
      setIsShow(true);
    }
  }, []);

  useEffect(() => {
    // @ts-ignore
    const PSTBanners = (window.PSTBanners = window.PSTBanners || []);

    PSTBanners.push({
      zone: "zone18629245",
      options: { gamClick: "%%CLICK_URL_UNESC%%" },
    });
  }, [router.asPath]);

  return isShow ? (
    <div className="my-4">
      <div id="zone18629245"></div>

      <Script
        id="pushtimize-banner-src"
        async
        type="text/javascript"
        src="https://api.trackpush.com/sdk/banner/v1.js?pid=QyD0YhFH-RJxSHM4XHVISQ"
      />
    </div>
  ) : null;
};

export default TopBanner;
