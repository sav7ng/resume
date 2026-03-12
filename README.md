# Saving Resume

一个单页静态个人简历站，采用移动优先的 monochrome editorial 视觉风格：强排版对比、海报式标题、长段落阅读布局，以及带主题切换和 AOS 入场节奏的单页履历展示。

项目现在采用轻量构建方案：

- 唯一可构建内容源是 [`content/resume.json`](/Users/saving/Development/Code/resume/content/resume.json)
- 履历草稿 / 参考稿是 [`content/Saving.md`](/Users/saving/Development/Code/resume/content/Saving.md)
- 页面模板入口是 [`src/index.template.html`](/Users/saving/Development/Code/resume/src/index.template.html)
- 构建脚本是 [`scripts/build-resume.mjs`](/Users/saving/Development/Code/resume/scripts/build-resume.mjs)
- 根目录 [`index.html`](/Users/saving/Development/Code/resume/index.html) 是生成产物，通常不直接手改

## 当前页面内容

页面围绕个人履历展示展开，包含这些主要区块：

- Hero 首屏：姓名、职业定位、slogan、摘要、头像和关键指标
- `Profile / Personal Details / Contact`
- `Skills / 技能`
- `Work Experience / 工作经历`
- `Articles / 文章`
- `Open Sources / 开源项目`
- `Thanks For Your / 致谢`

当前风格重点：

- `Anton` 负责大标题、标签、区块标题
- `Crimson Text` 负责正文和说明性文本
- 使用主题 token 管理浅色、深色和跟随系统模式
- 页面保留 A4 打印样式，按钮会直接下载预置 PDF
- 保留 `AOS` 作为轻量滚动入场动画
- 内容结构由 JSON 驱动，模板继续承载视觉和交互层

## 仓库结构

```text
resume/
├── README.md
├── avatar.jpg
├── content/
│   ├── Saving.md
│   └── resume.json
├── scripts/
│   └── build-resume.mjs
├── src/
│   └── index.template.html
└── index.html
```

文件说明：

- [`content/resume.json`](/Users/saving/Development/Code/resume/content/resume.json)：唯一可构建内容源，维护 Hero、技能、工作经历、文章和开源项目信息
- [`content/Saving.md`](/Users/saving/Development/Code/resume/content/Saving.md)：最新履历草稿 / 参考稿，可先在这里整理长文案，再同步回 JSON
- [`src/index.template.html`](/Users/saving/Development/Code/resume/src/index.template.html)：页面模板，保留样式、字体、主题脚本、AOS 逻辑和内容占位符
- [`scripts/build-resume.mjs`](/Users/saving/Development/Code/resume/scripts/build-resume.mjs)：无依赖构建脚本，读取 JSON 和模板后生成最终页面
- [`index.html`](/Users/saving/Development/Code/resume/index.html)：构建产物，用于直接部署和预览
- [`avatar.jpg`](/Users/saving/Development/Code/resume/avatar.jpg)：首屏头像资源
- [`README.md`](/Users/saving/Development/Code/resume/README.md)：项目说明

## 技术与依赖

当前项目依赖非常少，主要是：

- 原生 `HTML`
- 原生 `CSS`
- 少量原生 `JavaScript`
- `Node.js` 用于本地构建生成静态页面
- [Tailwind CSS CDN](https://cdn.tailwindcss.com) 作为布局辅助
- [AOS](https://michalsnik.github.io/aos/) 作为滚动入场动画
- [Google Fonts](https://fonts.google.com/) 提供 `Anton` 和 `Crimson Text`

说明：

- 不需要 `npm install`
- 不引入前端框架、模板引擎或额外构建依赖
- 页面依赖外部 CDN 和字体服务，离线环境下显示会退化
- 内容渲染不依赖浏览器端 `fetch` 或运行时拼装

## 内容维护方式

常见维护入口：

- 改简历最终内容：编辑 [`content/resume.json`](/Users/saving/Development/Code/resume/content/resume.json)
- 先整理长文案草稿：编辑 [`content/Saving.md`](/Users/saving/Development/Code/resume/content/Saving.md)
- 调整视觉样式：编辑 [`src/index.template.html`](/Users/saving/Development/Code/resume/src/index.template.html) 中的 CSS token、布局和动效
- 调整构建逻辑：编辑 [`scripts/build-resume.mjs`](/Users/saving/Development/Code/resume/scripts/build-resume.mjs)
- 替换头像：更新 [`avatar.jpg`](/Users/saving/Development/Code/resume/avatar.jpg)

推荐更新流程：

1. 如需先打草稿，可先修改 [`content/Saving.md`](/Users/saving/Development/Code/resume/content/Saving.md)。
2. 将最终要展示的内容同步到 [`content/resume.json`](/Users/saving/Development/Code/resume/content/resume.json)。
3. 运行 `node scripts/build-resume.mjs` 重新生成 [`index.html`](/Users/saving/Development/Code/resume/index.html)。

当前 JSON schema 的核心约束：

- `tone`: `default | inverse`
- `page.exportPdf`: 导出按钮文案、无障碍标签和静态 PDF 下载目标
- `introCards[].type`: `richText | detailList`
- `experiences[].sections[].type`: `paragraph | list`
- 链接、图片和 badge 都使用显式字段，不在 JSON 里直接写原始 HTML

## 构建与预览

先生成根目录页面：

```bash
node scripts/build-resume.mjs
```

然后启动静态文件服务器：

```bash
python3 -m http.server 8000
```

访问：

```text
http://localhost:8000
```

也可以直接打开生成后的 [`index.html`](/Users/saving/Development/Code/resume/index.html)，但更推荐通过本地服务器预览外部资源加载和链接行为。

## 导出 PDF

页面 Hero 区域带有 `Export PDF` 按钮，建议通过本地静态服务器访问后使用：

1. 先通过本地静态服务器打开页面。
2. 点击页面右上角 `Export PDF` 按钮。
3. 页面会直接下载仓库中的 [`content/saving.pdf`](/Users/saving/Development/Code/resume/content/saving.pdf)。

导出特性：

- 默认下载文件名为 `saving.pdf`
- 浏览器若忽略 `download` 属性，会按原生行为打开同一个 PDF 文件
- 页面仍保留 `A4` 打印样式，供手动浏览器打印时使用

## 实现特点

- 内容与模板分层：文案维护和视觉实现职责清晰
- 静态直出：构建后得到完整 HTML，部署简单
- 移动优先：桌面端延续窄栏 editorial 布局，不扩展为复杂双栏应用界面
- 风格统一：头像、信息卡、经历卡、列表项和主题切换都使用同一套视觉规则
- 可维护性更高：后续新增文章、工作经历或开源项目时，只需要扩展 JSON

## 适合的部署方式

这是一个纯静态页面，适合直接部署到：

- GitHub Pages
- Vercel 静态站点
- Netlify
- 任意 Nginx / OSS / 对象存储静态托管

## 隐私提醒

页面源码和 [`content/resume.json`](/Users/saving/Development/Code/resume/content/resume.json) 包含真实个人履历信息和联系方式。若仓库公开，请确认这些内容都属于你愿意公开的信息。
