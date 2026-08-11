const nextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
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



