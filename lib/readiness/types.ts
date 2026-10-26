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

export interface CategoryRisk {
  categoryId: CategoryId
  label: string
  score: number
  recommendation: string
}

export interface SensitivityHint {
  categoryLabel: string
  fromTier: ReadinessTier
  toTier: ReadinessTier
}

export interface ReadinessResult {
  overallScore: number // 0-100
  tier: ReadinessTier
  tierSummary: string
  categoryResults: CategoryResult[]
  riskAreas: CategoryRisk[]
  overrideApplied: boolean
  sensitivityHint: SensitivityHint | null
}

// Step 3: technology-approach recommendation. These questions describe the candidate workflow
// itself (its data, logic and volume), not the organisation, so they are deliberately separate
// from the 12 readiness questions above.
export type WorkflowQuestionId = 'dataStructure' | 'decisionLogic' | 'explainability' | 'volume'

export interface WorkflowOption {
  value: string
  label: string
}

export interface WorkflowQuestion {
  id: WorkflowQuestionId
  text: string
  options: WorkflowOption[]
}

export interface WorkflowAnswer {
  questionId: WorkflowQuestionId
  value: string
}

export type TechApproach =
  | 'Fix the process first'
  | 'Not worth automating yet'
  | 'Deterministic rules-based automation'
  | 'AI-assisted with mandatory human review'

export interface ApproachResult {
  approach: TechApproach
  rationale: string
}
