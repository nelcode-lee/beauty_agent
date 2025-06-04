/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-datepicker'],
  experimental: {
    turbo: true
  }
}

module.exports = nextConfig 