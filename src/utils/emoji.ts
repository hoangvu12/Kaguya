import { Emoji, EmojiProps, EmojiData, CustomEmoji } from "emoji-mart";
import { PropsWithChildren } from "react";

const TRANSPARENT_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const customEmojis: CustomEmoji[] = [
  {
    name: "Kaguya",
    short_names: ["kaguya"],
    colons: ":kaguya:",
    imageUrl: "https://i.postimg.cc/kMfZwQHm/logo-3-2-1.png",
  },
];

export const emoji = (props: PropsWithChildren<EmojiProps>) => {
  const customEmoji = customEmojis.find(
    (emoji) => emoji.colons === props.emoji
  );

  if (customEmoji) {
    props.emoji = customEmoji;
  }

  // @ts-ignore
  return Emoji(props) as string;
};

export const emojiToHTMLImage = (
  emojiObject: CustomEmoji | EmojiData | string
) => {
  const emojiSize = 20;

  const colons =
    typeof emojiObject === "string" ? emojiObject : emojiObject.colons;

  const emojiProps: PropsWithChildren<EmojiProps> = {
    emoji: colons,
    size: emojiSize,
    html: true,
    set: "facebook",
  };

  const originalHTMLEmoji = emoji(emojiProps);

  const regex = /style='(.*?)'/g;

  const styles = regex.exec(originalHTMLEmoji);

  const htmlEmoji = `<img style='${styles[1]}' data-emoji-colons="${colons}" src="${TRANSPARENT_GIF}" />`;

  return htmlEmoji;
};
