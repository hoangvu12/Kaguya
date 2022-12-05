/* eslint-disable @next/next/no-img-element */
import CircleButton from "@/components/shared/CircleButton";
import classNames from "classnames";
import Script from "next/script";
import nookies from "nookies";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const BANNER_COOKIE = "kaguya_banner";

const Banner = () => {
  // const [isShow, setIsShow] = useState(true);

  // const handleClose = () => {
  //   setIsShow(false);
  // };

  // useEffect(() => {
  //   const cookies = nookies.get(null, "");

  //   const willShow = !cookies[BANNER_COOKIE];

  //   setIsShow(willShow);

  //   if (willShow) {
  //     nookies.set(null, BANNER_COOKIE, "1", {
  //       // 2 days
  //       maxAge: 12 * 60 * 60,
  //       path: "/",
  //     });
  //   }
  // }, []);

  // return isShow ? (
  //   <div
  //     className={classNames(
  //       "z-[9000] banner-ads catfish fixed bottom-4 left-1/2 -translate-x-1/2",
  //       !isShow && "hidden"
  //     )}
  //   >

  //     <CircleButton
  //       onClick={handleClose}
  //       className="!bg-background-600 absolute -top-5 -right-5"
  //       secondary
  //       iconClassName="w-8 h-8"
  //       LeftIcon={AiOutlineClose}
  //     />
  //   </div>
  // ) : null;

  return null;
};

export default React.memo(Banner);
