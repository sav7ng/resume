import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  devIndicators: false,
  images: {
    qualities: [75, 100],
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
}

export default nextConfig
