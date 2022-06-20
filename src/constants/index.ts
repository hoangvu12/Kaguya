import dayjs from "@/lib/dayjs";

const START_YEAR = 1940;
const CURRENT_YEAR = dayjs().year();

export const WEBSITE_URL = "https://www.kaguya.live";
export const DISCORD_URL = "https://discord.gg/382BEFfER6";
export const FACEBOOK_URL = "https://www.facebook.com/kaguyaa.live";

export const DISCORD_REG_URL = "https://discord.gg/62RkwWkvkP";

export const REVALIDATE_TIME = 18000; // 5 hours
export const SKIP_TIME = 90; // 1m30s

export const SEASON_YEARS = new Array(CURRENT_YEAR + 1 - START_YEAR)
  .fill(null)
  .map((_, index) => START_YEAR + index)
  .sort((a, b) => b - a);
