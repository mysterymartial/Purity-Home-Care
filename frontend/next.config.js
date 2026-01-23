/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v0-website-ui-improvement-navy.vercel.app',
        pathname: '/**',
      },
    ],
  },
  // Next.js 14 automatically exposes NEXT_PUBLIC_* variables
  // No need to manually expose them in env
};

module.exports = nextConfig;

