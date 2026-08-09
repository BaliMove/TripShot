/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  generateBuildId: async () => `build-${Date.now()}`,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;



