export type RequirementFormat = 'user-story' | 'plain-requirement' | 'unrecognized'

export type IssueSeverity = 'blocker' | 'warning' | 'suggestion'

export type IssueType =
  | 'ambiguous-term'
  | 'compound-requirement'
  | 'missing-acceptance-criteria'
  | 'untestable-criterion'
  | 'missing-role'
  | 'missing-benefit'
  | 'too-brief'

export interface RequirementIssue {
  type: IssueType
  severity: IssueSeverity
  message: string
  excerpt?: string
}

export interface RequirementAnalysisResult {
  format: RequirementFormat
  qualityScore: number
  issues: RequirementIssue[]
  hasAcceptanceCriteria: boolean
  acceptanceCriteriaCount: number
  untestableCriteriaCount: number
  suggestedQuestions: string[]
  confidence: number
  needsHumanReview: boolean
  source: 'rules'
  rationale: string
}
