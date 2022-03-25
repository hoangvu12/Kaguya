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

export const textToEmojiHTML = (text: string) => {
  const regex = /:((?!image\/gif)[^\s-]\w{1,}.*?):/g;

  return text
    .replace(regex, (match) => {
      // Transparent image source, check @/utils/emoji.ts
      if (match.includes(":image/gif;base64")) return match;

      const emoji = emojiToHTMLImage(match);

      return emoji || match;
    })
    .replace(/\n/g, "<br />");
};

export const isEmojiOnly = (text: string) => {
  const emojiText = textToEmojiHTML(text);

  return emojiText.startsWith("<img");
};

const EmojiText = React.forwardRef<
  ContentEditable & HTMLDivElement,
  EmojiTextProps
>(({ text, ...props }, ref) => {
  return (
    <ContentEditable
      onChange={emptyFn}
      html={textToEmojiHTML(text)}
      ref={ref}
      {...props}
    />
  );
});

EmojiText.displayName = "EmojiText";

export default React.memo(EmojiText);
