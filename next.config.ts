import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },

  // Compression
  compress: true,

  // Production source maps for better debugging (optional)
  productionBrowserSourceMaps: false,

  // Trailing slash behavior (consistent URLs for SEO)
  trailingSlash: false,

  // Optimize server components
  experimental: {
    optimizePackageImports: ['@vercel/analytics'],
  },

  // Redirects: old Wix URLs → new pages (301 permanent)
  async redirects() {
    return [
      // Old Wix homepage
      { source: '/home', destination: '/', permanent: true },

      // Service pages
      { source: '/service-page/:path*', destination: '/our-services', permanent: true },
      { source: '/full-service-grooming', destination: '/grooming', permanent: true },
      { source: '/aromatherapy', destination: '/our-services', permanent: true },
      { source: '/wash-n-go-baths-1', destination: '/wash-n-go-baths', permanent: true },

      // Old Wix duplicated pages
      { source: '/copy-of-training', destination: '/our-services', permanent: true },
      { source: '/copy-of-dog-walking', destination: '/our-services', permanent: true },
      { source: '/training', destination: '/our-services', permanent: true },
      { source: '/dog-walking-1', destination: '/our-services', permanent: true },

      // Booking / calendar
      { source: '/book-online-1', destination: '/appointments', permanent: true },
      { source: '/booking-calendar/:path*', destination: '/appointments', permanent: true },

      // Hotel / boarding
      { source: '/hotel-reservation-request', destination: '/#boarding', permanent: true },
      { source: '/hotel', destination: '/#boarding', permanent: true },

      // Products (no equivalent — send to homepage)
      { source: '/cart-page', destination: '/', permanent: true },
      { source: '/shop', destination: '/', permanent: true },
      { source: '/cat-food', destination: '/', permanent: true },
      { source: '/dog-food', destination: '/', permanent: true },
      { source: '/supplements', destination: '/', permanent: true },

      // Other old pages
      { source: '/gallery', destination: '/photo-booth', permanent: true },
      { source: '/specials', destination: '/', permanent: true },
    ];
  },

  // Proxy Context Memo pages under /memos
  async rewrites() {
    return [
      {
        source: '/memos/:path*',
        destination: 'https://paparazzi-petspa.contextmemo.com/:path*',
      },
    ];
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/gallery/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
