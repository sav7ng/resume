"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, usePageInView } from "motion/react"

import { DecodeText } from "@/registry/components/decode-text"

const INTERVAL_MS = 3000

export function FlipSentences({
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "ref"> & {
  children: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)
  const play = isPageInView && isInView

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!play || children.length < 2) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % children.length)
    }, INTERVAL_MS)

    return () => clearInterval(timer)
  }, [play, children.length])

  return (
    <div ref={ref} {...props}>
      <DecodeText
        className="font-mono text-sm text-balance text-muted-foreground"
        play={play}
      >
        {children[index % children.length]}
      </DecodeText>
    </div>
  )
}
