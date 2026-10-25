import { runRulesTriage } from './rules'
import { EVAL_DATASET, type CaseCategory, type LabeledCase } from './eval-dataset'
import type { Department, IssueType, TriageResult } from './types'

export interface CaseEvalResult {
  case: LabeledCase
  actual: TriageResult
  departmentCorrect: boolean
  issueTypeCorrect: boolean
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
  departmentAccuracy: number
  issueTypeAccuracy: number
  priorityAccuracy: number
}

export interface EvaluationReport {
  totalCases: number
  overallDepartmentAccuracy: number
  overallIssueTypeAccuracy: number
  overallPriorityAccuracy: number
  reviewFlagAccuracy: number
  baselineDepartment: Department
  baselineDepartmentAccuracy: number
  baselineIssueType: IssueType
  baselineIssueTypeAccuracy: number
  byCaseCategory: CategoryBreakdown[]
  confidenceCalibration: ConfidenceBucket[]
  caseResults: CaseEvalResult[]
  failedCases: CaseEvalResult[]
}

function mostCommon<T extends string>(dataset: LabeledCase[], key: 'expectedDepartment' | 'expectedIssueType'): T {
  const counts = new Map<T, number>()
  for (const c of dataset) {
    const value = c[key] as T
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
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
      departmentCorrect: actual.department === testCase.expectedDepartment,
      issueTypeCorrect: actual.issueType === testCase.expectedIssueType,
      priorityCorrect: actual.priority === testCase.expectedPriority,
      reviewFlagCorrect: actual.needsHumanReview === testCase.expectedNeedsReview,
    }
  })

  const totalCases = caseResults.length
  const overallDepartmentAccuracy = pct(caseResults.filter((r) => r.departmentCorrect).length, totalCases)
  const overallIssueTypeAccuracy = pct(caseResults.filter((r) => r.issueTypeCorrect).length, totalCases)
  const overallPriorityAccuracy = pct(caseResults.filter((r) => r.priorityCorrect).length, totalCases)
  const reviewFlagAccuracy = pct(caseResults.filter((r) => r.reviewFlagCorrect).length, totalCases)

  const baselineDepartment = mostCommon<Department>(dataset, 'expectedDepartment')
  const baselineDepartmentAccuracy = pct(
    dataset.filter((c) => c.expectedDepartment === baselineDepartment).length,
    totalCases
  )
  const baselineIssueType = mostCommon<IssueType>(dataset, 'expectedIssueType')
  const baselineIssueTypeAccuracy = pct(
    dataset.filter((c) => c.expectedIssueType === baselineIssueType).length,
    totalCases
  )

  const categories: CaseCategory[] = ['clear', 'ambiguous', 'missing-info', 'adversarial']
  const byCaseCategory: CategoryBreakdown[] = categories.map((cat) => {
    const inCat = caseResults.filter((r) => r.case.caseCategory === cat)
    return {
      category: cat,
      count: inCat.length,
      departmentAccuracy: pct(inCat.filter((r) => r.departmentCorrect).length, inCat.length),
      issueTypeAccuracy: pct(inCat.filter((r) => r.issueTypeCorrect).length, inCat.length),
      priorityAccuracy: pct(inCat.filter((r) => r.priorityCorrect).length, inCat.length),
    }
  })

  const confidenceCalibration: ConfidenceBucket[] = CONFIDENCE_BANDS.map((band) => {
    const inBand = caseResults.filter(
      (r) => r.actual.confidence >= band.min && r.actual.confidence < band.max
    )
    const bandCorrect = inBand.filter((r) => r.departmentCorrect && r.issueTypeCorrect)
    return {
      range: band.label,
      count: inBand.length,
      correct: bandCorrect.length,
      accuracy: inBand.length === 0 ? null : pct(bandCorrect.length, inBand.length),
    }
  })

  const failedCases = caseResults.filter((r) => !r.departmentCorrect || !r.issueTypeCorrect || !r.priorityCorrect)

  return {
    totalCases,
    overallDepartmentAccuracy,
    overallIssueTypeAccuracy,
    overallPriorityAccuracy,
    reviewFlagAccuracy,
    baselineDepartment,
    baselineDepartmentAccuracy,
    baselineIssueType,
    baselineIssueTypeAccuracy,
    byCaseCategory,
    confidenceCalibration,
    caseResults,
    failedCases,
  }
}
