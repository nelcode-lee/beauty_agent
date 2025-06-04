/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-datepicker'],
  // Remove experimental features and turbopack for production
  webpack: (config, { isServer }) => {
    // Avoid lightningcss-darwin issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  }
}

module.exports = nextConfig 