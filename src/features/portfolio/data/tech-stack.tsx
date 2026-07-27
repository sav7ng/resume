import {
  ArrowLeftRightIcon,
  BoxesIcon,
  ChartColumnIcon,
  ChartPieIcon,
  ClockIcon,
  CoffeeIcon,
  ContainerIcon,
  DatabaseIcon,
  DatabaseZapIcon,
  GitMergeIcon,
  InfinityIcon,
  LeafIcon,
  NetworkIcon,
  PackageIcon,
  RadarIcon,
  RadioTowerIcon,
  RocketIcon,
  ScrollTextIcon,
  ShieldIcon,
  TriangleIcon,
  ZapIcon,
} from "lucide-react"

import { ClaudeIcon, CursorIcon, OpenAIIcon } from "@/components/icons"

import type { TechStack } from "../types/tech-stack"

export const TECH_STACK: TechStack[] = [
  // ─── Language ──────────────────────────────────────────────────────────
  {
    key: "java",
    title: "Java",
    href: "https://www.java.com",
    icon: <CoffeeIcon />,
    categories: ["Language"],
  },
  {
    key: "golang",
    title: "Golang",
    href: "https://go.dev",
    icon: <ZapIcon />,
    categories: ["Language"],
  },
  {
    key: "kotlin",
    title: "Kotlin",
    href: "https://kotlinlang.org",
    icon: <TriangleIcon />,
    categories: ["Language"],
  },

  // ─── Framework ─────────────────────────────────────────────────────────
  {
    key: "spring",
    title: "Spring Framework",
    href: "https://spring.io",
    icon: <LeafIcon />,
    categories: ["Framework"],
  },
  {
    key: "mybatis",
    title: "MyBatis",
    href: "https://mybatis.org",
    icon: <DatabaseZapIcon />,
    categories: ["Framework"],
  },
  {
    key: "kratos",
    title: "Kratos",
    href: "https://go-kratos.dev",
    icon: <BoxesIcon />,
    categories: ["Framework"],
  },
  {
    key: "qmgo",
    title: "Qmgo",
    href: "https://github.com/qiniu/qmgo",
    icon: <DatabaseIcon />,
    categories: ["Framework"],
  },

  // ─── Database ──────────────────────────────────────────────────────────
  {
    key: "mysql",
    title: "MySQL",
    href: "https://www.mysql.com",
    icon: <DatabaseIcon />,
    categories: ["Database"],
  },
  {
    key: "redis",
    title: "Redis",
    href: "https://redis.io",
    icon: <DatabaseZapIcon />,
    categories: ["Database"],
  },
  {
    key: "mongodb",
    title: "MongoDB",
    href: "https://www.mongodb.com",
    icon: <LeafIcon />,
    categories: ["Database"],
  },
  {
    key: "clickhouse",
    title: "ClickHouse",
    href: "https://clickhouse.com",
    icon: <ChartColumnIcon />,
    categories: ["Database"],
  },

  // ─── Middleware ────────────────────────────────────────────────────────
  {
    key: "rocketmq",
    title: "RocketMQ",
    href: "https://rocketmq.apache.org",
    icon: <RocketIcon />,
    categories: ["Middleware"],
  },
  {
    key: "kafka",
    title: "Kafka",
    href: "https://kafka.apache.org",
    icon: <RadioTowerIcon />,
    categories: ["Middleware"],
  },
  {
    key: "pulsar",
    title: "Pulsar",
    href: "https://pulsar.apache.org",
    icon: <RadarIcon />,
    categories: ["Middleware"],
  },
  {
    key: "apisix",
    title: "APISIX",
    href: "https://apisix.apache.org",
    icon: <NetworkIcon />,
    categories: ["Middleware"],
  },
  {
    key: "seata",
    title: "Seata",
    href: "https://seata.apache.org",
    icon: <GitMergeIcon />,
    categories: ["Middleware"],
  },
  {
    key: "sentinel",
    title: "Sentinel",
    href: "https://sentinelguard.io",
    icon: <ShieldIcon />,
    categories: ["Middleware"],
  },
  {
    key: "xxl-job",
    title: "XXL-Job",
    href: "https://www.xuxueli.com/xxl-job",
    icon: <ClockIcon />,
    categories: ["Middleware"],
  },
  {
    key: "rpc",
    title: "RPC",
    href: "https://grpc.io",
    icon: <ArrowLeftRightIcon />,
    categories: ["Middleware"],
  },

  // ─── DevOps ────────────────────────────────────────────────────────────
  {
    key: "docker",
    title: "Docker",
    href: "https://www.docker.com",
    icon: <ContainerIcon />,
    categories: ["DevOps"],
  },
  {
    key: "cicd",
    title: "CI / CD",
    href: "https://docs.github.com/actions",
    icon: <InfinityIcon />,
    categories: ["DevOps"],
  },
  {
    key: "maven-gradle",
    title: "Maven / Gradle",
    href: "https://maven.apache.org",
    icon: <PackageIcon />,
    categories: ["DevOps"],
  },
  {
    key: "metabase",
    title: "Metabase",
    href: "https://www.metabase.com",
    icon: <ChartPieIcon />,
    categories: ["DevOps"],
  },

  // ─── AI Coding ─────────────────────────────────────────────────────────
  {
    key: "openspec",
    title: "OpenSpec",
    href: "https://github.com/Fission-AI/OpenSpec",
    icon: <ScrollTextIcon />,
    categories: ["AI Coding"],
  },
  {
    key: "claude-code",
    title: "Claude Code",
    href: "https://claude.com/claude-code",
    icon: <ClaudeIcon />,
    categories: ["AI Coding"],
  },
  {
    key: "cursor",
    title: "Cursor",
    href: "https://cursor.com",
    icon: <CursorIcon />,
    categories: ["AI Coding"],
  },
  {
    key: "codex",
    title: "Codex",
    href: "https://openai.com/codex",
    icon: <OpenAIIcon />,
    categories: ["AI Coding"],
  },
]
