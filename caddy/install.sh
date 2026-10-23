#!/usr/bin/env bash
#
# 在服务器上执行一次，完成安装：
#
#     sudo ./install.sh
#
# 可选：同时指定域名（会自动改写 Caddyfile 里的监听地址）
#
#     sudo DOMAIN=resume.example.com ./install.sh
#
# 之后每次更新站点，只需要重新上传 site/ 的内容到 /var/www/resume。
set -euo pipefail

WEB_ROOT="/var/www/resume"
CADDYFILE="/etc/caddy/Caddyfile"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [[ $EUID -ne 0 ]]; then
  echo "✗ 需要 root 权限运行：sudo ./install.sh" >&2
  exit 1
fi

if ! command -v caddy >/dev/null 2>&1; then
  cat >&2 <<'EOF'
✗ 没有检测到 caddy。先安装（Debian / Ubuntu）：

  apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | tee /etc/apt/sources.list.d/caddy-stable.list
  apt update && apt install caddy

装好后重新运行本脚本。
EOF
  exit 1
fi

if [[ ! -f "$HERE/site/index.html" ]]; then
  echo "✗ 找不到 $HERE/site/index.html —— 站点文件没有一起上传？" >&2
  exit 1
fi

echo "▸ 部署站点文件到 $WEB_ROOT"
mkdir -p "$WEB_ROOT"
# 先同步再删除多余文件，避免旧版本残留
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$HERE/site/" "$WEB_ROOT/"
else
  rm -rf "${WEB_ROOT:?}/"*
  cp -R "$HERE/site/." "$WEB_ROOT/"
fi
chown -R caddy:caddy "$WEB_ROOT" 2>/dev/null || true
find "$WEB_ROOT" -type d -exec chmod 755 {} +
find "$WEB_ROOT" -type f -exec chmod 644 {} +

echo "▸ 安装 Caddy 配置到 $CADDYFILE"
mkdir -p "$(dirname "$CADDYFILE")"
if [[ -f "$CADDYFILE" ]]; then
  cp "$CADDYFILE" "$CADDYFILE.bak.$(date +%Y%m%d%H%M%S)"
  echo "  （已备份原配置）"
fi
cp "$HERE/Caddyfile" "$CADDYFILE"

if [[ -n "${DOMAIN:-}" ]]; then
  echo "▸ 设置域名为 $DOMAIN"
  # 配置里只有一处行首的 ":80 {"（注释中的 :80 不在行首，不会被误伤）
  sed -i "s|^:80 {|${DOMAIN} {|" "$CADDYFILE"
  if ! grep -q "^${DOMAIN} {" "$CADDYFILE"; then
    echo "✗ 域名替换失败，请手动编辑 $CADDYFILE 把 ':80 {' 改成 '${DOMAIN} {'" >&2
    exit 1
  fi
fi

echo "▸ 校验配置"
caddy validate --config "$CADDYFILE" --adapter caddyfile

echo "▸ 重载 Caddy"
systemctl enable --now caddy >/dev/null 2>&1 || true
systemctl reload caddy || systemctl restart caddy

echo
if [[ -n "${DOMAIN:-}" ]]; then
  echo "✓ 完成 —— 访问 https://${DOMAIN}"
  echo "  （首次访问需等几秒，Caddy 正在申请证书）"
else
  IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
  echo "✓ 完成 —— 访问 http://${IP:-你的服务器IP}"
  echo "  有域名后：sudo DOMAIN=你的域名 ./install.sh"
fi
