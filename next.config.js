/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  outputStandalone: true,
  reactStrictMode: true,
  optimizeFonts: false,
  env: {
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
    API: process.env.API,
  },
};

module.exports = nextConfig;
