import Link from 'next/link'
import type { Metadata } from 'next'
import { runEvaluation } from '@/lib/requirements/evaluate'

export const metadata: Metadata = {
  title: 'Requirements QA Evaluation Report | Arpita Panda',
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

export default function RequirementsEvalReport() {
  const report = runEvaluation()

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/requirements-qa" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Requirements QA: evaluation report
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        These numbers are computed live by actually running the rules-based engine against a{' '}
        {report.totalCases}-case synthetic, hand-labelled test set every time this page loads;
        nothing here is a pasted-in or invented figure. Ground-truth labels were assigned by
        tracing the engine&apos;s own logic against each case, split across four buckets: clear,
        ambiguous, missing-information, and adversarial (designed to break naive pattern
        matching). One adversarial case (AD2) found a genuine false-positive bug in acceptance-
        criteria detection during this process, which was fixed before these numbers were taken;
        see Limitations on the case study page for what remains.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Format accuracy" value={`${report.overallFormatAccuracy}%`} />
        <MetricCard label="AC detection accuracy" value={`${report.acDetectionAccuracy}%`} />
        <MetricCard label="Review-flag accuracy" value={`${report.reviewFlagAccuracy}%`} />
        <MetricCard label="Issue-type accuracy" value={`${report.issueTypeAccuracy}%`} />
      </div>

      <div className="mt-6">
        <MetricCard
          label="Baseline"
          value={`${report.baselineReviewAccuracy}%`}
          sub="Always flagging for human review, regardless of content"
        />
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Accuracy by case difficulty</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Format and review-flag accuracy across each case-difficulty bucket, shown in full rather
          than only for the easy cases.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2 pr-4">Format accuracy</th>
                <th className="py-2">Review-flag accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.byCaseCategory.map((c) => (
                <tr key={c.category} className="border-b border-border/60">
                  <td className="py-2 pr-4 capitalize text-ink">{c.category.replace('-', ' ')}</td>
                  <td className="py-2 pr-4 text-ink-muted">{c.count}</td>
                  <td className="py-2 pr-4 text-ink">{c.formatAccuracy}%</td>
                  <td className="py-2 text-ink">{c.reviewFlagAccuracy}%</td>
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
          correct on format detection. This checks that directly.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Confidence band</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2">Format accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.confidenceCalibration.map((b) => (
                <tr key={b.range} className="border-b border-border/60">
                  <td className="py-2 pr-4 text-ink">{b.range}</td>
                  <td className="py-2 pr-4 text-ink-muted">{b.count}</td>
                  <td className="py-2 text-ink">{b.accuracy === null ? 'N/A' : `${b.accuracy}%`}</td>
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
          Shown in full, not cherry-picked. A case is marked failed if its format, acceptance-
          criteria detection, review flag, or expected issue types do not match.
        </p>
        <div className="mt-4 space-y-4">
          {report.failedCases.length === 0 && (
            <p className="text-sm text-ink-muted">No failed cases in the current test set.</p>
          )}
          {report.failedCases.map((f) => (
            <div key={f.case.id} className="card p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-ink-muted">
                {f.case.id} · {f.case.caseCategory}
              </p>
              <p className="mt-1 text-sm text-ink">&ldquo;{f.case.text || '(empty input)'}&rdquo;</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-muted">Expected: </span>
                  <span className="text-ink">
                    {f.case.expectedFormat}, AC: {f.case.expectedHasAcceptanceCriteria ? 'yes' : 'no'},
                    review: {f.case.expectedNeedsHumanReview ? 'yes' : 'no'}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted">Actual: </span>
                  <span className="text-ink">
                    {f.actual.format}, AC: {f.actual.hasAcceptanceCriteria ? 'yes' : 'no'}, review:{' '}
                    {f.actual.needsHumanReview ? 'yes' : 'no'}
                  </span>
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
