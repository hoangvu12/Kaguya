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
  const regex = /:([^\s-]\w{2,}?):/g;
  const cleanText = text.replace(/&nbsp;/g, " ");

  return cleanText.replace(regex, (match) => {
    const emoji = emojiToHTMLImage(match);

    return emoji || match;
  });
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
