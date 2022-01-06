import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <AiOutlineLoading3Quarters className="w-16 h-16 animate-spin text-primary-500" />
    </div>
  );
};

export default React.memo(Loading);
