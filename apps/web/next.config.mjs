/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hha/ui', '@hha/shared'],
  experimental: {
    typedRoutes: false,
  },
  poweredByHeader: false,
};

export default nextConfig;
