/* eslint-disable @next/next/no-img-element */
import CircleButton from "@/components/shared/CircleButton";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import nookies from "nookies";

const PRELOAD_COOKIE = "kaguya_preload";
const USER_COOKIE = "sb-access-token";

const Preload = () => {
  // const [isShow, setIsShow] = useState(true);

  // const handleClose = () => {
  //   setIsShow(false);
  // };

  // useEffect(() => {
  //   const cookies = nookies.get(null);
  //   let shownTime = 0;

  //   shownTime = Number(cookies?.[PRELOAD_COOKIE]);

  //   shownTime = isNaN(shownTime) ? 0 : shownTime;

  //   if (shownTime >= 3 || cookies?.[USER_COOKIE]) {
  //     setIsShow(false);

  //     return;
  //   }

  //   nookies.set(null, PRELOAD_COOKIE, String(shownTime + 1), {
  //     // 3 hours
  //     maxAge: 3 * 60 * 60,
  //     path: "/",
  //   });
  // }, []);

  // return isShow ? (
  //   <div className="banner-ads fixed inset-0 z-[9999]">
  //     <div
  //       className="bg-black/60 absolute inset-0 z-40"
  //       onClick={handleClose}
  //     ></div>

  //     <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
  //       <a href="https://cwin999.com/?a=31913">
  //         <img
  //           src="https://dimg04.c-ctrip.com/images/0103g12000a6gnn1o868B.gif?proc=autoorient"
  //           alt="preload"
  //           className="min-w-[250px] min-h-[250px]"
  //         />
  //       </a>

  //       <CircleButton
  //         onClick={handleClose}
  //         className="!bg-background-600 absolute -top-5 -right-5"
  //         secondary
  //         iconClassName="w-8 h-8"
  //         LeftIcon={AiOutlineClose}
  //       />
  //     </div>
  //   </div>
  // ) : null;

  // Currently no active ads
  return null;
};

export default Preload;
