const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

const isDev = process.env.NODE_ENV === "development";

/** @type {import("next-i18next").UserConfig} */
module.exports = {
  backend: {
    backendOptions: [{ expirationTime: isDev ? 60 : 7 * 24 * 60 * 60 * 1000 }], //  7 days
    backends:
      typeof window !== "undefined" ? [LocalStorageBackend, HttpBackend] : [],
  },
  i18n: {
    locales: ["vi", "en", "ru", "es"],
    defaultLocale: "en",
    reloadOnPrerender: isDev,
    load: "currentOnly",
  },
  serializeConfig: false,
  use: typeof window !== "undefined" ? [ChainedBackend] : [],
};
