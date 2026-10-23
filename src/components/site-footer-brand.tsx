"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

const VIEWBOX_WIDTH = 1122

// Narrow, stepped outlines use the original footer's 32-unit drafting grid.
const WORDMARK_PATH = [
  "M33 1H161V33H33V113H129V145H161V225H129V257H1V225H129V145H33V113H1V33H33Z",
  "M225 33V1H321V33H353V257H321V161H225V257H193V33ZM225 33V129H321V33Z",
  "M385 1H417V161H449V225H481V161H513V1H545V161H513V225H481V257H449V225H417V161H385Z",
  "M577 1H737V33H673V225H737V257H577V225H641V33H577Z",
  "M769 257V1H801V65H833V113H865V161H897V1H929V257H897V209H865V161H833V113H801V257Z",
  "M993 1H1089V33H1121V65H1089V33H993V225H1089V161H1057V129H1121V225H1089V257H993V225H961V33H993Z",
].join(" ")

export function SiteFooterInteractiveLogotype() {
  const shouldReduceMotion = useReducedMotion()

  const gradientX1Raw = useMotionValue(0.5)
  const gradientX1 = useSpring(
    useTransform(gradientX1Raw, [0, 1], [0, VIEWBOX_WIDTH]),
    {
      stiffness: 150,
      damping: 25,
    }
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const containerRect = event.currentTarget.getBoundingClientRect()
    gradientX1Raw.set(
      (event.clientX - containerRect.left) / containerRect.width
    )
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    gradientX1Raw.set(0.5)
  }

  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex w-full translate-y-[37.5%] items-center justify-center">
          <svg
            className="container size-full"
            viewBox="0 0 1122 258"
            role="img"
            aria-label="SAVING"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={WORDMARK_PATH}
              fillRule="evenodd"
              fill="url(#saving-footer-gradient)"
              className="stroke-foreground/10"
              strokeWidth="2"
            />
            <defs>
              <motion.linearGradient
                id="saving-footer-gradient"
                x1={gradientX1}
                y1="1"
                x2="561"
                y2="257"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--foreground)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
