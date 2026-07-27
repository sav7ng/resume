import type { NextConfig } from "next"

/**
 * Set when the site is served from a subpath (GitHub Pages project sites are
 * served from `/<repo>`). Leave unset for root deployments — a custom domain,
 * a `<user>.github.io` repo, or Caddy serving `/`.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`, which
  // any file server (GitHub Pages, Caddy, object storage + CDN) can serve.
  output: "export",
  basePath,
  // Emits `out/timeline/index.html` instead of `out/timeline.html`, so both
  // GitHub Pages and a bare Caddy `file_server` resolve routes without extra
  // rewrite rules.
  trailingSlash: true,
  reactStrictMode: true,
  typedRoutes: true,
  devIndicators: false,
  images: {
    // No server at runtime, so the Next.js image optimizer is unavailable.
    unoptimized: true,
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
