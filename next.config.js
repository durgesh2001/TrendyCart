/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.myntassets.com" },
      { protocol: "https", hostname: "constant.myntassets.com" },
      { protocol: "https", hostname: "*.myntassets.com" }
    ]
  }
};

module.exports = nextConfig;
