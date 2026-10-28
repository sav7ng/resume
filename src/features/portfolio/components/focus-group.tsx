"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue } from "motion/react"

import { getReadingViewport, pickReadingItem } from "../lib/reading-focus"

/**
 * A row opts in one by one with data-focus-item; a block of prose opts its
 * paragraphs and list items in at once with data-focus-items.
 */
const ITEM_SELECTOR =
  "[data-focus-item], [data-focus-items] > :not(ul, ol), [data-focus-items] > :is(ul, ol) > li"

type FocusItem = {
  element: HTMLElement
  id: string
  left: number
  top: number
  width: number
  height: number
  axis: number
}

/** Server-rendered rows opt in with data-focus-item; only the ruler is client UI. */
export function FocusGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const left = useMotionValue(0)
  const top = useMotionValue(0)
  const bottom = useMotionValue(0)
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const axis = useMotionValue(0)
  const center = useMotionValue(0)
  const opacity = useMotionValue(0)

  useEffect(() => {
    const root = ref.current
    if (!root || !window.ResizeObserver || !window.IntersectionObserver) return

    const followReading = window.matchMedia(
      "(max-width: 767px), (pointer: coarse), (hover: none)"
    )
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const observed = new Set<Element>()
    let items: FocusItem[] = []
    let active: FocusItem | null = null
    let pointer: HTMLElement | null = null
    let keyboard = document.activeElement?.matches(":focus-visible") ?? false
    let inView = false
    let dirty = true
    let frame = 0
    let alive = true

    const itemFor = (target: EventTarget | null) => {
      const element =
        target instanceof Element
          ? target.closest<HTMLElement>(ITEM_SELECTOR)
          : null
      return element && root.contains(element) ? element : null
    }

    const show = (next: FocusItem | null, moved = false) => {
      if (active?.element !== next?.element) {
        active?.element.removeAttribute("data-focus-active")
        next?.element.setAttribute("data-focus-active", "")
      }
      root.dataset.focusMoving = String(
        !!active && !!next && moved && !reduced.matches
      )
      active = next
      if (!next) {
        opacity.set(0)
        delete root.dataset.focusCurrent
        return
      }
      root.dataset.focusCurrent = next.id
      left.set(next.left)
      top.set(next.top)
      bottom.set(next.top + next.height - 1)
      width.set(next.width)
      height.set(next.height - 1)
      axis.set(next.axis - 6)
      center.set(next.top + next.height / 2)
      opacity.set(1)
    }

    const measure = () => {
      const box = root.getBoundingClientRect()
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(ITEM_SELECTOR)
      )
      const counters = new Map<HTMLElement, number>()
      for (const element of observed) {
        if (!elements.includes(element as HTMLElement)) {
          resize.unobserve(element)
          observed.delete(element)
        }
      }
      items = elements.flatMap((element) => {
        if (!observed.has(element)) {
          resize.observe(element)
          observed.add(element)
        }
        let id = element.dataset.focusItem
        if (!id) {
          // Number the opted-in children by position so the id survives a
          // re-measure; collapsed blocks measure zero and drop out below.
          const block = element.closest<HTMLElement>("[data-focus-items]")!
          const index = (counters.get(block) ?? 0) + 1
          counters.set(block, index)
          id = `${block.dataset.focusItems}-${index}`
        }
        const row = element.getBoundingClientRect()
        if (!row.width || !row.height) return []
        const group = element.closest<HTMLElement>("[data-focus-group]")
        const anchor =
          element.querySelector<HTMLElement>("[data-focus-axis]") ??
          group?.querySelector<HTMLElement>("[data-focus-axis]")
        const anchorBox = anchor?.getBoundingClientRect()
        const axisX =
          anchorBox?.width || anchorBox?.height
            ? anchorBox.left +
              (anchor?.dataset.focusAxis === "center" ? anchorBox.width / 2 : 0)
            : row.left + 16
        return [
          {
            element,
            id,
            left: row.left - box.left,
            top: row.top - box.top,
            width: row.width,
            height: row.height,
            axis: axisX - box.left,
          },
        ]
      })
      dirty = false
    }

    const update = () => {
      frame = 0
      if (!inView || document.hidden) {
        show(null)
        return
      }
      const remeasured = dirty
      if (dirty) measure()
      const box = root.getBoundingClientRect()
      const viewport = getReadingViewport()
      const visible = items.filter(
        (item) =>
          item.top + item.height + box.top > viewport.start &&
          item.top + box.top < viewport.end
      )
      const focused = itemFor(document.activeElement)
      const keyboardItem =
        keyboard && document.activeElement?.matches(":focus-visible")
          ? visible.find((item) => item.element === focused)
          : null
      const pointerItem = !followReading.matches
        ? visible.find((item) => item.element === pointer)
        : null
      const readingId = followReading.matches
        ? pickReadingItem(
            visible.map((item) => ({
              id: item.id,
              start: item.top + box.top,
              end: item.top + item.height + box.top,
            })),
            viewport.line,
            viewport.start,
            viewport.end,
            active?.id ?? null
          )
        : null
      const next =
        keyboardItem ??
        pointerItem ??
        visible.find((item) => item.id === readingId) ??
        null
      if (!remeasured && active && active.element === next?.element) return
      show(next, !remeasured && active?.element !== next?.element)
    }

    const schedule = () => {
      if (alive && !frame && !document.hidden)
        frame = requestAnimationFrame(update)
    }
    const invalidate = () => {
      dirty = true
      schedule()
    }
    const resize = new ResizeObserver(invalidate)
    const mutations = new MutationObserver(invalidate)
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) invalidate()
      else show(null)
    })
    const pointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      // Hold the last row while the pointer crosses padding or a separator;
      // pointerleave is what actually releases it.
      const next = itemFor(event.target)
      if (!next || next === pointer) return
      pointer = next
      schedule()
    }
    const pointerLeave = () => {
      pointer = null
      schedule()
    }
    const pointerDown = () => {
      keyboard = false
      schedule()
    }
    const keyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      keyboard = true
      schedule()
    }
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
        show(null)
      } else invalidate()
    }

    resize.observe(root)
    intersection.observe(root)
    mutations.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "data-open", "data-closed"],
    })
    root.addEventListener("pointerover", pointerOver)
    root.addEventListener("pointerleave", pointerLeave)
    document.addEventListener("pointerdown", pointerDown, true)
    document.addEventListener("keydown", keyDown, true)
    document.addEventListener("focusin", schedule)
    document.addEventListener("focusout", schedule)
    document.addEventListener("visibilitychange", visibility)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", invalidate)
    window.visualViewport?.addEventListener("resize", invalidate)
    window.visualViewport?.addEventListener("scroll", schedule)
    followReading.addEventListener("change", schedule)
    reduced.addEventListener("change", invalidate)
    void document.fonts.ready.then(() => alive && invalidate())

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      active?.element.removeAttribute("data-focus-active")
      resize.disconnect()
      mutations.disconnect()
      intersection.disconnect()
      root.removeEventListener("pointerover", pointerOver)
      root.removeEventListener("pointerleave", pointerLeave)
      document.removeEventListener("pointerdown", pointerDown, true)
      document.removeEventListener("keydown", keyDown, true)
      document.removeEventListener("focusin", schedule)
      document.removeEventListener("focusout", schedule)
      document.removeEventListener("visibilitychange", visibility)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", invalidate)
      window.visualViewport?.removeEventListener("resize", invalidate)
      window.visualViewport?.removeEventListener("scroll", schedule)
      followReading.removeEventListener("change", schedule)
      reduced.removeEventListener("change", invalidate)
    }
  }, [axis, bottom, center, height, left, opacity, top, width])

  const movement =
    "group-data-[focus-moving=true]/focus:transition-[transform,height] group-data-[focus-moving=true]/focus:duration-150 group-data-[focus-moving=true]/focus:ease-sheet motion-reduce:transition-none"

  return (
    <div ref={ref} className="group/focus relative" data-slot="focus-group">
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-clip"
        style={{ opacity }}
        aria-hidden="true"
        data-slot="focus-scan"
      >
        <motion.span
          className={`absolute top-0 left-0 h-px border-t border-dashed border-foreground/25 ${movement}`}
          style={{ x: left, y: top, width }}
        />
        <motion.span
          className={`absolute top-0 left-0 h-px border-t border-dashed border-foreground/25 ${movement}`}
          style={{ x: left, y: bottom, width }}
        />
        <motion.span
          className={`absolute top-0 left-0 h-px w-3 bg-foreground/60 ${movement}`}
          style={{ x: axis, y: center }}
        />
      </motion.div>

      {/* Dimension line for the focused row, drawn in the margin beside the
          panels so it never crosses content; the margin only exists on wide
          viewports, where the focus follows the pointer rather than scrolling. */}
      <motion.div
        className="pointer-events-none absolute inset-0 max-[831px]:hidden"
        style={{ opacity }}
        aria-hidden="true"
        data-slot="focus-measure"
      >
        <motion.span
          className={`absolute top-0 left-full ml-2 flex w-px flex-col justify-between bg-foreground/25 ${movement}`}
          style={{ y: top, height }}
        >
          <span className="-ml-[3px] h-px w-[7px] bg-foreground/60" />
          <span className="-ml-[3px] h-px w-[7px] bg-foreground/60" />
        </motion.span>
      </motion.div>
    </div>
  )
}
