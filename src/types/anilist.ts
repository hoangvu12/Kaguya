// 💙

/* eslint-disable */

// *******************************************************
// *******************************************************
//
// GENERATED FILE, DO NOT MODIFY
//
// Made by Victor Garcia ®
//
// https://github.com/victorgarciaesgi
// *******************************************************
// *******************************************************
// 💙

export type Maybe<T> = T | null;

/** Page of data */
export interface Page {
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
  media: Maybe<Media[]>;
  characters: Maybe<Character[]>;
  staff: Maybe<Staff[]>;
  studios: Maybe<Studio[]>;
  mediaList: Maybe<MediaList[]>;
  airingSchedules: Maybe<AiringSchedule[]>;
  mediaTrends: Maybe<MediaTrend[]>;
  recommendations: Maybe<Recommendation[]>;
}

export interface PageInfo {
  /** The total number of items. Note: This value is not guaranteed to be accurate, do not rely on this for logic*/
  total: Maybe<number>;
  /** The count on a page*/
  perPage: Maybe<number>;
  /** The current page*/
  currentPage: Maybe<number>;
  /** The last page*/
  lastPage: Maybe<number>;
  /** If there is another page*/
  hasNextPage: Maybe<boolean>;
}

export interface PageArgs {
  /** The page number*/
  page?: number;
  /** The amount of entries per page, max 50*/
  perPage?: number;
}

/** Media list watching/reading status enum. */
export enum MediaListStatus {
  Current = "CURRENT",
  Planning = "PLANNING",
  Completed = "COMPLETED",
  Dropped = "DROPPED",
  Paused = "PAUSED",
  Repeating = "REPEATING",
}

export interface MediaConnection {
  edges: Maybe<MediaEdge[]>;
  nodes: Maybe<Media[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Media connection edge */
export interface MediaEdge {
  node: Maybe<Media>;
  /** The id of the connection*/
  id: Maybe<number>;
  /** The type of relation to the parent model*/
  relationType: Maybe<MediaRelation>;
  /** If the studio is the main animation studio of the media (For Studio->MediaConnection field only)*/
  isMainStudio: boolean;
  /** The characters in the media voiced by the parent actor*/
  characters: Maybe<Character[]>;
  /** The characters role in the media*/
  characterRole: Maybe<CharacterRole>;
  /** Media specific character name*/
  characterName: Maybe<string>;
  /** Notes regarding the VA's role for the character*/
  roleNotes: Maybe<string>;
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant.*/
  dubGroup: Maybe<string>;
  /** The role of the staff member in the production of the media*/
  staffRole: Maybe<string>;
  /** The voice actors of the character*/
  voiceActors: Maybe<Staff[]>;
  /** The voice actors of the character with role date*/
  voiceActorRoles: Maybe<StaffRoleType[]>;
  /** The order the media should be displayed from the users favourites*/
  favouriteOrder: Maybe<number>;
}

/** Anime or Manga */
export interface Media {
  /** The id of the media*/
  id: number;
  /** The mal id of the media*/
  idMal: Maybe<number>;
  /** The official titles of the media in various languages*/
  title: Maybe<MediaTitle>;
  /** The type of the media; anime or manga*/
  type: Maybe<MediaType>;
  /** The format the media was released in*/
  format: Maybe<MediaFormat>;
  /** The current releasing status of the media*/
  status: Maybe<MediaStatus>;
  /** Short description of the media's story and characters*/
  description: Maybe<string>;
  /** The first official release date of the media*/
  startDate: Maybe<FuzzyDate>;
  /** The last official release date of the media*/
  endDate: Maybe<FuzzyDate>;
  /** The season the media was initially released in*/
  season: Maybe<MediaSeason>;
  /** The season year the media was initially released in*/
  seasonYear: Maybe<number>;
  /** The year & season the media was initially released in*/
  seasonInt: Maybe<number>;
  /** The amount of episodes the anime has when complete*/
  episodes: Maybe<number>;
  /** The general length of each anime episode in minutes*/
  duration: Maybe<number>;
  /** The amount of chapters the manga has when complete*/
  chapters: Maybe<number>;
  /** The amount of volumes the manga has when complete*/
  volumes: Maybe<number>;
  /** Where the media was created. (ISO 3166-1 alpha-2)*/
  countryOfOrigin: Maybe<string>;
  /** If the media is officially licensed or a self-published doujin release*/
  isLicensed: Maybe<boolean>;
  /** Source type the media was adapted from.*/
  source: Maybe<MediaSource>;
  /** Official Twitter hashtags for the media*/
  hashtag: Maybe<string>;
  /** Media trailer or advertisement*/
  trailer: Maybe<MediaTrailer>;
  /** When the media's data was last updated*/
  updatedAt: Maybe<number>;
  /** The cover images of the media*/
  coverImage: Maybe<MediaCoverImage>;
  /** The banner image of the media*/
  bannerImage: Maybe<string>;
  /** The genres of the media*/
  genres: Maybe<string[]>;
  /** Alternative titles of the media*/
  synonyms: Maybe<string[]>;
  /** A weighted average score of all the user's scores of the media*/
  averageScore: Maybe<number>;
  /** Mean score of all the user's scores of the media*/
  meanScore: Maybe<number>;
  /** The number of users with the media on their list*/
  popularity: Maybe<number>;
  /** Locked media may not be added to lists our favorited. This may be due to the entry pending for deletion or other reasons.*/
  isLocked: Maybe<boolean>;
  /** The amount of related activity in the past hour*/
  trending: Maybe<number>;
  /** The amount of user's who have favourited the media*/
  favourites: Maybe<number>;
  /** List of tags that describes elements and themes of the media*/
  tags: Maybe<MediaTag[]>;
  /** Other media in the same or connecting franchise*/
  relations: Maybe<MediaConnection>;
  /** The characters in the media*/
  characters: Maybe<CharacterConnection>;
  /** The staff who produced the media*/
  staff: Maybe<StaffConnection>;
  /** The companies who produced the media*/
  studios: Maybe<StudioConnection>;
  /** If the media is marked as favourite by the current authenticated user*/
  isFavourite: boolean;
  /** If the media is blocked from being added to favourites*/
  isFavouriteBlocked: boolean;
  /** If the media is intended only for 18+ adult audiences*/
  isAdult: Maybe<boolean>;
  /** The media's next episode airing schedule*/
  nextAiringEpisode: Maybe<AiringSchedule>;
  /** The media's entire airing schedule*/
  airingSchedule: Maybe<AiringScheduleConnection>;
  /** The media's daily trend stats*/
  trends: Maybe<MediaTrendConnection>;
  /** External links to another site related to the media*/
  externalLinks: Maybe<MediaExternalLink[]>;
  /** Data and links to legal streaming episodes on external sites*/
  streamingEpisodes: Maybe<MediaStreamingEpisode[]>;
  /** The ranking of the media in a particular time span and format compared to other media*/
  rankings: Maybe<MediaRank[]>;
  /** The authenticated user's media list entry for the media*/
  mediaListEntry: Maybe<MediaList>;
  /** User recommendations for similar media*/
  recommendations: Maybe<RecommendationConnection>;
  /** The url for the media page on the AniList website*/
  siteUrl: Maybe<string>;
  /** If the media should have forum thread automatically created for it on airing episode release*/
  autoCreateForumThread: Maybe<boolean>;
  /** If the media is blocked from being recommended to/from*/
  isRecommendationBlocked: Maybe<boolean>;
  /** If the media is blocked from being reviewed*/
  isReviewBlocked: Maybe<boolean>;
  /** Notes for site moderators*/
  modNotes: Maybe<string>;
}

/** Media query */
export interface MediaArgs {
  /** Filter by the media id*/
  id?: number;
  /** Filter by the media's MyAnimeList id*/
  idMal?: number;
  /** Filter by the start date of the media*/
  startDate?: undefined;
  /** Filter by the end date of the media*/
  endDate?: undefined;
  /** Filter by the season the media was released in*/
  season?: MediaSeason;
  /** The year of the season (Winter 2017 would also include December 2016 releases). Requires season argument*/
  seasonYear?: number;
  /** Filter by the media's type*/
  type?: MediaType;
  /** Filter by the media's format*/
  format?: MediaFormat;
  /** Filter by the media's current release status*/
  status?: MediaStatus;
  /** Filter by amount of episodes the media has*/
  episodes?: number;
  /** Filter by the media's episode length*/
  duration?: number;
  /** Filter by the media's chapter count*/
  chapters?: number;
  /** Filter by the media's volume count*/
  volumes?: number;
  /** Filter by if the media's intended for 18+ adult audiences*/
  isAdult?: boolean;
  /** Filter by the media's genres*/
  genre?: string;
  /** Filter by the media's tags*/
  tag?: string;
  /** Only apply the tags filter argument to tags above this rank. Default: 18*/
  minimumTagRank?: number;
  /** Filter by the media's tags with in a tag category*/
  tagCategory?: string;
  /** Filter by the media on the authenticated user's lists*/
  onList?: boolean;
  /** Filter media by sites name with a online streaming or reading license*/
  licensedBy?: string;
  /** Filter media by sites id with a online streaming or reading license*/
  licensedById?: number;
  /** Filter by the media's average score*/
  averageScore?: number;
  /** Filter by the number of users with this media on their list*/
  popularity?: number;
  /** Filter by the source type of the media*/
  source?: MediaSource;
  /** Filter by the media's country of origin*/
  countryOfOrigin?: string;
  /** If the media is officially licensed or a self-published doujin release*/
  isLicensed?: boolean;
  /** Filter by search query*/
  search?: string;
  /** Filter by the media id*/
  id_not?: number;
  /** Filter by the media id*/
  id_in?: number[];
  /** Filter by the media id*/
  id_not_in?: number[];
  /** Filter by the media's MyAnimeList id*/
  idMal_not?: number;
  /** Filter by the media's MyAnimeList id*/
  idMal_in?: number[];
  /** Filter by the media's MyAnimeList id*/
  idMal_not_in?: number[];
  /** Filter by the start date of the media*/
  startDate_greater?: undefined;
  /** Filter by the start date of the media*/
  startDate_lesser?: undefined;
  /** Filter by the start date of the media*/
  startDate_like?: string;
  /** Filter by the end date of the media*/
  endDate_greater?: undefined;
  /** Filter by the end date of the media*/
  endDate_lesser?: undefined;
  /** Filter by the end date of the media*/
  endDate_like?: string;
  /** Filter by the media's format*/
  format_in?: MediaFormat[];
  /** Filter by the media's format*/
  format_not?: MediaFormat;
  /** Filter by the media's format*/
  format_not_in?: MediaFormat[];
  /** Filter by the media's current release status*/
  status_in?: MediaStatus[];
  /** Filter by the media's current release status*/
  status_not?: MediaStatus;
  /** Filter by the media's current release status*/
  status_not_in?: MediaStatus[];
  /** Filter by amount of episodes the media has*/
  episodes_greater?: number;
  /** Filter by amount of episodes the media has*/
  episodes_lesser?: number;
  /** Filter by the media's episode length*/
  duration_greater?: number;
  /** Filter by the media's episode length*/
  duration_lesser?: number;
  /** Filter by the media's chapter count*/
  chapters_greater?: number;
  /** Filter by the media's chapter count*/
  chapters_lesser?: number;
  /** Filter by the media's volume count*/
  volumes_greater?: number;
  /** Filter by the media's volume count*/
  volumes_lesser?: number;
  /** Filter by the media's genres*/
  genre_in?: string[];
  /** Filter by the media's genres*/
  genre_not_in?: string[];
  /** Filter by the media's tags*/
  tag_in?: string[];
  /** Filter by the media's tags*/
  tag_not_in?: string[];
  /** Filter by the media's tags with in a tag category*/
  tagCategory_in?: string[];
  /** Filter by the media's tags with in a tag category*/
  tagCategory_not_in?: string[];
  /** Filter media by sites name with a online streaming or reading license*/
  licensedBy_in?: string[];
  /** Filter media by sites id with a online streaming or reading license*/
  licensedById_in?: number[];
  /** Filter by the media's average score*/
  averageScore_not?: number;
  /** Filter by the media's average score*/
  averageScore_greater?: number;
  /** Filter by the media's average score*/
  averageScore_lesser?: number;
  /** Filter by the number of users with this media on their list*/
  popularity_not?: number;
  /** Filter by the number of users with this media on their list*/
  popularity_greater?: number;
  /** Filter by the number of users with this media on their list*/
  popularity_lesser?: number;
  /** Filter by the source type of the media*/
  source_in?: MediaSource[];
  /** The order the results will be returned in*/
  sort?: MediaSort[];
}

/** The official titles of the media in various languages */
export interface MediaTitle extends Record<string, string> {
  /** The romanization of the native language title*/
  romaji: Maybe<string>;
  /** The official english title*/
  english: Maybe<string>;
  /** Official title in it's native language*/
  native: Maybe<string>;
  /** The currently authenticated users preferred title language. Default romaji for non-authenticated*/
  userPreferred: Maybe<string>;
}

/** Media type enum, anime or manga. */
export enum MediaType {
  Anime = "ANIME",
  Manga = "MANGA",
}
/** The format the media was released in */
export enum MediaFormat {
  Tv = "TV",
  Tv_short = "TV_SHORT",
  Movie = "MOVIE",
  Special = "SPECIAL",
  Ova = "OVA",
  Ona = "ONA",
  Music = "MUSIC",
  Manga = "MANGA",
  Novel = "NOVEL",
  One_shot = "ONE_SHOT",
}
/** The current releasing status of the media */
export enum MediaStatus {
  Finished = "FINISHED",
  Releasing = "RELEASING",
  Not_yet_released = "NOT_YET_RELEASED",
  Cancelled = "CANCELLED",
  Hiatus = "HIATUS",
}
/** Date object that allows for incomplete date values (fuzzy) */
export interface FuzzyDate {
  /** Numeric Year (2017)*/
  year: Maybe<number>;
  /** Numeric Month (3)*/
  month: Maybe<number>;
  /** Numeric Day (24)*/
  day: Maybe<number>;
}

export enum MediaSeason {
  Winter = "WINTER",
  Spring = "SPRING",
  Summer = "SUMMER",
  Fall = "FALL",
}

/** Source type the media was adapted from */
export enum MediaSource {
  Original = "ORIGINAL",
  Manga = "MANGA",
  Light_novel = "LIGHT_NOVEL",
  Visual_novel = "VISUAL_NOVEL",
  Video_game = "VIDEO_GAME",
  Other = "OTHER",
  Novel = "NOVEL",
  Doujinshi = "DOUJINSHI",
  Anime = "ANIME",
  Web_novel = "WEB_NOVEL",
  Live_action = "LIVE_ACTION",
  Game = "GAME",
  Comic = "COMIC",
  Multimedia_project = "MULTIMEDIA_PROJECT",
  Picture_book = "PICTURE_BOOK",
}
/** Media trailer or advertisement */
export interface MediaTrailer {
  /** The trailer video id*/
  id: Maybe<string>;
  /** The site the video is hosted by (Currently either youtube or dailymotion)*/
  site: Maybe<string>;
  /** The url for the thumbnail image of the video*/
  thumbnail: Maybe<string>;
}

export interface MediaCoverImage {
  /** The cover image url of the media at its largest size. If this size isn't available, large will be provided instead.*/
  extraLarge: Maybe<string>;
  /** The cover image url of the media at a large size*/
  large: Maybe<string>;
  /** The cover image url of the media at medium size*/
  medium: Maybe<string>;
  /** Average #hex color of cover image*/
  color: Maybe<string>;
}

/** A tag that describes a theme or element of the media */
export interface MediaTag {
  /** The id of the tag*/
  id: number;
  /** The name of the tag*/
  name: string;
  /** A general description of the tag*/
  description: Maybe<string>;
  /** The categories of tags this tag belongs to*/
  category: Maybe<string>;
  /** The relevance ranking of the tag out of the 100 for this media*/
  rank: Maybe<number>;
  /** If the tag could be a spoiler for any media*/
  isGeneralSpoiler: Maybe<boolean>;
  /** If the tag is a spoiler for this media*/
  isMediaSpoiler: Maybe<boolean>;
  /** If the tag is only for adult 18+ media*/
  isAdult: Maybe<boolean>;
  /** The user who submitted the tag*/
  userId: Maybe<number>;
}

/** Character sort enums */
export enum CharacterSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Role = "ROLE",
  Role_desc = "ROLE_DESC",
  Search_match = "SEARCH_MATCH",
  Favourites = "FAVOURITES",
  Favourites_desc = "FAVOURITES_DESC",
  Relevance = "RELEVANCE",
}
/** The role the character plays in the media */
export enum CharacterRole {
  Main = "MAIN",
  Supporting = "SUPPORTING",
  Background = "BACKGROUND",
}
export interface CharacterConnection {
  edges: Maybe<CharacterEdge[]>;
  nodes: Maybe<Character[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Character connection edge */
export interface CharacterEdge {
  node: Maybe<Character>;
  /** The id of the connection*/
  id: Maybe<number>;
  /** The characters role in the media*/
  role: Maybe<CharacterRole>;
  /** Media specific character name*/
  name: Maybe<string>;
  /** The voice actors of the character*/
  voiceActors: Maybe<Staff[]>;
  /** The voice actors of the character with role date*/
  voiceActorRoles: Maybe<StaffRoleType[]>;
  /** The media the character is in*/
  media: Maybe<Media[]>;
  /** The order the character should be displayed from the users favourites*/
  favouriteOrder: Maybe<number>;
}

/** A character that features in an anime or manga */
export interface Character {
  /** The id of the character*/
  id: number;
  /** The names of the character*/
  name: Maybe<CharacterName>;
  /** Character images*/
  image: Maybe<CharacterImage>;
  /** A general description of the character*/
  description: Maybe<string>;
  /** The character's gender. Usually Male, Female, or Non-binary but can be any string.*/
  gender: Maybe<string>;
  /** The character's birth date*/
  dateOfBirth: Maybe<FuzzyDate>;
  /** The character's age. Note this is a string, not an int, it may contain further text and additional ages.*/
  age: Maybe<string>;
  /** The characters blood type*/
  bloodType: Maybe<string>;
  /** If the character is marked as favourite by the currently authenticated user*/
  isFavourite: boolean;
  /** If the character is blocked from being added to favourites*/
  isFavouriteBlocked: boolean;
  /** The url for the character page on the AniList website*/
  siteUrl: Maybe<string>;
  /** Media that includes the character*/
  media: Maybe<MediaConnection>;
  /** @deprecated No data available*/
  updatedAt: Maybe<number>;
  /** The amount of user's who have favourited the character*/
  favourites: Maybe<number>;
  /** Notes for site moderators*/
  modNotes: Maybe<string>;
}

/** The names of the character */
export interface CharacterName {
  /** The character's given name*/
  first: Maybe<string>;
  /** The character's middle name*/
  middle: Maybe<string>;
  /** The character's surname*/
  last: Maybe<string>;
  /** The character's first and last name*/
  full: Maybe<string>;
  /** The character's full name in their native language*/
  native: Maybe<string>;
  /** Other names the character might be referred to as*/
  alternative: Maybe<string[]>;
  /** Other names the character might be referred to as but are spoilers*/
  alternativeSpoiler: Maybe<string[]>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated*/
  userPreferred: Maybe<string>;
}

export interface CharacterImage {
  /** The character's image of media at its largest size*/
  large: Maybe<string>;
  /** The character's image of media at medium size*/
  medium: Maybe<string>;
}

/** Media sort enums */
export enum MediaSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Title_romaji = "TITLE_ROMAJI",
  Title_romaji_desc = "TITLE_ROMAJI_DESC",
  Title_english = "TITLE_ENGLISH",
  Title_english_desc = "TITLE_ENGLISH_DESC",
  Title_native = "TITLE_NATIVE",
  Title_native_desc = "TITLE_NATIVE_DESC",
  Type = "TYPE",
  Type_desc = "TYPE_DESC",
  Format = "FORMAT",
  Format_desc = "FORMAT_DESC",
  Start_date = "START_DATE",
  Start_date_desc = "START_DATE_DESC",
  End_date = "END_DATE",
  End_date_desc = "END_DATE_DESC",
  Score = "SCORE",
  Score_desc = "SCORE_DESC",
  Popularity = "POPULARITY",
  Popularity_desc = "POPULARITY_DESC",
  Trending = "TRENDING",
  Trending_desc = "TRENDING_DESC",
  Episodes = "EPISODES",
  Episodes_desc = "EPISODES_DESC",
  Duration = "DURATION",
  Duration_desc = "DURATION_DESC",
  Status = "STATUS",
  Status_desc = "STATUS_DESC",
  Chapters = "CHAPTERS",
  Chapters_desc = "CHAPTERS_DESC",
  Volumes = "VOLUMES",
  Volumes_desc = "VOLUMES_DESC",
  Updated_at = "UPDATED_AT",
  Updated_at_desc = "UPDATED_AT_DESC",
  Search_match = "SEARCH_MATCH",
  Favourites = "FAVOURITES",
  Favourites_desc = "FAVOURITES_DESC",
}
/** The primary language of the voice actor */
export enum StaffLanguage {
  Japanese = "JAPANESE",
  English = "ENGLISH",
  Korean = "KOREAN",
  Italian = "ITALIAN",
  Spanish = "SPANISH",
  Portuguese = "PORTUGUESE",
  French = "FRENCH",
  German = "GERMAN",
  Hebrew = "HEBREW",
  Hungarian = "HUNGARIAN",
}
/** Staff sort enums */
export enum StaffSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Role = "ROLE",
  Role_desc = "ROLE_DESC",
  Language = "LANGUAGE",
  Language_desc = "LANGUAGE_DESC",
  Search_match = "SEARCH_MATCH",
  Favourites = "FAVOURITES",
  Favourites_desc = "FAVOURITES_DESC",
  Relevance = "RELEVANCE",
}
/** Voice actors or production staff */
export interface Staff {
  /** The id of the staff member*/
  id: number;
  /** The names of the staff member*/
  name: Maybe<StaffName>;
  /** @deprecated Replaced with languageV2The primary language the staff member dub's in*/
  language: Maybe<StaffLanguage>;
  /** The primary language of the staff member. Current values: Japanese, English, Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian, Chinese, Arabic, Filipino, Catalan, Finnish, Turkish, Dutch, Swedish, Thai, Tagalog, Malaysian, Indonesian, Vietnamese, Nepali, Hindi, Urdu*/
  languageV2: Maybe<string>;
  /** The staff images*/
  image: Maybe<StaffImage>;
  /** A general description of the staff member*/
  description: Maybe<string>;
  /** The person's primary occupations*/
  primaryOccupations: Maybe<string[]>;
  /** The staff's gender. Usually Male, Female, or Non-binary but can be any string.*/
  gender: Maybe<string>;
  dateOfBirth: Maybe<FuzzyDate>;
  dateOfDeath: Maybe<FuzzyDate>;
  /** The person's age in years*/
  age: Maybe<number>;
  /** [startYear, endYear] (If the 2nd value is not present staff is still active)*/
  yearsActive: Maybe<number[]>;
  /** The persons birthplace or hometown*/
  homeTown: Maybe<string>;
  /** The persons blood type*/
  bloodType: Maybe<string>;
  /** If the staff member is marked as favourite by the currently authenticated user*/
  isFavourite: boolean;
  /** If the staff member is blocked from being added to favourites*/
  isFavouriteBlocked: boolean;
  /** The url for the staff page on the AniList website*/
  siteUrl: Maybe<string>;
  /** Media where the staff member has a production role*/
  staffMedia: Maybe<MediaConnection>;
  /** Characters voiced by the actor*/
  characters: Maybe<CharacterConnection>;
  /** Media the actor voiced characters in. (Same data as characters with media as node instead of characters)*/
  characterMedia: Maybe<MediaConnection>;
  /** @deprecated No data available*/
  updatedAt: Maybe<number>;
  /** Staff member that the submission is referencing*/
  staff: Maybe<Staff>;
  /** Status of the submission*/
  submissionStatus: Maybe<number>;
  /** Inner details of submission status*/
  submissionNotes: Maybe<string>;
  /** The amount of user's who have favourited the staff member*/
  favourites: Maybe<number>;
  /** Notes for site moderators*/
  modNotes: Maybe<string>;
}

/** The names of the staff member */
export interface StaffName {
  /** The person's given name*/
  first: Maybe<string>;
  /** The person's middle name*/
  middle: Maybe<string>;
  /** The person's surname*/
  last: Maybe<string>;
  /** The person's first and last name*/
  full: Maybe<string>;
  /** The person's full name in their native language*/
  native: Maybe<string>;
  /** Other names the staff member might be referred to as (pen names)*/
  alternative: Maybe<string[]>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated*/
  userPreferred: Maybe<string>;
}

export interface StaffImage {
  /** The person's image of media at its largest size*/
  large: Maybe<string>;
  /** The person's image of media at medium size*/
  medium: Maybe<string>;
}

/** Voice actor role for a character */
export interface StaffRoleType {
  /** The voice actors of the character*/
  voiceActor: Maybe<Staff>;
  /** Notes regarding the VA's role for the character*/
  roleNotes: Maybe<string>;
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant.*/
  dubGroup: Maybe<string>;
}

export interface StaffConnection {
  edges: Maybe<StaffEdge[]>;
  nodes: Maybe<Staff[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Staff connection edge */
export interface StaffEdge {
  node: Maybe<Staff>;
  /** The id of the connection*/
  id: Maybe<number>;
  /** The role of the staff member in the production of the media*/
  role: Maybe<string>;
  /** The order the staff should be displayed from the users favourites*/
  favouriteOrder: Maybe<number>;
}

/** Studio sort enums */
export enum StudioSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Name = "NAME",
  Name_desc = "NAME_DESC",
  Search_match = "SEARCH_MATCH",
  Favourites = "FAVOURITES",
  Favourites_desc = "FAVOURITES_DESC",
}
export interface StudioConnection {
  edges: Maybe<StudioEdge[]>;
  nodes: Maybe<Studio[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Studio connection edge */
export interface StudioEdge {
  node: Maybe<Studio>;
  /** The id of the connection*/
  id: Maybe<number>;
  /** If the studio is the main animation studio of the anime*/
  isMain: boolean;
  /** The order the character should be displayed from the users favourites*/
  favouriteOrder: Maybe<number>;
}

/** Animation or production company */
export interface Studio {
  /** The id of the studio*/
  id: number;
  /** The name of the studio*/
  name: string;
  /** If the studio is an animation studio or a different kind of company*/
  isAnimationStudio: boolean;
  /** The media the studio has worked on*/
  media: Maybe<MediaConnection>;
  /** The url for the studio page on the AniList website*/
  siteUrl: Maybe<string>;
  /** If the studio is marked as favourite by the currently authenticated user*/
  isFavourite: boolean;
  /** The amount of user's who have favourited the studio*/
  favourites: Maybe<number>;
}

/** Media Airing Schedule. NOTE: We only aim to guarantee that FUTURE airing data is present and accurate. */
export interface AiringSchedule {
  /** The id of the airing schedule item*/
  id: number;
  /** The time the episode airs at*/
  airingAt: number;
  /** Seconds until episode starts airing*/
  timeUntilAiring: number;
  /** The airing episode number*/
  episode: number;
  /** The associate media id of the airing episode*/
  mediaId: number;
  /** The associate media of the airing episode*/
  media: Maybe<Media>;
}

export interface AiringScheduleConnection {
  edges: Maybe<AiringScheduleEdge[]>;
  nodes: Maybe<AiringSchedule[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** AiringSchedule connection edge */
export interface AiringScheduleEdge {
  node: Maybe<AiringSchedule>;
  /** The id of the connection*/
  id: Maybe<number>;
}

/** Media trend sort enums */
export enum MediaTrendSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Media_id = "MEDIA_ID",
  Media_id_desc = "MEDIA_ID_DESC",
  Date = "DATE",
  Date_desc = "DATE_DESC",
  Score = "SCORE",
  Score_desc = "SCORE_DESC",
  Popularity = "POPULARITY",
  Popularity_desc = "POPULARITY_DESC",
  Trending = "TRENDING",
  Trending_desc = "TRENDING_DESC",
  Episode = "EPISODE",
  Episode_desc = "EPISODE_DESC",
}
export interface MediaTrendConnection {
  edges: Maybe<MediaTrendEdge[]>;
  nodes: Maybe<MediaTrend[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Media trend connection edge */
export interface MediaTrendEdge {
  node: Maybe<MediaTrend>;
}

/** Daily media statistics */
export interface MediaTrend {
  /** The id of the tag*/
  mediaId: number;
  /** The day the data was recorded (timestamp)*/
  date: number;
  /** The amount of media activity on the day*/
  trending: number;
  /** A weighted average score of all the user's scores of the media*/
  averageScore: Maybe<number>;
  /** The number of users with the media on their list*/
  popularity: Maybe<number>;
  /** The number of users with watching/reading the media*/
  inProgress: Maybe<number>;
  /** If the media was being released at this time*/
  releasing: boolean;
  /** The episode number of the anime released on this day*/
  episode: Maybe<number>;
  /** The related media*/
  media: Maybe<Media>;
}

/** An external link to another site related to the media or staff member */
export interface MediaExternalLink {
  /** The id of the external link*/
  id: number;
  /** The url of the external link or base url of link source*/
  url: Maybe<string>;
  /** The links website site name*/
  site: string;
  /** The links website site id*/
  siteId: Maybe<number>;
  type: Maybe<ExternalLinkType>;
  /** Language the site content is in. See Staff language field for values.*/
  language: Maybe<string>;
  color: Maybe<string>;
  /** The icon image url of the site. Not available for all links. Transparent PNG 64x64*/
  icon: Maybe<string>;
  notes: Maybe<string>;
  isDisabled: Maybe<boolean>;
}

export enum ExternalLinkType {
  Info = "INFO",
  Streaming = "STREAMING",
  Social = "SOCIAL",
}
/** Data and links to legal streaming episodes on external sites */
export interface MediaStreamingEpisode {
  /** Title of the episode*/
  title: Maybe<string>;
  /** Url of episode image thumbnail*/
  thumbnail: Maybe<string>;
  /** The url of the episode*/
  url: Maybe<string>;
  /** The site location of the streaming episodes*/
  site: Maybe<string>;
}

/** The ranking of a media in a particular time span and format compared to other media */
export interface MediaRank {
  /** The id of the rank*/
  id: number;
  /** The numerical rank of the media*/
  rank: number;
  /** The type of ranking*/
  type: MediaRankType;
  /** The format the media is ranked within*/
  format: MediaFormat;
  /** The year the media is ranked within*/
  year: Maybe<number>;
  /** The season the media is ranked within*/
  season: Maybe<MediaSeason>;
  /** If the ranking is based on all time instead of a season/year*/
  allTime: Maybe<boolean>;
  /** String that gives context to the ranking type and time span*/
  context: string;
}

/** The type of ranking */
export enum MediaRankType {
  Rated = "RATED",
  Popular = "POPULAR",
}

/** Recommendation sort enums */
export enum RecommendationSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Rating = "RATING",
  Rating_desc = "RATING_DESC",
}
export interface RecommendationConnection {
  edges: Maybe<RecommendationEdge[]>;
  nodes: Maybe<Recommendation[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Recommendation connection edge */
export interface RecommendationEdge {
  node: Maybe<Recommendation>;
}

/** Media recommendation */
export interface Recommendation {
  /** The id of the recommendation*/
  id: number;
  /** Users rating of the recommendation*/
  rating: Maybe<number>;
  /** The rating of the recommendation by currently authenticated user*/
  userRating: Maybe<RecommendationRating>;
  /** The media the recommendation is from*/
  media: Maybe<Media>;
  /** The recommended media*/
  mediaRecommendation: Maybe<Media>;
  /** The user that first created the recommendation*/
}

/** Recommendation rating enums */
export enum RecommendationRating {
  No_rating = "NO_RATING",
  Rate_up = "RATE_UP",
  Rate_down = "RATE_DOWN",
}

/** Type of relation media has to its parent. */
export enum MediaRelation {
  Adaptation = "ADAPTATION",
  Prequel = "PREQUEL",
  Sequel = "SEQUEL",
  Parent = "PARENT",
  Side_story = "SIDE_STORY",
  Character = "CHARACTER",
  Summary = "SUMMARY",
  Alternative = "ALTERNATIVE",
  Spin_off = "SPIN_OFF",
  Other = "OTHER",
  Source = "SOURCE",
  Compilation = "COMPILATION",
  Contains = "CONTAINS",
}

/** Media list sort enums */
export enum MediaListSort {
  Media_id = "MEDIA_ID",
  Media_id_desc = "MEDIA_ID_DESC",
  Score = "SCORE",
  Score_desc = "SCORE_DESC",
  Status = "STATUS",
  Status_desc = "STATUS_DESC",
  Progress = "PROGRESS",
  Progress_desc = "PROGRESS_DESC",
  Progress_volumes = "PROGRESS_VOLUMES",
  Progress_volumes_desc = "PROGRESS_VOLUMES_DESC",
  Repeat = "REPEAT",
  Repeat_desc = "REPEAT_DESC",
  Priority = "PRIORITY",
  Priority_desc = "PRIORITY_DESC",
  Started_on = "STARTED_ON",
  Started_on_desc = "STARTED_ON_DESC",
  Finished_on = "FINISHED_ON",
  Finished_on_desc = "FINISHED_ON_DESC",
  Added_time = "ADDED_TIME",
  Added_time_desc = "ADDED_TIME_DESC",
  Updated_time = "UPDATED_TIME",
  Updated_time_desc = "UPDATED_TIME_DESC",
  Media_title_romaji = "MEDIA_TITLE_ROMAJI",
  Media_title_romaji_desc = "MEDIA_TITLE_ROMAJI_DESC",
  Media_title_english = "MEDIA_TITLE_ENGLISH",
  Media_title_english_desc = "MEDIA_TITLE_ENGLISH_DESC",
  Media_title_native = "MEDIA_TITLE_NATIVE",
  Media_title_native_desc = "MEDIA_TITLE_NATIVE_DESC",
  Media_popularity = "MEDIA_POPULARITY",
  Media_popularity_desc = "MEDIA_POPULARITY_DESC",
}
/** Airing schedule sort enums */
export enum AiringSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Media_id = "MEDIA_ID",
  Media_id_desc = "MEDIA_ID_DESC",
  Time = "TIME",
  Time_desc = "TIME_DESC",
  Episode = "EPISODE",
  Episode_desc = "EPISODE_DESC",
}

export enum ExternalLinkMediaType {
  Anime = "ANIME",
  Manga = "MANGA",
  Staff = "STAFF",
}

/** A user's list options for anime or manga lists */
export interface MediaListOptionsInput {
  /** The order each list should be displayed in*/
  sectionOrder?: string[];
  /** If the completed sections of the list should be separated by format*/
  splitCompletedSectionByFormat?: boolean;
  /** The names of the user's custom lists*/
  customLists?: string[];
  /** The names of the user's advanced scoring sections*/
  advancedScoring?: string[];
  /** If advanced scoring is enabled*/
  advancedScoringEnabled?: boolean;
  /** list theme*/
  theme?: string;
}

export interface ListActivityOptionInput {
  disabled?: boolean;
  type?: MediaListStatus;
}

/** Date object that allows for incomplete date values (fuzzy) */
export interface FuzzyDateInput {
  /** Numeric Year (2017)*/
  year?: number;
  /** Numeric Month (3)*/
  month?: number;
  /** Numeric Day (24)*/
  day?: number;
}

/** Deleted data type */
export interface Deleted {
  /** If an item has been successfully deleted*/
  deleted: Maybe<boolean>;
}

/** Internal - Media characters separated */
export interface MediaCharacter {
  /** The id of the connection*/
  id: Maybe<number>;
  /** The characters role in the media*/
  role: Maybe<CharacterRole>;
  roleNotes: Maybe<string>;
  dubGroup: Maybe<string>;
  /** Media specific character name*/
  characterName: Maybe<string>;
  /** The characters in the media voiced by the parent actor*/
  character: Maybe<Character>;
  /** The voice actor of the character*/
  voiceActor: Maybe<Staff>;
}

/** The official titles of the media in various languages */
export interface MediaTitleInput {
  /** The romanization of the native language title*/
  romaji?: string;
  /** The official english title*/
  english?: string;
  /** Official title in it's native language*/
  native?: string;
}

export interface AiringScheduleInput {
  airingAt?: number;
  episode?: number;
  timeUntilAiring?: number;
}

/** An external link to another site related to the media */
export interface MediaExternalLinkInput {
  /** The id of the external link*/
  id: number;
  /** The url of the external link*/
  url: string;
  /** The site location of the external link*/
  site: string;
}

/** The names of the character */
export interface CharacterNameInput {
  /** The character's given name*/
  first?: string;
  /** The character's middle name*/
  middle?: string;
  /** The character's surname*/
  last?: string;
  /** The character's full name in their native language*/
  native?: string;
  /** Other names the character might be referred by*/
  alternative?: string[];
  /** Other names the character might be referred to as but are spoilers*/
  alternativeSpoiler?: string[];
}

/** The names of the staff member */
export interface StaffNameInput {
  /** The person's given name*/
  first?: string;
  /** The person's middle name*/
  middle?: string;
  /** The person's surname*/
  last?: string;
  /** The person's full name in their native language*/
  native?: string;
  /** Other names the character might be referred by*/
  alternative?: string[];
}

/** Airing schedule query */
export interface AiringScheduleArgs {
  /** Filter by the id of the airing schedule item*/
  id?: number;
  /** Filter by the id of associated media*/
  mediaId?: number;
  /** Filter by the airing episode number*/
  episode?: number;
  /** Filter by the time of airing*/
  airingAt?: number;
  /** Filter to episodes that haven't yet aired*/
  notYetAired?: boolean;
  /** Filter by the id of the airing schedule item*/
  id_not?: number;
  /** Filter by the id of the airing schedule item*/
  id_in?: number[];
  /** Filter by the id of the airing schedule item*/
  id_not_in?: number[];
  /** Filter by the id of associated media*/
  mediaId_not?: number;
  /** Filter by the id of associated media*/
  mediaId_in?: number[];
  /** Filter by the id of associated media*/
  mediaId_not_in?: number[];
  /** Filter by the airing episode number*/
  episode_not?: number;
  /** Filter by the airing episode number*/
  episode_in?: number[];
  /** Filter by the airing episode number*/
  episode_not_in?: number[];
  /** Filter by the airing episode number*/
  episode_greater?: number;
  /** Filter by the airing episode number*/
  episode_lesser?: number;
  /** Filter by the time of airing*/
  airingAt_greater?: number;
  /** Filter by the time of airing*/
  airingAt_lesser?: number;
  /** The order the results will be returned in*/
  sort?: AiringSort[];
}

/** Character query */
export interface CharacterArgs {
  /** Filter by character id*/
  id?: number;
  /** Filter by character by if its their birthday today*/
  isBirthday?: boolean;
  /** Filter by search query*/
  search?: string;
  /** Filter by character id*/
  id_not?: number;
  /** Filter by character id*/
  id_in?: number[];
  /** Filter by character id*/
  id_not_in?: number[];
  /** The order the results will be returned in*/
  sort?: CharacterSort[];
}

/** Staff query */
export interface StaffArgs {
  /** Filter by the staff id*/
  id?: number;
  /** Filter by staff by if its their birthday today*/
  isBirthday?: boolean;
  /** Filter by search query*/
  search?: string;
  /** Filter by the staff id*/
  id_not?: number;
  /** Filter by the staff id*/
  id_in?: number[];
  /** Filter by the staff id*/
  id_not_in?: number[];
  /** The order the results will be returned in*/
  sort?: StaffSort[];
}

/** Media list query */
export interface MediaListArgs {
  /** Filter by a list entry's id*/
  id?: number;
  /** Filter by a user's id*/
  userId?: number;
  /** Filter by a user's name*/
  userName?: string;
  /** Filter by the list entries media type*/
  type?: MediaType;
  /** Filter by the watching/reading status*/
  status?: MediaListStatus;
  /** Filter by the media id of the list entry*/
  mediaId?: number;
  /** Filter list entries to users who are being followed by the authenticated user*/
  isFollowing?: boolean;
  /** Filter by note words and #tags*/
  notes?: string;
  /** Filter by the date the user started the media*/
  startedAt?: undefined;
  /** Filter by the date the user completed the media*/
  completedAt?: undefined;
  /** Limit to only entries also on the auth user's list. Requires user id or name arguments.*/
  compareWithAuthList?: boolean;
  /** Filter by a user's id*/
  userId_in?: number[];
  /** Filter by the watching/reading status*/
  status_in?: MediaListStatus[];
  /** Filter by the watching/reading status*/
  status_not_in?: MediaListStatus[];
  /** Filter by the watching/reading status*/
  status_not?: MediaListStatus;
  /** Filter by the media id of the list entry*/
  mediaId_in?: number[];
  /** Filter by the media id of the list entry*/
  mediaId_not_in?: number[];
  /** Filter by note words and #tags*/
  notes_like?: string;
  /** Filter by the date the user started the media*/
  startedAt_greater?: undefined;
  /** Filter by the date the user started the media*/
  startedAt_lesser?: undefined;
  /** Filter by the date the user started the media*/
  startedAt_like?: string;
  /** Filter by the date the user completed the media*/
  completedAt_greater?: undefined;
  /** Filter by the date the user completed the media*/
  completedAt_lesser?: undefined;
  /** Filter by the date the user completed the media*/
  completedAt_like?: string;
  /** The order the results will be returned in*/
  sort?: MediaListSort[];
}

/** Media list collection query, provides list pre-grouped by status & custom lists. User ID and Media Type arguments required. */
export interface MediaListCollectionArgs {
  /** Filter by a user's id*/
  userId?: number;
  /** Filter by a user's name*/
  userName?: string;
  /** Filter by the list entries media type*/
  type?: MediaType;
  /** Filter by the watching/reading status*/
  status?: MediaListStatus;
  /** Filter by note words and #tags*/
  notes?: string;
  /** Filter by the date the user started the media*/
  startedAt?: undefined;
  /** Filter by the date the user completed the media*/
  completedAt?: undefined;
  /** Always return completed list entries in one group, overriding the user's split completed option.*/
  forceSingleCompletedList?: boolean;
  /** Which chunk of list entries to load*/
  chunk?: number;
  /** The amount of entries per chunk, max 500*/
  perChunk?: number;
  /** Filter by the watching/reading status*/
  status_in?: MediaListStatus[];
  /** Filter by the watching/reading status*/
  status_not_in?: MediaListStatus[];
  /** Filter by the watching/reading status*/
  status_not?: MediaListStatus;
  /** Filter by note words and #tags*/
  notes_like?: string;
  /** Filter by the date the user started the media*/
  startedAt_greater?: undefined;
  /** Filter by the date the user started the media*/
  startedAt_lesser?: undefined;
  /** Filter by the date the user started the media*/
  startedAt_like?: string;
  /** Filter by the date the user completed the media*/
  completedAt_greater?: undefined;
  /** Filter by the date the user completed the media*/
  completedAt_lesser?: undefined;
  /** Filter by the date the user completed the media*/
  completedAt_like?: string;
  /** The order the results will be returned in*/
  sort?: MediaListSort[];
}

/** Collection of all the possible media genres */
export interface GenreCollectionArgs {}

/** Collection of all the possible media tags */
export interface MediaTagCollectionArgs {
  /** Mod Only*/
  status?: number;
}

/** Studio query */
export interface StudioArgs {
  /** Filter by the studio id*/
  id?: number;
  /** Filter by search query*/
  search?: string;
  /** Filter by the studio id*/
  id_not?: number;
  /** Filter by the studio id*/
  id_in?: number[];
  /** Filter by the studio id*/
  id_not_in?: number[];
  /** The order the results will be returned in*/
  sort?: StudioSort[];
}

/** Recommendation query */
export interface RecommendationArgs {
  /** Filter by recommendation id*/
  id?: number;
  /** Filter by media id*/
  mediaId?: number;
  /** Filter by media recommendation id*/
  mediaRecommendationId?: number;
  /** Filter by user who created the recommendation*/
  userId?: number;
  /** Filter by total rating of the recommendation*/
  rating?: number;
  /** Filter by the media on the authenticated user's lists*/
  onList?: boolean;
  /** Filter by total rating of the recommendation*/
  rating_greater?: number;
  /** Filter by total rating of the recommendation*/
  rating_lesser?: number;
  /** The order the results will be returned in*/
  sort?: RecommendationSort[];
}
