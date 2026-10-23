# 部署到自己的服务器

这个文件夹是自包含的：**整个 `caddy/` 上传到服务器，跑一个脚本就完事**。

```
caddy/
├── Caddyfile     Caddy 站点配置
├── install.sh    服务器上执行一次，自动安装
├── site/         静态站点文件（由 pnpm bundle 生成）
└── README.md     本文件
```

## 步骤

**1. 本地打包**

```bash
pnpm bundle
```

站点文件会生成到 `caddy/site/`。

**2. 上传整个文件夹**

```bash
scp -r caddy root@你的服务器IP:~/
```

**3. 服务器上安装**

```bash
cd ~/caddy && chmod +x install.sh && sudo ./install.sh
```

脚本会把站点复制到 `/var/www/resume`、安装 Caddy 配置、校验并重载服务，最后打印访问地址。

装完用 `http://服务器IP` 就能访问。

## 有域名之后

先把域名的 A 记录指向服务器 IP，确认 80 / 443 端口开放，然后本地重新打包一次（让 canonical、sitemap、分享图地址用上新域名）：

```bash
SITE_URL=https://你的域名 pnpm bundle
```

上传后在服务器上带域名重新安装：

```bash
sudo DOMAIN=你的域名 ./install.sh
```

Caddy 会自动申请 HTTPS 证书并续期，不用管。

## 以后更新简历

改完内容重新打包、上传、安装即可，三条命令：

```bash
pnpm bundle && scp -r caddy root@你的服务器IP:~/ && ssh root@你的服务器IP "cd ~/caddy && sudo ./install.sh"
```

## 说明

- `install.sh` 会先备份已有的 `/etc/caddy/Caddyfile`（加时间戳后缀），不会直接覆盖丢失
- 站点同步使用 `rsync --delete`，旧版本的残留文件会被清理
- GitHub 贡献热力图是**打包时**抓取并写死进 HTML 的，想让它保持最新就定期重新打包一次
- 服务器上没装 Caddy 的话，`install.sh` 会打印 Debian / Ubuntu 的安装命令
