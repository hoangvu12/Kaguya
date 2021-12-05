import { emojiToHTMLImage } from "@/utils/emoji";
import React from "react";
import ContentEditable, {
  ContentEditableEvent,
  Props,
} from "react-contenteditable";

interface EmojiTextProps extends Omit<Props, "onChange" | "html" | "ref"> {
  text: string;
  html?: string;
  onChange?: (text: ContentEditableEvent) => void;
}

const emptyFn = () => {};

const textToEmojiHTML = (text: string) => {
  return text
    .replace(/&nbsp;/g, " ")
    .split(" ")
    .map((word) => {
      if (word[0] !== ":" || word[word.length - 1] !== ":") return word;

      const html = emojiToHTMLImage(word);

      return html || word;
    })
    .join(" ");
};

const EmojiText: React.FC<EmojiTextProps> = ({ text, ...props }) => {
  return (
    <ContentEditable
      onChange={emptyFn}
      html={textToEmojiHTML(text)}
      {...props}
    />
  );
};

export default React.memo(EmojiText);
