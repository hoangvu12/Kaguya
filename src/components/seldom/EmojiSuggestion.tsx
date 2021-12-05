import { emojiSearch } from "@/utils/emoji";
import classNames from "classnames";
import { EmojiData } from "emoji-mart";
import React, { useEffect, useRef } from "react";
import Emoji from "../shared/Emoji";
import useEventListener from "@/hooks/useEventListener";

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
  const [focusIndex, setFocusIndex] = React.useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  const [show, setShow] = React.useState(false);

  useEffect(() => {
    if (!text) return;

    const emojis = emojiSearch(text).slice(0, 10).reverse();

    setEmojis(emojis);
    setFocusIndex(emojis.length - 1);
  }, [text]);

  useEffect(() => {
    setShow(text[0] === ":" && text.length > 2);
  }, [text]);

  useEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "Enter"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  });

  useEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      const buttons = ref.current?.querySelectorAll("button");

      buttons[focusIndex]?.click();
    } else {
      setFocusIndex(e.keyCode === 38 ? focusIndex - 1 : focusIndex + 1);
    }
  });

  return !!emojis?.length && show ? (
    <React.Fragment>
      <div className={classNames("p-4", className)} {...props} ref={ref}>
        {emojis.map((emoji, index) => (
          <button
            onClick={() => {
              onClick(emoji);
            }}
            key={emoji.colons}
            className={classNames(
              "flex items-center w-full p-2 space-x-2 transition duration-300 rounded-md hover:bg-white/20",
              index === focusIndex && "bg-white/20"
            )}
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
