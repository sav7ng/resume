import { cn } from "@/lib/utils"
import { Markdown } from "@/components/markdown"
import {
  TimescaleAge,
  TimescaleContent,
  TimescaleHeader,
  TimescaleItem,
  TimescaleRail,
  TimescaleRoot,
  TimescaleTick,
  TimescaleTrack,
  TimescaleViewport,
  TimescaleYear,
} from "@/registry/components/timescale"
import {
  TIMELINE_BIRTH_YEAR,
  TIMELINE_MILESTONES,
} from "@/features/portfolio/data/timeline"
import { getTimelineSegments } from "@/features/portfolio/lib/timeline-segments"

export function Timeline({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TimescaleRoot>) {
  const segments = getTimelineSegments(TIMELINE_MILESTONES)

  return (
    <TimescaleRoot
      orientation={orientation}
      className={cn("w-full", className)}
      {...props}
    >
      <TimescaleHeader>
        <TimescaleAge>Age</TimescaleAge>
        <TimescaleYear>Years</TimescaleYear>
      </TimescaleHeader>

      <TimescaleViewport
        tabIndex={orientation === "horizontal" ? 0 : undefined}
        role={orientation === "horizontal" ? "region" : undefined}
        aria-label={
          orientation === "horizontal" ? "人生时间轴，从近到远" : undefined
        }
      >
        <TimescaleTrack>
          <TimescaleRail />

          {segments.map((segment) => {
            const recentYear =
              segment.kind === "event" ? segment.year : segment.lastYear
            const olderYear =
              segment.kind === "event" ? segment.year : segment.firstYear
            const range = (recent: number, older: number) =>
              recent === older ? recent : `${recent}—${older}`

            return (
              <TimescaleItem
                key={segment.id}
                id={`timeline-${orientation}-${segment.id}`}
                data-timeline-segment={segment.id}
                data-timeline-kind={segment.kind}
                className={cn(
                  "group/timeline-item",
                  segment.kind === "gap" &&
                    "group-data-[orientation=horizontal]/timescale:w-24 group-data-[orientation=vertical]/timescale:h-16"
                )}
              >
                <TimescaleTick />
                <TimescaleAge className="group-data-current/timeline-item:text-foreground">
                  {range(
                    recentYear - TIMELINE_BIRTH_YEAR,
                    olderYear - TIMELINE_BIRTH_YEAR
                  )}
                </TimescaleAge>
                <TimescaleYear className="group-data-current/timeline-item:text-foreground">
                  {range(recentYear, olderYear)}
                </TimescaleYear>
                {segment.kind === "event" ? (
                  <TimescaleContent className="typeset typeset-timescale">
                    <Markdown>{segment.content}</Markdown>
                  </TimescaleContent>
                ) : (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute flex justify-between group-data-[orientation=horizontal]/timescale:top-[calc(var(--timescale-rail)-4px)] group-data-[orientation=horizontal]/timescale:right-2 group-data-[orientation=horizontal]/timescale:left-3 group-data-[orientation=horizontal]/timescale:h-2 group-data-[orientation=vertical]/timescale:top-5 group-data-[orientation=vertical]/timescale:left-[calc(var(--timescale-rail)-4px)] group-data-[orientation=vertical]/timescale:h-8 group-data-[orientation=vertical]/timescale:w-2 group-data-[orientation=vertical]/timescale:flex-col"
                  >
                    {Array.from(
                      { length: Math.min(recentYear - olderYear + 1, 17) },
                      (_, index) => (
                        <span
                          key={index}
                          className="block bg-foreground/15 group-data-[orientation=horizontal]/timescale:h-2 group-data-[orientation=horizontal]/timescale:w-px group-data-[orientation=vertical]/timescale:h-px group-data-[orientation=vertical]/timescale:w-2"
                        />
                      )
                    )}
                  </span>
                )}
              </TimescaleItem>
            )
          })}
        </TimescaleTrack>
      </TimescaleViewport>
    </TimescaleRoot>
  )
}
