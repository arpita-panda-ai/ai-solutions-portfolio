import { NextResponse } from 'next/server'
import { recommendApproach, WORKFLOW_QUESTIONS } from '@/lib/readiness/approach'
import type { ReadinessTier, WorkflowAnswer } from '@/lib/readiness/types'

const VALID_TIERS: ReadinessTier[] = ['Ready to pilot', 'Ready with conditions', 'Not ready yet']

export async function POST(request: Request) {
  let body: { readinessTier?: unknown; workflowAnswers?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (typeof body.readinessTier !== 'string' || !VALID_TIERS.includes(body.readinessTier as ReadinessTier)) {
    return NextResponse.json({ error: 'A valid readinessTier is required.' }, { status: 400 })
  }

  if (!Array.isArray(body.workflowAnswers)) {
    return NextResponse.json({ error: 'workflowAnswers must be an array.' }, { status: 400 })
  }

  const workflowAnswers = body.workflowAnswers as WorkflowAnswer[]

  for (const a of workflowAnswers) {
    const question = WORKFLOW_QUESTIONS.find((q) => q.id === a?.questionId)
    if (!a || !question || !question.options.some((o) => o.value === a.value)) {
      return NextResponse.json(
        { error: 'Each workflow answer needs a valid questionId and value.' },
        { status: 400 }
      )
    }
  }

  if (workflowAnswers.length !== WORKFLOW_QUESTIONS.length) {
    return NextResponse.json(
      { error: `All ${WORKFLOW_QUESTIONS.length} workflow questions must be answered.` },
      { status: 400 }
    )
  }

  const result = recommendApproach(body.readinessTier as ReadinessTier, workflowAnswers)
  return NextResponse.json({ result })
}
