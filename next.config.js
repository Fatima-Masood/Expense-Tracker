/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination:
          "https://expense-tracker-backend-production-724a.up.railway.app/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
