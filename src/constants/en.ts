import { I18n } from "netplayer";

export const SEASONS = [
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

export const STATUS = [
  { value: "FINISHED", label: "Finished" },
  { value: "RELEASING", label: "Releasing" },
  { value: "NOT_YET_RELEASED", label: "Not yet released" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "HIATUS", label: "Hiatus" },
];

export const FORMATS = [
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Movie" },
  { value: "SPECIAL", label: "Special" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MUSIC", label: "Music" },
  { value: "MANGA", label: "Manga" },
];

export const ANIME_SORTS = [
  { value: "popularity", label: "Popularity" },
  { value: "trending", label: "Trending" },
  { value: "favourites", label: "Favourites" },
  { value: "averageScore", label: "Average Score" },
  { value: "episodeUpdatedAt", label: "Latest Episode" },
];

export const MANGA_SORTS = [
  { value: "popularity", label: "Popularity" },
  { value: "trending", label: "Trending" },
  { value: "favourites", label: "Favourites" },
  { value: "averageScore", label: "Average Score" },
  { value: "chapterUpdatedAt", label: "Latest Episode" },
];

export const GENRES = [
  {
    value: "Action",
    label: "Action",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg",
  },
  {
    value: "Adventure",
    label: "Adventure",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhKBUDDS6L.jpg",
  },
  {
    value: "Comedy",
    label: "Comedy",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20464-HbmkPacki4sl.jpg",
  },
  {
    value: "Drama",
    label: "Drama",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n9253-JIhmKgBKsWUN.jpg",
  },
  {
    value: "Ecchi",
    label: "Ecchi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-RgsRpTMhP9Sv.jpg",
  },
  {
    value: "Fantasy",
    label: "Fantasy",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Hentai",
    label: "Hentai",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/99894-MWIuMGnDIg1x.jpg",
  },
  {
    value: "Horror",
    label: "Horror",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Mahou Shoujo",
    label: "Mahou Shoujo",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/9756-d5M8NffgJJHB.jpg",
  },
  {
    value: "Mecha",
    label: "Mecha",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30-gEMoHHIqxDgN.jpg",
  },
  {
    value: "Music",
    label: "Music",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20665-j4kSsfhfkM24.jpg",
  },
  {
    value: "Mystery",
    label: "Mystery",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n101291-fqIUvQ6apEtD.jpg",
  },
  {
    value: "Psychological",
    label: "Psychological",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-f9SjOfEJMk5P.jpg",
  },
  {
    value: "Romance",
    label: "Romance",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101921-GgvvFhlNhzlF.jpg",
  },
  {
    value: "Sci-Fi",
    label: "Sci-Fi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Slice of Life",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124080-ARyLAHHgikRq.jpg",
  },
  {
    value: "Sports",
    label: "Sports",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20992-sYHxFXg98JEj.jpg",
  },
  {
    value: "Supernatural",
    label: "Supernatural",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21507-Qx8bGsLXUgLo.jpg",
  },
  {
    value: "Thriller",
    label: "Thriller",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/100388-CR4PUEz1Nzsl.jpg",
  },
];

export const TYPES = [
  {
    value: "anime",
    label: "Anime",
  },
  {
    value: "manga",
    label: "Manga",
  },
  {
    value: "characters",
    label: "Characters",
  },
  {
    value: "voice_actors",
    label: "Voice actors",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Japan",
  },
  {
    value: "CN",
    label: "China",
  },
  {
    value: "KR",
    label: "Korea",
  },
];

export const CHARACTERS_ROLES = [
  { value: "MAIN", label: "Main" },
  { value: "SUPPORTING", label: "Supporting" },
  { value: "BACKGROUND", label: "Background" },
];

export const WATCH_STATUS = [
  {
    value: "WATCHING",
    label: "Watching",
  },
  {
    value: "PLANNING",
    label: "Planning",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

export const READ_STATUS = [
  {
    value: "READING",
    label: "Reading",
  },
  {
    value: "PLANNING",
    label: "Planning",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

export const VISIBILITY_MODES = [
  {
    value: "public",
    label: "Public",
  },
  {
    value: "private",
    label: "Private",
  },
];

export const CHAT_EVENT_TYPES = {
  join: "has joined the room",
  leave: "has left the room",
  play: "has started video",
  pause: "has paused video",
  changeEpisode: "has changed episode",
};

export const GENDERS = {
  male: "Male",
  female: "Female",
};

export const EMOJI_GROUP = {
  smileys_people: "Smileys & People",
  animals_nature: "Animals & Nature",
  food_drink: "Food & Drink",
  travel_places: "Travel & Places",
  activities: "Activities",
  objects: "Objects",
  symbols: "Symbols",
  flags: "Flags",
  recently_used: "Recently used",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Play ({{shortcut}})",
    pause: "Pause ({{shortcut}})",
    forward: "Forward {{time}} seconds",
    backward: "Backward {{time}} seconds",
    enableSubtitle: "Enable subtitles",
    disableSubtitle: "Disable subtitles",
    settings: "Settings",
    enterFullscreen: "Enter fullscreen ({{shortcut}})",
    exitFullscreen: "Exit fullscreen ({{shortcut}})",
    muteVolume: "Mute ({{shortcut}})",
    unmuteVolume: "Unmute ({{shortcut}})",
    sliderDragMessage: "Drag to seek video",
    nextEpisode: "Next episode",
    episodes: "Episodes",
    skipOPED: "Skip OP/ED",
  },
  settings: {
    audio: "Audio",
    playbackSpeed: "Playback speed",
    quality: "Quality",
    subtitle: "Subtitle",
    subtitleSettings: "Subtitle settings",
    reset: "Reset",
    none: "None",
    off: "Off",
    subtitleBackgroundOpacity: "Background Opacity",
    subtitleFontOpacity: "Font Opacity",
    subtitleFontSize: "Font Size",
    subtitleTextStyle: "Text Style",
  },
};

const translations = {
  SEASONS,
  FORMATS,
  STATUS,
  GENRES,
  CHARACTERS_ROLES,
  ANIME_SORTS,
  MANGA_SORTS,
  TYPES,
  COUNTRIES,
  VISIBILITY_MODES,
  CHAT_EVENT_TYPES,
  WATCH_STATUS,
  READ_STATUS,
  GENDERS,
  EMOJI_GROUP,
  PLAYER_TRANSLATIONS,
};

export default translations;
