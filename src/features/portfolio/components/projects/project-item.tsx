import Image from "next/image"
import { addQueryParams } from "@/utils/url"
import { BoxIcon, InfinityIcon, LinkIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { Tag } from "@/components/ui/tag"
import {
  Collapsible,
  CollapsibleChevronsUpDownIcon,
} from "@/components/base/collapsible-animated"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Markdown } from "@/components/markdown"

import type { Project } from "../../types/projects"

export function ProjectItem({
  className,
  project,
}: {
  className?: string
  project: Project
}) {
  const { start, end } = project.period
  const isOngoing = !end
  const isSinglePeriod = end === start

  return (
    <Collapsible className={className} defaultOpen={project.isExpanded}>
      <div
        data-focus-item={`project-${project.id}`}
        className="group/project flex items-center focus-within:bg-accent-muted hover:bg-accent-muted"
      >
        {project.logo ? (
          <Image
            src={project.logo}
            alt={project.title}
            width={32}
            height={32}
            quality={100}
            className="mx-4 flex size-6 shrink-0 grayscale select-none group-hover/project:grayscale-0"
            unoptimized
            aria-hidden
          />
        ) : (
          <div className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-line ring-offset-1 ring-offset-background select-none">
            <BoxIcon className="size-4" />
          </div>
        )}

        <div
          data-focus-axis="start"
          className="flex min-w-0 flex-1 items-center border-l border-dashed border-line"
        >
          <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-2 p-4 pr-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 leading-snug font-medium text-balance">
                {project.title}
              </h3>

              <dl className="text-sm text-muted-foreground">
                <dt className="sr-only">Period</dt>
                <dd className="flex items-center gap-0.5">
                  <span>{start}</span>
                  {!isSinglePeriod && (
                    <>
                      <span className="font-mono">—</span>
                      {isOngoing ? (
                        <InfinityIcon
                          className="size-4.5 translate-y-[0.5px]"
                          aria-label="Present"
                        />
                      ) : (
                        <span>{end}</span>
                      )}
                    </>
                  )}
                </dd>
              </dl>
            </div>

            <div className="shrink-0 text-muted-foreground [&_svg]:size-4">
              <CollapsibleChevronsUpDownIcon duration={0.15} />
            </div>
          </CollapsibleTrigger>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  className="mr-1 flex size-10 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring pointer-coarse:size-11"
                  href={addQueryParams(project.link, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener"
                  aria-label="Open project"
                >
                  <LinkIcon className="pointer-events-none size-4" />
                </a>
              }
            />
            <TooltipContent>
              <p>Open project</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden">
        <ProjectContent project={project} />
      </CollapsibleContent>
    </Collapsible>
  )
}

export function ProjectContent({ project }: { project: Project }) {
  return (
    <div className="space-y-4 border-t border-line p-4">
      {project.description && (
        <div
          data-focus-items={`project-${project.id}-note`}
          className="typeset typeset-description"
        >
          <Markdown>{project.description}</Markdown>
        </div>
      )}
      {project.skills.length > 0 && (
        <ul
          data-focus-item={`project-${project.id}-skills`}
          className="flex flex-wrap gap-1.5"
        >
          {project.skills.map((skill) => (
            <li key={skill} className="flex">
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
