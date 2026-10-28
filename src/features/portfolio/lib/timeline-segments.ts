import type { TimelineMilestone } from "../types/timeline"

export type TimelineSegment =
  | { kind: "event"; id: string; year: number; content: string }
  | { kind: "gap"; id: string; firstYear: number; lastYear: number }

/** Derive a recent-first view without changing or inventing source milestones. */
export function getTimelineSegments(
  milestones: readonly TimelineMilestone[]
): TimelineSegment[] {
  const segments: TimelineSegment[] = []
  for (const milestone of [...milestones].sort((a, b) => b.year - a.year)) {
    if (milestone.content?.trim()) {
      segments.push({
        kind: "event",
        id: `event-${milestone.year}`,
        year: milestone.year,
        content: milestone.content,
      })
      continue
    }
    const previous = segments.at(-1)
    if (previous?.kind === "gap" && previous.firstYear === milestone.year + 1) {
      previous.firstYear = milestone.year
      previous.id = `gap-${previous.lastYear}-${milestone.year}`
    } else {
      segments.push({
        kind: "gap",
        id: `gap-${milestone.year}-${milestone.year}`,
        firstYear: milestone.year,
        lastYear: milestone.year,
      })
    }
  }
  return segments
}
