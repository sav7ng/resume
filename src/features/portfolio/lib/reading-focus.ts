export type ReadingItem = {
  id: string
  start: number
  end: number
}

/** Keep the current row until a new visible row is meaningfully closer. */
export function pickReadingItem(
  items: ReadingItem[],
  line: number,
  viewportStart: number,
  viewportEnd: number,
  currentId: string | null,
  tolerance = 16
) {
  const visible = items.filter(
    (item) => item.end > viewportStart && item.start < viewportEnd
  )
  const distance = (item: ReadingItem) =>
    Math.abs((item.start + item.end) / 2 - line)
  const nearest = visible.reduce<ReadingItem | null>(
    (best, item) => (!best || distance(item) < distance(best) ? item : best),
    null
  )
  const current = visible.find((item) => item.id === currentId)
  if (current && nearest && distance(current) - distance(nearest) <= tolerance)
    return current.id
  return nearest?.id ?? null
}

/** Exclude the sticky header and floating navigation from the reading area. */
export function getReadingViewport() {
  const viewport = window.visualViewport
  const viewportTop = viewport?.offsetTop ?? 0
  const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight)
  const header = document.querySelector('[data-slot="site-header"]')
  const navigation = document.querySelector('[data-slot="site-bottom-nav"]')
  const headerBox = header?.getBoundingClientRect()
  const navigationBox = navigation?.getBoundingClientRect()
  const start = Math.max(viewportTop, headerBox?.bottom ?? viewportTop)
  const end =
    navigationBox && navigationBox.height > 0
      ? Math.min(viewportBottom, navigationBox.top - 8)
      : viewportBottom
  return { start, end, line: start + Math.max(0, end - start) * 0.35 }
}
