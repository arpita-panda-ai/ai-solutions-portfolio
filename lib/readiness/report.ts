import type { ActionPlanStep } from './actionPlan'
import type { ApproachResult, ReadinessResult } from './types'

// Step 5 of the decision journey: a plain-text/Markdown summary generated entirely client-side
// from data already computed in Steps 1-4. No backend call, no stored data, no fabricated PDF
// service: just the same numbers already shown on screen, formatted for saving or sharing.
export function buildReadinessReport(
  result: ReadinessResult,
  approach: ApproachResult,
  actionPlan: ActionPlanStep[]
): string {
  const today = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const lines: string[] = []

  lines.push('# AI Pilot Readiness Scorecard: Report')
  lines.push(`Generated ${today}`)
  lines.push('')
  lines.push(
    'This is a self-assessment framework, not a certified audit. The output is a conversation-starter, not a go/no-go verdict.'
  )
  lines.push('')

  lines.push('## Overall readiness')
  lines.push(`Score: ${result.overallScore}/100`)
  lines.push(`Tier: ${result.tier}`)
  lines.push(result.tierSummary)
  if (result.overrideApplied) {
    lines.push('Note: this tier was adjusted by a gap-override rule, not just the weighted average.')
  }
  if (result.sensitivityHint) {
    lines.push(
      `Sensitivity: if ${result.sensitivityHint.categoryLabel} answers each improved by one point, the tier would move from "${result.sensitivityHint.fromTier}" to "${result.sensitivityHint.toTier}".`
    )
  }
  lines.push('')

  lines.push('## Category breakdown')
  result.categoryResults.forEach((c) => {
    lines.push(`- ${c.label} (${Math.round(c.weight * 100)}% of score): ${c.score}/100`)
  })
  lines.push('')

  lines.push('## Blockers')
  if (result.riskAreas.length === 0) {
    lines.push('No single category stands out as a blocking risk; normal pilot diligence still applies.')
  } else {
    result.riskAreas.forEach((risk, i) => {
      lines.push(`${i + 1}. ${risk.label} (${risk.score}/100): ${risk.recommendation}`)
    })
  }
  lines.push('')

  lines.push('## Recommended technology approach')
  lines.push(`Approach: ${approach.approach}`)
  lines.push(approach.rationale)
  lines.push('')

  lines.push('## Action plan')
  actionPlan.forEach((step) => {
    lines.push(`${step.order}. ${step.title}: ${step.detail}`)
  })
  lines.push('')

  return lines.join('\n')
}
