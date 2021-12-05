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

// Type workaround
export const emoji = (props: PropsWithChildren<EmojiProps>) => {
  // @ts-ignore
  return Emoji(props) as string;
};

export const emojiToHTMLImage = (emojiObject: CustomEmoji | EmojiData) => {
  const emojiSize = 20;

  const emojiProps: PropsWithChildren<EmojiProps> = {
    emoji: emojiObject.colons,
    size: emojiSize,
    html: true,
    set: "facebook",
  };

  const customEmoji = customEmojis.find(
    (emoji) => emoji.colons === emojiObject.colons
  );

  if (customEmoji && "imageUrl" in emojiObject) {
    return `
    <img
        style='width: ${emojiSize}px; height: ${emojiSize}px; display: inline-block; background-image: url("${emojiObject.imageUrl}"); background-size: cover;'
        data-emoji-colons="${emojiObject.colons}" src="${TRANSPARENT_GIF}"
    />
    `;
  }

  const originalHTMLEmoji = emoji(emojiProps);

  const regex = /style='(.*?)'/g;

  const styles = regex.exec(originalHTMLEmoji);

  const htmlEmoji = `<img style='${styles[1]}' data-emoji-colons="${emojiObject.colons}" src="${TRANSPARENT_GIF}" />`;

  return htmlEmoji;
};
