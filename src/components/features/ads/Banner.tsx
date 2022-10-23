import CircleButton from "@/components/shared/CircleButton";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const MAX_SHOW_TIME = 2;

const Banner = () => {
  const [isShow, setIsShow] = useState(true);
  const count = useRef(0);
  const router = useRouter();

  const handleClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const listener = () => {
      setIsShow(true);

      count.current++;
    };

    router.events.on("routeChangeComplete", listener);
  }, [router]);

  const shouldShow = isShow && count.current < MAX_SHOW_TIME;

  return (
    <div
      className={classNames(
        "z-[9999] banner-ads fixed bottom-4 left-1/2 -translate-x-1/2",
        !shouldShow && "hidden"
      )}
    >
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

export default Banner;
