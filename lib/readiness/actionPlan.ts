import type { ApproachResult, CategoryRisk, TechApproach } from './types'

// Step 4 of the decision journey: turn the already-computed blockers (Step 2) and technology
// recommendation (Step 3) into a single ordered checklist. Deliberately just reuses that data
// rather than introducing new logic or new user input.
export interface ActionPlanStep {
  order: number
  title: string
  detail: string
}

const APPROACH_NEXT_STEP: Record<TechApproach, { title: string; detail: string }> = {
  'Fix the process first': {
    title: 'Pause the technology decision',
    detail:
      'Document the current process and agree clear ownership before choosing any technology. Revisit this assessment once that foundation is in place.',
  },
  'Not worth automating yet': {
    title: 'Hold off building anything',
    detail:
      'Track the volume or frequency of this workflow over the next few months. Revisit this assessment if it grows enough to justify the build and maintenance cost.',
  },
  'Deterministic rules-based automation': {
    title: 'Scope a rules-based prototype',
    detail:
      'Write down the explicit decision rules, assemble a small real-world test set, and pilot the prototype against a human baseline before wider rollout.',
  },
  'AI-assisted with mandatory human review': {
    title: 'Scope an AI-assisted prototype with mandatory review',
    detail:
      'Start with a narrow, low-risk slice of the workflow, require a human to review every output (not spot-check), and log every decision for audit.',
  },
}

export function buildActionPlan(riskAreas: CategoryRisk[], approach: ApproachResult): ActionPlanStep[] {
  const steps: ActionPlanStep[] = riskAreas.map((risk, i) => ({
    order: i + 1,
    title: `Address the ${risk.label.toLowerCase()} gap (${risk.score}/100)`,
    detail: risk.recommendation,
  }))

  const nextStep = APPROACH_NEXT_STEP[approach.approach]
  steps.push({
    order: steps.length + 1,
    title: nextStep.title,
    detail: nextStep.detail,
  })

  return steps
}
