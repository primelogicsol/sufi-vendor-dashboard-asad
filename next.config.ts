
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['res.cloudinary.com'],
//   },
// }

// module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**', // This allows all hostnames
//       },
//     ],
//   },
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '6015',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all HTTP domains (if needed)
      }
    ],
  },
}

module.exports = nextConfig