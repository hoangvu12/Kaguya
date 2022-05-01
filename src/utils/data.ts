import enTranslations from "@/constants/en";
import viTranslations from "@/constants/vi";
import { Anime, Chapter, Episode, Manga, Media } from "@/types";
import { parseNumbersFromString } from ".";

type Translate = { readonly value: string; readonly label: string } & Record<
  string,
  any
>;

type Translation = {
  SEASONS: Translate[];
  FORMATS: Translate[];
  STATUS: Translate[];
  GENRES: Translate[];
  CHARACTERS_ROLES: Translate[];
  ANIME_SORTS: Translate[];
  MANGA_SORTS: Translate[];
  TYPES: Translate[];
  COUNTRIES: Translate[];
  VISIBILITY_MODES: Translate[];
  CHAT_EVENT_TYPES: Translate[];
};

export const getConstantTranslation = (locale: string): Translation => {
  switch (locale) {
    case "vi":
      // @ts-ignore
      return viTranslations;
    case "en":
      // @ts-ignore
      return enTranslations;
    default:
      // @ts-ignore
      return enTranslations;
  }
};

const composeTranslation = (translation: Translation) => {
  return {
    season: translation.SEASONS,
    format: translation.FORMATS,
    status: translation.STATUS,
    genre: translation.GENRES,
    characterRole: translation.CHARACTERS_ROLES,
    animeSort: translation.ANIME_SORTS,
    mangaSort: translation.MANGA_SORTS,
    type: translation.TYPES,
    country: translation.COUNTRIES,
    visibilityModes: translation.VISIBILITY_MODES,
  };
};

const types = [
  "season",
  "format",
  "status",
  "genre",
  "characterRole",
  "animeSort",
  "mangaSort",
  "type",
  "country",
  "visibilityModes",
] as const;

type ConvertOptions = {
  reverse?: boolean;
  locale?: string;
};

export const convert = (
  text: string,
  type: typeof types[number],
  options: ConvertOptions = {}
) => {
  const { locale, reverse } = options;

  const constants = composeTranslation(getConstantTranslation(locale));

  const constant = constants[type];

  if (!constant) return text;

  const index = constant.findIndex(
    (el: typeof constant[number]) => el.value === text || el.label === text
  );

  if (index === -1) return null;

  if (reverse) return constant[index].value;

  return constant[index].label;
};

export const getTitle = <T extends Media<Anime> | Media<Manga>>(
  data: T,
  locale?: string
) => {
  if (locale === "en") return data?.title.userPreferred;

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
