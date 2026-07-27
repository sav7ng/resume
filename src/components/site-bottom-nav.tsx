import dynamic from "next/dynamic"

import { MOBILE_NAV } from "@/config/site"
import { cn } from "@/lib/utils"

const NavMobile = dynamic(() => import("@/components/nav-mobile"))

export function SiteBottomNav() {
  return (
    <div
      className={cn(
        "fixed! bottom-[calc(--spacing(2)+env(safe-area-inset-bottom,0))] left-1/2 z-50 flex w-fit -translate-x-1/2 items-center rounded-xl bg-popover px-1 py-1 shadow-md ring ring-foreground/10 sm:hidden dark:ring-foreground/20"
      )}
    >
      <NavMobile items={MOBILE_NAV} />
    </div>
  )
}
