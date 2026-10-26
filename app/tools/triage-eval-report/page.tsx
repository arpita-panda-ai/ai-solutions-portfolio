import Link from 'next/link'
import type { Metadata } from 'next'
import { runEvaluation } from '@/lib/triage/evaluate'
import { runRealWorldEvaluation } from '@/lib/triage/evaluate-real'

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
  const realReport = runRealWorldEvaluation()

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-ops-triage-copilot" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Triage Copilot: evaluation report
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        These numbers are computed live, every time this page loads, by actually running the
        rules-based triage engine against two separate test sets: nothing here is a pasted-in or
        invented figure.
      </p>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Headline metrics</h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
          Synthetic test set ({report.totalCases} cases)
        </p>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard label="Department accuracy" value={`${report.overallDepartmentAccuracy}%`} />
          <MetricCard label="Issue type accuracy" value={`${report.overallIssueTypeAccuracy}%`} />
          <MetricCard label="Priority accuracy" value={`${report.overallPriorityAccuracy}%`} />
          <MetricCard label="Review-flag accuracy" value={`${report.reviewFlagAccuracy}%`} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MetricCard
            label="Department baseline"
            value={`${report.baselineDepartmentAccuracy}%`}
            sub={`Always guessing "${report.baselineDepartment}"`}
          />
          <MetricCard
            label="Issue type baseline"
            value={`${report.baselineIssueTypeAccuracy}%`}
            sub={`Always guessing "${report.baselineIssueType}"`}
          />
        </div>

        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-ink-muted">
          Real-world test set ({realReport.totalCases} cases)
        </p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <MetricCard label="Department accuracy" value={`${realReport.overallDepartmentAccuracy}%`} />
          <MetricCard label="Issue type accuracy" value={`${realReport.overallIssueTypeAccuracy}%`} />
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Lower than the synthetic set, as expected: real tickets are terser and more implicit.
          Full by-category breakdown and failed cases are on the{' '}
          <Link href="/tools/triage-real-eval-report" className="text-accent hover:underline">
            real-world evaluation report
          </Link>
          , kept separate rather than blended into one number.
        </p>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Evaluation methodology</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          <li>
            <strong className="text-ink">Synthetic set</strong>: {report.totalCases} hand-labelled
            cases written to cover four buckets, clear, ambiguous, missing-information, and
            adversarial (designed to break naive keyword matching). Ground-truth labels were
            assigned by reading each request before looking at what the engine produced.
          </li>
          <li>
            <strong className="text-ink">Real-world set</strong>: {realReport.totalCases} anonymised
            IT service-desk tickets from a public, CC0-licensed Kaggle dataset, with ground truth
            taken from the dataset&apos;s own category labels rather than written by me. Sampling
            method and source details are on the{' '}
            <Link href="/tools/triage-real-eval-report" className="text-accent hover:underline">
              real-world evaluation report
            </Link>
            .
          </li>
          <li>
            <strong className="text-ink">Baselines</strong>: always guessing the single most common
            department or issue type in each dataset, shown alongside the engine&apos;s accuracy so
            the uplift over doing nothing clever is visible rather than assumed.
          </li>
        </ul>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Accuracy by difficulty</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Accuracy should (and does) drop as cases get harder: that is the point of including
          difficult cases rather than hiding them.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2 pr-4">Department accuracy</th>
                <th className="py-2 pr-4">Issue type accuracy</th>
                <th className="py-2">Priority accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.byCaseCategory.map((c) => (
                <tr key={c.category} className="border-b border-border/60">
                  <td className="py-2 pr-4 capitalize text-ink">{c.category.replace('-', ' ')}</td>
                  <td className="py-2 pr-4 text-ink-muted">{c.count}</td>
                  <td className="py-2 pr-4 text-ink">{c.departmentAccuracy}%</td>
                  <td className="py-2 pr-4 text-ink">{c.issueTypeAccuracy}%</td>
                  <td className="py-2 text-ink">{c.priorityAccuracy}%</td>
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
                  <span className="text-ink">{f.case.expectedDepartment} / {f.case.expectedIssueType} / {f.case.expectedPriority}</span>
                </div>
                <div>
                  <span className="text-ink-muted">Actual: </span>
                  <span className="text-ink">{f.actual.department} / {f.actual.issueType} / {f.actual.priority} (confidence {f.actual.confidence})</span>
                </div>
              </div>
              {f.case.note && <p className="mt-2 text-xs italic text-ink-muted">{f.case.note}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Iteration history</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          This evaluation was used to improve the engine, not just describe it. The numbers below
          for iteration 1 are a fixed historical record (that version of the rule set no longer
          exists to re-run), while the current numbers are the live figures shown above.
        </p>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-muted">
          <div>
            <p className="font-medium text-ink">Iteration 1 (first synthetic run)</p>
            <p className="mt-1">
              72% department accuracy, 80% issue type accuracy, 88% priority accuracy, 72%
              review-flag accuracy, 12 of 25 cases failed. Reviewing every failure by hand split
              them into two groups: genuine, generalisable rule gaps, and cases failing by design
              (deliberate ties on ambiguous or multi-intent text, or a structural limit of the
              dataset-derived keyword approach).
            </p>
          </div>
          <div>
            <p className="font-medium text-ink">Fixes applied (iteration 2)</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                Added named business systems (e.g. &quot;CRM&quot;, &quot;ERP&quot;) and the phrase
                &quot;access to the ... system&quot; as Access-department signals, so a request
                like &quot;request access to the CRM system&quot; isn&apos;t outweighed by
                unrelated onboarding language in the same message (case C2).
              </li>
              <li>
                Added billing-specific problem language (&quot;overcharged&quot;, &quot;double
                charged&quot;, &quot;charged twice&quot;) as an Incident signal, so a billing
                complaint is read as reporting a problem rather than falling through to
                unclassified (cases C5 and A5).
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-ink">Current (iteration 2, live figures above)</p>
            <p className="mt-1">
              {report.overallDepartmentAccuracy}% department accuracy, {report.overallIssueTypeAccuracy}%
              issue type accuracy, {report.reviewFlagAccuracy}% review-flag accuracy,{' '}
              {report.failedCases.length} of {report.totalCases} cases failed. The real-world
              evaluation was re-run after these fixes and stayed at {realReport.overallDepartmentAccuracy}%
              department / {realReport.overallIssueTypeAccuracy}% issue type accuracy, unchanged:
              both fixes target specific phrasing found in the synthetic set, not the real
              dataset&apos;s stripped, keyword-light text, and an unchanged real-world score after a
              synthetic-only fix is a reasonable check against overfitting to this test set&apos;s
              exact wording.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink">What was deliberately left alone</p>
            <p className="mt-1">
              The remaining {report.failedCases.length} failures were not patched further. Several
              are deliberate ties on genuinely ambiguous or multi-intent text, where the engine is
              designed to fall back rather than guess. Others reflect a structural ceiling of the
              dataset-derived keyword approach, which intentionally excludes generic words to avoid
              worse collisions elsewhere. Patching these further would mean writing rules shaped to
              this specific 25-sentence test set rather than genuinely improving the engine, which
              is exactly the overfitting risk the real-world dataset above is designed to catch.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Confidence analysis and limitations
        </h2>
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
                <th className="py-2">Accuracy (department &amp; issue type both correct)</th>
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
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Calibration is noisy at this sample size (one band holds a single case) and is not yet a
          reliable signal on its own; read it as a direction, not a precise probability. More
          broadly, this is a rules-based pattern-matching engine, not a trained model: it will not
          quietly improve with more data the way a machine-learning model might. The remaining
          failures above are either genuine, designed-in ambiguity or a structural ceiling of the
          keyword approach (see Iteration history), so the honest next step for improving these
          numbers further is comparing this engine against an LLM-assisted approach, not more rule
          tuning against the same test sets.
        </p>
      </div>
    </main>
  )
}
