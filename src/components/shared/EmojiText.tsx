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

const noop = () => {};

const EmojiText = React.forwardRef<
  ContentEditable & HTMLDivElement,
  EmojiTextProps
>(({ text, ...props }, ref) => {
  return <ContentEditable onChange={noop} html={text} ref={ref} {...props} />;
});

EmojiText.displayName = "EmojiText";

export default React.memo(EmojiText);
