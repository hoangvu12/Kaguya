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
