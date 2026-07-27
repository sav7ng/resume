import {
  BotIcon,
  BuildingIcon,
  CloudIcon,
  FlameIcon,
  MessagesSquareIcon,
  PlugIcon,
  ShieldIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  SparklesIcon,
  TruckIcon,
} from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "firehu",
    companyName: "海南火狐云网络科技有限公司",
    companyIcon: <FlameIcon />,
    location: "广州",
    locationType: "On-site",
    isCurrentEmployer: true,
    positions: [
      {
        id: "firehu-fireshield",
        title: "FIRESHIELD 火盾云手机封控系统",
        employmentType: "高级后端开发工程师",
        icon: <ShieldIcon />,
        employmentPeriod: { start: "05.2026" },
        isExpanded: true,
        description: `面向云手机业务的风控与封控系统。

> 项目细节与技术方案处于保密阶段，暂不公开展示。如需了解，欢迎面聊。`,
      },
    ],
  },
  {
    id: "suqi",
    companyName: "广州速启科技有限责任公司",
    companyIcon: <CloudIcon />,
    location: "广州",
    locationType: "On-site",
    positions: [
      {
        id: "suqi-cloudphone-openclaw",
        title: "CloudPhone OpenClaw 插件 · 云手机 Agent 能力开放",
        employmentType: "高级后端开发工程师",
        icon: <PlugIcon />,
        employmentPeriod: { start: "12.2025", end: "05.2026" },
        isExpanded: true,
        description: `基于 OpenClaw 插件体系开发的云手机 AI Agent 能力开放插件，把云手机 OpenAPI 封装为 14 个标准化的 \`cloudphone_*\` Agent 工具，覆盖设备管理与 UI 自动化操控全链路。插件以 npm 包 \`@whateverai/cloudphone\` 发布，支持 OpenClaw Gateway 一键安装，Agent 即装即用。

**担任职责**

- **Agent 工具体系设计** —— 设计并实现 14 个 \`cloudphone_*\` 工具定义，包括工具名、描述、JSON Schema 参数校验与执行函数，遵循 MCP 内容项规范（text / image），统一 Agent 工具调用与响应格式。
- **OpenAPI 请求抽象层** —— 封装统一 \`apiRequest\` 函数，内置超时控制（AbortController）、鉴权头注入、URL 归一化、业务状态码多格式兼容判定与错误信息提取，屏蔽底层 HTTP 细节。
- **设备管理能力** —— 实现用户信息获取、设备列表分页筛选、设备详情、电源控制、ADB/SSH 连接信息获取共 5 个工具，支撑 Agent 完成设备选择与状态确认。
- **UI 交互操控能力** —— 实现坐标点击、长按、滑动、文本输入、文本清除、系统按键（BACK/HOME/ENTER/RECENT/POWER）共 6 个工具，使 Agent 具备完整屏幕操控能力。
- **状态观测与截图渲染** —— 实现截图 / UI 树快照、页面等待条件（element_appear / element_disappear / page_stable）、截图 URL 渲染共 3 个工具。
- **内置 Skill 设计** —— 编写 \`basic-skill\` 教学文档，定义标准工作流与分层恢复策略、能力边界声明与排查指南，提升 Agent 多步 UI 自动化的执行稳定性。
- **插件注册与生命周期** —— 实现插件入口 register 函数，完成运行时配置解析、工具批量注册、执行结果规范化、异常兜底与结构化日志输出。
- **CI/CD 与发布** —— 基于 GitHub Actions 实现两阶段流水线，main 分支 push 触发构建，\`v*\` 标签触发公开发布到 npm Registry。

**技术要点**

- 严格遵循 \`name / description / parameters(JSON Schema) / execute\` 四元组定义工具，返回值统一采用 MCP 内容项规范。
- 截图渲染实现远程拉取 → MD5 哈希去重 → 本地缓存 → MIME 双重推断（Content-Type 优先 + URL 扩展名兜底）→ MCP image + MEDIA 兼容回退的完整链路。
- 设计「观察 → 行动 → 验证 → 再观察」标准工作流与分层恢复策略（BACK → HOME → 截图 → 重启），不增加新工具即提升执行稳定性。
- 结合 Cursor 辅助提效，在工具模板生成、请求抽象层搭建、Skill 文档编写与 CI/CD 配置环节加速迭代。

**个人收获**

深入理解了 AI Agent 工具化开放的工程实践：从「如何将后端 API 标准化封装为 Agent 可调用工具」到「如何通过 Skill 引导 Agent 稳定执行多步自动化任务」，掌握了 MCP 协议内容项规范、工具参数 JSON Schema 设计，以及 Agent 行为引导（Skill）与底层能力（Plugin）的职责分离思想。`,
        skills: [
          "TypeScript",
          "Node.js",
          "OpenClaw Plugin API",
          "MCP",
          "Fetch API",
          "AbortController",
          "GitHub Actions",
          "npm Registry",
        ],
      },
      {
        id: "suqi-cpc-ai-agent",
        title: "CPC 云手机 AI Agent 编排平台",
        employmentType: "高级后端开发工程师",
        icon: <BotIcon />,
        employmentPeriod: { start: "03.2025", end: "12.2025" },
        description: `微服务体系中的独立 AI 能力模块，面向云手机自动化与智能任务执行场景。核心是将自然语言指令解析为结构化任务，按任务类型自动路由到 Agent 执行器或脚本执行服务，完成任务创建、状态流转、执行派发、结果回调、会话沉淀的完整闭环，同时对外提供 HTTP OpenAPI 与 MCP Tool 双协议调用能力。

**担任职责**

- **AI 任务解析中心** —— 基于 Spring AI + OpenAI 实现自然语言任务结构化解析，将用户输入转为任务类型、执行时间、策略、目标应用、动作内容等字段，并结合租户应用库动态注入 Prompt 上下文。
- **Agent / Script 任务编排** —— 设计统一任务调度链路，完成任务落库、状态流转、立即执行、定时执行、策略分发，支持按任务策略派发至外部 Agent 执行器或脚本服务。
- **云手机开放接口** —— 设计并开发设备列表、设备详情、实时状态、电源控制、应用启动、ADB 连接信息获取等能力。
- **MCP 能力开放** —— 将 AI 任务能力封装为 MCP Tool，以 JSON-RPC 风格暴露任务创建与结果获取接口，支持智能体工具调用。
- **回调闭环与会话沉淀** —— 处理 Agent 与脚本任务回调，更新任务状态、转发业务通知，并将执行结果写入会话历史，支持多轮上下文追踪。
- **定时任务调度** —— 基于 XXL-JOB 实现到期任务扫描与自动派发，补齐延迟执行、预约执行场景。
- **OpenAPI 鉴权治理** —— 基于 Redis Token 校验与线程上下文用户态传递实现设备类接口安全访问控制。

**技术要点**

- 基于 Spring AI + BeanOutputConverter 将大模型输出直接转换为结构化任务对象，降低自然语言解析对手写规则的依赖。
- 将租户应用库信息动态注入 Prompt 上下文，使模型结合实际业务应用完成任务识别与 agent / script 策略路由。
- 打通「任务创建 → 状态持久化 → 执行派发 → 回调处理 → 通知转发 → 会话沉淀」完整闭环，增强可观测性与可追踪性。
- MCP Server + HTTP OpenAPI 双协议暴露，服务既可被传统业务系统调用，也能被支持 Tool Calling 的智能体直接接入。

**个人收获**

对 AI 大模型在企业级业务系统中的工程化落地有了更深理解——不再局限于调用模型返回结果，而是掌握了从 Prompt 设计、结构化任务解析、异步任务编排、执行回调闭环到能力平台化开放的完整实现思路。`,
        skills: [
          "Java 17",
          "Spring Boot 3",
          "Spring AI",
          "OpenAI",
          "MCP",
          "Spring Cloud",
          "Nacos",
          "Redis",
          "MySQL",
          "Kafka",
          "XXL-JOB",
          "WebFlux",
          "SSE",
        ],
      },
      {
        id: "suqi-cpc3",
        title: "CPC 3.0 多租户云机管理平台 / 云手机 SaaS",
        employmentType: "高级后端开发工程师",
        icon: <SmartphoneIcon />,
        employmentPeriod: { start: "07.2024", end: "03.2025" },
        description: `围绕云机资源管理、租户隔离、设备路由、用户接入、订单计费和 SaaS 配置构建的多模块后端平台。仓库由 lib 公共能力层、worker 业务微服务层、master 平台管理入口、mopenapi 开放接口层与 gateway 工具服务组成，覆盖管理后台、客户端 API、开放平台、worker 集群协同、设备接入、异步任务与第三方云厂商对接。

**担任职责**

- **平台架构治理** —— 参与多模块微服务架构拆分与服务边界设计，形成统一分层协作模式，沉淀可复用通用组件与服务模板。
- **租户与用户中心** —— 围绕租户配置、用户信息、登录记录、验证码、用户反馈、租户设备绑定进行设计实现，支撑 SaaS 多租户隔离。
- **订单与计费链路** —— 参与订单、商品、支付回调、套餐与计费服务建设，打通订单中心、租户系统与上层业务模块的协同链路。
- **设备与云机中心** —— 参与云机设备、资源池、共享存储、应用上下架、批量换机、重置、Root、截图、文件上传、设备定位修改等能力建设。
- **网关与路由体系** —— 参与 cpc-center-gateway、mopenapi 与 worker 路由关系设计，围绕租户到 worker、设备到 worker 的域名路由、请求转发、接口签名与跨 worker 数据同步建设开放平台调用链路。
- **IoT 与设备通信** —— 参与 kite-netty / kite-proxy / kite-manager / kite-monitor / iotapi 服务协同，支撑设备接入、代理转发、集群管理与 MQTT / WebSocket / Netty 通信。
- **第三方生态对接** —— 参与 Huawei、Tencent、Volcengine、Baidu、Ali、Firebase、Migu、Line、蜂助手等云厂商与生态能力接入。
- **监控与数据能力** —— 参与 Prometheus 指标采集、运行状态统计、资源池统计、埋点日志与业务数据接口建设。

**技术要点**

- 通过 lib / cpc-core 的 starter 模块沉淀 Redis、MyBatis、Kafka、MongoDB、Prometheus、XXL-Job、ShardingSphere、Feign、锁、认证等公共能力。
- 利用 Redis + Redisson 实现分布式锁与并发保护，在设备分配、换机、共享、回调、回收、备份恢复流程中减少并发覆盖与脏写风险。
- 借助 mopenapi 路由表 + worker 域名映射 + 跨 worker 同步接口构建分布式路由能力，支撑多 worker 集群下的业务调度与扩展。
- 结合 MongoDB + ShardingSphere + MyBatis-Plus 处理结构化与非结构化数据场景。

**个人收获**

加深了对微服务架构拆分、公共能力沉淀、跨模块协同与复杂业务边界划分的理解；在租户、设备、路由、开放平台、任务调度与监控链路场景中，提升了分布式系统设计、并发控制、异步任务编排、跨 worker 数据同步与平台型后端建设的整体把控能力。`,
        skills: [
          "Spring Boot 2.6",
          "Spring Cloud 2021",
          "Java 17",
          "Nacos",
          "OpenFeign",
          "MyBatis-Plus",
          "MySQL",
          "Redis",
          "Redisson",
          "MongoDB",
          "ShardingSphere",
          "Kafka",
          "XXL-Job",
          "Prometheus",
          "Netty",
          "MQTT",
          "WebSocket",
        ],
      },
    ],
  },
  {
    id: "dashijian",
    companyName: "广州大事件科技网络有限公司",
    companyIcon: <ShoppingBagIcon />,
    location: "广州",
    locationType: "On-site",
    positions: [
      {
        id: "dashijian-boomsj",
        title: "贪吃商城小程序 / 移动端 / 商家端",
        employmentType: "后端开发组长",
        icon: <ShoppingBagIcon />,
        employmentPeriod: { start: "11.2020", end: "07.2024" },
        description: `[贪吃商城](https://www.boomsj.com) 是自研从 0 到 1 的本地生活服务电商平台，注册会员 400W，月流水平均 2.5KW。依托微信生态与大事件流量优势，以技术为驱动帮助本地商家精准匹配消费群体。我全程参与项目开发，负责系统架构讨论与相关模块设计开发，并独立完成发号器调研测试与多渠道用户行为埋点统计系统的设计开发。

**担任职责**

- **用户中心** —— 负责多端（网页 / 微信 / 抖音 / 支付宝）统一登录注册的 SaaS 用户层功能与用户服务中心设计开发，确保高流量场景下正常登录注册；用户等级、任务系统、行为事件系统开发。
- **消息中心** —— 担任设计与开发主导，融合统一第三方消息发送渠道（短信 / APP 极光推送 / 站内信 / 公众号模板消息 / 小程序订阅消息 / 支付宝小程序推送），设计关键字与事件中心配合管理，解决多渠道统一发送难点。
- **APISIX 网关** —— 负责后端服务统一入口，实现路由、Token 身份认证、用户鉴权、租户 ID 校验、全局异常与限流处理。
- **OpenAPI 网关** —— 负责第三方鉴权、参数校验、API 请求次数与黑白名单功能。
- **微信中心** —— 负责微信服务设计开发重构；开发微信开放平台第三方平台，实现公众号授权管理、扫码事件监听、自动回复引流与缓存性能优化；对接小程序 UrlLink、带参二维码跳转与订阅消息发送。
- **渠道码数据统计中心** —— 负责交易分析图表（支付总金额、支付人数、单均支付金额、人均消费次数）开发；使用 ClickHouse 实现渠道码埋点数据分析，可查看访问人数、客单价、下单与支付全链路指标。
- **第三方服务** —— 对接腾讯广告附近推朋友圈广告投放流程与浏览 / 购券 / 核销行为数据回传；对接哗啦啦实现门店管理与扫码核销。
- **CodeReview** —— 审核代码合并请求，指出开发与优化问题，对项目方案整体把关。

**技术要点**

- 灵活使用「策略 + 工厂 + 模版」设计模式开发统一登录注册与消息中心，一套接口多处实现，大幅降低代码复杂度并提升可读性与拓展性。
- 使用 RocketMQ 实现异步通信、组件解耦与分布式事件系统，保障失败重试并通过数据库操作保证消费幂等性，实现高吞吐、高可靠。
- 引入 APISIX 替换 Spring Cloud Gateway：基于 OpenResty 架构性能更强，具备灵活路由、负载均衡、熔断、限流、认证授权与动态配置；基于 etcd 动态配置开发实时用户黑名单，并定制授权 Token 验签插件，开发中多次参与开源社区讨论与 bug 反馈。
- 设计业务用户埋点数据模型，利用 ClickHouse 列式存储进行打点记录与统计，配合 Pulsar 分批上报实现多维度数据展示。
- 利用 MongoDB 单文档原子性操作与多文档事务实现商品库存扣减与回补。
- 熟练使用 Arthas 进行线上服务性能诊断与问题排查。

**个人收获**

提升了对系统架构的大局观思考与微服务分布式架构的深入理解；在高并发高流量的真实商城场景中积累了更完善的处理方案；提升了 SaaS 多租户系统设计能力、会员系统设计能力，以及代码重构与设计模式的运用能力。`,
        skills: [
          "Spring Cloud",
          "MyBatis-Plus",
          "MySQL (PolarDB)",
          "Redis",
          "MongoDB",
          "ClickHouse",
          "Elasticsearch",
          "RocketMQ",
          "Pulsar",
          "Seata",
          "XXL-Job",
          "Sentinel",
          "OpenFeign",
          "APISIX",
          "Kubernetes",
          "Jenkins",
        ],
      },
      {
        id: "dashijian-disco",
        title: "贪吃商城 Disco 社区",
        employmentType: "后端开发工程师",
        icon: <MessagesSquareIcon />,
        employmentPeriod: { start: "09.2022", end: "06.2023" },
        description: `吃喝玩乐的社交平台，与贪吃商城相互结合补齐社交部分，内设帖子发布与评论、商品转卖与拼单等功能。

**担任职责**

- 项目架构设计与把控：前期完成 Kratos、Gin、go-micro、go-zero 等 Go 架构调研与选型，组织多次 Go 开发分析会议并沉淀技术文档。
- 负责用户模块与商城核销码转卖功能开发、贪吃商城用户授权注册社区会员功能、会员等级与收藏夹等功能开发。
- 推行内部开源 goscrew「螺丝钉」开发，类似 Java 生态中 hutool 的工具轮子包。

**个人收获**

个人时间学习的 Golang 在生产中得到实践，并在公司推行落地；增加了 Go 分布式架构系统的开发经验，开发过程中学习并实践了 DDD 领域模型开发与高内聚、低耦合的开发模式。`,
        skills: [
          "Golang",
          "Kratos",
          "Protobuf",
          "Kafka",
          "Redis",
          "MongoDB",
          "Prometheus",
          "Wire",
          "Docker",
          "XXL-Job",
          "APISIX",
        ],
      },
    ],
  },
  {
    id: "tangchao",
    companyName: "唐朝科技(广州)有限公司",
    companyIcon: <BuildingIcon />,
    location: "广州",
    locationType: "On-site",
    positions: [
      {
        id: "tangchao-banma",
        title: "斑马同校小程序",
        employmentType: "后端开发工程师",
        icon: <SmartphoneIcon />,
        employmentPeriod: { start: "02.2020", end: "11.2020" },
        description: `校园小程序，提供代拿快递、代跑购物、代课信息与点外卖功能，骑手端支持任务抢单、完成新订单与钱包管理，另有校园合伙人功能提供学校级权限管理。

**担任职责**

担任外卖模块开发负责人，对接微信支付、微信小程序与公众号授权及推送信息，处理新需求并优化代码遗留问题；使用 Swagger 搭建 API 文档提升前后端对接速度；开发后台外卖商家与商品审核模块、用户提现审核模块；为后台系统集成 Shiro 安全框架实现多用户权限管理。

**个人收获**

熟练运用微信接口对接，可快速开发；对外卖类项目从表设计到模块落地需要考虑的问题有了更深层认识；从 0 到 1 集成 Shiro 并开发权限管理系统，对其框架知识与源码有了进一步了解。`,
        skills: [
          "Spring",
          "Spring MVC",
          "Spring Boot",
          "MyBatis-Plus",
          "MySQL",
          "Maven",
          "Swagger",
          "JWT",
          "Shiro",
        ],
      },
      {
        id: "tangchao-ruifei",
        title: "睿妃医美公众号平台",
        employmentType: "后端开发工程师",
        icon: <SparklesIcon />,
        employmentPeriod: { start: "08.2019", end: "02.2020" },
        description: `医美共享队列金平台，消费返利平台。

**担任职责**

项目原为 PHP 开发，我主导整个项目重构为 Java：利用自己编写的开源脚手架 IRON（含 Maven 与 Gradle 版本）重建工程，分析优化原有数据库结构与业务逻辑，并将项目 Docker 容器化，使用 Dockerfile 与 Git 实现 CI/CD 持续构建交付，解决共享金队列分佣奖励的繁琐计算问题。

**个人收获**

对 Docker 理解更进一步，熟悉了 Dockerfile 编写规则；也认识到镜像优化仍有提升空间，例如基础镜像选型（alpine）与构建后清理无用文件以减少容器体积。`,
        skills: [
          "Spring",
          "Spring Boot",
          "Spring Security",
          "MyBatis-Plus",
          "MySQL",
          "Redis",
          "Maven",
          "Swagger2",
          "JWT",
          "Docker",
        ],
      },
    ],
  },
  {
    id: "wangdi",
    companyName: "广州市网地软件科技有限公司",
    companyIcon: <TruckIcon />,
    location: "广州",
    locationType: "On-site",
    positions: [
      {
        id: "wangdi-yimaotong",
        title: "威时沛运货运易贸通系统",
        employmentType: "后端开发工程师",
        icon: <TruckIcon />,
        employmentPeriod: { start: "12.2017", end: "08.2019" },
        description: `配合威时沛运的仓储管理、商品保税、飞机退运等境外物流功能，从前端多元化客户应用到后端云平台大数据计算，全方位覆盖国际贸易环节。

**担任职责**

负责新科宇航模块的费用分摊核算功能，精确计算货物在空运费、物流费、税费中的分摊比例，并处理本币与源币之间的汇率转换；负责实际入仓记录模块的 Excel 导出与航空标签打印功能。

**个人收获**

对境外物流系统有了更深入的了解，也体会到需求理解的重要性——不能盲目开始写代码，必须先弄清整个模块的流程再进行开发。`,
        skills: ["Spring", "Spring MVC", "iBATIS", "JSP", "Oracle"],
      },
    ],
  },
]
