# Saving 个人主页 / 在线简历

这是一个单文件静态个人主页项目，用于展示个人简介、技能栈、工作经历、文章和开源项目。仓库没有引入构建工具、包管理器或框架脚手架，核心实现集中在 [`index.html`](/Users/saving/Development/Code/about/index.html) 中，页面依赖少量本地静态资源和多个 CDN 脚本。

项目更适合被理解为“在线简历页面源码”，而不是常规的前端工程模板。页面主体采用大体量内联 SVG 背景、时间线履历布局、滚动动画和渐变文本视觉风格，整体偏向一次性静态展示。

## 项目简介

页面围绕个人履历展示展开，主要包含以下特点：

- 单页静态结构，所有主要内容直接写在 HTML 中。
- 通过大段内联 SVG 构建背景与闪烁动画效果。
- 使用时间线样式展示工作经历。
- 区块标题采用中英双语形式，如 `PROFILE / 简介`、`WORK EXPERIENCE / 工作经历`。
- 页面文案、样式和交互逻辑耦合在同一个入口文件内，适合快速发布，不适合复杂迭代。

## 技术栈

- 原生 `HTML`、`CSS`、`JavaScript`
- [Tailwind CSS CDN](https://cdn.tailwindcss.com)
- [AOS](https://michalsnik.github.io/aos/) 滚动动画
- [jQuery 3.3.1](https://jquery.com/)
- 本地样式文件：[`obsidian.mini.css`](/Users/saving/Development/Code/about/obsidian.mini.css)、[`obsidian.css`](/Users/saving/Development/Code/about/obsidian.css)

页面运行依赖外部 CDN。如果在离线环境中打开，Tailwind、AOS、jQuery 和部分字体资源可能无法正常加载。

## 项目结构

```text
about/
├── index.html
├── avatar.jpg
├── background.jpg
├── background.png
├── obsidian.css
├── obsidian.mini.css
├── s.png
└── s.svg
```

各文件职责如下：

- [`index.html`](/Users/saving/Development/Code/about/index.html)：页面主入口，包含内容结构、内联样式、SVG 背景和交互脚本。
- [`avatar.jpg`](/Users/saving/Development/Code/about/avatar.jpg)：头像资源。
- [`background.jpg`](/Users/saving/Development/Code/about/background.jpg)、[`background.png`](/Users/saving/Development/Code/about/background.png)：背景图资源，当前页面中有部分相关写法被注释或保留作备用。
- [`s.png`](/Users/saving/Development/Code/about/s.png)、[`s.svg`](/Users/saving/Development/Code/about/s.svg)：SVG/PNG 背景相关资源。
- [`obsidian.css`](/Users/saving/Development/Code/about/obsidian.css)：完整样式源文件，包含时间线、渐变文本等样式定义。
- [`obsidian.mini.css`](/Users/saving/Development/Code/about/obsidian.mini.css)：页面实际引用的压缩样式版本。

## 页面内容概览

页面按区块组织内容，主要包括：

- `PROFILE / 简介`：简短自我介绍。
- `PERSONAL DETAILS / 个人信息`：基础背景信息。
- `CONTACT / 联系方式`：页面中展示联系方式，README 不同步敏感字段。
- `SKILLS / 技能`：以标签形式展示语言、框架、中间件和工程能力。
- `WORK EXPERIENCE / 工作经历`：以时间线形式展示多段工作履历和项目职责。
- `ARTICLES / 文章`：外链文章列表。
- `OPEN SOURCES / 开源项目`：公开项目链接。
- `THANKS FOR YOUR / 致谢`：结尾说明。

README 仅保留项目层面的高层概述，不逐段复写页面中的完整履历正文。

## 本地运行

推荐使用本地静态服务器运行：

```bash
python3 -m http.server 8000
```

然后在浏览器访问：

```text
http://localhost:8000
```

也可以直接双击打开 [`index.html`](/Users/saving/Development/Code/about/index.html) 进行预览，但需要注意：

- 页面依赖多个外部 CDN，必须联网才能完整加载样式和脚本。
- 某些浏览器在本地文件协议下对资源或脚本行为更严格，推荐优先使用静态服务器。

## 实现特点

- 时间线布局：时间节点与履历内容主要依赖 [`obsidian.css`](/Users/saving/Development/Code/about/obsidian.css) 中的 `timeline` 相关样式。
- 渐变文本：`gradient-text` 类统一控制高亮标题和强调内容。
- 滚动动画：通过 `data-aos` 属性和 AOS 初始化脚本控制进入动画。
- ASCII / SVG 背景闪烁：页面底部脚本使用 jQuery 定时给 `.ascii-pattern g` 添加 `flash` 类，制造背景闪烁效果。
- 单文件入口：页面内容、内联样式和脚本集中在一个 HTML 中，维护门槛低，但复用性有限。

## 已知限制

- 依赖外部 CDN，不适合严格离线环境。
- [`index.html`](/Users/saving/Development/Code/about/index.html) 体积较大，约 `2.2 MB`，约 `17337` 行，阅读和维护成本较高。
- 页面内容、样式和脚本耦合，缺少模块化拆分。
- 仓库没有 `package.json`、构建脚本、自动化测试或部署配置。
- 当前目录不是 Git 工作树，仓库内也没有现成的版本管理元信息可供 README 引用。

## 可定制项

如果需要继续维护或二次修改，通常从以下位置入手：

- 替换头像：更新 [`avatar.jpg`](/Users/saving/Development/Code/about/avatar.jpg)。
- 修改文案：直接编辑 [`index.html`](/Users/saving/Development/Code/about/index.html) 中各区块文本。
- 调整技能标签：修改 `SKILLS / 技能` 区块中的标签节点。
- 调整履历：修改 `WORK EXPERIENCE / 工作经历` 时间线中的列表内容。
- 调整颜色与时间线样式：优先查看 [`obsidian.css`](/Users/saving/Development/Code/about/obsidian.css) 和压缩版 [`obsidian.mini.css`](/Users/saving/Development/Code/about/obsidian.mini.css)。
- 调整背景和动画：查看 [`index.html`](/Users/saving/Development/Code/about/index.html) 内联样式、SVG 片段和底部动画脚本。

如果后续要长期维护，建议先将超大体积的 SVG、页面内容和脚本拆分成独立文件，再补充构建与部署流程。

## 隐私说明

本 README 不同步页面中的手机号、微信等敏感联系方式，也不完整复制页面中的联系信息区块。若计划公开发布该页面源码，建议在发布前再次检查 [`index.html`](/Users/saving/Development/Code/about/index.html) 中是否仍包含不希望公开的个人信息。
