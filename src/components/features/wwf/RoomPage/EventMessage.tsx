import { ChatEvent } from "@/types";
import React from "react";

interface EventMessageProps {
  event: ChatEvent;
}

const typeMessages = {
  join: "đã tham gia phòng",
  leave: "đã rời phòng",
  play: "đã bắt đầu phát",
  pause: "đã tạm dừng phát",
  changeEpisode: "đã chuyển tập",
};

const EventMessage: React.FC<EventMessageProps> = ({ event }) => {
  return (
    <p className="text-center italic text-gray-400 text-xs">
      <strong>{event.user?.user_metadata?.name || "Một người khách"} </strong>

      {typeMessages[event.eventType]}
    </p>
  );
};

export default React.memo(EventMessage);
