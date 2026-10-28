"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const ASCII_NOISE =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}()/\\|;:,._-=+*&^%$#@!?~"

const CJK_NOISE =
  "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展"

/**
 * CJK, kana and full-width punctuation occupy two monospace columns, so they
 * have to be scrambled into glyphs of the same width or the line reflows.
 */
const WIDE_CHAR = new RegExp(
  "[\u2E80-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFF60\uFFE0-\uFFE6]"
)

/** Re-roll a few times a second; a fresh glyph every frame reads as static. */
const ROLL_MS = 45

function noiseFor(char: string) {
  if (/\s/.test(char)) return char
  const pool = WIDE_CHAR.test(char) ? CJK_NOISE : ASCII_NOISE
  return pool[Math.floor(Math.random() * pool.length)]
}

export type DecodeTextProps = Omit<
  React.ComponentProps<"span">,
  "children" | "ref"
> & {
  /** The text to resolve to; changing it starts a new decode. */
  children: string

  /**
   * Time in milliseconds for the whole string to resolve.
   * @defaultValue 700
   * */
  duration?: number

  /** Controls whether the decode animation runs. */
  play?: boolean
}

export function DecodeText({
  className,
  children,

  duration = 700,
  play = true,

  ...props
}: DecodeTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  // Rendered once so the text ships in the HTML and survives without
  // JavaScript; from the first effect on, the node belongs to the animation
  // and React never reconciles it again.
  const [initial] = useState(children)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const settle = () => {
      node.textContent = children
    }

    if (
      !play ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      settle()
      return
    }

    const chars = Array.from(children)
    // Resolve roughly left to right, with enough jitter that the edge reads as
    // a scan rather than a wipe.
    const thresholds = chars.map((_, index) =>
      Math.min(1, (index / chars.length) * 0.72 + Math.random() * 0.28)
    )
    const noise = chars.map(noiseFor)

    let frame = 0
    let rolled = 0
    const start = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      if (now - rolled >= ROLL_MS) {
        rolled = now
        for (const [index, char] of chars.entries()) {
          if (progress < thresholds[index]) noise[index] = noiseFor(char)
        }
      }
      node.textContent = chars
        .map((char, index) =>
          progress >= thresholds[index] ? char : noise[index]
        )
        .join("")
      if (progress < 1) {
        frame = requestAnimationFrame(step)
        return
      }
      frame = 0
      settle()
    }

    frame = requestAnimationFrame(step)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      // A decode that is cut short leaves the text readable, never half noise.
      settle()
    }
  }, [children, duration, play])

  return (
    <span className={cn("inline-block", className)} {...props}>
      <span ref={ref} aria-hidden="true">
        {initial}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  )
}
