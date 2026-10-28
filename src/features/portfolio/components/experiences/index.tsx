import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import type { Experience } from "@/features/portfolio/types/experiences"

import {
  NativeEarlierExperiences,
  NoScriptCollapsibles,
} from "../native-collapsibles"
import { ExperienceItem } from "./experience-item"

const ID = "experience"
const MAX = 3

export function Experiences() {
  return (
    <Panel id={ID} data-focus-group={ID}>
      <PanelHeader data-focus-item={`${ID}-header`}>
        <PanelTitle>
          <a href={`#${ID}`}>Experience</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        <ExperienceList experiences={EXPERIENCES.slice(0, MAX)} />
      </div>

      {EXPERIENCES.length > MAX && (
        <Collapsible className="group/collapsible" data-scripted-collapsibles>
          <CollapsibleContent render={<div className="pr-2 pl-4" />}>
            <ExperienceList experiences={EXPERIENCES.slice(MAX)} />
          </CollapsibleContent>

          <div className="-mt-px flex items-center justify-center py-2">
            <CollapsibleTrigger
              render={
                <Button
                  className="gap-2 pr-2.5 pl-3"
                  variant="secondary"
                  size="sm"
                >
                  <span className="hidden group-data-closed/collapsible:block">
                    Show more
                  </span>

                  <span className="hidden group-data-open/collapsible:block">
                    Show less
                  </span>

                  <ChevronDownIcon className="group-data-open/collapsible:rotate-180" />
                </Button>
              }
            />
          </div>
        </Collapsible>
      )}
      {EXPERIENCES.length > MAX && (
        <NoScriptCollapsibles>
          <NativeEarlierExperiences experiences={EXPERIENCES.slice(MAX)} />
        </NoScriptCollapsibles>
      )}
    </Panel>
  )
}

function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <>
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </>
  )
}
