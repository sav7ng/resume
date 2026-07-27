import { MailIcon, MessagesSquareIcon, RssIcon } from "lucide-react"

import { LICENSE, SOURCE_CODE_GITHUB_URL, UPSTREAM } from "@/config/site"
import { cn } from "@/lib/utils"
import { GitHubIcon } from "@/components/icons"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export function SiteFooter() {
  const githubLink = SOCIAL.github
  const wechatBlogLink = SOCIAL.wechatBlog
  const emailLink = SOCIAL.email

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <dl className="flex flex-col gap-4 py-8 font-mono [&_dd]:text-sm [&_dt]:text-right [&_dt]:text-sm [&_dt]:text-muted-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          <Item>
            <dt>Crafted by</dt>
            <dd>
              <a
                className="link-underline"
                href={githubLink.href}
                target="_blank"
                rel="noopener"
              >
                {githubLink.handle}
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Based on</dt>
            <dd>
              <a
                className="link-underline"
                href={UPSTREAM.url}
                target="_blank"
                rel="noopener"
              >
                {UPSTREAM.name}
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Built with</dt>
            <dd>
              <ul>
                <li>Next.js</li>
                <li>Tailwind CSS</li>
                <li>shadcn/ui</li>
              </ul>
            </dd>
          </Item>

          <Item>
            <dt>Source code</dt>
            <dd>
              <a
                className="link-underline"
                href={SOURCE_CODE_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </dd>
          </Item>

          <Item>
            <dt>License</dt>
            <dd>
              <a
                className="link-underline"
                href={LICENSE.url}
                target="_blank"
                rel="noopener"
              >
                {LICENSE.name}
              </a>
            </dd>
          </Item>
        </dl>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4">
            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={githubLink.href}
              target="_blank"
              rel="noopener"
              aria-label="GitHub Profile"
            >
              <GitHubIcon className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={wechatBlogLink.href}
              target="_blank"
              rel="noopener"
              aria-label="微信公众号"
            >
              <RssIcon className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={emailLink.href}
              aria-label="Email"
            >
              <MailIcon className="size-4" />
            </a>

            <Separator />

            <span
              className="flex items-center text-muted-foreground"
              title={`微信 ${SOCIAL.wechat.handle}`}
            >
              <MessagesSquareIcon className="size-4" />
              <span className="sr-only">微信 {SOCIAL.wechat.handle}</span>
            </span>
          </div>
        </div>
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-line", className)} {...props} />
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-4", className)} {...props} />
}
