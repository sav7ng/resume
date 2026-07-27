/**
 * Logomark for this site: a blocky "S" laid out on a 64px grid (5 rows x 5
 * columns), matching the engineering-drawing language used across the page.
 */
export function SavingMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 320 320"
      aria-hidden
      {...props}
    >
      <path fill="currentColor" d={MARK_PATH} />
    </svg>
  )
}

const MARK_PATH = [
  "M0 0h320v64H0z", // top bar
  "M0 64h64v64H0z", // upper-left stem
  "M0 128h320v64H0z", // middle bar
  "M256 192h64v64h-64z", // lower-right stem
  "M0 256h320v64H0z", // bottom bar
].join("")

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 320 320"><path fill="currentColor" d="${MARK_PATH}"/></svg>`
}

/** Text logotype paired with the mark. */
export function SavingWordmark({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={`font-mono text-lg font-medium tracking-tight ${className ?? ""}`}
      {...props}
    >
      Saving
    </span>
  )
}

export function getWordmarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64"><text x="0" y="46" font-family="ui-monospace, SFMono-Regular, monospace" font-size="44" font-weight="500" fill="currentColor">Saving</text></svg>`
}
