import CircleButton from "@/components/shared/CircleButton";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Banner = () => {
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    setIsShow(false);
  };

  return (
    isShow && (
      <div className="z-[9999] banner-ads fixed bottom-4 left-1/2 -translate-x-1/2">
        <CircleButton
          onClick={handleClose}
          className="!bg-background-600 absolute -top-5 -right-5"
          secondary
          iconClassName="w-8 h-8"
          LeftIcon={AiOutlineClose}
        />
      </div>
    )
  );
};

export default Banner;
