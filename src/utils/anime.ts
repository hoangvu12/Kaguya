import {
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  SEASONS,
  STATUSES,
  VIETNAMESE_CHARACTERS_ROLES,
  VIETNAMESE_FORMATS,
  VIETNAMESE_SEASONS,
  VIETNAMESE_STATUSES,
} from "@/constants";

type ConvertType = "season" | "format" | "status" | "genre" | "characterRole";

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
};

export const convert = (
  text: string,
  type: ConvertType,
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
