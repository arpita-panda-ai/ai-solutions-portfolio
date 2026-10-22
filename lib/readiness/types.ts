export type CategoryId = 'processMaturity' | 'dataQuality' | 'changeReadiness' | 'evaluation'

export interface ReadinessQuestion {
  id: string
  categoryId: CategoryId
  text: string
}

export interface ReadinessCategory {
  id: CategoryId
  label: string
  weight: number // sums to 1 across all categories
  lowScoreRecommendation: string
}

export interface ReadinessAnswer {
  questionId: string
  score: number // 1-5
}

export type ReadinessTier = 'Ready to pilot' | 'Ready with conditions' | 'Not ready yet'

export interface CategoryResult {
  categoryId: CategoryId
  label: string
  score: number // 0-100
  weight: number
}

export interface ReadinessResult {
  overallScore: number // 0-100
  tier: ReadinessTier
  tierSummary: string
  categoryResults: CategoryResult[]
  biggestRisk: { label: string; recommendation: string } | null
}
