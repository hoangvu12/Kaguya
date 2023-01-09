import { Notification, NotificationEntity } from "@/types";
import {
  CharacterRole,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { I18n } from "netplayer";

export const SEASONS = [
  { value: MediaSeason.Winter, label: "Mùa đông" },
  { value: MediaSeason.Spring, label: "Mùa xuân" },
  { value: MediaSeason.Summer, label: "Mùa hạ" },
  { value: MediaSeason.Fall, label: "Mùa thu" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "Hoàn thành" },
  { value: MediaStatus.Releasing, label: "Đang phát hành" },
  { value: MediaStatus.Not_yet_released, label: "Sắp chiếu" },
  { value: MediaStatus.Cancelled, label: "Đã hủy bỏ" },
  { value: MediaStatus.Hiatus, label: "Tạm hoãn" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "TV" },
  { value: MediaFormat.Tv_short, label: "TV Short" },
  { value: MediaFormat.Movie, label: "Movie" },
  { value: MediaFormat.Movie, label: "Đặc biệt" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Music" },
  { value: MediaFormat.Manga, label: "Manga" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Nổi bật" },
  { value: MediaSort.Trending_desc, label: "Xu hướng" },
  { value: MediaSort.Favourites_desc, label: "Yêu thích" },
  { value: MediaSort.Score_desc, label: "Đánh giá" },
  { value: MediaSort.Updated_at_desc, label: "Mới cập nhật" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Nổi bật" },
  { value: MediaSort.Trending_desc, label: "Xu hướng" },
  { value: MediaSort.Favourites_desc, label: "Yêu thích" },
  { value: MediaSort.Score_desc, label: "Đánh giá" },
  { value: MediaSort.Updated_at_desc, label: "Mới cập nhật" },
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
    label: "Nhân vật",
  },
  {
    value: "voice_actors",
    label: "Người lồng tiếng",
  },
  {
    value: "users",
    label: "Người dùng",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Nhật Bản",
  },
  {
    value: "CN",
    label: "Trung Quốc",
  },
  {
    value: "KR",
    label: "Hàn Quốc",
  },
];

export const CHARACTERS_ROLES = [
  { value: CharacterRole.Main, label: "Nhân vật chính" },
  { value: CharacterRole.Supporting, label: "Nhân vật phụ" },
  { value: CharacterRole.Background, label: "Nhân vật nền" },
];

export const WATCH_STATUS = [
  {
    value: "WATCHING",
    label: "Đang xem",
  },
  {
    value: "PLANNING",
    label: "Dự định xem",
  },
  {
    value: "COMPLETED",
    label: "Đã xem",
  },
];

export const READ_STATUS = [
  {
    value: "READING",
    label: "Đang đọc",
  },
  {
    value: "PLANNING",
    label: "Dự định đọc",
  },
  {
    value: "COMPLETED",
    label: "Đã đọc",
  },
];

export const VISIBILITY_MODES = [
  {
    value: "public",
    label: "Công khai",
  },
  {
    value: "private",
    label: "Riêng tư",
  },
];

const CHAT_EVENT_TYPES = {
  join: "đã tham gia phòng",
  leave: "đã rời phòng",
  play: "đã bắt đầu phát",
  pause: "đã tạm dừng phát",
  changeEpisode: "đã chuyển tập",
};

export const GENDERS = {
  male: "Nam",
  female: "Nữ",
};

export const EMOJI_GROUP = {
  smileys_people: "Cảm xúc",
  animals_nature: "Động vật và thiên nhiên",
  food_drink: "Thức ăn",
  travel_places: "Du lịch",
  activities: "Hoạt động",
  objects: "Vật thể",
  symbols: "Biểu tượng",
  flags: "Cờ",
  recently_used: "Gần đây",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Phát ({{shortcut}})",
    pause: "Dừng ({{shortcut}})",
    forward: "Tiến {{time}} giây",
    backward: "Lùi {{time}} giây",
    enableSubtitle: "Bật phụ đề",
    disableSubtitle: "Tắt phụ đề",
    settings: "Cài đặt",
    enterFullscreen: "Toàn màn hình ({{shortcut}})",
    exitFullscreen: "Thoát toàn màn hình ({{shortcut}})",
    muteVolume: "Tắt tiếng ({{shortcut}})",
    unmuteVolume: "Bật tiếng ({{shortcut}})",
    sliderDragMessage: "Kéo để tua",
    nextEpisode: "Tập tiếp theo",
    episodes: "Danh sách tập",
    skipOPED: "Skip OP/ED",
    timestamps: "Mốc thời gian",
    screenshot: "Chụp màn hình",
  },
  settings: {
    audio: "Âm thanh",
    playbackSpeed: "Tốc độ phát",
    quality: "Chất lượng",
    subtitle: "Phụ đề",
    subtitleSettings: "Cài đặt phụ đề",
    reset: "Khôi phục",
    none: "Không",
    off: "Tắt",
    subtitleBackgroundOpacity: "Nền trong suốt",
    subtitleFontOpacity: "Chữ trong suốt",
    subtitleFontSize: "Cỡ chữ",
    subtitleTextStyle: "Kiểu chữ",
  },
};

export const NOTIFICATION_ENTITIES: Record<
  string,
  (notification: Notification) => NotificationEntity
> = {
  comment_mention: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.name} đã nhắc tới bạn trong một bình luận`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
  comment_reaction: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.name} đã bảy tỏ cảm xúc về bình luận của bạn`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
};

const DAYSOFWEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

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
  DAYSOFWEEK,
  NOTIFICATION_ENTITIES,
};

export default translations;
