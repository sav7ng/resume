import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "gzccc",
    school: "广州城建职业学院",
    degree: "大专",
    fieldOfStudy: "软件技术",
    period: {
      start: "09.2015",
      end: "06.2018",
    },
    description: `- 软件技术专业，系统学习 Java 语言基础、数据结构与算法、数据库原理与 Web 开发。
- 在校期间自学 Spring 生态与 Linux 服务端部署，并完成多个课程项目实践。
- 大三起进入企业实习，提前进入后端开发岗位并参与真实项目交付。`,
    skills: [
      "Java",
      "数据结构与算法",
      "MySQL",
      "Web 开发",
      "Linux",
      "面向对象设计",
    ],
    isExpanded: true,
  },
]
