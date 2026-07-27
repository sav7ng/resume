import { ArrowUpRightIcon } from "lucide-react"

import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { WRITING } from "@/features/portfolio/data/writing"

const ID = "writing"

export function Writing() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Writing</a>
          <PanelTitleSup>({WRITING.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <ul>
        {WRITING.map((item, index) => (
          <li key={item.id} className="border-b border-line last:border-none">
            <a
              className="group/writing relative flex items-start gap-3 px-4 py-3 outline-none"
              href={item.link}
              target="_blank"
              rel="noopener"
            >
              <span
                className="mt-0.5 shrink-0 font-mono text-sm text-muted-foreground/50 tabular-nums select-none"
                aria-hidden
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-balance group-hover/writing:underline group-hover/writing:decoration-current/30 group-hover/writing:underline-offset-3">
                  {item.title}
                </span>

                {item.description && (
                  <span className="text-sm text-muted-foreground">
                    {item.description}
                  </span>
                )}

                {item.publisher && (
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {item.publisher}
                  </span>
                )}
              </span>

              <ArrowUpRightIcon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover/writing:translate-x-px group-hover/writing:-translate-y-px"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
