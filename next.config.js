/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-datepicker'],
  // Remove experimental features for production
  swcMinify: true
}

module.exports = nextConfig 