/**
 * Generates the static Open Graph image into `public/og-image.png`.
 *
 * The site is exported as static HTML, so it cannot generate OG images on
 * demand. Run this once (and again whenever the name/title changes) and commit
 * the PNG:
 *
 *   node scripts/generate-og.mjs
 *
 * Text is kept ASCII on purpose — the SVG is rasterized by librsvg through
 * sharp, which resolves fonts from the host system, and CJK glyphs are not
 * reliably available on CI runners.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, "..", "public", "og-image.png")

const WIDTH = 1200
const HEIGHT = 630
const INSET = 48

// Blocky "S" on a 5x5 grid — same geometry as src/components/saving-mark.tsx.
const MARK = [
  "M0 0h320v64H0z",
  "M0 64h64v64H0z",
  "M0 128h320v64H0z",
  "M256 192h64v64h-64z",
  "M0 256h320v64H0z",
].join("")

const MARK_SIZE = 76
const MARK_SCALE = MARK_SIZE / 320

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#09090b"/>

  <g stroke="#27272a" stroke-width="1">
    <line x1="${INSET}" y1="0" x2="${INSET}" y2="${HEIGHT}"/>
    <line x1="${WIDTH - INSET}" y1="0" x2="${WIDTH - INSET}" y2="${HEIGHT}"/>
    <line x1="0" y1="${INSET}" x2="${WIDTH}" y2="${INSET}"/>
    <line x1="0" y1="${HEIGHT - INSET}" x2="${WIDTH}" y2="${HEIGHT - INSET}"/>
  </g>

  <g transform="translate(96 96) scale(${MARK_SCALE})" fill="#fafafa">
    <path d="${MARK}"/>
  </g>

  <text x="96" y="392" font-family="Helvetica, Arial, sans-serif" font-size="104" font-weight="600" fill="#fafafa" letter-spacing="-3">Saving</text>

  <text x="96" y="452" font-family="Helvetica, Arial, sans-serif" font-size="38" font-weight="400" fill="#a1a1aa">Senior Backend Developer / Team Lead</text>

  <text x="${WIDTH - 96}" y="152" text-anchor="end" font-family="Menlo, Consolas, monospace" font-size="24" fill="#52525b">github.com/sav7ng</text>

  <text x="96" y="534" font-family="Menlo, Consolas, monospace" font-size="24" fill="#52525b" letter-spacing="1">8 YEARS  ·  JAVA / GOLANG / KOTLIN  ·  DISTRIBUTED SYSTEMS</text>
</svg>`

mkdirSync(dirname(OUT), { recursive: true })

const png = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync(OUT, png)

console.log(`✓ ${OUT} (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB)`)
