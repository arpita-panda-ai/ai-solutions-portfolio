export type RequestType =
  | 'Incident / Something is broken'
  | 'Access request'
  | 'Change request'
  | 'Information request'
  | 'Billing / invoice query'
  | 'Other / unclassified'

export type Priority = 'High' | 'Medium' | 'Low'

export interface TriageResult {
  requestType: RequestType
  requestTypeConfidence: number // 0-1, how clearly the text matched one category
  priority: Priority
  priorityRationale: string
  extractedDetails: {
    label: string
    value: string
  }[]
  missingInformation: string[]
  suggestedOwner: string
  confidence: number // 0-1 overall confidence in this triage result
  needsHumanReview: boolean
  source: 'rules' | 'llm'
  rationale: string
}

export interface TriageRequestInput {
  text: string
  useAI: boolean
}
