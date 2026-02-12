import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* use redirect proxy for api calls
   * every request to /api/* will be redirected to the backend server
   * */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BACKEND_URL}/api/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${process.env.API_BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
