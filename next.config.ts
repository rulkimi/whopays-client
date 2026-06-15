/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "bucket.railway.internal" },
    ],
  },
};

module.exports = nextConfig;
