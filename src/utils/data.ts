import {
  ANIME_SORTS,
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  MANGA_SORTS,
  SEASONS,
  STATUS,
} from "@/constants";
import { Anime, Chapter, Episode, Manga, Media } from "@/types";
import { parseNumbersFromString } from ".";

const constants = {
  season: SEASONS,
  format: FORMATS,
  status: STATUS,
  genre: GENRES,
  characterRole: CHARACTERS_ROLES,
  animeSort: ANIME_SORTS,
  mangaSort: MANGA_SORTS,
};

export const convert = (
  text: string,
  type: keyof typeof constants,
  reverse: boolean = false
) => {
  const constant = constants[type];

  const index = constant.findIndex(
    (el: typeof constant[number]) => el.value === text || el.label === text
  );

  if (index === -1) return null;

  if (reverse) return constant[index].value;

  return constant[index].label;
};

export const getTitle = <T extends Media<Anime> | Media<Manga>>(data: T) => {
  const title =
    typeof data?.title === "string" ? data?.title : data?.title.userPreferred;

  return data?.vietnameseTitle || title;
};

export const sortMediaUnit = <T extends Chapter | Episode>(data: T[]) => {
  return data.sort((a, b) => {
    const aNumber = parseNumbersFromString(a.name, 9999)?.[0];
    const bNumber = parseNumbersFromString(b.name, 9999)?.[0];

    return aNumber - bNumber;
  });
};
