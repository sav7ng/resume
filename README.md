# Saving Resume

一个单页静态个人简历站，采用移动优先的 monochrome editorial 视觉风格：强排版对比、海报式标题、长段落阅读布局，以及带主题切换和 AOS 入场节奏的单页履历展示。

项目现在采用轻量构建方案：

- 内容维护入口是 [`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json)
- 页面模板入口是 [`src/index.template.html`](/Users/saving/Development/Code/about/src/index.template.html)
- 构建脚本是 [`scripts/build-resume.mjs`](/Users/saving/Development/Code/about/scripts/build-resume.mjs)
- 根目录 [`index.html`](/Users/saving/Development/Code/about/index.html) 是生成产物，通常不直接手改

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
- 页面内置 A4 打印样式，可通过按钮导出 PDF
- 保留 `AOS` 作为轻量滚动入场动画
- 内容结构由 JSON 驱动，模板继续承载视觉和交互层

## 仓库结构

```text
about/
├── README.md
├── avatar.jpg
├── content/
│   └── resume.json
├── scripts/
│   └── build-resume.mjs
├── src/
│   └── index.template.html
└── index.html
```

文件说明：

- [`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json)：唯一内容源，维护 Hero、技能、工作经历、文章和开源项目信息
- [`src/index.template.html`](/Users/saving/Development/Code/about/src/index.template.html)：页面模板，保留样式、字体、主题脚本、AOS 逻辑和内容占位符
- [`scripts/build-resume.mjs`](/Users/saving/Development/Code/about/scripts/build-resume.mjs)：无依赖构建脚本，读取 JSON 和模板后生成最终页面
- [`index.html`](/Users/saving/Development/Code/about/index.html)：构建产物，用于直接部署和预览
- [`avatar.jpg`](/Users/saving/Development/Code/about/avatar.jpg)：首屏头像资源
- [`README.md`](/Users/saving/Development/Code/about/README.md)：项目说明

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

- 改简历文案：编辑 [`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json)
- 调整视觉样式：编辑 [`src/index.template.html`](/Users/saving/Development/Code/about/src/index.template.html) 中的 CSS token、布局和动效
- 调整构建逻辑：编辑 [`scripts/build-resume.mjs`](/Users/saving/Development/Code/about/scripts/build-resume.mjs)
- 替换头像：更新 [`avatar.jpg`](/Users/saving/Development/Code/about/avatar.jpg)

当前 JSON schema 的核心约束：

- `tone`: `default | inverse`
- `page.exportPdf`: 导出按钮文案与无障碍标签
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

也可以直接打开生成后的 [`index.html`](/Users/saving/Development/Code/about/index.html)，但更推荐通过本地服务器预览外部资源加载和链接行为。

## 导出 PDF

页面 Hero 区域带有 `Export PDF` 按钮，建议在桌面浏览器中使用：

1. 先通过本地静态服务器打开页面，确保头像、字体和外部资源加载完成。
2. 点击页面右上角 `Export PDF` 按钮。
3. 浏览器会打开打印对话框，选择 `Save as PDF` 或同类选项即可导出。

导出特性：

- 默认按 `A4` 纸张优化
- 无论当前浏览主题是什么，打印预览都会强制切到浅色打印版
- 打印时会自动隐藏主题切换和导出按钮，并压缩分页间距以减少断裂

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

页面源码和 [`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json) 包含真实个人履历信息和联系方式。若仓库公开，请确认这些内容都属于你愿意公开的信息。
