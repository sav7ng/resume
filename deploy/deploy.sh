#!/usr/bin/env bash
#
# Build the static site and rsync it to the Caddy server.
#
#   DEPLOY_HOST=root@1.2.3.4 ./deploy/deploy.sh
#
# Optional:
#   DEPLOY_PATH   remote web root                (default /var/www/resume)
#   SITE_URL      canonical URL baked into SEO   (default https://resume.example.com)
#
# Put the values in deploy/.env to avoid retyping them — it is gitignored.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f deploy/.env ]]; then
  # shellcheck disable=SC1091
  source deploy/.env
fi

: "${DEPLOY_HOST:?Set DEPLOY_HOST, e.g. DEPLOY_HOST=root@1.2.3.4}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/resume}"
SITE_URL="${SITE_URL:-https://resume.example.com}"

echo "▸ Building for ${SITE_URL}"
# Served from the domain root, so no base path.
NEXT_PUBLIC_BASE_PATH="" NEXT_PUBLIC_APP_URL="${SITE_URL}" pnpm build

if [[ ! -f out/index.html ]]; then
  echo "✗ Build produced no out/index.html — aborting." >&2
  exit 1
fi

echo "▸ Uploading to ${DEPLOY_HOST}:${DEPLOY_PATH}"
# --delete removes files that no longer exist in the build. It only ever
# touches DEPLOY_PATH, so keep that pointed at a directory the site owns.
rsync -avz --delete \
  --chmod=D755,F644 \
  out/ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "✓ Deployed to ${SITE_URL}"
