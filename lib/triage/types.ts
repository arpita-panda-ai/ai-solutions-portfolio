// Two independent classification axes, reflecting a real ITSM-style ticket model (e.g.
// ServiceNow's Category + Ticket Type): WHO should own the ticket (Department) and WHAT KIND
// of action it needs (Issue type). These are scored independently because a dataset analysis
// showed every department contains a mix of all issue types: collapsing them into one list
// (the old `RequestType`) conflated topic with action and caused avoidable misclassifications.
export type Department =
  | 'Hardware'
  | 'Access'
  | 'Storage'
  | 'Purchase'
  | 'Billing'
  | 'HR Support'
  | 'Administrative rights'
  | 'Internal Project'
  | 'Miscellaneous'

export type IssueType =
  | 'Incident / Something is broken'
  | 'Request / Something new is needed'
  | 'Change / Modify something existing'
  | 'Query / A question, no action needed'
  | 'Other / unclassified'

export type Priority = 'High' | 'Medium' | 'Low'

export interface TriageResult {
  department: Department
  departmentConfidence: number // 0-1, how clearly the text matched one department
  issueType: IssueType
  issueTypeConfidence: number // 0-1, how clearly the text matched one issue type
  priority: Priority
  priorityRationale: string
  extractedDetails: {
    label: string
    value: string
  }[]
  missingInformation: string[]
  confidence: number // 0-1 overall confidence in this triage result (weakest of the two axes)
  needsHumanReview: boolean
  source: 'rules' | 'llm'
  rationale: string
}

export interface TriageRequestInput {
  text: string
  useAI: boolean
}
