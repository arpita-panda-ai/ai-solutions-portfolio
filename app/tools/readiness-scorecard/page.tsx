'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Loader2, Info, Download } from 'lucide-react'
import {
  ANSWER_LABELS,
  CATEGORIES,
  QUESTIONS,
  SEVERE_GAP_THRESHOLD,
  MAJOR_GAP_THRESHOLD,
  RISK_FLAG_THRESHOLD,
} from '@/lib/readiness/scorecard'
import { WORKFLOW_QUESTIONS } from '@/lib/readiness/approach'
import { buildActionPlan } from '@/lib/readiness/actionPlan'
import { buildReadinessReport } from '@/lib/readiness/report'
import type { ApproachResult, ReadinessResult, WorkflowQuestionId } from '@/lib/readiness/types'

const TIER_STYLES: Record<string, string> = {
  'Ready to pilot': 'bg-status-completed/10 text-status-completed border-status-completed/30',
  'Ready with conditions': 'bg-status-progress/10 text-status-progress border-status-progress/30',
  'Not ready yet': 'bg-status-prototype/10 text-status-prototype border-status-prototype/30',
}

const APPROACH_STYLES: Record<string, string> = {
  'Deterministic rules-based automation': 'bg-status-completed/10 text-status-completed border-status-completed/30',
  'AI-assisted with mandatory human review': 'bg-status-progress/10 text-status-progress border-status-progress/30',
  'Fix the process first': 'bg-status-prototype/10 text-status-prototype border-status-prototype/30',
  'Not worth automating yet': 'bg-status-concept/10 text-status-concept border-status-concept/30',
}

function barColor(score: number): string {
  if (score < RISK_FLAG_THRESHOLD) return 'bg-status-progress'
  return 'bg-status-completed'
}

export default function ReadinessScorecardTool() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReadinessResult | null>(null)

  const [showWorkflowQuestions, setShowWorkflowQuestions] = useState(false)
  const [workflowAnswers, setWorkflowAnswers] = useState<Record<WorkflowQuestionId, string>>(
    {} as Record<WorkflowQuestionId, string>
  )
  const [approachLoading, setApproachLoading] = useState(false)
  const [approachError, setApproachError] = useState<string | null>(null)
  const [approach, setApproach] = useState<ApproachResult | null>(null)

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined)
  const allWorkflowAnswered = WORKFLOW_QUESTIONS.every((q) => workflowAnswers[q.id] !== undefined)

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

  async function handleApproachSubmit() {
    if (!result) return
    setApproachLoading(true)
    setApproachError(null)
    setApproach(null)
    try {
      const res = await fetch('/api/readiness/approach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readinessTier: result.tier,
          workflowAnswers: Object.entries(workflowAnswers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApproachError(data.error ?? 'Something went wrong.')
      } else {
        setApproach(data.result)
      }
    } catch {
      setApproachError('Could not reach the recommendation service. Please try again.')
    } finally {
      setApproachLoading(false)
    }
  }

  function handleDownloadReport() {
    if (!result || !approach) return
    const report = buildReadinessReport(result, approach, buildActionPlan(result.riskAreas, approach))
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-pilot-readiness-report.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function reset() {
    setAnswers({})
    setResult(null)
    setError(null)
    setShowWorkflowQuestions(false)
    setWorkflowAnswers({} as Record<WorkflowQuestionId, string>)
    setApproach(null)
    setApproachError(null)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-adoption-readiness-assessment" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        AI Pilot Readiness Scorecard
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Answer honestly about a specific team and a specific candidate AI workflow, not the
        organisation in general. This is a self-assessment framework, not a certified audit, and
        the output is a conversation-starter, not a go/no-go verdict.
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Assess readiness → identify blockers → recommend a technology approach → build an action
        plan → export a report
      </p>

      <details className="mt-4 rounded-md border border-border">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-ink">
          <Info size={14} className="text-accent" />
          How the score is actually calculated
        </summary>
        <div className="space-y-2 px-4 pb-4 text-xs leading-relaxed text-ink-muted">
          <p>
            Each of the 12 questions belongs to one of four categories, which are weighted
            differently because they are not equally predictive of pilot success:{' '}
            {CATEGORIES.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? ', ' : ''}
                <strong className="text-ink">{c.label}</strong> ({Math.round(c.weight * 100)}%)
              </span>
            ))}
            .
          </p>
          <p>
            Your overall score is a weighted average of the four category scores. But a high
            average can hide one critical gap, so two guardrails override it: a category scoring
            below {SEVERE_GAP_THRESHOLD}/100 forces a &ldquo;Not ready yet&rdquo; result regardless
            of the average, and a category below {MAJOR_GAP_THRESHOLD}/100 prevents a
            &ldquo;Ready to pilot&rdquo; result. Any category below {RISK_FLAG_THRESHOLD}/100 is
            also flagged as the biggest risk area with a specific recommendation.
          </p>
        </div>
      </details>

      {!result && (
        <div className="mt-8 space-y-8">
          <div className="sticky top-0 z-10 -mx-4 bg-paper/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 lg:-mx-8">
            <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
              <span>
                {Object.keys(answers).length} of {QUESTIONS.length} answered
              </span>
              <span>{Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-ink/10">
              <div
                className="h-1.5 rounded-full bg-accent transition-all"
                style={{ width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="card p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif text-lg font-semibold text-ink">{cat.label}</h2>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-ink-muted">
                  {Math.round(cat.weight * 100)}% of score
                </span>
              </div>
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
            {result.overrideApplied && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-status-progress">
                <AlertTriangle size={12} />
                Tier was adjusted by a gap-override rule, not just the weighted average.
              </p>
            )}
            {result.sensitivityHint && (
              <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-accent">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                If {result.sensitivityHint.categoryLabel} answers each improved by one point, the
                tier would move from &ldquo;{result.sensitivityHint.fromTier}&rdquo; to &ldquo;
                {result.sensitivityHint.toTier}&rdquo;.
              </p>
            )}

            <div className="mt-6 space-y-3">
              {result.categoryResults.map((c) => (
                <div key={c.categoryId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">
                      {c.label} <span className="text-ink-muted">({Math.round(c.weight * 100)}%)</span>
                    </span>
                    <span className="text-ink-muted">{c.score}/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-ink/10">
                    <div
                      className={`h-1.5 rounded-full transition-all ${barColor(c.score)}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {result.riskAreas.length > 0 && (
              <div className="mt-6 space-y-3">
                {result.riskAreas.map((risk, i) => (
                  <div
                    key={risk.categoryId}
                    className="flex items-start gap-2 rounded-md border border-status-progress/30 bg-status-progress/5 p-4 text-sm text-ink"
                  >
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-status-progress" />
                    <div>
                      <p className="font-medium">
                        {i === 0 ? 'Biggest risk area: ' : 'Also worth addressing: '}
                        {risk.label} ({risk.score}/100)
                      </p>
                      <p className="mt-1 text-ink-muted">{risk.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.riskAreas.length === 0 && (
              <div className="mt-6 flex items-start gap-2 rounded-md border border-status-completed/30 bg-status-completed/5 p-4 text-sm text-ink">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-status-completed" />
                <p>No single category stands out as a blocking risk; normal pilot diligence still applies.</p>
              </div>
            )}
          </div>

          {!showWorkflowQuestions && !approach && (
            <button
              type="button"
              onClick={() => setShowWorkflowQuestions(true)}
              className="btn-primary mt-6"
            >
              Continue to technology recommendation →
            </button>
          )}

          {showWorkflowQuestions && !approach && (
            <div className="mt-8 space-y-6">
              <div className="card p-6">
                <h2 className="font-serif text-lg font-semibold text-ink">
                  Step 3: what kind of workflow is this?
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  These questions are about the specific task, not your organisation, and decide
                  which technology approach actually fits: a rules-based engine, an AI-assisted
                  workflow, or neither yet.
                </p>
                <div className="mt-5 space-y-5">
                  {WORKFLOW_QUESTIONS.map((q) => (
                    <div key={q.id}>
                      <p className="text-sm text-ink">{q.text}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setWorkflowAnswers((prev) => ({ ...prev, [q.id]: opt.value }))
                            }
                            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                              workflowAnswers[q.id] === opt.value
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

              <button
                type="button"
                onClick={handleApproachSubmit}
                disabled={!allWorkflowAnswered || approachLoading}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approachLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                {approachLoading ? 'Recommending...' : 'See recommended approach'}
              </button>
              {!allWorkflowAnswered && (
                <p className="text-xs text-ink-muted">
                  Answer all {WORKFLOW_QUESTIONS.length} questions to see a recommendation.
                </p>
              )}
              {approachError && (
                <div className="rounded-md border border-status-progress/40 bg-status-progress/5 p-4 text-sm text-ink">
                  {approachError}
                </div>
              )}
            </div>
          )}

          {approach && (
            <div className="mt-8 card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                  Recommended approach
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${APPROACH_STYLES[approach.approach]}`}
                >
                  {approach.approach}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">{approach.rationale}</p>
            </div>
          )}

          {result && approach && (
            <div className="mt-8 card p-6">
              <h2 className="font-serif text-lg font-semibold text-ink">Step 4: your action plan</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Ordered by urgency: close the blockers above first, then move on the recommended
                approach.
              </p>
              <ol className="mt-4 space-y-4">
                {buildActionPlan(result.riskAreas, approach).map((step) => (
                  <li key={step.order} className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                      {step.order}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{step.title}</p>
                      <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result && approach && (
            <div className="mt-8 card p-6">
              <h2 className="font-serif text-lg font-semibold text-ink">Step 5: export your report</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Downloads a plain-text summary of everything above (score, blockers, recommended
                approach, action plan) so you can save it or share it with a stakeholder. Generated
                entirely in your browser; nothing is stored.
              </p>
              <button type="button" onClick={handleDownloadReport} className="btn-outline mt-4 inline-flex items-center gap-2">
                <Download size={14} />
                Download report
              </button>
            </div>
          )}

          <button type="button" onClick={reset} className="btn-outline mt-6">
            Score another workflow
          </button>
        </div>
      )}
    </main>
  )
}
