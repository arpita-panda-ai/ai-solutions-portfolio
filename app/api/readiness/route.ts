import { NextResponse } from 'next/server'
import { computeReadiness, QUESTIONS } from '@/lib/readiness/scorecard'
import type { ReadinessAnswer } from '@/lib/readiness/types'

export async function POST(request: Request) {
  let body: { answers?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!Array.isArray(body.answers)) {
    return NextResponse.json({ error: 'answers must be an array.' }, { status: 400 })
  }

  const validIds = new Set(QUESTIONS.map((q) => q.id))
  const answers = body.answers as ReadinessAnswer[]

  for (const a of answers) {
    if (
      !a ||
      typeof a.questionId !== 'string' ||
      !validIds.has(a.questionId) ||
      typeof a.score !== 'number' ||
      a.score < 1 ||
      a.score > 5
    ) {
      return NextResponse.json({ error: 'Each answer needs a valid questionId and a score between 1 and 5.' }, { status: 400 })
    }
  }

  if (answers.length !== QUESTIONS.length) {
    return NextResponse.json(
      { error: `All ${QUESTIONS.length} questions must be answered.` },
      { status: 400 }
    )
  }

  const result = computeReadiness(answers)
  return NextResponse.json({ result })
}
