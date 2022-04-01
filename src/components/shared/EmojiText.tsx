import React from "react";

interface EmojiTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

const EmojiText = React.forwardRef<HTMLParagraphElement, EmojiTextProps>(
  ({ text, ...props }, ref) => {
    return (
      <p className="whitespace-pre-wrap" ref={ref} {...props}>
        {text}
      </p>
    );
  }
);

EmojiText.displayName = "EmojiText";

export default React.memo(EmojiText);
