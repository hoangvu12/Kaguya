import Button from "@/components/shared/Button";
import Popup from "@/components/shared/Popup";
import useReactions from "@/hooks/useReactions";
import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import Reaction from "./Reaction";

export interface ReactionSelectorProps {
  toggleReaction: (reactionType: string) => void;
}

const ReactionSelector: React.FC<ReactionSelectorProps> = ({
  toggleReaction,
}) => {
  const reactions = useReactions();
  return (
    <Popup
      placement="bottom"
      type="click"
      reference={
        <Button secondary LeftIcon={BsEmojiSmile} iconClassName="w-5 h-5" />
      }
      className="bg-background-700 px-0 py-0.5"
    >
      <div className="flex items-center gap-2 flex-wrap">
        {reactions.data?.map((reaction) => (
          <Popup
            className="p-0.5"
            placement="top-end"
            reference={
              <button
                className="p-1 rounded-full hover:scale-105 transition duration-300"
                onClick={() => toggleReaction(reaction.type)}
              >
                <Reaction type={reaction.type} />
              </button>
            }
            key={reaction.type}
          >
            <p>{reaction.label}</p>
          </Popup>
        ))}
      </div>
    </Popup>
  );
};

export default ReactionSelector;
