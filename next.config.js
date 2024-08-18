const withNextIntl = require("next-intl/plugin")(
  './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "uploadthing.com",
      "avatars.githubusercontent.com",
      "utfs.io",
    ],
  },
  webpack: (
    config
  ) => {
    config.module.noParse = [require.resolve("typescript/lib/typescript.js")]
    return config
  },
};

module.exports = withNextIntl(nextConfig);
