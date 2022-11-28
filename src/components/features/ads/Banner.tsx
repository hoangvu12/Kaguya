/* eslint-disable @next/next/no-img-element */
import CircleButton from "@/components/shared/CircleButton";
import classNames from "classnames";
import nookies from "nookies";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const BANNER_COOKIE = "kaguya_banner";

const Banner = () => {
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const cookies = nookies.get(null, "");

    const willShow = !cookies[BANNER_COOKIE];

    setIsShow(willShow);

    if (willShow) {
      nookies.set(null, BANNER_COOKIE, "1", {
        // 2 days
        maxAge: 12 * 60 * 60,
        path: "/",
      });
    }
  }, []);

  return (
    <div
      className={classNames(
        "z-[9000] banner-ads catfish fixed bottom-4 left-1/2 -translate-x-1/2",
        !isShow && "hidden"
      )}
    >
      <a href="https://cwin999.com/?a=31913">
        <img
          src="https://dimg04.c-ctrip.com/images/0105112000a6gnddmBD7E.gif?proc=autoorient"
          alt="banner"
          className="min-w-[350px] min-h-[100px]"
        />
      </a>

      <CircleButton
        onClick={handleClose}
        className="!bg-background-600 absolute -top-5 -right-5"
        secondary
        iconClassName="w-8 h-8"
        LeftIcon={AiOutlineClose}
      />
    </div>
  );
};

export default React.memo(Banner);
