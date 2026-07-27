import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "煌全",
  lastName: "吴",
  displayName: "Saving",
  username: "sav7ng",
  gender: "male",
  pronouns: "he/him",
  bio: "8 年后端开发经验，专注高性能、高可用系统与分布式架构。",
  flipSentences: [
    "Trying to do better.",
    "Senior Backend Developer / Team Lead.",
    "Java · Golang · Kotlin 分布式系统。",
    "AI 协同研发 · Vibe Coding · OpenSpec。",
  ],
  address: "广州, 中国",
  phoneNumberB64: "Kzg2MTgzMTYyNjA5OTc=", // +8618316260997
  emailB64: "c2F2aW5ncnVuQGdtYWlsLmNvbQ==", // savingrun@gmail.com
  website: "https://github.com/sav7ng",
  jobTitle: "高级后端开发工程师",
  jobs: [
    {
      title: "高级后端开发工程师",
      company: "海南火狐云网络科技",
      website: "https://github.com/sav7ng",
      experienceId: "firehu",
    },
  ],
  about: `- 我是吴煌全（叫我 Saving）—— 一名拥有 8 年经验的后端工程师，专注高性能、高可用系统的设计与实现。
- 熟悉 Java、Golang、Kotlin，在多租户 SaaS 平台、云手机自动化、本地生活电商等业务中完成从 0 到 1 的架构落地。
- 具备良好的 AI 协同开发能力，熟悉 Vibe Coding 与 OpenSpec 规范，熟练使用 Codex、Cursor、Claude Code 等工具，在需求分析、代码开发、重构优化、测试调试等环节实现高效协同。
- 开源作品：[WeHalo](https://github.com/sav7ng/WeHalo)（简约风微信小程序博客）、[AgentDroid](https://github.com/sav7ng/AgentDroid)（AI 移动设备自动化服务器）。
- 热爱运动，注重自我精进，追求专业能力与作品质量的持续进化。
`,
  avatar: "/images/avatar.jpg",
  avatarVariants: {
    lightOff: "/images/avatar.jpg",
    lightOn: "/images/avatar.jpg",
    darkOff: "/images/avatar.jpg",
    darkOn: "/images/avatar.jpg",
  },
  ogImage: "/images/avatar.jpg",
  namePronunciationUrl: "",
  timeZone: "Asia/Shanghai",
  keywords: [
    "saving",
    "sav7ng",
    "吴煌全",
    "后端开发",
    "高级后端开发工程师",
    "Java",
    "Golang",
    "Kotlin",
    "分布式架构",
    "微服务",
    "云手机",
    "AI 协同研发",
  ],
  dateCreated: "2024-07-24", // YYYY-MM-DD
}
