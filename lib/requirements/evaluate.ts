import { runRequirementsQA } from './rules'
import { EVAL_DATASET, type CaseCategory, type LabeledCase } from './eval-dataset'
import type { IssueType, RequirementAnalysisResult, RequirementFormat } from './types'

export interface CaseEvalResult {
  case: LabeledCase
  actual: RequirementAnalysisResult
  formatCorrect: boolean
  acDetectionCorrect: boolean
  reviewFlagCorrect: boolean
  missingExpectedIssues: IssueType[]
  unexpectedIssues: IssueType[]
  issueTypesCorrect: boolean
  overallCorrect: boolean
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
  formatAccuracy: number
  reviewFlagAccuracy: number
}

export interface EvaluationReport {
  totalCases: number
  overallFormatAccuracy: number
  acDetectionAccuracy: number
  reviewFlagAccuracy: number
  issueTypeAccuracy: number
  baselineReviewAccuracy: number
  baselineFormat: RequirementFormat
  byCaseCategory: CategoryBreakdown[]
  confidenceCalibration: ConfidenceBucket[]
  caseResults: CaseEvalResult[]
  failedCases: CaseEvalResult[]
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
    const actual = runRequirementsQA(testCase.text)
    const actualTypes = new Set(actual.issues.map((i) => i.type))

    const missingExpectedIssues = testCase.expectedIssueTypesPresent.filter((t) => !actualTypes.has(t))
    const unexpectedIssues = (testCase.expectedIssueTypesAbsent ?? []).filter((t) => actualTypes.has(t))

    const formatCorrect = actual.format === testCase.expectedFormat
    const acDetectionCorrect = actual.hasAcceptanceCriteria === testCase.expectedHasAcceptanceCriteria
    const reviewFlagCorrect = actual.needsHumanReview === testCase.expectedNeedsHumanReview
    const issueTypesCorrect = missingExpectedIssues.length === 0 && unexpectedIssues.length === 0

    return {
      case: testCase,
      actual,
      formatCorrect,
      acDetectionCorrect,
      reviewFlagCorrect,
      missingExpectedIssues,
      unexpectedIssues,
      issueTypesCorrect,
      overallCorrect: formatCorrect && acDetectionCorrect && reviewFlagCorrect && issueTypesCorrect,
    }
  })

  const totalCases = caseResults.length
  const overallFormatAccuracy = pct(caseResults.filter((r) => r.formatCorrect).length, totalCases)
  const acDetectionAccuracy = pct(caseResults.filter((r) => r.acDetectionCorrect).length, totalCases)
  const reviewFlagAccuracy = pct(caseResults.filter((r) => r.reviewFlagCorrect).length, totalCases)
  const issueTypeAccuracy = pct(caseResults.filter((r) => r.issueTypesCorrect).length, totalCases)

  // Baseline: always guess the most common format, and always flag for human review (the safest
  // naive default). Shows how much the real logic adds over a trivial always-say-the-same-thing rule.
  const formatCounts = new Map<RequirementFormat, number>()
  for (const c of dataset) formatCounts.set(c.expectedFormat, (formatCounts.get(c.expectedFormat) ?? 0) + 1)
  const baselineFormat = [...formatCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
  const baselineReviewAccuracy = pct(dataset.filter((c) => c.expectedNeedsHumanReview === true).length, totalCases)

  const categories: CaseCategory[] = ['clear', 'ambiguous', 'missing-info', 'adversarial']
  const byCaseCategory: CategoryBreakdown[] = categories.map((cat) => {
    const inCat = caseResults.filter((r) => r.case.caseCategory === cat)
    return {
      category: cat,
      count: inCat.length,
      formatAccuracy: pct(inCat.filter((r) => r.formatCorrect).length, inCat.length),
      reviewFlagAccuracy: pct(inCat.filter((r) => r.reviewFlagCorrect).length, inCat.length),
    }
  })

  const confidenceCalibration: ConfidenceBucket[] = CONFIDENCE_BANDS.map((band) => {
    const inBand = caseResults.filter(
      (r) => r.actual.confidence >= band.min && r.actual.confidence < band.max
    )
    return {
      range: band.label,
      count: inBand.length,
      correct: inBand.filter((r) => r.formatCorrect).length,
      accuracy: inBand.length === 0 ? null : pct(inBand.filter((r) => r.formatCorrect).length, inBand.length),
    }
  })

  const failedCases = caseResults.filter((r) => !r.overallCorrect)

  return {
    totalCases,
    overallFormatAccuracy,
    acDetectionAccuracy,
    reviewFlagAccuracy,
    issueTypeAccuracy,
    baselineReviewAccuracy,
    baselineFormat,
    byCaseCategory,
    confidenceCalibration,
    caseResults,
    failedCases,
  }
}
