import { CollapsibleList } from "@/components/collapsible-list"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { PROJECTS } from "@/features/portfolio/data/projects"

import { NativeProjects, NoScriptCollapsibles } from "../native-collapsibles"
import { ProjectItem } from "./project-item"

const ID = "projects"

export function Projects() {
  return (
    <Panel id={ID} data-focus-group={ID}>
      <PanelHeader data-focus-item={`${ID}-header`}>
        <PanelTitle>
          <a href={`#${ID}`}>Projects</a>
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div data-scripted-collapsibles>
        <CollapsibleList
          items={PROJECTS}
          max={4}
          renderItem={(item) => <ProjectItem project={item} />}
        />
      </div>
      <NoScriptCollapsibles>
        <NativeProjects projects={PROJECTS} />
      </NoScriptCollapsibles>
    </Panel>
  )
}
