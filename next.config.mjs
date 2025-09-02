/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://expense-tracker-backend-production-724a.up.railway.app/:path*",
      },
      {
        source: "/oauth2/authorization/:path*",
        destination: "https://expense-tracker-backend-production-724a.up.railway.app/oauth2/authorization/:path*",
      },
    ];
  },
};

export default nextConfig;
