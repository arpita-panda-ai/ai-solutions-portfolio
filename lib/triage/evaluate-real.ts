import { runRulesTriage } from './rules'
import { REAL_WORLD_DATASET, REAL_WORLD_SOURCE, type RealWorldCase } from './real-eval-dataset'
import type { Department, IssueType, TriageResult } from './types'

export interface RealCaseEvalResult {
  case: RealWorldCase
  actual: TriageResult
  departmentCorrect: boolean
  issueTypeCorrect: boolean
}

export interface ConfidenceBucket {
  range: string
  count: number
  accuracy: number | null
}

export interface SourceCategoryBreakdown {
  sourceCategory: string
  count: number
  departmentAccuracy: number
  issueTypeAccuracy: number
}

export interface RealWorldEvaluationReport {
  totalCases: number
  overallDepartmentAccuracy: number
  overallIssueTypeAccuracy: number
  baselineDepartmentAccuracy: number
  baselineDepartment: Department
  baselineIssueTypeAccuracy: number
  baselineIssueType: IssueType
  bySourceCategory: SourceCategoryBreakdown[]
  confidenceCalibration: ConfidenceBucket[]
  caseResults: RealCaseEvalResult[]
  failedCases: RealCaseEvalResult[]
  source: typeof REAL_WORLD_SOURCE
}

function mostCommon<T extends string>(dataset: RealWorldCase[], key: 'expectedDepartment' | 'expectedIssueType'): T {
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

export function runRealWorldEvaluation(
  dataset: RealWorldCase[] = REAL_WORLD_DATASET
): RealWorldEvaluationReport {
  const caseResults: RealCaseEvalResult[] = dataset.map((testCase) => {
    const actual = runRulesTriage(testCase.text)
    return {
      case: testCase,
      actual,
      departmentCorrect: actual.department === testCase.expectedDepartment,
      issueTypeCorrect: actual.issueType === testCase.expectedIssueType,
    }
  })

  const totalCases = caseResults.length
  const overallDepartmentAccuracy = pct(caseResults.filter((r) => r.departmentCorrect).length, totalCases)
  const overallIssueTypeAccuracy = pct(caseResults.filter((r) => r.issueTypeCorrect).length, totalCases)

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

  const sourceCategories = [...new Set(dataset.map((c) => c.sourceCategory))]
  const bySourceCategory: SourceCategoryBreakdown[] = sourceCategories.map((cat) => {
    const inCat = caseResults.filter((r) => r.case.sourceCategory === cat)
    return {
      sourceCategory: cat,
      count: inCat.length,
      departmentAccuracy: pct(inCat.filter((r) => r.departmentCorrect).length, inCat.length),
      issueTypeAccuracy: pct(inCat.filter((r) => r.issueTypeCorrect).length, inCat.length),
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
      accuracy: inBand.length === 0 ? null : pct(bandCorrect.length, inBand.length),
    }
  })

  const failedCases = caseResults.filter((r) => !r.departmentCorrect || !r.issueTypeCorrect)

  return {
    totalCases,
    overallDepartmentAccuracy,
    overallIssueTypeAccuracy,
    baselineDepartmentAccuracy,
    baselineDepartment,
    baselineIssueTypeAccuracy,
    baselineIssueType,
    bySourceCategory,
    confidenceCalibration,
    caseResults,
    failedCases,
    source: REAL_WORLD_SOURCE,
  }
}
