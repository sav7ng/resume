import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import { Tag } from "@/components/ui/tag"
import { Markdown } from "@/components/markdown"

import type { Experience, ExperiencePosition } from "../types/experiences"
import type { Project } from "../types/projects"
import { ProjectContent } from "./projects/project-item"

/** Browsers with scripting enabled treat this entire branch as inert text. */
export function NoScriptCollapsibles({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <noscript>
      <style>{"[data-scripted-collapsibles]{display:none!important}"}</style>
      {children}
    </noscript>
  )
}

export function NativeProjects({ projects }: { projects: Project[] }) {
  return projects.map((project) => (
    <details
      key={project.id}
      open={project.isExpanded}
      className="border-b border-line last:border-none"
    >
      <summary className="p-4 focus-visible:outline-2 focus-visible:outline-ring">
        <span className="font-medium">{project.title}</span>
        <span className="ml-3 text-sm text-muted-foreground">
          {project.period.start} — {project.period.end ?? "Present"}
        </span>
      </summary>
      <div className="border-t border-line px-4 pt-4">
        <a
          className="text-sm link"
          href={addQueryParams(project.link, UTM_PARAMS)}
          target="_blank"
          rel="noopener"
        >
          Open project
        </a>
      </div>
      <ProjectContent project={project} />
    </details>
  ))
}

export function NativePositions({
  positions,
}: {
  positions: ExperiencePosition[]
}) {
  return positions.map((position) => (
    <details key={position.id} open={position.isExpanded} className="py-2">
      <summary className="focus-visible:outline-2 focus-visible:outline-ring">
        <span className="font-medium">{position.title}</span>
        <span className="mt-1 block pl-4 text-sm text-muted-foreground">
          {position.employmentType && `${position.employmentType} · `}
          {position.employmentPeriod.start} —{" "}
          {position.employmentPeriod.end ?? "Present"}
        </span>
      </summary>
      {position.description && (
        <div className="typeset typeset-description pt-3">
          <Markdown>{position.description}</Markdown>
        </div>
      )}
      {!!position.skills?.length && (
        <ul className="flex flex-wrap gap-1.5 pt-3">
          {position.skills.map((skill) => (
            <li key={skill}>
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      )}
    </details>
  ))
}

export function NativeEarlierExperiences({
  experiences,
}: {
  experiences: Experience[]
}) {
  return (
    <details className="px-4 py-2">
      <summary className="text-sm focus-visible:outline-2 focus-visible:outline-ring">
        Show more
      </summary>
      {experiences.map((experience) => (
        <div
          key={experience.id}
          id={`experience-${experience.id}`}
          className="space-y-3 border-b border-line py-4"
        >
          <h3 className="text-xl/6 font-medium">
            {experience.companyWebsite ? (
              <a
                className="link"
                href={addQueryParams(experience.companyWebsite, UTM_PARAMS)}
                target="_blank"
                rel="noopener"
              >
                {experience.companyName}
              </a>
            ) : (
              experience.companyName
            )}
          </h3>
          {experience.location && (
            <p className="text-sm text-muted-foreground">
              {experience.location}
              {experience.locationType && ` (${experience.locationType})`}
            </p>
          )}
          <NativePositions positions={experience.positions} />
        </div>
      ))}
    </details>
  )
}
