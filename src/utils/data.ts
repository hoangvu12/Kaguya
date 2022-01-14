import {
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  SEASONS,
  SORTS,
  STATUSES,
  VIETNAMESE_CHARACTERS_ROLES,
  VIETNAMESE_FORMATS,
  VIETNAMESE_SEASONS,
  VIETNAMESE_SORTS,
  VIETNAMESE_STATUSES,
} from "@/constants";
import { Anime, Manga } from "@/types";

const constants = {
  season: {
    from: SEASONS,
    to: VIETNAMESE_SEASONS,
  },

  format: {
    from: FORMATS,
    to: VIETNAMESE_FORMATS,
  },

  status: {
    from: STATUSES,
    to: VIETNAMESE_STATUSES,
  },

  genre: {
    from: GENRES.map((genre) => genre.value),
    to: GENRES.map((genre) => genre.value),
  },

  characterRole: {
    from: CHARACTERS_ROLES,
    to: VIETNAMESE_CHARACTERS_ROLES,
  },

  sort: {
    from: SORTS,
    to: VIETNAMESE_SORTS,
  },
};

export const convert = (
  text: string,
  type: keyof typeof constants,
  reverse: boolean = false
) => {
  const { from, to } = constants[type];

  if (reverse) {
    const index = to.findIndex((el) => el === text);

    return from[index];
  }

  const index = from.findIndex((el) => el === text);

  return to[index];
};

export const getTitle = <T extends Anime | Manga>(data: T) => {
  const title =
    typeof data?.title === "string" ? data?.title : data?.title.user_preferred;

  return data?.vietnamese_title || title;
};
