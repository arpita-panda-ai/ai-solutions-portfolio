'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { ANSWER_LABELS, CATEGORIES, QUESTIONS } from '@/lib/readiness/scorecard'
import type { ReadinessResult } from '@/lib/readiness/types'

const TIER_STYLES: Record<string, string> = {
  'Ready to pilot': 'bg-status-completed/10 text-status-completed border-status-completed/30',
  'Ready with conditions': 'bg-status-progress/10 text-status-progress border-status-progress/30',
  'Not ready yet': 'bg-status-prototype/10 text-status-prototype border-status-prototype/30',
}

export default function ReadinessScorecardTool() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReadinessResult | null>(null)

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, score]) => ({ questionId, score })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setResult(data.result)
      }
    } catch {
      setError('Could not reach the scoring service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setAnswers({})
    setResult(null)
    setError(null)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-adoption-readiness-assessment" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        AI Adoption Readiness Scorecard
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Answer honestly about a specific team and a specific candidate AI workflow — not the
        organisation in general. This is a self-assessment framework, not a certified audit, and
        the output is a conversation-starter, not a go/no-go verdict.
      </p>

      {!result && (
        <div className="mt-8 space-y-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="card p-6">
              <h2 className="font-serif text-lg font-semibold text-ink">{cat.label}</h2>
              <div className="mt-4 space-y-5">
                {QUESTIONS.filter((q) => q.categoryId === cat.id).map((q) => (
                  <div key={q.id}>
                    <p className="text-sm text-ink">{q.text}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ANSWER_LABELS.map((opt) => (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                            answers[q.id] === opt.score
                              ? 'border-accent bg-accent-soft text-accent'
                              : 'border-border text-ink-muted hover:border-accent hover:text-accent'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Scoring...' : 'See my readiness score'}
          </button>
          {!allAnswered && (
            <p className="text-xs text-ink-muted">
              Answer all {QUESTIONS.length} questions to see your score.
            </p>
          )}
          {error && (
            <div className="rounded-md border border-status-progress/40 bg-status-progress/5 p-4 text-sm text-ink">
              {error}
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Overall score</span>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${TIER_STYLES[result.tier]}`}>
                {result.tier}
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-ink">{result.overallScore}/100</p>
            <p className="mt-2 text-sm text-ink-muted">{result.tierSummary}</p>

            <div className="mt-6 space-y-3">
              {result.categoryResults.map((c) => (
                <div key={c.categoryId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{c.label}</span>
                    <span className="text-ink-muted">{c.score}/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-ink/10">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {result.biggestRisk && (
              <div className="mt-6 flex items-start gap-2 rounded-md border border-status-progress/30 bg-status-progress/5 p-4 text-sm text-ink">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-status-progress" />
                <div>
                  <p className="font-medium">Biggest risk area: {result.biggestRisk.label}</p>
                  <p className="mt-1 text-ink-muted">{result.biggestRisk.recommendation}</p>
                </div>
              </div>
            )}

            {!result.biggestRisk && (
              <div className="mt-6 flex items-start gap-2 rounded-md border border-status-completed/30 bg-status-completed/5 p-4 text-sm text-ink">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-status-completed" />
                <p>No single category stands out as a blocking risk — normal pilot diligence still applies.</p>
              </div>
            )}
          </div>

          <button type="button" onClick={reset} className="btn-outline mt-6">
            Score another workflow
          </button>
        </div>
      )}
    </main>
  )
}
