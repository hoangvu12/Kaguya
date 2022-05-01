import useConstantTranslation from "@/hooks/useConstantTranslation";
import { ChatEvent } from "@/types";
import React from "react";

interface EventMessageProps {
  event: ChatEvent;
}

const EventMessage: React.FC<EventMessageProps> = ({ event }) => {
  const { CHAT_EVENT_TYPES } = useConstantTranslation();

  return (
    <p className="text-center italic text-gray-400 text-xs">
      <strong>{event.user?.user_metadata?.name || "Một người khách"} </strong>

      {CHAT_EVENT_TYPES[event.eventType]}
    </p>
  );
};

export default React.memo(EventMessage);
