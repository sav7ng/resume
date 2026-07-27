import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  github: {
    title: "GitHub",
    handle: "sav7ng",
    href: "https://github.com/sav7ng",
    sameAs: true,
  },
  wechat: {
    title: "微信",
    handle: "sav7ng",
    href: "https://weixin.qq.com/",
  },
  wechatBlog: {
    title: "公众号",
    handle: "爱敲代码的猫",
    href: "https://mp.weixin.qq.com/s?__biz=MzU1NzA0NDM2OA==&mid=2247484393&idx=1&sn=86c95c8ce70f780dcb587b06974c64d0#rd",
  },
  email: {
    title: "Email",
    handle: "savingrun",
    href: "mailto:savingrun@gmail.com",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
