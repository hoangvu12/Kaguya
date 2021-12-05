import { emojiSearch } from "@/utils/emoji";
import classNames from "classnames";
import { EmojiData } from "emoji-mart";
import React, { useEffect } from "react";
import Emoji from "../shared/Emoji";

interface EmojiSuggestionProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "onClick"> {
  text: string;
  onClick?: (emoji: EmojiData) => void;
}

const EmojiSuggestion: React.FC<EmojiSuggestionProps> = ({
  text,
  className,
  onClick,
  ...props
}) => {
  const [emojis, setEmojis] = React.useState<EmojiData[]>([]);

  const [show, setShow] = React.useState(false);

  useEffect(() => {
    if (!text) return;

    setEmojis(emojiSearch(text).slice(0, 10).reverse());
  }, [text]);

  useEffect(() => {
    setShow(text[0] === ":" && text.length > 2);
  }, [text]);

  return !!emojis?.length && show ? (
    <React.Fragment>
      <div className={classNames("p-4", className)} {...props}>
        {emojis.map((emoji) => (
          <button
            onClick={() => {
              onClick(emoji);
            }}
            key={emoji.colons}
            className="flex items-center w-full p-2 space-x-2 transition duration-300 rounded-md hover:bg-white/20"
          >
            <Emoji emoji={emoji.colons} size={20} />

            <p className="text-base">{emoji.colons}</p>
          </button>
        ))}
      </div>

      <div className="fixed inset-0 z-40" onClick={() => setShow(false)}></div>
    </React.Fragment>
  ) : null;
};

export default React.memo(EmojiSuggestion);
