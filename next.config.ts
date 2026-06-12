import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config silences the "webpack config but no turbopack config" error
  // pdf-parse has been removed so no webpack externals are needed
  turbopack: {},
};

export default nextConfig;
