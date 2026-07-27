import { unstable_cache } from "next/cache"

import { FEATURED_GITHUB_REPO } from "@/config/site"
import { GitHubStars } from "@/components/github-stars"

const getStargazerCount = unstable_cache(
  async () => {
    try {
      const token = process.env.GITHUB_API_TOKEN

      const response = await fetch(
        `https://api.github.com/repos/${FEATURED_GITHUB_REPO}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            // Only send Authorization when a token is actually configured —
            // `Bearer undefined` makes GitHub reject the request with 401,
            // which would silently render a 0 star count. Anonymous requests
            // work fine for public repos (just a lower rate limit).
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "X-GitHub-Api-Version": "2026-03-10",
          },
        }
      )

      if (!response.ok) {
        return 0
      }

      const json = (await response.json()) as { stargazers_count?: number }
      return Number(json?.stargazers_count) || 0
    } catch {
      return 0
    }
  },
  ["github-stargazer-count"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)

export async function NavItemGitHub() {
  const stargazersCount = await getStargazerCount()

  return (
    <GitHubStars
      repo={FEATURED_GITHUB_REPO}
      stargazersCount={stargazersCount}
    />
  )
}
