import { describe, expect, it } from "vitest"

import { TIMELINE_MILESTONES } from "../data/timeline"
import { getTimelineSegments } from "./timeline-segments"

describe("getTimelineSegments", () => {
  it("orders events recent-first and preserves their content", () => {
    expect(
      getTimelineSegments([
        { year: 2019, content: "first\n\nsecond" },
        { year: 2026, content: "latest" },
        { year: 2022, content: "middle" },
      ])
    ).toEqual([
      { kind: "event", id: "event-2026", year: 2026, content: "latest" },
      { kind: "event", id: "event-2022", year: 2022, content: "middle" },
      {
        kind: "event",
        id: "event-2019",
        year: 2019,
        content: "first\n\nsecond",
      },
    ])
  })

  it("compresses consecutive empty years and keeps a single empty year", () => {
    expect(
      getTimelineSegments([
        { year: 2018, content: "event" },
        { year: 2017 },
        { year: 2016, content: "  " },
        { year: 2015, content: "event" },
        { year: 2014 },
      ]).filter((segment) => segment.kind === "gap")
    ).toEqual([
      { kind: "gap", id: "gap-2017-2016", firstYear: 2016, lastYear: 2017 },
      { kind: "gap", id: "gap-2014-2014", firstYear: 2014, lastYear: 2014 },
    ])
  })

  it("keeps empty ranges at both ends and handles an entirely empty range", () => {
    const source = [
      { year: 2026 },
      { year: 2025 },
      { year: 2024, content: "event" },
      { year: 2023 },
      { year: 2022 },
    ]
    const result = getTimelineSegments(source)
    expect(result[0]).toMatchObject({ firstYear: 2025, lastYear: 2026 })
    expect(result.at(-1)).toMatchObject({ firstYear: 2022, lastYear: 2023 })
    expect(getTimelineSegments([{ year: 2001 }, { year: 2000 }])).toEqual([
      { kind: "gap", id: "gap-2001-2000", firstYear: 2000, lastYear: 2001 },
    ])
    expect(getTimelineSegments([])).toEqual([])
  })

  it("does not fill in missing years or merge across them", () => {
    expect(getTimelineSegments([{ year: 2026 }, { year: 2024 }])).toHaveLength(
      2
    )
  })

  it("does not mutate source objects or their order", () => {
    const source = Object.freeze([
      Object.freeze({ year: 2020 }),
      Object.freeze({ year: 2021 }),
      Object.freeze({ year: 2019, content: "event" }),
    ])
    getTimelineSegments(source)
    expect(source.map((item) => item.year)).toEqual([2020, 2021, 2019])
    expect(source[0]).toEqual({ year: 2020 })
  })

  it("compresses the actual 1998–2014 range while retaining all public events", () => {
    const segments = getTimelineSegments(TIMELINE_MILESTONES)
    expect(segments[0]).toMatchObject({ kind: "event", year: 2026 })
    expect(segments).toContainEqual({
      kind: "gap",
      id: "gap-2014-1998",
      firstYear: 1998,
      lastYear: 2014,
    })
    expect(segments.filter((segment) => segment.kind === "event")).toHaveLength(
      TIMELINE_MILESTONES.filter((milestone) => milestone.content).length
    )
  })
})
