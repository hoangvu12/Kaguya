import {
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  SEASONS,
  SORTS,
  STATUSES,
  TAGS,
  VIETNAMESE_CHARACTERS_ROLES,
  VIETNAMESE_FORMATS,
  VIETNAMESE_SEASONS,
  VIETNAMESE_SORTS,
  VIETNAMESE_STATUSES,
} from "@/constants";

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
    from: GENRES,
    to: GENRES,
  },

  characterRole: {
    from: CHARACTERS_ROLES,
    to: VIETNAMESE_CHARACTERS_ROLES,
  },

  sort: {
    from: SORTS,
    to: VIETNAMESE_SORTS,
  },

  tag: {
    from: TAGS,
    to: TAGS,
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
