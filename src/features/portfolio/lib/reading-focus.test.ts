import { describe, expect, it } from "vitest"

import { pickReadingItem } from "./reading-focus"

const rows = [
  { id: "a", start: 0, end: 100 },
  { id: "b", start: 100, end: 200 },
  { id: "c", start: 200, end: 400 },
]

describe("pickReadingItem", () => {
  it("chooses the nearest visible row, including rows of different heights", () => {
    expect(pickReadingItem(rows, 290, 50, 350, null)).toBe("c")
    expect(pickReadingItem(rows, 30, 100, 350, null)).toBe("b")
  })

  it("holds the current row around a boundary until the advantage exceeds 16px", () => {
    expect(pickReadingItem(rows, 105, 0, 400, "a")).toBe("a")
    expect(pickReadingItem(rows, 110, 0, 400, "a")).toBe("b")
  })

  it("releases an offscreen or removed current row and handles no visible rows", () => {
    expect(pickReadingItem(rows, 160, 100, 400, "a")).toBe("b")
    expect(pickReadingItem(rows, 160, 0, 400, "removed")).toBe("b")
    expect(pickReadingItem(rows, 500, 400, 600, "c")).toBeNull()
    expect(pickReadingItem([], 100, 0, 400, null)).toBeNull()
  })
})
