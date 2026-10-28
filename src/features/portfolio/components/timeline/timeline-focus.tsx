"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue } from "motion/react"

import { getReadingViewport, pickReadingItem } from "../../lib/reading-focus"

type TimelinePosition = {
  id: string
  element: HTMLElement
  start: number
  end: number
  tickX: number
  tickY: number
}

/** Enhance only the visible orientation, retaining native scroll and server HTML. */
export function TimelineFocus({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const width = useMotionValue(1)
  const height = useMotionValue(12)
  const opacity = useMotionValue(0)

  useEffect(() => {
    const root = ref.current
    if (!root || !window.ResizeObserver || !window.IntersectionObserver) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const desktop = window.matchMedia("(min-width: 768px)")
    const observed = new Set<Element>()
    let viewport: HTMLElement | null = null
    let orientation: string | null = null
    let positions: TimelinePosition[] = []
    let current: TimelinePosition | null = null
    let currentId: string | null = null
    let requestedIndex: number | null = null
    let endTimer = 0
    let dirty = true
    let inView = false
    let frame = 0
    let alive = true

    const setCurrent = (next: TimelinePosition | null) => {
      if (next?.element !== current?.element) {
        current?.element.removeAttribute("data-current")
        current?.element
          .querySelector('[data-slot="timescale-year"]')
          ?.removeAttribute("aria-current")
        next?.element.setAttribute("data-current", "")
        next?.element
          .querySelector('[data-slot="timescale-year"]')
          ?.setAttribute("aria-current", "true")
      }
      current = next
      currentId = next?.id ?? null
      if (next) root.dataset.timelineCurrent = next.id
      else delete root.dataset.timelineCurrent
    }

    const stopRequest = () => {
      requestedIndex = null
      window.clearTimeout(endTimer)
    }
    const scroll = () => {
      window.clearTimeout(endTimer)
      endTimer = window.setTimeout(stopRequest, 160)
      schedule()
    }
    const headerWidth = () =>
      viewport
        ?.closest('[data-slot="timescale-root"]')
        ?.querySelector('[data-slot="timescale-header"]')
        ?.getBoundingClientRect().width ?? 0

    const scrollToPosition = (position: TimelinePosition, smooth: boolean) => {
      if (!viewport) return
      if (orientation === "horizontal") {
        const rootBox = root.getBoundingClientRect()
        const viewportBox = viewport.getBoundingClientRect()
        viewport.scrollTo({
          left:
            position.start - (viewportBox.left - rootBox.left) - headerWidth(),
          behavior: smooth && !reduced.matches ? "smooth" : "instant",
        })
      } else {
        window.scrollBy({
          top:
            root.getBoundingClientRect().top +
            position.start -
            getReadingViewport().line,
          behavior: "instant",
        })
      }
    }

    const measure = () => {
      const visible = Array.from(
        root.querySelectorAll<HTMLElement>('[data-slot="timescale-root"]')
      ).find((element) => element.getBoundingClientRect().width > 0)
      const nextViewport =
        visible?.querySelector<HTMLElement>(
          '[data-slot="timescale-viewport"]'
        ) ?? null
      if (!visible || !nextViewport) return
      const nextOrientation = visible.dataset.orientation ?? "horizontal"
      const switched = !!orientation && orientation !== nextOrientation
      const savedId = currentId

      if (viewport !== nextViewport) {
        viewport?.removeEventListener("scroll", scroll)
        viewport?.removeEventListener("scrollend", stopRequest)
        viewport?.removeEventListener("wheel", stopRequest)
        viewport?.removeEventListener("pointerdown", stopRequest)
        resize.disconnect()
        observed.clear()
        viewport = nextViewport
        if (nextOrientation === "horizontal") {
          viewport.addEventListener("scroll", scroll, { passive: true })
          viewport.addEventListener("scrollend", stopRequest)
          viewport.addEventListener("wheel", stopRequest, { passive: true })
          viewport.addEventListener("pointerdown", stopRequest, {
            passive: true,
          })
        }
        resize.observe(root)
        resize.observe(viewport)
      }
      orientation = nextOrientation
      const box = root.getBoundingClientRect()
      const scrollLeft = orientation === "horizontal" ? viewport.scrollLeft : 0
      const elements = Array.from(
        visible.querySelectorAll<HTMLElement>("[data-timeline-segment]")
      )
      positions = elements.map((element) => {
        if (!observed.has(element)) {
          resize.observe(element)
          observed.add(element)
        }
        const itemBox = element.getBoundingClientRect()
        const tick = element
          .querySelector('[data-slot="timescale-tick"]')!
          .getBoundingClientRect()
        return {
          id: element.dataset.timelineSegment!,
          element,
          start:
            orientation === "horizontal"
              ? itemBox.left - box.left + scrollLeft
              : itemBox.top - box.top,
          end:
            orientation === "horizontal"
              ? itemBox.right - box.left + scrollLeft
              : itemBox.bottom - box.top,
          tickX: tick.left + tick.width / 2 - box.left + scrollLeft,
          tickY: tick.top + tick.height / 2 - box.top,
        }
      })
      dirty = false
      if (switched) {
        stopRequest()
        const restored = positions.find((position) => position.id === savedId)
        if (restored && inView) {
          setCurrent(restored)
          scrollToPosition(restored, false)
        }
      }
    }

    const update = () => {
      frame = 0
      if (!inView || document.hidden) {
        opacity.set(0)
        return
      }
      if (dirty) measure()
      if (!viewport || !positions.length) {
        setCurrent(null)
        opacity.set(0)
        return
      }
      const box = root.getBoundingClientRect()
      const horizontal = orientation === "horizontal"
      let nextId: string | null
      if (horizontal) {
        const view = viewport.getBoundingClientRect()
        const start = view.left + headerWidth()
        const end = view.right
        const offset = box.left - viewport.scrollLeft
        const max = viewport.scrollWidth - viewport.clientWidth
        nextId =
          viewport.scrollLeft <= 1
            ? positions[0].id
            : viewport.scrollLeft >= max - 1
              ? positions.at(-1)!.id
              : pickReadingItem(
                  positions.map((position) => ({
                    id: position.id,
                    start: position.start + offset,
                    end: position.end + offset,
                  })),
                  start + (end - start) * 0.35,
                  start,
                  end,
                  currentId
                )
      } else {
        const view = getReadingViewport()
        nextId = pickReadingItem(
          positions.map((position) => ({
            id: position.id,
            start: position.start + box.top,
            end: position.end + box.top,
          })),
          view.line,
          view.start,
          view.end,
          currentId
        )
      }
      const focused = document.activeElement
      const focusedId =
        focused instanceof Element && focused.matches(":focus-visible")
          ? focused.closest<HTMLElement>("[data-timeline-segment]")?.dataset
              .timelineSegment
          : undefined
      const next =
        positions.find((position) => position.id === (focusedId ?? nextId)) ??
        null
      setCurrent(next)
      if (!next) {
        opacity.set(0)
        return
      }
      const scrollLeft = horizontal ? viewport.scrollLeft : 0
      x.set(next.tickX - scrollLeft - (horizontal ? 0.5 : 6))
      y.set(next.tickY - (horizontal ? 6 : 0.5))
      width.set(horizontal ? 1 : 12)
      height.set(horizontal ? 12 : 1)
      opacity.set(1)
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
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) invalidate()
      else opacity.set(0)
    })
    const keyDown = (event: KeyboardEvent) => {
      if (
        event.target !== viewport ||
        orientation !== "horizontal" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !positions.length
      )
        return
      const index =
        requestedIndex ??
        Math.max(
          0,
          positions.findIndex((position) => position.id === currentId)
        )
      let nextIndex: number
      switch (event.key) {
        case "ArrowRight":
          nextIndex = Math.min(positions.length - 1, index + 1)
          break
        case "ArrowLeft":
          nextIndex = Math.max(0, index - 1)
          break
        case "Home":
          nextIndex = 0
          break
        case "End":
          nextIndex = positions.length - 1
          break
        default:
          return
      }
      event.preventDefault()
      requestedIndex = nextIndex
      scrollToPosition(positions[nextIndex], true)
      schedule()
    }
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
        stopRequest()
        opacity.set(0)
      } else invalidate()
    }

    intersection.observe(root)
    root.addEventListener("keydown", keyDown)
    root.addEventListener("focusin", schedule)
    root.addEventListener("focusout", schedule)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", invalidate)
    window.visualViewport?.addEventListener("resize", invalidate)
    window.visualViewport?.addEventListener("scroll", schedule)
    document.addEventListener("visibilitychange", visibility)
    desktop.addEventListener("change", invalidate)
    reduced.addEventListener("change", schedule)
    void document.fonts.ready.then(() => alive && invalidate())

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      stopRequest()
      setCurrent(null)
      resize.disconnect()
      intersection.disconnect()
      viewport?.removeEventListener("scroll", scroll)
      viewport?.removeEventListener("scrollend", stopRequest)
      viewport?.removeEventListener("wheel", stopRequest)
      viewport?.removeEventListener("pointerdown", stopRequest)
      root.removeEventListener("keydown", keyDown)
      root.removeEventListener("focusin", schedule)
      root.removeEventListener("focusout", schedule)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", invalidate)
      window.visualViewport?.removeEventListener("resize", invalidate)
      window.visualViewport?.removeEventListener("scroll", schedule)
      document.removeEventListener("visibilitychange", visibility)
      desktop.removeEventListener("change", invalidate)
      reduced.removeEventListener("change", schedule)
    }
  }, [height, opacity, width, x, y])

  return (
    <div ref={ref} className="relative" data-slot="timeline-focus">
      {children}
      <div
        className="pointer-events-none absolute inset-0 overflow-clip"
        aria-hidden="true"
      >
        <motion.span
          className="absolute top-0 left-0 bg-foreground/70"
          style={{ x, y, width, height, opacity }}
          data-slot="timeline-indicator"
        />
      </div>
    </div>
  )
}
