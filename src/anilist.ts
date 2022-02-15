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
  users: Maybe<User[]>;
  media: Maybe<Media[]>;
  characters: Maybe<Character[]>;
  staff: Maybe<Staff[]>;
  studios: Maybe<Studio[]>;
  mediaList: Maybe<MediaList[]>;
  airingSchedules: Maybe<AiringSchedule[]>;
  mediaTrends: Maybe<MediaTrend[]>;
  notifications: Maybe<NotificationUnion[]>;
  followers: Maybe<User[]>;
  following: Maybe<User[]>;
  activities: Maybe<ActivityUnion[]>;
  activityReplies: Maybe<ActivityReply[]>;
  threads: Maybe<Thread[]>;
  threadComments: Maybe<ThreadComment[]>;
  reviews: Maybe<Review[]>;
  recommendations: Maybe<Recommendation[]>;
  likes: Maybe<User[]>;
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

/** User sort enums */
export enum UserSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Username = "USERNAME",
  Username_desc = "USERNAME_DESC",
  Watched_time = "WATCHED_TIME",
  Watched_time_desc = "WATCHED_TIME_DESC",
  Chapters_read = "CHAPTERS_READ",
  Chapters_read_desc = "CHAPTERS_READ_DESC",
  Search_match = "SEARCH_MATCH",
}
/** A user */
export interface User {
  /** The id of the user*/
  id: number;
  /** The name of the user*/
  name: string;
  /** The bio written by user (Markdown)*/
  about: Maybe<string>;
  /** The user's avatar images*/
  avatar: Maybe<UserAvatar>;
  /** The user's banner images*/
  bannerImage: Maybe<string>;
  /** If the authenticated user if following this user*/
  isFollowing: Maybe<boolean>;
  /** If this user if following the authenticated user*/
  isFollower: Maybe<boolean>;
  /** If the user is blocked by the authenticated user*/
  isBlocked: Maybe<boolean>;
  bans: Maybe<string>;
  /** The user's general options*/
  options: Maybe<UserOptions>;
  /** The user's media list options*/
  mediaListOptions: Maybe<MediaListOptions>;
  /** The users favourites*/
  favourites: Maybe<Favourites>;
  /** The users anime & manga list statistics*/
  statistics: Maybe<UserStatisticTypes>;
  /** The number of unread notifications the user has*/
  unreadNotificationCount: Maybe<number>;
  /** The url for the user page on the AniList website*/
  siteUrl: Maybe<string>;
  /** The donation tier of the user*/
  donatorTier: Maybe<number>;
  /** Custom donation badge text*/
  donatorBadge: Maybe<string>;
  /** The user's moderator roles if they are a site moderator*/
  moderatorRoles: Maybe<ModRole[]>;
  /** When the user's account was created. (Does not exist for accounts created before 2020)*/
  createdAt: Maybe<number>;
  /** When the user's data was last updated*/
  updatedAt: Maybe<number>;
  /** @deprecated Deprecated. Replaced with statistics field.The user's statistics*/
  stats: Maybe<UserStats>;
  /** @deprecated Deprecated. Replaced with moderatorRoles field.If the user is a moderator or data moderator*/
  moderatorStatus: Maybe<string>;
  /** The user's previously used names.*/
  previousNames: Maybe<UserPreviousName[]>;
}

/** A user's avatars */
export interface UserAvatar {
  /** The avatar of user at its largest size*/
  large: Maybe<string>;
  /** The avatar of user at medium size*/
  medium: Maybe<string>;
}

/** A user's general options */
export interface UserOptions {
  /** The language the user wants to see media titles in*/
  titleLanguage: Maybe<UserTitleLanguage>;
  /** Whether the user has enabled viewing of 18+ content*/
  displayAdultContent: Maybe<boolean>;
  /** Whether the user receives notifications when a show they are watching aires*/
  airingNotifications: Maybe<boolean>;
  /** Profile highlight color (blue, purple, pink, orange, red, green, gray)*/
  profileColor: Maybe<string>;
  /** Notification options*/
  notificationOptions: Maybe<NotificationOption[]>;
  /** The user's timezone offset (Auth user only)*/
  timezone: Maybe<string>;
  /** Minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is Always.*/
  activityMergeTime: Maybe<number>;
  /** The language the user wants to see staff and character names in*/
  staffNameLanguage: Maybe<UserStaffNameLanguage>;
}

/** The language the user wants to see media titles in */
export enum UserTitleLanguage {
  Romaji = "ROMAJI",
  English = "ENGLISH",
  Native = "NATIVE",
  Romaji_stylised = "ROMAJI_STYLISED",
  English_stylised = "ENGLISH_STYLISED",
  Native_stylised = "NATIVE_STYLISED",
}
/** Notification option */
export interface NotificationOption {
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** Whether this type of notification is enabled*/
  enabled: Maybe<boolean>;
}

/** Notification type enum */
export enum NotificationType {
  Activity_message = "ACTIVITY_MESSAGE",
  Activity_reply = "ACTIVITY_REPLY",
  Following = "FOLLOWING",
  Activity_mention = "ACTIVITY_MENTION",
  Thread_comment_mention = "THREAD_COMMENT_MENTION",
  Thread_subscribed = "THREAD_SUBSCRIBED",
  Thread_comment_reply = "THREAD_COMMENT_REPLY",
  Airing = "AIRING",
  Activity_like = "ACTIVITY_LIKE",
  Activity_reply_like = "ACTIVITY_REPLY_LIKE",
  Thread_like = "THREAD_LIKE",
  Thread_comment_like = "THREAD_COMMENT_LIKE",
  Activity_reply_subscribed = "ACTIVITY_REPLY_SUBSCRIBED",
  Related_media_addition = "RELATED_MEDIA_ADDITION",
  Media_data_change = "MEDIA_DATA_CHANGE",
  Media_merge = "MEDIA_MERGE",
  Media_deletion = "MEDIA_DELETION",
}
/** The language the user wants to see staff and character names in */
export enum UserStaffNameLanguage {
  Romaji_western = "ROMAJI_WESTERN",
  Romaji = "ROMAJI",
  Native = "NATIVE",
}
/** A user's list options */
export interface MediaListOptions {
  /** The score format the user is using for media lists*/
  scoreFormat: Maybe<ScoreFormat>;
  /** The default order list rows should be displayed in*/
  rowOrder: Maybe<string>;
  /** @deprecated No longer used*/
  useLegacyLists: Maybe<boolean>;
  /** The user's anime list options*/
  animeList: Maybe<MediaListTypeOptions>;
  /** The user's manga list options*/
  mangaList: Maybe<MediaListTypeOptions>;
  /** @deprecated No longer usedThe list theme options for both lists*/
  sharedTheme: Maybe<string>;
  /** @deprecated No longer usedIf the shared theme should be used instead of the individual list themes*/
  sharedThemeEnabled: Maybe<boolean>;
}

/** Media list scoring type */
export enum ScoreFormat {
  Point_100 = "POINT_100",
  Point_10_decimal = "POINT_10_DECIMAL",
  Point_10 = "POINT_10",
  Point_5 = "POINT_5",
  Point_3 = "POINT_3",
}
/** A user's list options for anime or manga lists */
export interface MediaListTypeOptions {
  /** The order each list should be displayed in*/
  sectionOrder: Maybe<string[]>;
  /** If the completed sections of the list should be separated by format*/
  splitCompletedSectionByFormat: Maybe<boolean>;
  /** @deprecated This field has not yet been fully implemented and may change without warningThe list theme options*/
  theme: Maybe<string>;
  /** The names of the user's custom lists*/
  customLists: Maybe<string[]>;
  /** The names of the user's advanced scoring sections*/
  advancedScoring: Maybe<string[]>;
  /** If advanced scoring is enabled*/
  advancedScoringEnabled: Maybe<boolean>;
}

/** User's favourite anime, manga, characters, staff & studios */
export interface Favourites {
  /** Favourite anime*/
  anime: Maybe<MediaConnection>;
  /** Favourite manga*/
  manga: Maybe<MediaConnection>;
  /** Favourite characters*/
  characters: Maybe<CharacterConnection>;
  /** Favourite staff*/
  staff: Maybe<StaffConnection>;
  /** Favourite studios*/
  studios: Maybe<StudioConnection>;
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
  countryOfOrigin: Maybe<undefined>;
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
  /** User reviews of the media*/
  reviews: Maybe<ReviewConnection>;
  /** User recommendations for similar media*/
  recommendations: Maybe<RecommendationConnection>;
  stats: Maybe<MediaStats>;
  /** The url for the media page on the AniList website*/
  siteUrl: Maybe<string>;
  /** If the media should have forum thread automatically created for it on airing episode release*/
  autoCreateForumThread: Maybe<boolean>;
  /** If the media is blocked from being recommended to/from*/
  isRecommendationBlocked: Maybe<boolean>;
  /** Notes for site moderators*/
  modNotes: Maybe<string>;
}

/** The official titles of the media in various languages */
export interface MediaTitle {
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
  /** The primary language of the staff member. Current values: Japanese, English, Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian, Chinese, Arabic, Filipino, Catalan*/
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
  /** Submitter for the submission*/
  submitter: Maybe<User>;
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

/** An external link to another site related to the media */
export interface MediaExternalLink {
  /** The id of the external link*/
  id: number;
  /** The url of the external link*/
  url: string;
  /** The site location of the external link*/
  site: string;
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
/** List of anime or manga */
export interface MediaList {
  /** The id of the list entry*/
  id: number;
  /** The id of the user owner of the list entry*/
  userId: number;
  /** The id of the media*/
  mediaId: number;
  /** The watching/reading status*/
  status: Maybe<MediaListStatus>;
  /** The score of the entry*/
  score: Maybe<number>;
  /** The amount of episodes/chapters consumed by the user*/
  progress: Maybe<number>;
  /** The amount of volumes read by the user*/
  progressVolumes: Maybe<number>;
  /** The amount of times the user has rewatched/read the media*/
  repeat: Maybe<number>;
  /** Priority of planning*/
  priority: Maybe<number>;
  /** If the entry should only be visible to authenticated user*/
  private: Maybe<boolean>;
  /** Text notes*/
  notes: Maybe<string>;
  /** If the entry shown be hidden from non-custom lists*/
  hiddenFromStatusLists: Maybe<boolean>;
  /** Map of booleans for which custom lists the entry are in*/
  customLists: Maybe<string>;
  /** Map of advanced scores with name keys*/
  advancedScores: Maybe<string>;
  /** When the entry was started by the user*/
  startedAt: Maybe<FuzzyDate>;
  /** When the entry was completed by the user*/
  completedAt: Maybe<FuzzyDate>;
  /** When the entry data was last updated*/
  updatedAt: Maybe<number>;
  /** When the entry data was created*/
  createdAt: Maybe<number>;
  media: Maybe<Media>;
  user: Maybe<User>;
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

/** Review sort enums */
export enum ReviewSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Score = "SCORE",
  Score_desc = "SCORE_DESC",
  Rating = "RATING",
  Rating_desc = "RATING_DESC",
  Created_at = "CREATED_AT",
  Created_at_desc = "CREATED_AT_DESC",
  Updated_at = "UPDATED_AT",
  Updated_at_desc = "UPDATED_AT_DESC",
}
export interface ReviewConnection {
  edges: Maybe<ReviewEdge[]>;
  nodes: Maybe<Review[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Review connection edge */
export interface ReviewEdge {
  node: Maybe<Review>;
}

/** A Review that features in an anime or manga */
export interface Review {
  /** The id of the review*/
  id: number;
  /** The id of the review's creator*/
  userId: number;
  /** The id of the review's media*/
  mediaId: number;
  /** For which type of media the review is for*/
  mediaType: Maybe<MediaType>;
  /** A short summary of the review*/
  summary: Maybe<string>;
  /** The main review body text*/
  body: Maybe<string>;
  /** The total user rating of the review*/
  rating: Maybe<number>;
  /** The amount of user ratings of the review*/
  ratingAmount: Maybe<number>;
  /** The rating of the review by currently authenticated user*/
  userRating: Maybe<ReviewRating>;
  /** The review score of the media*/
  score: Maybe<number>;
  /** If the review is not yet publicly published and is only viewable by creator*/
  private: Maybe<boolean>;
  /** The url for the review page on the AniList website*/
  siteUrl: Maybe<string>;
  /** The time of the thread creation*/
  createdAt: number;
  /** The time of the thread last update*/
  updatedAt: number;
  /** The creator of the review*/
  user: Maybe<User>;
  /** The media the review is of*/
  media: Maybe<Media>;
}

/** Review rating enums */
export enum ReviewRating {
  No_vote = "NO_VOTE",
  Up_vote = "UP_VOTE",
  Down_vote = "DOWN_VOTE",
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
  user: Maybe<User>;
}

/** Recommendation rating enums */
export enum RecommendationRating {
  No_rating = "NO_RATING",
  Rate_up = "RATE_UP",
  Rate_down = "RATE_DOWN",
}
/** A media's statistics */
export interface MediaStats {
  scoreDistribution: Maybe<ScoreDistribution[]>;
  statusDistribution: Maybe<StatusDistribution[]>;
  /** @deprecated Replaced by MediaTrends*/
  airingProgression: Maybe<AiringProgression[]>;
}

/** A user's list score distribution. */
export interface ScoreDistribution {
  score: Maybe<number>;
  /** The amount of list entries with this score*/
  amount: Maybe<number>;
}

/** The distribution of the watching/reading status of media or a user's list */
export interface StatusDistribution {
  /** The day the activity took place (Unix timestamp)*/
  status: Maybe<MediaListStatus>;
  /** The amount of entries with this status*/
  amount: Maybe<number>;
}

/** Score & Watcher stats for airing anime by episode and mid-week */
export interface AiringProgression {
  /** The episode the stats were recorded at. .5 is the mid point between 2 episodes airing dates.*/
  episode: Maybe<number>;
  /** The average score for the media*/
  score: Maybe<number>;
  /** The amount of users watching the anime*/
  watching: Maybe<number>;
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
export interface UserStatisticTypes {
  anime: Maybe<UserStatistics>;
  manga: Maybe<UserStatistics>;
}

export interface UserStatistics {
  count: number;
  meanScore: number;
  standardDeviation: number;
  minutesWatched: number;
  episodesWatched: number;
  chaptersRead: number;
  volumesRead: number;
  formats: Maybe<UserFormatStatistic[]>;
  statuses: Maybe<UserStatusStatistic[]>;
  scores: Maybe<UserScoreStatistic[]>;
  lengths: Maybe<UserLengthStatistic[]>;
  releaseYears: Maybe<UserReleaseYearStatistic[]>;
  startYears: Maybe<UserStartYearStatistic[]>;
  genres: Maybe<UserGenreStatistic[]>;
  tags: Maybe<UserTagStatistic[]>;
  countries: Maybe<UserCountryStatistic[]>;
  voiceActors: Maybe<UserVoiceActorStatistic[]>;
  staff: Maybe<UserStaffStatistic[]>;
  studios: Maybe<UserStudioStatistic[]>;
}

/** User statistics sort enum */
export enum UserStatisticsSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Count = "COUNT",
  Count_desc = "COUNT_DESC",
  Progress = "PROGRESS",
  Progress_desc = "PROGRESS_DESC",
  Mean_score = "MEAN_SCORE",
  Mean_score_desc = "MEAN_SCORE_DESC",
}
export interface UserFormatStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  format: Maybe<MediaFormat>;
}

export interface UserStatusStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  status: Maybe<MediaListStatus>;
}

export interface UserScoreStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  score: Maybe<number>;
}

export interface UserLengthStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  length: Maybe<string>;
}

export interface UserReleaseYearStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  releaseYear: Maybe<number>;
}

export interface UserStartYearStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  startYear: Maybe<number>;
}

export interface UserGenreStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  genre: Maybe<string>;
}

export interface UserTagStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  tag: Maybe<MediaTag>;
}

export interface UserCountryStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  country: Maybe<undefined>;
}

export interface UserVoiceActorStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  voiceActor: Maybe<Staff>;
  characterIds: number[];
}

export interface UserStaffStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  staff: Maybe<Staff>;
}

export interface UserStudioStatistic {
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  studio: Maybe<Studio>;
}

/** Mod role enums */
export enum ModRole {
  Admin = "ADMIN",
  Lead_developer = "LEAD_DEVELOPER",
  Developer = "DEVELOPER",
  Lead_community = "LEAD_COMMUNITY",
  Community = "COMMUNITY",
  Discord_community = "DISCORD_COMMUNITY",
  Lead_anime_data = "LEAD_ANIME_DATA",
  Anime_data = "ANIME_DATA",
  Lead_manga_data = "LEAD_MANGA_DATA",
  Manga_data = "MANGA_DATA",
  Lead_social_media = "LEAD_SOCIAL_MEDIA",
  Social_media = "SOCIAL_MEDIA",
  Retired = "RETIRED",
}
/** A user's statistics */
export interface UserStats {
  /** The amount of anime the user has watched in minutes*/
  watchedTime: Maybe<number>;
  /** The amount of manga chapters the user has read*/
  chaptersRead: Maybe<number>;
  activityHistory: Maybe<UserActivityHistory[]>;
  animeStatusDistribution: Maybe<StatusDistribution[]>;
  mangaStatusDistribution: Maybe<StatusDistribution[]>;
  animeScoreDistribution: Maybe<ScoreDistribution[]>;
  mangaScoreDistribution: Maybe<ScoreDistribution[]>;
  animeListScores: Maybe<ListScoreStats>;
  mangaListScores: Maybe<ListScoreStats>;
  favouredGenresOverview: Maybe<GenreStats[]>;
  favouredGenres: Maybe<GenreStats[]>;
  favouredTags: Maybe<TagStats[]>;
  favouredActors: Maybe<StaffStats[]>;
  favouredStaff: Maybe<StaffStats[]>;
  favouredStudios: Maybe<StudioStats[]>;
  favouredYears: Maybe<YearStats[]>;
  favouredFormats: Maybe<FormatStats[]>;
}

/** A user's activity history stats. */
export interface UserActivityHistory {
  /** The day the activity took place (Unix timestamp)*/
  date: Maybe<number>;
  /** The amount of activity on the day*/
  amount: Maybe<number>;
  /** The level of activity represented on a 1-10 scale*/
  level: Maybe<number>;
}

/** User's list score statistics */
export interface ListScoreStats {
  meanScore: Maybe<number>;
  standardDeviation: Maybe<number>;
}

/** User's genre statistics */
export interface GenreStats {
  genre: Maybe<string>;
  amount: Maybe<number>;
  meanScore: Maybe<number>;
  /** The amount of time in minutes the genre has been watched by the user*/
  timeWatched: Maybe<number>;
}

/** User's tag statistics */
export interface TagStats {
  tag: Maybe<MediaTag>;
  amount: Maybe<number>;
  meanScore: Maybe<number>;
  /** The amount of time in minutes the tag has been watched by the user*/
  timeWatched: Maybe<number>;
}

/** User's staff statistics */
export interface StaffStats {
  staff: Maybe<Staff>;
  amount: Maybe<number>;
  meanScore: Maybe<number>;
  /** The amount of time in minutes the staff member has been watched by the user*/
  timeWatched: Maybe<number>;
}

/** User's studio statistics */
export interface StudioStats {
  studio: Maybe<Studio>;
  amount: Maybe<number>;
  meanScore: Maybe<number>;
  /** The amount of time in minutes the studio's works have been watched by the user*/
  timeWatched: Maybe<number>;
}

/** User's year statistics */
export interface YearStats {
  year: Maybe<number>;
  amount: Maybe<number>;
  meanScore: Maybe<number>;
}

/** User's format statistics */
export interface FormatStats {
  format: Maybe<MediaFormat>;
  amount: Maybe<number>;
}

/** A user's previous name */
export interface UserPreviousName {
  /** A previous name of the user.*/
  name: Maybe<string>;
  /** When the user first changed from this name.*/
  createdAt: Maybe<number>;
  /** When the user most recently changed from this name.*/
  updatedAt: Maybe<number>;
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
/** Notification union type */
export type NotificationUnion =
  | AiringNotification
  | FollowingNotification
  | ActivityMessageNotification
  | ActivityMentionNotification
  | ActivityReplyNotification
  | ActivityReplySubscribedNotification
  | ActivityLikeNotification
  | ActivityReplyLikeNotification
  | ThreadCommentMentionNotification
  | ThreadCommentReplyNotification
  | ThreadCommentSubscribedNotification
  | ThreadCommentLikeNotification
  | ThreadLikeNotification
  | RelatedMediaAdditionNotification
  | MediaDataChangeNotification
  | MediaMergeNotification
  | MediaDeletionNotification;
/** Notification for when an episode of anime airs */
export interface AiringNotification {
  /** The id of the Notification*/
  id: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the aired anime*/
  animeId: number;
  /** The episode number that just aired*/
  episode: number;
  /** The notification context text*/
  contexts: Maybe<string[]>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The associated media of the airing schedule*/
  media: Maybe<Media>;
}

/** Notification for when the authenticated user is followed by another user */
export interface FollowingNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who followed the authenticated user*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The liked activity*/
  user: Maybe<User>;
}

/** Notification for when a user is send an activity message */
export interface ActivityMessageNotification {
  /** The id of the Notification*/
  id: number;
  /** The if of the user who send the message*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity message*/
  activityId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The message activity*/
  message: Maybe<MessageActivity>;
  /** The user who sent the message*/
  user: Maybe<User>;
}

/** User message activity */
export interface MessageActivity {
  /** The id of the activity*/
  id: number;
  /** The user id of the activity's recipient*/
  recipientId: Maybe<number>;
  /** The user id of the activity's sender*/
  messengerId: Maybe<number>;
  /** The type of the activity*/
  type: Maybe<ActivityType>;
  /** The number of activity replies*/
  replyCount: number;
  /** The message text (Markdown)*/
  message: Maybe<string>;
  /** If the activity is locked and can receive replies*/
  isLocked: Maybe<boolean>;
  /** If the currently authenticated user is subscribed to the activity*/
  isSubscribed: Maybe<boolean>;
  /** The amount of likes the activity has*/
  likeCount: number;
  /** If the currently authenticated user liked the activity*/
  isLiked: Maybe<boolean>;
  /** If the message is private and only viewable to the sender and recipients*/
  isPrivate: Maybe<boolean>;
  /** The url for the activity page on the AniList website*/
  siteUrl: Maybe<string>;
  /** The time the activity was created at*/
  createdAt: number;
  /** The user who the activity message was sent to*/
  recipient: Maybe<User>;
  /** The user who sent the activity message*/
  messenger: Maybe<User>;
  /** The written replies to the activity*/
  replies: Maybe<ActivityReply[]>;
  /** The users who liked the activity*/
  likes: Maybe<User[]>;
}

/** Activity type enum. */
export enum ActivityType {
  Text = "TEXT",
  Anime_list = "ANIME_LIST",
  Manga_list = "MANGA_LIST",
  Message = "MESSAGE",
  Media_list = "MEDIA_LIST",
}
/** Replay to an activity item */
export interface ActivityReply {
  /** The id of the reply*/
  id: number;
  /** The id of the replies creator*/
  userId: Maybe<number>;
  /** The id of the parent activity*/
  activityId: Maybe<number>;
  /** The reply text*/
  text: Maybe<string>;
  /** The amount of likes the reply has*/
  likeCount: number;
  /** If the currently authenticated user liked the reply*/
  isLiked: Maybe<boolean>;
  /** The time the reply was created at*/
  createdAt: number;
  /** The user who created reply*/
  user: Maybe<User>;
  /** The users who liked the reply*/
  likes: Maybe<User[]>;
}

/** Notification for when authenticated user is @ mentioned in activity or reply */
export interface ActivityMentionNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who mentioned the authenticated user*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity where mentioned*/
  activityId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The liked activity*/
  activity: Maybe<ActivityUnion>;
  /** The user who mentioned the authenticated user*/
  user: Maybe<User>;
}

/** Activity union type */
export type ActivityUnion = TextActivity | ListActivity | MessageActivity;
/** User text activity */
export interface TextActivity {
  /** The id of the activity*/
  id: number;
  /** The user id of the activity's creator*/
  userId: Maybe<number>;
  /** The type of activity*/
  type: Maybe<ActivityType>;
  /** The number of activity replies*/
  replyCount: number;
  /** The status text (Markdown)*/
  text: Maybe<string>;
  /** The url for the activity page on the AniList website*/
  siteUrl: Maybe<string>;
  /** If the activity is locked and can receive replies*/
  isLocked: Maybe<boolean>;
  /** If the currently authenticated user is subscribed to the activity*/
  isSubscribed: Maybe<boolean>;
  /** The amount of likes the activity has*/
  likeCount: number;
  /** If the currently authenticated user liked the activity*/
  isLiked: Maybe<boolean>;
  /** The time the activity was created at*/
  createdAt: number;
  /** The user who created the activity*/
  user: Maybe<User>;
  /** The written replies to the activity*/
  replies: Maybe<ActivityReply[]>;
  /** The users who liked the activity*/
  likes: Maybe<User[]>;
}

/** User list activity (anime & manga updates) */
export interface ListActivity {
  /** The id of the activity*/
  id: number;
  /** The user id of the activity's creator*/
  userId: Maybe<number>;
  /** The type of activity*/
  type: Maybe<ActivityType>;
  /** The number of activity replies*/
  replyCount: number;
  /** The list item's textual status*/
  status: Maybe<string>;
  /** The list progress made*/
  progress: Maybe<string>;
  /** If the activity is locked and can receive replies*/
  isLocked: Maybe<boolean>;
  /** If the currently authenticated user is subscribed to the activity*/
  isSubscribed: Maybe<boolean>;
  /** The amount of likes the activity has*/
  likeCount: number;
  /** If the currently authenticated user liked the activity*/
  isLiked: Maybe<boolean>;
  /** The url for the activity page on the AniList website*/
  siteUrl: Maybe<string>;
  /** The time the activity was created at*/
  createdAt: number;
  /** The owner of the activity*/
  user: Maybe<User>;
  /** The associated media to the activity update*/
  media: Maybe<Media>;
  /** The written replies to the activity*/
  replies: Maybe<ActivityReply[]>;
  /** The users who liked the activity*/
  likes: Maybe<User[]>;
}

/** Notification for when a user replies to the authenticated users activity */
export interface ActivityReplyNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who replied to the activity*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity which was replied too*/
  activityId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The liked activity*/
  activity: Maybe<ActivityUnion>;
  /** The user who replied to the activity*/
  user: Maybe<User>;
}

/** Notification for when a user replies to activity the authenticated user has replied to */
export interface ActivityReplySubscribedNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who replied to the activity*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity which was replied too*/
  activityId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The liked activity*/
  activity: Maybe<ActivityUnion>;
  /** The user who replied to the activity*/
  user: Maybe<User>;
}

/** Notification for when a activity is liked */
export interface ActivityLikeNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who liked to the activity*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity which was liked*/
  activityId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The liked activity*/
  activity: Maybe<ActivityUnion>;
  /** The user who liked the activity*/
  user: Maybe<User>;
}

/** Notification for when a activity reply is liked */
export interface ActivityReplyLikeNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who liked to the activity reply*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity where the reply which was liked*/
  activityId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The liked activity*/
  activity: Maybe<ActivityUnion>;
  /** The user who liked the activity reply*/
  user: Maybe<User>;
}

/** Notification for when authenticated user is @ mentioned in a forum thread comment */
export interface ThreadCommentMentionNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who mentioned the authenticated user*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the comment where mentioned*/
  commentId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The thread that the relevant comment belongs to*/
  thread: Maybe<Thread>;
  /** The thread comment that included the @ mention*/
  comment: Maybe<ThreadComment>;
  /** The user who mentioned the authenticated user*/
  user: Maybe<User>;
}

/** Forum Thread */
export interface Thread {
  /** The id of the thread*/
  id: number;
  /** The title of the thread*/
  title: Maybe<string>;
  /** The text body of the thread (Markdown)*/
  body: Maybe<string>;
  /** The id of the thread owner user*/
  userId: number;
  /** The id of the user who most recently commented on the thread*/
  replyUserId: Maybe<number>;
  /** The id of the most recent comment on the thread*/
  replyCommentId: Maybe<number>;
  /** The number of comments on the thread*/
  replyCount: Maybe<number>;
  /** The number of times users have viewed the thread*/
  viewCount: Maybe<number>;
  /** If the thread is locked and can receive comments*/
  isLocked: Maybe<boolean>;
  /** If the thread is stickied and should be displayed at the top of the page*/
  isSticky: Maybe<boolean>;
  /** If the currently authenticated user is subscribed to the thread*/
  isSubscribed: Maybe<boolean>;
  /** The amount of likes the thread has*/
  likeCount: number;
  /** If the currently authenticated user liked the thread*/
  isLiked: Maybe<boolean>;
  /** The time of the last reply*/
  repliedAt: Maybe<number>;
  /** The time of the thread creation*/
  createdAt: number;
  /** The time of the thread last update*/
  updatedAt: number;
  /** The owner of the thread*/
  user: Maybe<User>;
  /** The user to last reply to the thread*/
  replyUser: Maybe<User>;
  /** The users who liked the thread*/
  likes: Maybe<User[]>;
  /** The url for the thread page on the AniList website*/
  siteUrl: Maybe<string>;
  /** The categories of the thread*/
  categories: Maybe<ThreadCategory[]>;
  /** The media categories of the thread*/
  mediaCategories: Maybe<Media[]>;
}

/** A forum thread category */
export interface ThreadCategory {
  /** The id of the category*/
  id: number;
  /** The name of the category*/
  name: string;
}

/** Forum Thread Comment */
export interface ThreadComment {
  /** The id of the comment*/
  id: number;
  /** The user id of the comment's owner*/
  userId: Maybe<number>;
  /** The id of thread the comment belongs to*/
  threadId: Maybe<number>;
  /** The text content of the comment (Markdown)*/
  comment: Maybe<string>;
  /** The amount of likes the comment has*/
  likeCount: number;
  /** If the currently authenticated user liked the comment*/
  isLiked: Maybe<boolean>;
  /** The url for the comment page on the AniList website*/
  siteUrl: Maybe<string>;
  /** The time of the comments creation*/
  createdAt: number;
  /** The time of the comments last update*/
  updatedAt: number;
  /** The thread the comment belongs to*/
  thread: Maybe<Thread>;
  /** The user who created the comment*/
  user: Maybe<User>;
  /** The users who liked the comment*/
  likes: Maybe<User[]>;
  /** The comment's child reply comments*/
  childComments: Maybe<string>;
  /** If the comment tree is locked and may not receive replies or edits*/
  isLocked: Maybe<boolean>;
}

/** Notification for when a user replies to your forum thread comment */
export interface ThreadCommentReplyNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who create the comment reply*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the reply comment*/
  commentId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The thread that the relevant comment belongs to*/
  thread: Maybe<Thread>;
  /** The reply thread comment*/
  comment: Maybe<ThreadComment>;
  /** The user who replied to the activity*/
  user: Maybe<User>;
}

/** Notification for when a user replies to a subscribed forum thread */
export interface ThreadCommentSubscribedNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who commented on the thread*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the new comment in the subscribed thread*/
  commentId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The thread that the relevant comment belongs to*/
  thread: Maybe<Thread>;
  /** The reply thread comment*/
  comment: Maybe<ThreadComment>;
  /** The user who replied to the subscribed thread*/
  user: Maybe<User>;
}

/** Notification for when a thread comment is liked */
export interface ThreadCommentLikeNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who liked to the activity*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the activity which was liked*/
  commentId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The thread that the relevant comment belongs to*/
  thread: Maybe<Thread>;
  /** The thread comment that was liked*/
  comment: Maybe<ThreadComment>;
  /** The user who liked the activity*/
  user: Maybe<User>;
}

/** Notification for when a thread is liked */
export interface ThreadLikeNotification {
  /** The id of the Notification*/
  id: number;
  /** The id of the user who liked to the activity*/
  userId: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the thread which was liked*/
  threadId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The thread that the relevant comment belongs to*/
  thread: Maybe<Thread>;
  /** The liked thread comment*/
  comment: Maybe<ThreadComment>;
  /** The user who liked the activity*/
  user: Maybe<User>;
}

/** Notification for when new media is added to the site */
export interface RelatedMediaAdditionNotification {
  /** The id of the Notification*/
  id: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the new media*/
  mediaId: number;
  /** The notification context text*/
  context: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The associated media of the airing schedule*/
  media: Maybe<Media>;
}

/** Notification for when a media entry's data was changed in a significant way impacting users' list tracking */
export interface MediaDataChangeNotification {
  /** The id of the Notification*/
  id: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the media that received data changes*/
  mediaId: number;
  /** The reason for the media data change*/
  context: Maybe<string>;
  /** The reason for the media data change*/
  reason: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The media that received data changes*/
  media: Maybe<Media>;
}

/** Notification for when a media entry is merged into another for a user who had it on their list */
export interface MediaMergeNotification {
  /** The id of the Notification*/
  id: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The id of the media that was merged into*/
  mediaId: number;
  /** The title of the deleted media*/
  deletedMediaTitles: Maybe<string[]>;
  /** The reason for the media data change*/
  context: Maybe<string>;
  /** The reason for the media merge*/
  reason: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
  /** The media that was merged into*/
  media: Maybe<Media>;
}

/** Notification for when a media tracked in a user's list is deleted from the site */
export interface MediaDeletionNotification {
  /** The id of the Notification*/
  id: number;
  /** The type of notification*/
  type: Maybe<NotificationType>;
  /** The title of the deleted media*/
  deletedMediaTitle: Maybe<string>;
  /** The reason for the media deletion*/
  context: Maybe<string>;
  /** The reason for the media deletion*/
  reason: Maybe<string>;
  /** The time the notification was created at*/
  createdAt: Maybe<number>;
}

/** Activity sort enums */
export enum ActivitySort {
  Id = "ID",
  Id_desc = "ID_DESC",
}
/** Thread sort enums */
export enum ThreadSort {
  Id = "ID",
  Id_desc = "ID_DESC",
  Title = "TITLE",
  Title_desc = "TITLE_DESC",
  Created_at = "CREATED_AT",
  Created_at_desc = "CREATED_AT_DESC",
  Updated_at = "UPDATED_AT",
  Updated_at_desc = "UPDATED_AT_DESC",
  Replied_at = "REPLIED_AT",
  Replied_at_desc = "REPLIED_AT_DESC",
  Reply_count = "REPLY_COUNT",
  Reply_count_desc = "REPLY_COUNT_DESC",
  View_count = "VIEW_COUNT",
  View_count_desc = "VIEW_COUNT_DESC",
  Is_sticky = "IS_STICKY",
  Search_match = "SEARCH_MATCH",
}
/** Thread comments sort enums */
export enum ThreadCommentSort {
  Id = "ID",
  Id_desc = "ID_DESC",
}
/** Types that can be liked */
export enum LikeableType {
  Thread = "THREAD",
  Thread_comment = "THREAD_COMMENT",
  Activity = "ACTIVITY",
  Activity_reply = "ACTIVITY_REPLY",
}
/** List of anime or manga */
export interface MediaListCollection {
  /** Grouped media list entries*/
  lists: Maybe<MediaListGroup[]>;
  /** The owner of the list*/
  user: Maybe<User>;
  /** If there is another chunk*/
  hasNextChunk: Maybe<boolean>;
  /** @deprecated Not GraphQL spec compliant, use lists field instead.A map of media list entry arrays grouped by status*/
  statusLists: Maybe<MediaList[]>;
  /** @deprecated Not GraphQL spec compliant, use lists field instead.A map of media list entry arrays grouped by custom lists*/
  customLists: Maybe<MediaList[]>;
}

/** List group of anime or manga entries */
export interface MediaListGroup {
  /** Media list entries*/
  entries: Maybe<MediaList[]>;
  name: Maybe<string>;
  isCustomList: Maybe<boolean>;
  isSplitCompletedList: Maybe<boolean>;
  status: Maybe<MediaListStatus>;
}

/** Provides the parsed markdown as html */
export interface ParsedMarkdown {
  /** The parsed markdown as html*/
  html: Maybe<string>;
}

export interface AniChartUser {
  user: Maybe<User>;
  settings: Maybe<string>;
  highlights: Maybe<string>;
}

export interface SiteStatistics {
  users: Maybe<SiteTrendConnection>;
  anime: Maybe<SiteTrendConnection>;
  manga: Maybe<SiteTrendConnection>;
  characters: Maybe<SiteTrendConnection>;
  staff: Maybe<SiteTrendConnection>;
  studios: Maybe<SiteTrendConnection>;
  reviews: Maybe<SiteTrendConnection>;
}

/** Site trend sort enums */
export enum SiteTrendSort {
  Date = "DATE",
  Date_desc = "DATE_DESC",
  Count = "COUNT",
  Count_desc = "COUNT_DESC",
  Change = "CHANGE",
  Change_desc = "CHANGE_DESC",
}
export interface SiteTrendConnection {
  edges: Maybe<SiteTrendEdge[]>;
  nodes: Maybe<SiteTrend[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** Site trend connection edge */
export interface SiteTrendEdge {
  node: Maybe<SiteTrend>;
}

/** Daily site statistics */
export interface SiteTrend {
  /** The day the data was recorded (timestamp)*/
  date: number;
  count: number;
  /** The change from yesterday*/
  change: number;
}

/** Notification option input */
export interface NotificationOptionInput {
  /** The type of notification*/
  type?: NotificationType;
  /** Whether this type of notification is enabled*/
  enabled?: boolean;
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

/** Likeable union type */
export type LikeableUnion =
  | ListActivity
  | TextActivity
  | MessageActivity
  | ActivityReply
  | Thread
  | ThreadComment;
export interface AniChartHighlightInput {
  mediaId?: number;
  highlight?: string;
}

/** Page of data (Used for internal use only) */
export interface InternalPage {
  mediaSubmissions: Maybe<MediaSubmission[]>;
  characterSubmissions: Maybe<CharacterSubmission[]>;
  staffSubmissions: Maybe<StaffSubmission[]>;
  revisionHistory: Maybe<RevisionHistory[]>;
  reports: Maybe<Report[]>;
  modActions: Maybe<ModAction[]>;
  userBlockSearch: Maybe<User[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
  users: Maybe<User[]>;
  media: Maybe<Media[]>;
  characters: Maybe<Character[]>;
  staff: Maybe<Staff[]>;
  studios: Maybe<Studio[]>;
  mediaList: Maybe<MediaList[]>;
  airingSchedules: Maybe<AiringSchedule[]>;
  mediaTrends: Maybe<MediaTrend[]>;
  notifications: Maybe<NotificationUnion[]>;
  followers: Maybe<User[]>;
  following: Maybe<User[]>;
  activities: Maybe<ActivityUnion[]>;
  activityReplies: Maybe<ActivityReply[]>;
  threads: Maybe<Thread[]>;
  threadComments: Maybe<ThreadComment[]>;
  reviews: Maybe<Review[]>;
  recommendations: Maybe<Recommendation[]>;
  likes: Maybe<User[]>;
}

/** Submission status */
export enum SubmissionStatus {
  Pending = "PENDING",
  Rejected = "REJECTED",
  Partially_accepted = "PARTIALLY_ACCEPTED",
  Accepted = "ACCEPTED",
}
/** Submission sort enums */
export enum SubmissionSort {
  Id = "ID",
  Id_desc = "ID_DESC",
}
/** Media submission */
export interface MediaSubmission {
  /** The id of the submission*/
  id: number;
  /** User submitter of the submission*/
  submitter: Maybe<User>;
  /** Data Mod assigned to handle the submission*/
  assignee: Maybe<User>;
  /** Status of the submission*/
  status: Maybe<SubmissionStatus>;
  submitterStats: Maybe<string>;
  notes: Maybe<string>;
  source: Maybe<string>;
  changes: Maybe<string[]>;
  /** Whether the submission is locked*/
  locked: Maybe<boolean>;
  media: Maybe<Media>;
  submission: Maybe<Media>;
  characters: Maybe<MediaSubmissionComparison[]>;
  staff: Maybe<MediaSubmissionComparison[]>;
  studios: Maybe<MediaSubmissionComparison[]>;
  relations: Maybe<MediaEdge[]>;
  externalLinks: Maybe<MediaExternalLink[]>;
  createdAt: Maybe<number>;
}

/** Media submission with comparison to current data */
export interface MediaSubmissionComparison {
  submission: Maybe<MediaSubmissionEdge>;
  character: Maybe<MediaCharacter>;
  staff: Maybe<StaffEdge>;
  studio: Maybe<StudioEdge>;
}

export interface MediaSubmissionEdge {
  /** The id of the direct submission*/
  id: Maybe<number>;
  characterRole: Maybe<CharacterRole>;
  staffRole: Maybe<string>;
  roleNotes: Maybe<string>;
  dubGroup: Maybe<string>;
  characterName: Maybe<string>;
  isMain: Maybe<boolean>;
  character: Maybe<Character>;
  characterSubmission: Maybe<Character>;
  voiceActor: Maybe<Staff>;
  voiceActorSubmission: Maybe<Staff>;
  staff: Maybe<Staff>;
  staffSubmission: Maybe<Staff>;
  studio: Maybe<Studio>;
  media: Maybe<Media>;
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

/** A submission for a character that features in an anime or manga */
export interface CharacterSubmission {
  /** The id of the submission*/
  id: number;
  /** Character that the submission is referencing*/
  character: Maybe<Character>;
  /** The character submission changes*/
  submission: Maybe<Character>;
  /** Submitter for the submission*/
  submitter: Maybe<User>;
  /** Data Mod assigned to handle the submission*/
  assignee: Maybe<User>;
  /** Status of the submission*/
  status: Maybe<SubmissionStatus>;
  /** Inner details of submission status*/
  notes: Maybe<string>;
  source: Maybe<string>;
  /** Whether the submission is locked*/
  locked: Maybe<boolean>;
  createdAt: Maybe<number>;
}

/** A submission for a staff that features in an anime or manga */
export interface StaffSubmission {
  /** The id of the submission*/
  id: number;
  /** Staff that the submission is referencing*/
  staff: Maybe<Staff>;
  /** The staff submission changes*/
  submission: Maybe<Staff>;
  /** Submitter for the submission*/
  submitter: Maybe<User>;
  /** Data Mod assigned to handle the submission*/
  assignee: Maybe<User>;
  /** Status of the submission*/
  status: Maybe<SubmissionStatus>;
  /** Inner details of submission status*/
  notes: Maybe<string>;
  source: Maybe<string>;
  /** Whether the submission is locked*/
  locked: Maybe<boolean>;
  createdAt: Maybe<number>;
}

/** Feed of mod edit activity */
export interface RevisionHistory {
  /** The id of the media*/
  id: number;
  /** The action taken on the objects*/
  action: Maybe<RevisionHistoryAction>;
  /** A JSON object of the fields that changed*/
  changes: Maybe<string>;
  /** The user who made the edit to the object*/
  user: Maybe<User>;
  /** The media the mod feed entry references*/
  media: Maybe<Media>;
  /** The character the mod feed entry references*/
  character: Maybe<Character>;
  /** The staff member the mod feed entry references*/
  staff: Maybe<Staff>;
  /** The studio the mod feed entry references*/
  studio: Maybe<Studio>;
  /** When the mod feed entry was created*/
  createdAt: Maybe<number>;
}

/** Revision history actions */
export enum RevisionHistoryAction {
  Create = "CREATE",
  Edit = "EDIT",
}
export interface Report {
  id: number;
  reporter: Maybe<User>;
  reported: Maybe<User>;
  reason: Maybe<string>;
  /** When the entry data was created*/
  createdAt: Maybe<number>;
  cleared: Maybe<boolean>;
}

export interface ModAction {
  /** The id of the action*/
  id: number;
  user: Maybe<User>;
  mod: Maybe<User>;
  type: Maybe<ModActionType>;
  objectId: Maybe<number>;
  objectType: Maybe<string>;
  data: Maybe<string>;
  createdAt: number;
}

export enum ModActionType {
  Note = "NOTE",
  Ban = "BAN",
  Delete = "DELETE",
  Edit = "EDIT",
  Expire = "EXPIRE",
  Report = "REPORT",
  Reset = "RESET",
  Anon = "ANON",
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

/** An external link to another site related to the media */
export interface MediaExternalLinkInput {
  /** The id of the external link*/
  id: number;
  /** The url of the external link*/
  url: string;
  /** The site location of the external link*/
  site: string;
}

export interface AiringScheduleInput {
  airingAt?: number;
  episode?: number;
  timeUntilAiring?: number;
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

export interface CharacterSubmissionConnection {
  edges: Maybe<CharacterSubmissionEdge[]>;
  nodes: Maybe<CharacterSubmission[]>;
  /** The pagination information*/
  pageInfo: Maybe<PageInfo>;
}

/** CharacterSubmission connection edge */
export interface CharacterSubmissionEdge {
  node: Maybe<CharacterSubmission>;
  /** The characters role in the media*/
  role: Maybe<CharacterRole>;
  /** The voice actors of the character*/
  voiceActors: Maybe<Staff[]>;
  /** The submitted voice actors of the character*/
  submittedVoiceActors: Maybe<StaffSubmission[]>;
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

/** User data for moderators */
export interface UserModData {
  alts: Maybe<User[]>;
  bans: Maybe<string>;
  ip: Maybe<string>;
  counts: Maybe<string>;
  privacy: Maybe<number>;
  email: Maybe<string>;
}

export interface PageArgs {
  /** The page number*/
  page?: number;
  /** The amount of entries per page, max 50*/
  perPage?: number;
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
  /** Filter media by sites with a online streaming or reading license*/
  licensedBy?: string;
  /** Filter by the media's average score*/
  averageScore?: number;
  /** Filter by the number of users with this media on their list*/
  popularity?: number;
  /** Filter by the source type of the media*/
  source?: MediaSource;
  /** Filter by the media's country of origin*/
  countryOfOrigin?: undefined;
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
  /** Filter media by sites with a online streaming or reading license*/
  licensedBy_in?: string[];
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

/** Media Trend query */
export interface MediaTrendArgs {
  /** Filter by the media id*/
  mediaId?: number;
  /** Filter by date*/
  date?: number;
  /** Filter by trending amount*/
  trending?: number;
  /** Filter by score*/
  averageScore?: number;
  /** Filter by popularity*/
  popularity?: number;
  /** Filter by episode number*/
  episode?: number;
  /** Filter to stats recorded while the media was releasing*/
  releasing?: boolean;
  /** Filter by the media id*/
  mediaId_not?: number;
  /** Filter by the media id*/
  mediaId_in?: number[];
  /** Filter by the media id*/
  mediaId_not_in?: number[];
  /** Filter by date*/
  date_greater?: number;
  /** Filter by date*/
  date_lesser?: number;
  /** Filter by trending amount*/
  trending_greater?: number;
  /** Filter by trending amount*/
  trending_lesser?: number;
  /** Filter by trending amount*/
  trending_not?: number;
  /** Filter by score*/
  averageScore_greater?: number;
  /** Filter by score*/
  averageScore_lesser?: number;
  /** Filter by score*/
  averageScore_not?: number;
  /** Filter by popularity*/
  popularity_greater?: number;
  /** Filter by popularity*/
  popularity_lesser?: number;
  /** Filter by popularity*/
  popularity_not?: number;
  /** Filter by episode number*/
  episode_greater?: number;
  /** Filter by episode number*/
  episode_lesser?: number;
  /** Filter by episode number*/
  episode_not?: number;
  /** The order the results will be returned in*/
  sort?: MediaTrendSort[];
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

/** User query */
export interface UserArgs {
  /** Filter by the user id*/
  id?: number;
  /** Filter by the name of the user*/
  name?: string;
  /** Filter to moderators only if true*/
  isModerator?: boolean;
  /** Filter by search query*/
  search?: string;
  /** The order the results will be returned in*/
  sort?: UserSort[];
}

/** Get the currently authenticated user */
export interface ViewerArgs {}

/** Notification query */
export interface NotificationArgs {
  /** Filter by the type of notifications*/
  type?: NotificationType;
  /** Reset the unread notification count to 0 on load*/
  resetNotificationCount?: boolean;
  /** Filter by the type of notifications*/
  type_in?: NotificationType[];
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

/** Review query */
export interface ReviewArgs {
  /** Filter by Review id*/
  id?: number;
  /** Filter by media id*/
  mediaId?: number;
  /** Filter by user id*/
  userId?: number;
  /** Filter by media type*/
  mediaType?: MediaType;
  /** The order the results will be returned in*/
  sort?: ReviewSort[];
}

/** Activity query */
export interface ActivityArgs {
  /** Filter by the activity id*/
  id?: number;
  /** Filter by the owner user id*/
  userId?: number;
  /** Filter by the id of the user who sent a message*/
  messengerId?: number;
  /** Filter by the associated media id of the activity*/
  mediaId?: number;
  /** Filter by the type of activity*/
  type?: ActivityType;
  /** Filter activity to users who are being followed by the authenticated user*/
  isFollowing?: boolean;
  /** Filter activity to only activity with replies*/
  hasReplies?: boolean;
  /** Filter activity to only activity with replies or is of type text*/
  hasRepliesOrTypeText?: boolean;
  /** Filter by the time the activity was created*/
  createdAt?: number;
  /** Filter by the activity id*/
  id_not?: number;
  /** Filter by the activity id*/
  id_in?: number[];
  /** Filter by the activity id*/
  id_not_in?: number[];
  /** Filter by the owner user id*/
  userId_not?: number;
  /** Filter by the owner user id*/
  userId_in?: number[];
  /** Filter by the owner user id*/
  userId_not_in?: number[];
  /** Filter by the id of the user who sent a message*/
  messengerId_not?: number;
  /** Filter by the id of the user who sent a message*/
  messengerId_in?: number[];
  /** Filter by the id of the user who sent a message*/
  messengerId_not_in?: number[];
  /** Filter by the associated media id of the activity*/
  mediaId_not?: number;
  /** Filter by the associated media id of the activity*/
  mediaId_in?: number[];
  /** Filter by the associated media id of the activity*/
  mediaId_not_in?: number[];
  /** Filter by the type of activity*/
  type_not?: ActivityType;
  /** Filter by the type of activity*/
  type_in?: ActivityType[];
  /** Filter by the type of activity*/
  type_not_in?: ActivityType[];
  /** Filter by the time the activity was created*/
  createdAt_greater?: number;
  /** Filter by the time the activity was created*/
  createdAt_lesser?: number;
  /** The order the results will be returned in*/
  sort?: ActivitySort[];
}

/** Activity reply query */
export interface ActivityReplyArgs {
  /** Filter by the reply id*/
  id?: number;
  /** Filter by the parent id*/
  activityId?: number;
}

/** Follow query */
export interface FollowingArgs {
  /** User id of the follower/followed*/
  userId: number;
  /** The order the results will be returned in*/
  sort?: UserSort[];
}

/** Follow query */
export interface FollowerArgs {
  /** User id of the follower/followed*/
  userId: number;
  /** The order the results will be returned in*/
  sort?: UserSort[];
}

/** Thread query */
export interface ThreadArgs {
  /** Filter by the thread id*/
  id?: number;
  /** Filter by the user id of the thread's creator*/
  userId?: number;
  /** Filter by the user id of the last user to comment on the thread*/
  replyUserId?: number;
  /** Filter by if the currently authenticated user's subscribed threads*/
  subscribed?: boolean;
  /** Filter by thread category id*/
  categoryId?: number;
  /** Filter by thread media id category*/
  mediaCategoryId?: number;
  /** Filter by search query*/
  search?: string;
  /** Filter by the thread id*/
  id_in?: number[];
  /** The order the results will be returned in*/
  sort?: ThreadSort[];
}

/** Comment query */
export interface ThreadCommentArgs {
  /** Filter by the comment id*/
  id?: number;
  /** Filter by the thread id*/
  threadId?: number;
  /** Filter by the user id of the comment's creator*/
  userId?: number;
  /** The order the results will be returned in*/
  sort?: ThreadCommentSort[];
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

/** Like query */
export interface LikeArgs {
  /** The id of the likeable type*/
  likeableId?: number;
  /** The type of model the id applies to*/
  type?: LikeableType;
}

/** Provide AniList markdown to be converted to html (Requires auth) */
export interface MarkdownArgs {
  /** The markdown to be parsed to html*/
  markdown: string;
}

export interface AniChartUserArgs {}

/** Site statistics query */
export interface SiteStatisticsArgs {}

export interface UpdateUserArgs {
  /** User's about/bio text*/
  about?: string;
  /** User's title language*/
  titleLanguage?: UserTitleLanguage;
  /** If the user should see media marked as adult-only*/
  displayAdultContent?: boolean;
  /** If the user should get notifications when a show they are watching aires*/
  airingNotifications?: boolean;
  /** The user's list scoring system*/
  scoreFormat?: ScoreFormat;
  /** The user's default list order*/
  rowOrder?: string;
  /** Profile highlight color*/
  profileColor?: string;
  /** Profile highlight color*/
  donatorBadge?: string;
  /** Notification options*/
  notificationOptions?: NotificationOptionInput[];
  /** Timezone offset format: -?HH:MM*/
  timezone?: string;
  /** Minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is Always.*/
  activityMergeTime?: number;
  /** The user's anime list options*/
  animeListOptions?: MediaListOptionsInput;
  /** The user's anime list options*/
  mangaListOptions?: MediaListOptionsInput;
  /** The language the user wants to see staff and character names in*/
  staffNameLanguage?: UserStaffNameLanguage;
}

/** Create or update a media list entry */
export interface SaveMediaListEntryArgs {
  /** The list entry id, required for updating*/
  id?: number;
  /** The id of the media the entry is of*/
  mediaId?: number;
  /** The watching/reading status*/
  status?: MediaListStatus;
  /** The score of the media in the user's chosen scoring method*/
  score?: number;
  /** The score of the media in 100 point*/
  scoreRaw?: number;
  /** The amount of episodes/chapters consumed by the user*/
  progress?: number;
  /** The amount of volumes read by the user*/
  progressVolumes?: number;
  /** The amount of times the user has rewatched/read the media*/
  repeat?: number;
  /** Priority of planning*/
  priority?: number;
  /** If the entry should only be visible to authenticated user*/
  private?: boolean;
  /** Text notes*/
  notes?: string;
  /** If the entry shown be hidden from non-custom lists*/
  hiddenFromStatusLists?: boolean;
  /** Array of custom list names which should be enabled for this entry*/
  customLists?: string[];
  /** Array of advanced scores*/
  advancedScores?: number[];
  /** When the entry was started by the user*/
  startedAt?: FuzzyDateInput;
  /** When the entry was completed by the user*/
  completedAt?: FuzzyDateInput;
}

/** Update multiple media list entries to the same values */
export interface UpdateMediaListEntriesArgs {
  /** The watching/reading status*/
  status?: MediaListStatus;
  /** The score of the media in the user's chosen scoring method*/
  score?: number;
  /** The score of the media in 100 point*/
  scoreRaw?: number;
  /** The amount of episodes/chapters consumed by the user*/
  progress?: number;
  /** The amount of volumes read by the user*/
  progressVolumes?: number;
  /** The amount of times the user has rewatched/read the media*/
  repeat?: number;
  /** Priority of planning*/
  priority?: number;
  /** If the entry should only be visible to authenticated user*/
  private?: boolean;
  /** Text notes*/
  notes?: string;
  /** If the entry shown be hidden from non-custom lists*/
  hiddenFromStatusLists?: boolean;
  /** Array of advanced scores*/
  advancedScores?: number[];
  /** When the entry was started by the user*/
  startedAt?: FuzzyDateInput;
  /** When the entry was completed by the user*/
  completedAt?: FuzzyDateInput;
  /** The list entries ids to update*/
  ids?: number[];
}

/** Delete a media list entry */
export interface DeleteMediaListEntryArgs {
  /** The id of the media list entry to delete*/
  id?: number;
}

/** Delete a custom list and remove the list entries from it */
export interface DeleteCustomListArgs {
  /** The name of the custom list to delete*/
  customList?: string;
  /** The media list type of the custom list*/
  type?: MediaType;
}

/** Create or update text activity for the currently authenticated user */
export interface SaveTextActivityArgs {
  /** The activity's id, required for updating*/
  id?: number;
  /** The activity text*/
  text?: string;
  /** If the activity should be locked. (Mod Only)*/
  locked?: boolean;
}

/** Create or update message activity for the currently authenticated user */
export interface SaveMessageActivityArgs {
  /** The activity id, required for updating*/
  id?: number;
  /** The activity message text*/
  message?: string;
  /** The id of the user the message is being sent to*/
  recipientId?: number;
  /** If the activity should be private*/
  private?: boolean;
  /** If the activity should be locked. (Mod Only)*/
  locked?: boolean;
  /** If the message should be sent from the Moderator account (Mod Only)*/
  asMod?: boolean;
}

/** Update list activity (Mod Only) */
export interface SaveListActivityArgs {
  /** The activity's id, required for updating*/
  id?: number;
  /** If the activity should be locked. (Mod Only)*/
  locked?: boolean;
}

/** Delete an activity item of the authenticated users */
export interface DeleteActivityArgs {
  /** The id of the activity to delete*/
  id?: number;
}

/** Create or update an activity reply */
export interface SaveActivityReplyArgs {
  /** The activity reply id, required for updating*/
  id?: number;
  /** The id of the parent activity being replied to*/
  activityId?: number;
  /** The reply text*/
  text?: string;
  /** If the reply should be sent from the Moderator account (Mod Only)*/
  asMod?: boolean;
}

/** Delete an activity reply of the authenticated users */
export interface DeleteActivityReplyArgs {
  /** The id of the reply to delete*/
  id?: number;
}

/** Add or remove a like from a likeable type.
                          Returns all the users who liked the same model */
export interface ToggleLikeArgs {
  /** The id of the likeable type*/
  id?: number;
  /** The type of model to be un/liked*/
  type?: LikeableType;
}

/** Add or remove a like from a likeable type. */
export interface ToggleLikeV2Args {
  /** The id of the likeable type*/
  id?: number;
  /** The type of model to be un/liked*/
  type?: LikeableType;
}

/** Toggle the un/following of a user */
export interface ToggleFollowArgs {
  /** The id of the user to un/follow*/
  userId?: number;
}

/** Favourite or unfavourite an anime, manga, character, staff member, or studio */
export interface ToggleFavouriteArgs {
  /** The id of the anime to un/favourite*/
  animeId?: number;
  /** The id of the manga to un/favourite*/
  mangaId?: number;
  /** The id of the character to un/favourite*/
  characterId?: number;
  /** The id of the staff to un/favourite*/
  staffId?: number;
  /** The id of the studio to un/favourite*/
  studioId?: number;
}

/** Update the order favourites are displayed in */
export interface UpdateFavouriteOrderArgs {
  /** The id of the anime to un/favourite*/
  animeIds?: number[];
  /** The id of the manga to un/favourite*/
  mangaIds?: number[];
  /** The id of the character to un/favourite*/
  characterIds?: number[];
  /** The id of the staff to un/favourite*/
  staffIds?: number[];
  /** The id of the studio to un/favourite*/
  studioIds?: number[];
  /** List of integers which the anime should be ordered by (Asc)*/
  animeOrder?: number[];
  /** List of integers which the manga should be ordered by (Asc)*/
  mangaOrder?: number[];
  /** List of integers which the character should be ordered by (Asc)*/
  characterOrder?: number[];
  /** List of integers which the staff should be ordered by (Asc)*/
  staffOrder?: number[];
  /** List of integers which the studio should be ordered by (Asc)*/
  studioOrder?: number[];
}

/** Create or update a review */
export interface SaveReviewArgs {
  /** The review id, required for updating*/
  id?: number;
  /** The id of the media the review is of*/
  mediaId?: number;
  /** The main review text. Min:2200 characters*/
  body?: string;
  /** A short summary/preview of the review. Min:20, Max:120 characters*/
  summary?: string;
  /** A short summary/preview of the review. Min:20, Max:120 characters*/
  score?: number;
  /** If the review should only be visible to its creator*/
  private?: boolean;
}

/** Delete a review */
export interface DeleteReviewArgs {
  /** The id of the review to delete*/
  id?: number;
}

/** Rate a review */
export interface RateReviewArgs {
  /** The id of the review to rate*/
  reviewId?: number;
  /** The rating to apply to the review*/
  rating?: ReviewRating;
}

/** Recommendation a media */
export interface SaveRecommendationArgs {
  /** The id of the base media*/
  mediaId?: number;
  /** The id of the media to recommend*/
  mediaRecommendationId?: number;
  /** The rating to give the recommendation*/
  rating?: RecommendationRating;
}

/** Create or update a forum thread */
export interface SaveThreadArgs {
  /** The thread id, required for updating*/
  id?: number;
  /** The title of the thread*/
  title?: string;
  /** The main text body of the thread*/
  body?: string;
  /** Forum categories the thread should be within*/
  categories?: number[];
  /** Media related to the contents of the thread*/
  mediaCategories?: number[];
  /** If the thread should be stickied. (Mod Only)*/
  sticky?: boolean;
  /** If the thread should be locked. (Mod Only)*/
  locked?: boolean;
}

/** Delete a thread */
export interface DeleteThreadArgs {
  /** The id of the thread to delete*/
  id?: number;
}

/** Create or update a thread comment */
export interface SaveThreadCommentArgs {
  /** The comment id, required for updating*/
  id?: number;
  /** The id of thread the comment belongs to*/
  threadId?: number;
  /** The id of thread comment to reply to*/
  parentCommentId?: number;
  /** The comment markdown text*/
  comment?: string;
  /** If the comment tree should be locked. (Mod Only)*/
  locked?: boolean;
}

/** Delete a thread comment */
export interface DeleteThreadCommentArgs {
  /** The id of the thread comment to delete*/
  id?: number;
}

export interface UpdateAniChartSettingsArgs {
  titleLanguage?: string;
  outgoingLinkProvider?: string;
  theme?: string;
  sort?: string;
}

export interface UpdateAniChartHighlightsArgs {
  highlights?: AniChartHighlightInput[];
}
