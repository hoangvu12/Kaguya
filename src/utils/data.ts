import {
  ANIME_SORTS,
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  MANGA_SORTS,
  SEASONS,
  STATUS,
} from "@/constants";
import { Anime, Manga } from "@/types";

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

export const getTitle = <T extends Anime | Manga>(data: T) => {
  const title =
    typeof data?.title === "string" ? data?.title : data?.title.user_preferred;

  return data?.vietnamese_title || title;
};
