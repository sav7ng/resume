"use client"

import { LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"
import { createHeadingUrl } from "@/components/heading"

export function PanelTitleCopy({
  id,
  className,
  ...props
}: Omit<React.ComponentProps<typeof CopyButton>, "id" | "text"> & {
  id: string
}) {
  return (
    <CopyButton
      className={cn(
        "absolute -top-0.5 ml-1 size-10 shrink-0 border-none text-muted-foreground opacity-0 transition-opacity duration-150 group-focus-within/panel-title:opacity-100 group-hover/panel-title:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none pointer-coarse:size-11 pointer-coarse:opacity-100",
        className
      )}
      variant="ghost"
      text={() => createHeadingUrl(id || "")}
      idleIcon={<LinkIcon />}
      aria-label="Copy link to section"
      {...props}
    />
  )
}
