"use client"

import { useEffect, useRef } from "react"

/** Front and rear contours share the original five-by-five S silhouette. */
const OUTLINE = [
  [0, 0],
  [5, 0],
  [5, 1],
  [1, 1],
  [1, 2],
  [5, 2],
  [5, 5],
  [0, 5],
  [0, 4],
  [4, 4],
  [4, 3],
  [0, 3],
]

/** Half the extruded thickness: the contours sit at ±DEPTH. */
const DEPTH = 0.35
/** World units visible above and below the centre, as an orthographic view. */
const HALF_HEIGHT = 3.65
const MAX_PIXEL_RATIO = 1.75

type Layer = { opacity: number; points: number[] }

/**
 * Flat [x, y, z, x, y, z, …] runs of independent segments, in the order they
 * are painted: far contour, near contour, then the side ribs and hatching.
 */
function buildLayers(): Layer[] {
  const loop = (z: number) =>
    OUTLINE.flatMap(([x, y], i) => {
      const [nx, ny] = OUTLINE[(i + 1) % OUTLINE.length]
      return [x - 2.5, 2.5 - y, z, nx - 2.5, 2.5 - ny, z]
    })

  const ribs: number[] = []
  const hatches: number[] = []
  OUTLINE.forEach(([x, y], i) => {
    const [nx, ny] = OUTLINE[(i + 1) % OUTLINE.length]
    const length = Math.hypot(nx - x, ny - y)
    const at = (distance: number, z: number) => [
      x - 2.5 + ((nx - x) * distance) / length,
      2.5 - y - ((ny - y) * distance) / length,
      z,
    ]
    ribs.push(...at(0, -DEPTH), ...at(0, DEPTH))
    // Clip diagonal strokes to each side panel, including both end corners.
    const slant = 0.38
    for (let start = -slant; start < length; start += 0.16) {
      const lo = Math.max(0, -start / slant)
      const hi = Math.min(1, (length - start) / slant)
      if (lo >= hi) continue
      hatches.push(
        ...at(start + lo * slant, -DEPTH + lo * DEPTH * 2),
        ...at(start + hi * slant, -DEPTH + hi * DEPTH * 2)
      )
    }
  })

  return [
    { opacity: 0.18, points: loop(-DEPTH) },
    { opacity: 0.6, points: loop(DEPTH) },
    { opacity: 0.18, points: ribs },
    { opacity: 0.24, points: hatches },
  ]
}

/** A local, procedural sculpture: no WebGL, remote models, fonts, or textures. */
export function SavingMarkWireframe() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return

    const layers = buildLayers()
    const rest = { x: 0.68, y: -0.45, z: -0.48 }

    // Two detuned sines with random phases drift the pose without repeating.
    const drift = (amplitude: number) => {
      const slow = 0.085 + Math.random() * 0.07
      const fast = slow * (1.7 + Math.random() * 0.7)
      const slowPhase = Math.random() * Math.PI * 2
      const fastPhase = Math.random() * Math.PI * 2
      return (at: number) =>
        amplitude *
        (Math.sin(at * slow + slowPhase) * 0.68 +
          Math.sin(at * fast + fastPhase) * 0.32)
    }
    // The drift swings around its own centre, not the resting pose: pulling y
    // back towards zero keeps both ends of a wide sweep off the edge-on angle
    // that would collapse the S into a sliver. x stays shallowest so the top
    // of the travel never reads as a flat plan view.
    const sway = { x: 0.68, y: -0.2, z: -0.48 }
    const driftX = drift(0.22)
    const driftY = drift(0.8)
    const driftZ = drift(0.22)

    const rotation = { ...rest }
    let frame = 0
    let visible = false
    let time = 0
    let previous = 0
    let pointerX = 0
    let pointerY = 0
    let width = 0
    let height = 0
    let ratio = 1
    let stroke = "82, 82, 91"
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    const render = (now: number) => {
      frame = 0
      if (!width || !height) return
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0
      previous = now
      if (!reduced.matches) time += dt
      const blend = reduced.matches ? 1 : 1 - Math.exp(-dt * 3.2)
      const target = reduced.matches
        ? rest
        : {
            x: sway.x + driftX(time) + pointerY * 0.11,
            y: sway.y + driftY(time) + pointerX * 0.18,
            z: sway.z + driftZ(time),
          }
      rotation.x += (target.x - rotation.x) * blend
      rotation.y += (target.y - rotation.y) * blend
      rotation.z += (target.z - rotation.z) * blend
      const bob = reduced.matches ? 0 : Math.sin(time * 0.75) * 0.085

      // The two matrix rows an orthographic view needs, in the XYZ Euler order
      // the sculpture has always used.
      const a = Math.cos(rotation.x)
      const b = Math.sin(rotation.x)
      const c = Math.cos(rotation.y)
      const d = Math.sin(rotation.y)
      const e = Math.cos(rotation.z)
      const f = Math.sin(rotation.z)
      const m00 = c * e
      const m01 = -c * f
      const m02 = d
      const m10 = a * f + b * e * d
      const m11 = a * e - b * f * d
      const m12 = -b * c

      const scale = height / 2 / HALF_HEIGHT
      const originX = width / 2
      const originY = height / 2 - bob * scale

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      context.lineWidth = 1 / ratio
      for (const { opacity, points } of layers) {
        context.strokeStyle = `rgba(${stroke}, ${opacity})`
        context.beginPath()
        for (let i = 0; i < points.length; i += 6) {
          for (let end = 0; end < 2; end++) {
            const x = points[i + end * 3]
            const y = points[i + end * 3 + 1]
            const z = points[i + end * 3 + 2]
            const at: [number, number] = [
              originX + (m00 * x + m01 * y + m02 * z) * scale,
              originY - (m10 * x + m11 * y + m12 * z) * scale,
            ]
            if (end === 0) context.moveTo(...at)
            else context.lineTo(...at)
          }
        }
        context.stroke()
      }
      host.dataset.ready = "true"
      if (visible && !document.hidden && !reduced.matches)
        frame = requestAnimationFrame(render)
    }
    const refresh = () => {
      cancelAnimationFrame(frame)
      previous = 0
      if (visible && !document.hidden) frame = requestAnimationFrame(render)
    }
    const resize = new ResizeObserver(() => {
      const box = host.getBoundingClientRect()
      if (!box.width || !box.height) return
      width = box.width
      height = box.height
      ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      refresh()
    })
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      refresh()
    })
    const updateTheme = () => {
      stroke = document.documentElement.classList.contains("dark")
        ? "212, 212, 216"
        : "82, 82, 91"
    }
    const theme = new MutationObserver(() => {
      updateTheme()
      refresh()
    })
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return
      const box = host.getBoundingClientRect()
      pointerX = ((event.clientX - box.left) / box.width) * 2 - 1
      pointerY = ((event.clientY - box.top) / box.height) * 2 - 1
    }
    const leave = () => {
      pointerX = 0
      pointerY = 0
    }

    canvas.setAttribute("aria-hidden", "true")
    canvas.className =
      "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-data-[ready=true]:opacity-100"
    host.appendChild(canvas)
    updateTheme()
    resize.observe(host)
    intersection.observe(host)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    reduced.addEventListener("change", refresh)
    document.addEventListener("visibilitychange", refresh)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      theme.disconnect()
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
      reduced.removeEventListener("change", refresh)
      document.removeEventListener("visibilitychange", refresh)
      canvas.remove()
      delete host.dataset.ready
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className="group relative aspect-[1.57] w-full overflow-hidden"
      role="img"
      aria-label="Saving 的空心线框 S 标志"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse,black,transparent_72%)] bg-size-[40px_40px] opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-data-[ready=true]:opacity-0 motion-reduce:transition-none"
      >
        <svg
          viewBox="0 0 320 320"
          className="h-[65%] w-auto -rotate-6 text-foreground/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M0 0H320V64H64V128H320V320H0V256H256V192H0Z" />
        </svg>
      </div>
    </div>
  )
}
