import { runRulesTriage } from './rules'
import { EVAL_DATASET, type CaseCategory, type LabeledCase } from './eval-dataset'
import type { RequestType, TriageResult } from './types'

export interface CaseEvalResult {
  case: LabeledCase
  actual: TriageResult
  typeCorrect: boolean
  priorityCorrect: boolean
  reviewFlagCorrect: boolean
}

export interface ConfidenceBucket {
  range: string
  count: number
  correct: number
  accuracy: number | null
}

export interface CategoryBreakdown {
  category: CaseCategory
  count: number
  typeAccuracy: number
  priorityAccuracy: number
}

export interface EvaluationReport {
  totalCases: number
  overallTypeAccuracy: number
  overallPriorityAccuracy: number
  reviewFlagAccuracy: number
  baselineTypeAccuracy: number
  baselineType: RequestType
  byCaseCategory: CategoryBreakdown[]
  confidenceCalibration: ConfidenceBucket[]
  caseResults: CaseEvalResult[]
  failedCases: CaseEvalResult[]
}

function mostCommon(dataset: LabeledCase[]): RequestType {
  const counts = new Map<RequestType, number>()
  for (const c of dataset) counts.set(c.expectedType, (counts.get(c.expectedType) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function pct(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 1000) / 10
}

const CONFIDENCE_BANDS: { label: string; min: number; max: number }[] = [
  { label: '0.0 – 0.4', min: 0, max: 0.4 },
  { label: '0.4 – 0.6', min: 0.4, max: 0.6 },
  { label: '0.6 – 0.8', min: 0.6, max: 0.8 },
  { label: '0.8 – 1.0', min: 0.8, max: 1.01 },
]

export function runEvaluation(dataset: LabeledCase[] = EVAL_DATASET): EvaluationReport {
  const caseResults: CaseEvalResult[] = dataset.map((testCase) => {
    const actual = runRulesTriage(testCase.text)
    return {
      case: testCase,
      actual,
      typeCorrect: actual.requestType === testCase.expectedType,
      priorityCorrect: actual.priority === testCase.expectedPriority,
      reviewFlagCorrect: actual.needsHumanReview === testCase.expectedNeedsReview,
    }
  })

  const totalCases = caseResults.length
  const overallTypeAccuracy = pct(caseResults.filter((r) => r.typeCorrect).length, totalCases)
  const overallPriorityAccuracy = pct(caseResults.filter((r) => r.priorityCorrect).length, totalCases)
  const reviewFlagAccuracy = pct(caseResults.filter((r) => r.reviewFlagCorrect).length, totalCases)

  const baselineType = mostCommon(dataset)
  const baselineTypeAccuracy = pct(
    dataset.filter((c) => c.expectedType === baselineType).length,
    totalCases
  )

  const categories: CaseCategory[] = ['clear', 'ambiguous', 'missing-info', 'adversarial']
  const byCaseCategory: CategoryBreakdown[] = categories.map((cat) => {
    const inCat = caseResults.filter((r) => r.case.caseCategory === cat)
    return {
      category: cat,
      count: inCat.length,
      typeAccuracy: pct(inCat.filter((r) => r.typeCorrect).length, inCat.length),
      priorityAccuracy: pct(inCat.filter((r) => r.priorityCorrect).length, inCat.length),
    }
  })

  const confidenceCalibration: ConfidenceBucket[] = CONFIDENCE_BANDS.map((band) => {
    const inBand = caseResults.filter(
      (r) => r.actual.confidence >= band.min && r.actual.confidence < band.max
    )
    return {
      range: band.label,
      count: inBand.length,
      correct: inBand.filter((r) => r.typeCorrect).length,
      accuracy: inBand.length === 0 ? null : pct(inBand.filter((r) => r.typeCorrect).length, inBand.length),
    }
  })

  const failedCases = caseResults.filter((r) => !r.typeCorrect || !r.priorityCorrect)

  return {
    totalCases,
    overallTypeAccuracy,
    overallPriorityAccuracy,
    reviewFlagAccuracy,
    baselineTypeAccuracy,
    baselineType,
    byCaseCategory,
    confidenceCalibration,
    caseResults,
    failedCases,
  }
}
