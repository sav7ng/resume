# Saving Resume

一个单页静态个人简历站，当前实现采用移动优先的 monochrome editorial 视觉风格：白底、黑灰层级、强排版对比、海报式标题和长段落阅读布局。

项目入口是 [`index.html`](/Users/saving/Development/Code/about/index.html)，没有构建流程、没有前端框架工程结构，也没有额外的样式拆分文件。页面内容、样式和少量初始化脚本都集中在一个文件里。

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
- 仅使用黑 / 白 / 灰建立层级
- 零圆角、无阴影，强调留白、字重和字号对比
- 保留 `AOS` 作为轻量入场动画

## 仓库结构

```text
about/
├── README.md
├── avatar.jpg
└── index.html
```

文件说明：

- [`index.html`](/Users/saving/Development/Code/about/index.html)：页面主入口，包含完整内容、样式变量、版式类和 AOS 初始化脚本
- [`avatar.jpg`](/Users/saving/Development/Code/about/avatar.jpg)：首屏头像资源
- [`README.md`](/Users/saving/Development/Code/about/README.md)：当前项目说明

## 技术与依赖

当前页面依赖非常少，主要是：

- 原生 `HTML`
- 原生 `CSS`
- 少量原生 `JavaScript`
- [Tailwind CSS CDN](https://cdn.tailwindcss.com) 作为布局辅助
- [AOS](https://michalsnik.github.io/aos/) 作为滚动入场动画
- [Google Fonts](https://fonts.google.com/) 提供 `Anton` 和 `Crimson Text`

说明：

- 页面不依赖本地构建工具，不需要 `npm install`
- 页面依赖外部 CDN 和字体服务，离线环境下显示会退化
- 当前实现已经移除旧版 ASCII 背景、jQuery 和额外本地样式文件依赖

## 本地预览

直接在当前目录启动一个静态文件服务器即可：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

也可以直接打开 [`index.html`](/Users/saving/Development/Code/about/index.html)，但更推荐用本地服务器预览外部资源加载和链接行为。

## 实现特点

- 单文件交付：适合快速部署到任意静态托管平台
- 移动优先：桌面端延续窄栏 editorial 布局，不扩展为复杂双栏应用界面
- 内容完整：保留完整简历文案、技能列表、工作经历、文章和开源项目链接
- 风格统一：头像、信息卡、经历卡、列表项都使用同一套黑白灰视觉规则
- 可维护性比旧版更高：移除了旧版背景生成逻辑和历史遗留依赖

## 修改建议

如果后续继续维护，通常只需要改这几个位置：

- 替换头像：更新 [`avatar.jpg`](/Users/saving/Development/Code/about/avatar.jpg)
- 修改文案：直接编辑 [`index.html`](/Users/saving/Development/Code/about/index.html) 对应区块
- 调整视觉：修改 `index.html` 中的 CSS 变量和语义类
- 调整动效：修改 `AOS.init(...)` 参数或对应 `data-aos` 属性

## 适合的部署方式

这是一个纯静态页面，适合直接部署到：

- GitHub Pages
- Vercel 静态站点
- Netlify
- 任意 Nginx / OSS / 对象存储静态托管

## 隐私提醒

页面源码包含真实个人履历信息和联系方式。若仓库公开，请确认 [`index.html`](/Users/saving/Development/Code/about/index.html) 中的手机号、微信、邮箱和工作经历内容都属于你愿意公开的信息。
