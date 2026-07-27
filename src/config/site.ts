import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://sav7ng.github.io",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/sav7ng/about/blob/main/LICENSE",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Timeline",
    href: "/timeline",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "sav7ng/about"
export const SOURCE_CODE_GITHUB_URL = "https://github.com/sav7ng/about"

/** Repo whose star count is shown in the site header. */
export const FEATURED_GITHUB_REPO = "sav7ng/WeHalo"

/** Upstream project this site is derived from (MIT). */
export const UPSTREAM = {
  name: "chanhdai.com",
  url: "https://github.com/ncdai/chanhdai.com",
  author: "ncdai",
}

/** Static resume download, served from `public/`. */
export const RESUME_PDF_URL = "/saving.pdf"

export const UTM_PARAMS = {
  utm_source: "sav7ng.github.io",
}
