import { emojiToHTMLImage } from "@/utils/emoji";
import React from "react";
import ContentEditable, { Props } from "react-contenteditable";

interface EmojiTextProps extends Omit<Props, "onChange" | "html" | "ref"> {
  text: string;
}

const emptyFn = () => {};

const textToEmojiHTML = (text: string) => {
  return text
    .split(" ")
    .map((word) => {
      if (word[0] === ":" && word[word.length - 1] === ":") {
        return emojiToHTMLImage(word);
      }

      return word;
    })
    .join(" ");
};

const EmojiText: React.FC<EmojiTextProps> = ({ text, ...props }) => {
  return (
    <ContentEditable
      onChange={emptyFn}
      disabled
      html={textToEmojiHTML(text)}
      {...props}
    />
  );
};

export default React.memo(EmojiText);
