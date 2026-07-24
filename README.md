# Saving Resume

一个原生 HTML/CSS/JavaScript 实现的单页个人简历站。页面借鉴
[chanhdai.com](https://chanhdai.com/) 的工程感视觉语言，并按招聘方与技术面试官的阅读习惯重新设计：
窄内容中轴、全屏工程网格、细线分区、紧凑资料行，以及克制的滚动动效。

项目不迁移前端框架，也不复制参考站的品牌素材、文案或身份信息。内容由 JSON 驱动，构建后输出可直接部署的静态页面。

## 视觉与交互

- 最大宽度约 `760px` 的中央资料轨道，配合全屏横线、左右边线和斜线纹理分隔带
- `Geist` / `Geist Mono` 字体，中文回退到 `PingFang SC` 和系统无衬线字体
- 约 `49px` 高的粘性导航，提供区块锚点、PDF 下载和紧凑主题控件
- `Light / Dark / System` 三种主题模式，并保留用户选择
- 扁平列表、细边框资料行和小型技术标签，便于快速扫描履历
- 工作经历默认展示技术架构与项目概况，展开后阅读完整职责、技术要点和个人收获
- 保留 [AOS](https://michalsnik.github.io/aos/) 作为轻量入场动效，位移与时长经过收敛
- 浏览器打印时使用浅色 A4 样式，并自动展开完整经历

设计灵感来自 [chanhdai.com](https://chanhdai.com/)；其
[官方源码](https://github.com/ncdai/chanhdai.com) 采用 MIT 许可证。

## 仓库结构

```text
about/
├── README.md
├── avatar.jpg
├── content/
│   ├── saving.md
│   ├── resume.json
│   └── saving.pdf
├── scripts/
│   └── build-resume.mjs
├── src/
│   └── index.template.html
└── index.html
```

- [`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json)：唯一可构建内容源
- [`content/saving.md`](/Users/saving/Development/Code/about/content/saving.md)：履历草稿与长文案参考
- [`content/saving.pdf`](/Users/saving/Development/Code/about/content/saving.pdf)：页面下载的静态 PDF
- [`src/index.template.html`](/Users/saving/Development/Code/about/src/index.template.html)：视觉、主题、动效和交互模板
- [`scripts/build-resume.mjs`](/Users/saving/Development/Code/about/scripts/build-resume.mjs)：无依赖静态构建脚本
- [`index.html`](/Users/saving/Development/Code/about/index.html)：构建生成产物，通常不要直接修改

## 内容配置

常规履历更新只需编辑
[`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json)，再重新构建。
页面、链接、图片和标签均使用显式字段，不在 JSON 中写原始 HTML。

与页面结构相关的主要字段：

- `page.navigation[]`：导航项，包含 `label` 与区块 `target`
- `page.sections.*.id`：区块锚点，使用 `profile`、`skills`、`experience`、`writing`、`open-source`、`thanks`
- `page.experienceDisclosure`：经历展开与收起文案
- `page.exportPdf.href` / `downloadName`：静态 PDF 地址与下载文件名
- `experiences[].previewSectionCount`：默认预览的 section 数量；当前为 `2`，且不能超过该经历的 section 总数
- `experiences[].sections[].type`：经历内容类型，支持 `paragraph` 与 `list`

调整视觉时编辑
[`src/index.template.html`](/Users/saving/Development/Code/about/src/index.template.html)；调整渲染或校验逻辑时编辑
[`scripts/build-resume.mjs`](/Users/saving/Development/Code/about/scripts/build-resume.mjs)。

## 构建与预览

项目无需 `npm install`。在仓库根目录执行：

```bash
node scripts/build-resume.mjs
```

该命令读取模板与 JSON，并重新生成根目录
[`index.html`](/Users/saving/Development/Code/about/index.html)。建议不要直接编辑生成文件。

启动本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 [http://localhost:8000](http://localhost:8000)。也可以直接打开生成后的 `index.html`，但通过静态服务器更适合检查字体、外部资源和下载链接。

推荐更新流程：

1. 在 `content/saving.md` 中整理草稿（可选）。
2. 将最终内容维护到 `content/resume.json`。
3. 运行 `node scripts/build-resume.mjs`。
4. 启动静态服务器，在桌面端、平板和手机宽度下检查页面。

## PDF 与打印

页头的 PDF 入口直接下载
[`content/saving.pdf`](/Users/saving/Development/Code/about/content/saving.pdf)，默认文件名由
`page.exportPdf.downloadName` 配置。若浏览器忽略 `download` 属性，则按浏览器原生行为打开同一文件。

网页同时保留手动打印支持：打印时隐藏粘性页头和装饰背景、强制浅色，并展开全部工作经历。

## 可访问性

- 提供 skip-link、语义化 `header` / `nav` / `main` / `footer` 结构
- 导航、主题按钮、PDF 链接和经历展开控件均支持键盘操作
- 交互元素具有清晰的 `focus-visible` 状态
- 支持 `prefers-reduced-motion`，减少或关闭非必要位移与过渡
- 使用描述性页面元信息、主题色和内联 favicon

## 部署

构建结果是完整静态 HTML，可部署到 GitHub Pages、Vercel、Netlify、Nginx、对象存储或其他静态托管服务。

页面字体与 AOS 通过外部服务加载；离线环境下字体会回退，动效资源不可用时不影响履历正文阅读。

## 隐私提醒

页面源码和
[`content/resume.json`](/Users/saving/Development/Code/about/content/resume.json)
包含真实个人履历信息和联系方式。若仓库公开，请确认这些内容都属于你愿意公开的信息。
