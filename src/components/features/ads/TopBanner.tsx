/* eslint-disable @next/next/no-img-element */
import nookies from "nookies";
import { useEffect, useState } from "react";

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
    <div className="w-full flex items-center justify-center">
      <div className="my-8 w-[90vw] h-[50px] md:w-[728px] md:h-[90px]">
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            atOptions = {
              'key' : 'ca1799991e38f241a2d0c28782278d0e',
              'format' : 'iframe',
              'height' : 90,
		          'width' : 728,
              'params' : {}
            };
          `,
          }}
        />

        <script
          type="text/javascript"
          src="https://www.effectivecreativeformat.com/ca1799991e38f241a2d0c28782278d0e/invoke.js"
        />
      </div>
    </div>
  ) : null;

  return null;
};

export default TopBanner;
