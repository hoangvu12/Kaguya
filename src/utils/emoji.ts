import {
  Emoji,
  EmojiProps,
  EmojiData,
  CustomEmoji,
  emojiIndex,
} from "emoji-mart";
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

export const emojiSearch = (text: string) => {
  const matchedCustomEmojis = customEmojis.filter((emoji) =>
    emoji.colons.includes(text)
  );

  const matchedEmojis = emojiIndex.search(text.replace(/:/g, ""));

  return [...matchedCustomEmojis, ...(matchedEmojis || [])];
};

export const emojiToHTMLImage = (
  emojiObject: CustomEmoji | EmojiData | string
) => {
  const emojiSize = 20;

  const emojiText =
    typeof emojiObject === "string" ? emojiObject : emojiObject.colons;

  const emojiProps: PropsWithChildren<EmojiProps> = {
    emoji: emojiText,
    size: emojiSize,
    html: true,
    set: "facebook",
  };

  const originalHTMLEmoji = emoji(emojiProps);

  const regex = /style='(.*?)'/g;

  const styles = regex.exec(originalHTMLEmoji);

  if (!styles) return null;

  // Remove `:` because CommentInput use `:` to figure out which emoji.
  const htmlEmojiText = `data-emoji-text="${emojiText.replace(/:/g, "")}"`;

  const htmlEmoji = `<img style='${styles[1]}' ${htmlEmojiText} src="${TRANSPARENT_GIF}" />`;

  return htmlEmoji;
};

export const getMostOccuringEmojis = (emojis: string[]) => {
  const emojiOccurences = emojis.reduce((acc, emoji) => {
    if (acc[emoji]) {
      acc[emoji] += 1;
    } else {
      acc[emoji] = 1;
    }

    return acc;
  }, {} as Record<string, number>);

  const sortedEmojis = Object.keys(emojiOccurences).sort(
    (a, b) => emojiOccurences[b] - emojiOccurences[a]
  );

  return sortedEmojis;
};
