/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "juegazo.cl" }],
        destination: "https://www.juegazo.cl/:path*",
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com"
      }
    ]
  }
};

module.exports = nextConfig;

