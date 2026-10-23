"use client"

import { use, useState } from "react"
import { format } from "date-fns"
import { LoaderIcon } from "lucide-react"

import { Tooltip, TooltipContent } from "@/components/base/ui/tooltip"
import type { Activity } from "@/registry/components/contribution-graph"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/components/contribution-graph"

type HoveredBlock = { element: Element; count: number; date: string }

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>
}) {
  const data = use(contributions)
  // One tooltip anchored to whichever block the pointer is over. Giving each of
  // the 365 blocks its own tooltip is what the markup and the hydration pass
  // end up paying for, and the calendar is `aria-hidden` anyway, so the blocks
  // never need to be focusable triggers.
  const [hovered, setHovered] = useState<HoveredBlock | null>(null)

  return (
    <>
      <ContributionGraph
        className="mx-auto gap-4 py-4"
        data={data}
        blockSize={12}
        blockMargin={2}
        blockRadius={0}
        aria-label="GitHub Contributions Graph"
      >
        <ContributionGraphCalendar
          className="px-4 **:data-[slot=month-labels]:text-muted-foreground"
          title="GitHub Contributions"
          aria-hidden
          onPointerMove={(event) => {
            const element = (event.target as Element).closest("[data-date]")
            // Only the gaps between blocks miss; leaving the last one anchored
            // keeps the tooltip from flickering as the pointer crosses them.
            if (!element || element === hovered?.element) return
            setHovered({
              element,
              count: Number(element.getAttribute("data-count")),
              date: element.getAttribute("data-date") ?? "",
            })
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="gap-4 px-4 leading-none">
          <ContributionGraphTotalCount>
            {({ totalCount }) => (
              <div className="text-muted-foreground">
                {totalCount.toLocaleString("en")} contributions in the past 365
                days.
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend aria-hidden />
        </ContributionGraphFooter>
      </ContributionGraph>

      <Tooltip open={hovered !== null}>
        <TooltipContent className="font-sans" anchor={hovered?.element}>
          <p>
            {hovered?.count} contribution
            {(hovered?.count ?? 0) > 1 ? "s" : null} on{" "}
            {hovered ? format(new Date(hovered.date), "dd.MM.yyyy") : null}
          </p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-45 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  )
}
