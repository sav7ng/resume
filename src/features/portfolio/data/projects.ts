import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "agentdroid",
    title: "AgentDroid",
    period: {
      start: "01.2025",
    },
    link: "https://github.com/sav7ng/AgentDroid",
    skills: [
      "Open Source",
      "AI Agent",
      "Android",
      "ADB",
      "UI Automation",
      "MCP",
    ],
    description: `AI 移动设备自动化服务器 —— 让 AI Agent 具备真实 Android 设备的操控能力。
- 将设备控制能力封装为 Agent 可调用的标准化工具
- 支持截图、UI 树快照、坐标交互与系统按键等自动化原语
- 面向「观察 → 行动 → 验证」的多步自动化任务闭环设计
`,
    isExpanded: true,
  },
  {
    id: "wehalo",
    title: "WeHalo",
    period: {
      start: "03.2019",
    },
    link: "https://github.com/sav7ng/WeHalo",
    skills: ["Open Source", "微信小程序", "JavaScript", "Halo", "REST API"],
    description: `简约风的微信小程序版博客 —— 对接 Halo 博客系统，把个人博客搬进微信生态。
- 极简阅读体验，聚焦文章内容本身
- 对接 Halo 开放接口，文章、分类与标签自动同步
- 开源发布，供社区自由部署与二次开发
`,
  },
  {
    id: "goscrew",
    title: "goscrew",
    period: {
      start: "09.2022",
      end: "06.2023",
    },
    link: "https://github.com/sav7ng",
    skills: ["Golang", "工具库", "内部开源"],
    description: `Go 语言的「螺丝钉」工具包，定位类似 Java 生态中的 hutool。

在 Disco 社区项目中沉淀并推行的内部开源库，收敛团队重复的工具方法，统一 Go 项目的基础能力层。`,
  },
  {
    id: "iron",
    title: "IRON 脚手架",
    period: {
      start: "08.2019",
      end: "02.2020",
    },
    link: "https://github.com/sav7ng",
    skills: ["Java", "Spring Boot", "Maven", "Gradle", "脚手架"],
    description: `自研 Java 快速开发脚手架，提供 Maven 与 Gradle 双版本。

用于睿妃医美平台从 PHP 到 Java 的整体重构，沉淀了工程分层规范、通用组件与 Docker 化部署流程。`,
  },
]
