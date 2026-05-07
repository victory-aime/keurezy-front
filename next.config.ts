import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';
import path from 'path';

const apiUrl = process.env.API_BACKEND_URL;

if (!apiUrl) {
  throw new Error('API_BACKEND_URL is missing');
}

const withSerwist = withSerwistInit({
  swSrc: path.join(process.cwd(), 'app/sw.ts'),
  swDest: path.join(process.cwd(), 'public/sw.js'),
  cacheOnNavigation: true,
  disable: process.env.NODE_ENV !== 'production',
});

const nextConfig: NextConfig = {
  turbopack: {},
  /* use redirect proxy for api calls
   * every request to /api/* will be redirected to the backend server
   * */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSerwist(nextConfig);
