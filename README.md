# Saving Resume

吴煌全「Saving」的个人简历站。8 年后端开发经验，专注高性能、高可用系统与分布式架构。

站点基于 [chanhdai.com](https://github.com/ncdai/chanhdai.com)（MIT）改造：沿用其工程图纸式的视觉语言——全屏贯穿线、斜纹分隔带、768px 中轴、单色 zinc 色板、Geist 字体，内容与品牌标识全部替换为本人信息。

## 技术栈

- **Next.js 16**（App Router / Turbopack）+ **React 19**
- **Tailwind CSS v4** + **shadcn/ui**（Base UI）
- **motion** 动效，**next-themes** 主题
- TypeScript / ESLint / Prettier / Vitest

## 页面结构

单页简历，区块顺序：

| 区块                 | 说明                                                   |
| -------------------- | ------------------------------------------------------ |
| Profile Header       | 等距 "S" 标志（FIG_001）、头像、轮播标语               |
| Overview             | 职位、地点、当地时间、电话、邮箱、GitHub               |
| Social Links         | GitHub / 微信 / 公众号 / Email                         |
| GitHub Contributions | 拉取 `sav7ng` 近一年贡献热力图                         |
| Hello                | 个人简介                                               |
| Stack                | 技能墙，按 `01 Language` … `06 AI Coding` 六类编号分组 |
| Experience           | 五家公司 / 九个项目，可折叠展开完整职责与技术要点      |
| Projects             | AgentDroid / WeHalo / goscrew / IRON                   |
| Writing              | 微信公众号文章外链                                     |
| Education            | 广州城建职业学院 · 软件技术                            |

另有 `/timeline` 页面，以年份刻度展示职业生涯里程碑。

## 内容维护

所有简历内容都是 TypeScript 数据文件，改完重新构建即可：

| 文件                                                                                         | 内容                                                                  |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`src/features/portfolio/data/user.ts`](src/features/portfolio/data/user.ts)                 | 姓名、职位、简介、联系方式、头像、SEO 关键词                          |
| [`src/features/portfolio/data/experiences.tsx`](src/features/portfolio/data/experiences.tsx) | 工作经历（公司 → 项目 → 职责 / 技术要点 / 收获）                      |
| [`src/features/portfolio/data/tech-stack.tsx`](src/features/portfolio/data/tech-stack.tsx)   | 技能墙，`categories` 字段决定分组                                     |
| [`src/features/portfolio/data/projects.ts`](src/features/portfolio/data/projects.ts)         | 开源与个人项目                                                        |
| [`src/features/portfolio/data/writing.ts`](src/features/portfolio/data/writing.ts)           | 文章外链                                                              |
| [`src/features/portfolio/data/education.ts`](src/features/portfolio/data/education.ts)       | 教育经历                                                              |
| [`src/features/portfolio/data/timeline.ts`](src/features/portfolio/data/timeline.ts)         | 时间线里程碑                                                          |
| [`src/features/portfolio/data/social-links.ts`](src/features/portfolio/data/social-links.ts) | 社交链接（图标在 `components/social-link-icons.tsx` 按同名 key 绑定） |
| [`src/config/site.ts`](src/config/site.ts)                                                   | 站点 URL、导航、PDF 下载地址                                          |

电话与邮箱在 `user.ts` 中以 base64 存储（`phoneNumberB64` / `emailB64`），页面上按需解码，用于防爬。

简历 PDF 放在 [`public/saving.pdf`](public/saving.pdf)，页头的下载按钮指向它。原始简历草稿保留在 [`content/`](content/) 目录下。

## 品牌标识

标志是一个 5×5 网格上的块状 "S"：

- [`src/components/saving-mark.tsx`](src/components/saving-mark.tsx) —— 平面版，用于页头与 favicon
- [`src/features/portfolio/components/saving-mark-isometric.tsx`](src/features/portfolio/components/saving-mark-isometric.tsx) —— 30° 等距投影版，用于 Profile Header 的 FIG_001

等距版的几何由平面 S 的 12 个轮廓顶点按 `x = (u-v)` / `y = (u+v)` 投影得到，全部落在图纸网格点上；只有外法线朝向屏幕下方的 4 条边绘制侧面。

## 开发

```bash
pnpm install
```

```bash
pnpm dev
```

```bash
pnpm build
```

其他命令：`pnpm lint`、`pnpm check-types`、`pnpm test:run`、`pnpm format:write`。

环境变量参考 [`.env.example`](.env.example)，本地开发全部可留空（GitHub 贡献图默认走公开 API）。

## 许可

MIT，见 [LICENSE](LICENSE)。项目衍生自 [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com)，原始版权声明一并保留。
