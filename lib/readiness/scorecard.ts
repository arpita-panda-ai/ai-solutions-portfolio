import type {
  CategoryResult,
  ReadinessAnswer,
  ReadinessCategory,
  ReadinessQuestion,
  ReadinessResult,
  ReadinessTier,
} from './types'

export const CATEGORIES: ReadinessCategory[] = [
  {
    id: 'processMaturity',
    label: 'Process maturity',
    weight: 0.3,
    lowScoreRecommendation:
      'Document the current process and agree ownership before automating it — automating an undefined process usually just automates the confusion.',
  },
  {
    id: 'dataQuality',
    label: 'Data quality & availability',
    weight: 0.25,
    lowScoreRecommendation:
      'Invest in data cleanup and assemble a real test set before piloting — an AI workflow is only as good as the data it sees.',
  },
  {
    id: 'changeReadiness',
    label: 'Change readiness',
    weight: 0.25,
    lowScoreRecommendation:
      'Secure a named, accountable owner and dedicated time/budget before starting — pilots without a true owner tend to stall after the initial excitement.',
  },
  {
    id: 'evaluation',
    label: 'Evaluation & monitoring capability',
    weight: 0.2,
    lowScoreRecommendation:
      "Define what success looks like and a human-review/rollback plan before launch — without this you won't be able to tell if the pilot is actually working.",
  },
]

export const QUESTIONS: ReadinessQuestion[] = [
  {
    id: 'pm1',
    categoryId: 'processMaturity',
    text: 'Is there a clearly defined business process today that the AI workflow would support or replace?',
  },
  {
    id: 'pm2',
    categoryId: 'processMaturity',
    text: 'Are decision rights and ownership for this process clear (who approves, who is accountable)?',
  },
  {
    id: 'pm3',
    categoryId: 'processMaturity',
    text: "Is the current process's performance (volume, error rate, turnaround time) actually measured today?",
  },
  {
    id: 'dq1',
    categoryId: 'dataQuality',
    text: 'Is the data this workflow needs already captured digitally (not on paper or in people\'s heads)?',
  },
  {
    id: 'dq2',
    categoryId: 'dataQuality',
    text: 'Is that data reasonably clean and consistent (few missing fields, duplicates, or inconsistent formats)?',
  },
  {
    id: 'dq3',
    categoryId: 'dataQuality',
    text: 'Do you have — or can you quickly create — a set of real examples to test against before launch?',
  },
  {
    id: 'cr1',
    categoryId: 'changeReadiness',
    text: 'Do the people who would use or be affected by this AI workflow actually support trying it?',
  },
  {
    id: 'cr2',
    categoryId: 'changeReadiness',
    text: "Is there a named owner accountable for the pilot's outcome (not just IT or a vendor)?",
  },
  {
    id: 'cr3',
    categoryId: 'changeReadiness',
    text: "Is there budget and time explicitly set aside for a pilot, separate from people's existing workload?",
  },
  {
    id: 'ev1',
    categoryId: 'evaluation',
    text: "Is there a clear, specific definition of what 'success' looks like for this pilot?",
  },
  {
    id: 'ev2',
    categoryId: 'evaluation',
    text: "Is there a plan for a human to regularly review a sample of the AI's outputs?",
  },
  {
    id: 'ev3',
    categoryId: 'evaluation',
    text: 'Is there a way to roll back to the manual process if the pilot underperforms?',
  },
]

export const ANSWER_LABELS = [
  { score: 1, label: 'No / not at all' },
  { score: 2, label: 'Mostly no' },
  { score: 3, label: 'Partially / unsure' },
  { score: 4, label: 'Mostly yes' },
  { score: 5, label: 'Yes / fully' },
]

function tierFor(score: number): { tier: ReadinessTier; tierSummary: string } {
  if (score >= 75) {
    return {
      tier: 'Ready to pilot',
      tierSummary: 'This team shows the process, data and ownership foundations a pilot needs. Normal pilot risk still applies — this is not a guarantee of success.',
    }
  }
  if (score >= 50) {
    return {
      tier: 'Ready with conditions',
      tierSummary: 'There is a reasonable foundation, but at least one area needs attention before committing budget — see the biggest risk area below.',
    }
  }
  return {
    tier: 'Not ready yet',
    tierSummary: 'Multiple foundational gaps exist. Piloting now is likely to produce a demo that cannot be trusted or sustained, not a usable result.',
  }
}

// A straight weighted average can mask a single catastrophic gap (e.g. data quality at 0/100
// hidden by everything else scoring well). These guardrails deliberately prevent that: a very
// low score in any one category caps the overall tier, regardless of the weighted average.
const SEVERE_GAP_THRESHOLD = 20
const MAJOR_GAP_THRESHOLD = 40
const RISK_FLAG_THRESHOLD = 60

export function computeReadiness(answers: ReadinessAnswer[]): ReadinessResult {
  const scoreByQuestion = new Map(answers.map((a) => [a.questionId, a.score]))

  const categoryResults: CategoryResult[] = CATEGORIES.map((cat) => {
    const questions = QUESTIONS.filter((q) => q.categoryId === cat.id)
    const scores = questions.map((q) => scoreByQuestion.get(q.id) ?? 3)
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
    const normalized = ((avg - 1) / 4) * 100
    return {
      categoryId: cat.id,
      label: cat.label,
      score: Math.round(normalized * 10) / 10,
      weight: cat.weight,
    }
  })

  const overallScore =
    Math.round(
      categoryResults.reduce((sum, c) => sum + c.score * c.weight, 0) * 10
    ) / 10

  const lowest = [...categoryResults].sort((a, b) => a.score - b.score)[0]
  const lowestCategory = CATEGORIES.find((c) => c.id === lowest.categoryId)

  let { tier, tierSummary } = tierFor(overallScore)
  if (lowest.score < SEVERE_GAP_THRESHOLD) {
    tier = 'Not ready yet'
    tierSummary = `A severe gap in ${lowestCategory?.label ?? 'one category'} overrides the overall average — this blocks a credible pilot regardless of other strengths.`
  } else if (lowest.score < MAJOR_GAP_THRESHOLD && tier === 'Ready to pilot') {
    tier = 'Ready with conditions'
    tierSummary = `A significant gap in ${lowestCategory?.label ?? 'one category'} caps this below "Ready to pilot" even though the weighted average is high.`
  }

  const biggestRisk =
    lowest.score < RISK_FLAG_THRESHOLD && lowestCategory
      ? { label: lowestCategory.label, recommendation: lowestCategory.lowScoreRecommendation }
      : null

  return { overallScore, tier, tierSummary, categoryResults, biggestRisk }
}
