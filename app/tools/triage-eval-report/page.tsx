import Link from 'next/link'
import type { Metadata } from 'next'
import { runEvaluation } from '@/lib/triage/evaluate'

export const metadata: Metadata = {
  title: 'Triage Copilot Evaluation Report | Arpita Panda',
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

export default function TriageEvalReport() {
  const report = runEvaluation()

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-ops-triage-copilot" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Triage Copilot — evaluation report
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        These numbers are computed live by actually running the rules-based triage engine against
        a {report.totalCases}-case synthetic, hand-labelled test set every time this page loads —
        nothing here is a pasted-in or invented figure. Ground-truth labels were assigned by
        reading each request before looking at what the engine produced, split across four
        buckets: clear, ambiguous, missing-information, and adversarial (designed to break naive
        keyword matching).
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Type accuracy" value={`${report.overallTypeAccuracy}%`} />
        <MetricCard label="Priority accuracy" value={`${report.overallPriorityAccuracy}%`} />
        <MetricCard label="Review-flag accuracy" value={`${report.reviewFlagAccuracy}%`} />
        <MetricCard
          label="Baseline"
          value={`${report.baselineTypeAccuracy}%`}
          sub={`Always guessing "${report.baselineType}"`}
        />
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Accuracy by case difficulty</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Accuracy should (and does) drop as cases get harder — that is the point of including
          difficult cases rather than hiding them.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2 pr-4">Type accuracy</th>
                <th className="py-2">Priority accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.byCaseCategory.map((c) => (
                <tr key={c.category} className="border-b border-border/60">
                  <td className="py-2 pr-4 capitalize text-ink">{c.category.replace('-', ' ')}</td>
                  <td className="py-2 pr-4 text-ink-muted">{c.count}</td>
                  <td className="py-2 pr-4 text-ink">{c.typeAccuracy}%</td>
                  <td className="py-2 text-ink">{c.priorityAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Confidence calibration</h2>
        <p className="mt-2 text-sm text-ink-muted">
          A confidence score is only useful if higher confidence actually means more likely to be
          correct. This checks that directly.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Confidence band</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2">Type accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.confidenceCalibration.map((b) => (
                <tr key={b.range} className="border-b border-border/60">
                  <td className="py-2 pr-4 text-ink">{b.range}</td>
                  <td className="py-2 pr-4 text-ink-muted">{b.count}</td>
                  <td className="py-2 text-ink">{b.accuracy === null ? '—' : `${b.accuracy}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Failed cases ({report.failedCases.length} of {report.totalCases})
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Shown in full, not cherry-picked. Most failures cluster in the ambiguous and adversarial
          buckets, which is the expected and intended result.
        </p>
        <div className="mt-4 space-y-4">
          {report.failedCases.map((f) => (
            <div key={f.case.id} className="card p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-ink-muted">
                {f.case.id} · {f.case.caseCategory}
              </p>
              <p className="mt-1 text-sm text-ink">&ldquo;{f.case.text}&rdquo;</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-muted">Expected: </span>
                  <span className="text-ink">{f.case.expectedType} / {f.case.expectedPriority}</span>
                </div>
                <div>
                  <span className="text-ink-muted">Actual: </span>
                  <span className="text-ink">{f.actual.requestType} / {f.actual.priority} (confidence {f.actual.confidence})</span>
                </div>
              </div>
              {f.case.note && <p className="mt-2 text-xs italic text-ink-muted">{f.case.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
