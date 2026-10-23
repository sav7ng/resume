/**
 * Builds the static site into `caddy/site/`, so the whole `caddy/` folder can
 * be copied to the server as one self-contained bundle.
 *
 *   pnpm bundle                                      # 先用 IP 访问
 *   SITE_URL=https://resume.example.com pnpm bundle  # 有域名时
 *
 * SITE_URL only affects SEO metadata (canonical / sitemap / OG image URL) —
 * the page itself renders identically either way.
 */
import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const out = join(root, "out")
const dest = join(root, "caddy", "site")

const siteUrl = process.env.SITE_URL || ""

if (siteUrl) {
  console.log(`▸ 构建（站点地址：${siteUrl}）`)
} else {
  console.log("▸ 构建（未指定 SITE_URL，SEO 元数据用默认值）")
  console.log("  有域名后请改用：SITE_URL=https://你的域名 pnpm bundle")
}

execFileSync("pnpm", ["exec", "next", "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    // Served from the domain root — no base path.
    NEXT_PUBLIC_BASE_PATH: "",
    ...(siteUrl ? { NEXT_PUBLIC_APP_URL: siteUrl } : {}),
  },
})

if (!existsSync(join(out, "index.html"))) {
  console.error("✗ 构建没有产出 out/index.html，已中止")
  process.exit(1)
}

console.log("▸ 打包到 caddy/site/")
rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })
cpSync(out, dest, { recursive: true })

console.log(`\n✓ caddy/ 已就绪（站点 ${(dirSize(dest) / 1024 / 1024).toFixed(1)} MB）`)
console.log("  上传整个 caddy 文件夹，然后在服务器上执行 sudo ./install.sh")

function dirSize(dir) {
  let total = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    total += entry.isDirectory() ? dirSize(full) : statSync(full).size
  }
  return total
}
