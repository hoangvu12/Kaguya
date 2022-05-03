import enTranslations from "@/constants/en";
import viTranslations from "@/constants/vi";
import { Anime, Chapter, Episode, Manga, Media } from "@/types";
import { parseNumbersFromString } from ".";

type Translate = { readonly value: string; readonly label: string } & Record<
  string,
  any
>;

type TranslationKeys = [
  "SEASONS",
  "FORMATS",
  "STATUS",
  "GENRES",
  "CHARACTERS_ROLES",
  "ANIME_SORTS",
  "MANGA_SORTS",
  "TYPES",
  "COUNTRIES",
  "VISIBILITY_MODES",
  "CHAT_EVENT_TYPES",
  "READ_STATUS",
  "WATCH_STATUS",
  "GENDERS",
  "EMOJI_GROUP"
];
type Translation = Record<TranslationKeys[number], Translate[]>;

export const getConstantTranslation = (locale: string) => {
  switch (locale) {
    case "vi":
      return viTranslations;
    case "en":
      return enTranslations;
    default:
      return enTranslations;
  }
};

const composeTranslation = (translation: Translation) => {
  return {
    season: translation.SEASONS as Translate[],
    format: translation.FORMATS as Translate[],
    status: translation.STATUS as Translate[],
    genre: translation.GENRES as Translate[],
    characterRole: translation.CHARACTERS_ROLES as Translate[],
    animeSort: translation.ANIME_SORTS as Translate[],
    mangaSort: translation.MANGA_SORTS as Translate[],
    type: translation.TYPES as Translate[],
    country: translation.COUNTRIES as Translate[],
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

  // @ts-ignore
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

  return data?.title.vietnamese || data?.title.userPreferred;
};

export const getDescription = <T extends Media<Anime> | Media<Manga>>(
  data: T,
  locale?: string
) => {
  if (locale === "en") return data?.description?.english;

  return data?.description?.vietnamese || data?.description?.english;
};

export const sortMediaUnit = <T extends Chapter | Episode>(data: T[]) => {
  return data.sort((a, b) => {
    const aNumber = parseNumbersFromString(a.name, 9999)?.[0];
    const bNumber = parseNumbersFromString(b.name, 9999)?.[0];

    return aNumber - bNumber;
  });
};
