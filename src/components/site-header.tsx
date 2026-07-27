import dynamic from "next/dynamic"
import Link from "next/link"
import { FileDownIcon } from "lucide-react"

import { MAIN_NAV, RESUME_PDF_URL } from "@/config/site"
import { Button } from "@/components/base/ui/button"
import { Separator } from "@/components/base/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { NavDesktop } from "@/components/nav-desktop"
import { NavItemGitHub } from "@/components/nav-item-github"
import { SavingMark, SavingWordmark } from "@/components/saving-mark"
import { ThemeToggle } from "@/components/theme-toggle"

const BrandContextMenu = dynamic(
  () => import("@/components/brand-context-menu")
)

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-r border-line pr-2 group-has-data-[slot=layout-wide]/layout:container after:z-1 after:bg-border sm:gap-4 md:max-w-3xl">
        <BrandContextMenu>
          <Link
            className="flex items-center gap-2 pl-1"
            href="/"
            aria-label="Home"
          >
            <SavingMark className="h-6 shrink-0" />
            <SavingWordmark className="max-sm:sr-only" />
          </Link>
        </BrandContextMenu>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center">
          <Separator
            orientation="vertical"
            className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  render={
                    <a href={RESUME_PDF_URL} download="saving.pdf">
                      <FileDownIcon />
                      <span className="sr-only">下载简历 PDF</span>
                    </a>
                  }
                />
              }
            />
            <TooltipContent>下载简历 PDF</TooltipContent>
          </Tooltip>

          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-5 data-vertical:self-center"
          />
          <NavItemGitHub />
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-5 data-vertical:self-center"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
