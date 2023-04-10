// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["cdn.discordapp.com", "avatars.githubusercontent.com"]
  },
  env: {
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "",
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "",
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || "",
  }
};
export default config;
