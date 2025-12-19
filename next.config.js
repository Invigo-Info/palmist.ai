/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
