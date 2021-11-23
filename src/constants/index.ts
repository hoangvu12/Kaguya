import dayjs from "@/lib/dayjs";

const START_YEAR = 1940;
const CURRENT_YEAR = dayjs().year();

export const WEBSITE_URL = "https://www.kaguya.live";
export const DISCORD_URL = "https://discord.gg/382BEFfER6";
export const FACEBOOK_URL = "https://www.facebook.com/nguyenvuzxc1/";

export const REVALIDATE_TIME = 7200; // 2 hours

export const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;
export const FORMATS = [
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
] as const;
export const STATUSES = [
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
] as const;
export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Hentai",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export const SORTS = [
  "popularity",
  "trending",
  "favourites",
  "average_score",
  "episodes_updated_at",
];

export const CHARACTERS_ROLES = ["MAIN", "SUPPORTING", "BACKGROUND"] as const;
export const SEASON_YEARS = new Array(CURRENT_YEAR + 1 - START_YEAR)
  .fill(null)
  .map((_, index) => START_YEAR + index)
  .sort((a, b) => b - a);

export const VIETNAMESE_SORTS = [
  "Nổi bật",
  "Xu hướng",
  "Yêu thích",
  "Đánh giá",
  "Mới cập nhật",
];
export const VIETNAMESE_SEASONS = [
  "Mùa đông",
  "Mùa xuân",
  "Mùa hạ",
  "Mùa thu",
] as const;
export const VIETNAMESE_FORMATS = [
  "TV",
  "TV Short",
  "Movie",
  "Đặc biệt",
  "OVA",
  "ONA",
  "Music",
] as const;
export const VIETNAMESE_STATUSES = [
  "Hoàn thành",
  "Đang phát hành",
  "Sắp chiếu",
  "Đã hủy bỏ",
  "Tạm hoãn",
] as const;

export const VIETNAMESE_CHARACTERS_ROLES = [
  "Nhân vật chính",
  "Nhân vật phụ",
  "Nhân vật nền",
];
