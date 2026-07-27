/**
 * Public base path the site is served under.
 *
 * Empty for root deployments (a custom domain, or Caddy serving `/`), and
 * something like `/about` when GitHub Pages serves the site from a project
 * subpath. Next.js rewrites `next/link` and `next/image` targets for us, but
 * plain `<a href>` / `<img src>` and `metadata.icons` are untouched — pass
 * those through `withBasePath`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`
}
