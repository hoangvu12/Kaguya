/* eslint-disable @next/next/no-img-element */
import CircleButton from "@/components/shared/CircleButton";
import Image from "@/components/shared/Image";
import classNames from "classnames";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const BANNER_COOKIE = "kaguya_banner";

const Banner = () => {
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    setIsShow(false);
  };

  return isShow ? (
    <div
      className={classNames(
        "z-[9000] banner-ads catfish fixed bottom-4 left-1/2 -translate-x-1/2"
      )}
    >
      <div className="relative w-[90vw] h-[50px] md:w-[728px] md:h-[90px]">
        <a
          href={
            "https://affpa.top/L?tag=d_1947233m_97c__[]general[]_d85116_l87833_catfish&site=1947233&ad=97&r=line/Football/"
          }
          target="_blank"
          rel="noreferrer"
        >
          <Image
            layout="fill"
            objectFit="cover"
            src="/catfish.gif"
            className="w-full h-full"
            unoptimized
            alt="Catfish banner"
          />
        </a>
      </div>

      <CircleButton
        onClick={handleClose}
        className="!bg-background-600 absolute -top-5 -right-5"
        secondary
        iconClassName="w-8 h-8"
        LeftIcon={AiOutlineClose}
        title="Close banner ad"
      />
    </div>
  ) : null;
};

export default React.memo(Banner);
