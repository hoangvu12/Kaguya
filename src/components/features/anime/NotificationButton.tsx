import CircleButton from "@/components/shared/CircleButton";
import React from "react";
import { AiOutlineBell } from "react-icons/ai";

const NotificationButton = () => {
  return (
    <CircleButton secondary iconClassName="w-6 h-6" LeftIcon={AiOutlineBell} />
  );
};

export default React.memo(NotificationButton);
