const withPWA = require("next-pwa");

module.exports = withPWA({
  images: {
    domains: [
      "s4.anilist.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
    ],
  },
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
});
