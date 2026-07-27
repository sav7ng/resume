"use client"

import { useEffect, useId, useRef } from "react"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { metalClickSound } from "@/lib/soundcn/metal-click"
import { useSound } from "@/hooks/soundcn/use-sound"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

/**
 * Isometric logomark: the blocky "S" from `saving-mark.tsx` projected onto a
 * 30° isometric grid.
 *
 * The plan shape is a 5x5 grid S — top bar, upper-left stem, middle bar,
 * lower-right stem, bottom bar — whose outline walks 12 vertices in (u, v)
 * grid space. Each vertex maps to the screen with
 *
 *   x = X[u - v + 5]   where X steps by 55.426 from 0.50
 *   y = Y[u + v]       where Y steps by 32 from 0.58
 *
 * so every point lands exactly on the drawing grid. Slabs are 32 units thick;
 * only the four edges whose outward normal points down-screen show a side
 * face. Technique (hatched faces, dashed run-through lines, cursor-tracking
 * gradient stroke, spring press) follows chanhdai.com, the geometry does not.
 */
export function SavingMarkIsometric() {
  const id = useId()
  const ids = {
    facePattern: `saving-face-pattern-${id}`,
    faceFill: `saving-face-fill-${id}`,
    topFill: `saving-top-fill-${id}`,
    stroke: `saving-stroke-${id}`,
    radialGradient: `saving-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full touch-manipulation overflow-visible [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        {/* Side faces: the four outline edges facing down-screen. */}
        <motion.g
          id={ids.faceFill}
          variants={{
            normal: { transform: "translate(0px, 0px)" },
            pressed: { transform: "translate(0px, 16px)" },
          }}
          transition={transition}
        >
          {/* top bar — right end */}
          <path d="M554.76 160.58L499.33 192.58L499.33 224.58L554.76 192.58Z" />
          {/* top bar — underside */}
          <path d="M499.33 192.58L277.63 64.58L277.63 96.58L499.33 224.58Z" />
          {/* bottom bar — right end */}
          <path d="M443.90 224.58L277.63 320.58L277.63 352.58L443.90 256.58Z" />
          {/* bottom bar — underside */}
          <path d="M277.63 320.58L0.50 160.58L0.50 192.58L277.63 352.58Z" />
        </motion.g>

        {/* Top face: the 12-vertex S outline. */}
        <motion.path
          id={ids.topFill}
          variants={{
            normal: {
              d: "M277.63 0.58L554.76 160.58L499.33 192.58L277.63 64.58L222.20 96.58L443.90 224.58L277.63 320.58L0.50 160.58L55.93 128.58L277.63 256.58L333.05 224.58L111.35 96.58Z",
            },
            pressed: {
              d: "M277.63 16.58L554.76 176.58L499.33 208.58L277.63 80.58L222.20 112.58L443.90 240.58L277.63 336.58L0.50 176.58L55.93 144.58L277.63 272.58L333.05 240.58L111.35 112.58Z",
            },
          }}
          transition={transition}
        />

        <motion.path
          id={ids.stroke}
          variants={{
            normal: {
              d: [
                // top face outline
                "M277.63 0.58 L554.76 160.58 L499.33 192.58 L277.63 64.58 L222.20 96.58 L443.90 224.58 L277.63 320.58 L0.50 160.58 L55.93 128.58 L277.63 256.58 L333.05 224.58 L111.35 96.58 Z",
                // top bar — bottom edge of the two visible side faces
                "M554.76 160.58 V192.58 L499.33 224.58 L277.63 96.58",
                "M499.33 192.58 V224.58",
                "M277.63 64.58 V96.58",
                // bottom bar — bottom edge of the two visible side faces
                "M443.90 224.58 V256.58 L277.63 352.58 L0.50 192.58",
                "M277.63 320.58 V352.58",
                "M0.50 160.58 V192.58",
              ].join(""),
            },
            pressed: {
              d: [
                "M277.63 16.58 L554.76 176.58 L499.33 208.58 L277.63 80.58 L222.20 112.58 L443.90 240.58 L277.63 336.58 L0.50 176.58 L55.93 144.58 L277.63 272.58 L333.05 240.58 L111.35 112.58 Z",
                "M554.76 176.58 V192.58 L499.33 224.58 L277.63 96.58",
                "M499.33 208.58 V224.58",
                "M277.63 80.58 V96.58",
                "M443.90 240.58 V256.58 L277.63 352.58 L0.50 192.58",
                "M277.63 336.58 V352.58",
                "M0.50 176.58 V192.58",
              ].join(""),
            },
          }}
          transition={transition}
        />

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      {/* Dashed lines running through the mark, parallel to the isometric axes. */}
      <g className="stroke-line" strokeWidth="1" strokeDasharray="4 2">
        <path d="M-477.55 756.57L1254.51 -243.41" />
        <path d="M977.37 788.58L-754.67 -211.42" />
        <path d="M1143.65 692.58L-588.39 -307.42" />
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <use href={`#${ids.topFill}`} className="fill-background" />

      <use href={`#${ids.stroke}`} stroke="var(--stroke)" />
      <use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />
    </motion.svg>
  )
}
