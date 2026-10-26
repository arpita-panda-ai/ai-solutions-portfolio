# AI Adoption Readiness Assessment

Helping teams decide whether — and how — a business workflow is ready for an AI pilot.

An interactive tool that takes a team through the full decision journey: assess readiness, identify blockers, get a recommended technology approach, build an action plan, and export a report.

**Status:** Working prototype
**Focus:** AI strategy · Product thinking · Decision support · Rules-based automation design

## The problem

Not every business process is ready for AI.

Teams can invest in pilots before establishing clear process ownership, confirming data availability, planning human oversight or defining how success will be measured. Even teams that clear those bars often default straight to a generative-AI build without checking whether a simpler, cheaper, more auditable approach would actually fit the task better.

The challenge isn't simply deciding whether AI could be useful. It's understanding whether the team and workflow are prepared to test it responsibly, and which technology approach actually fits — before time and budget are committed.

## The solution

I designed an interactive tool that takes a team through five steps, rather than producing a single score.

**Steps 1-2: Readiness assessment.** The tool scores 12 questions across four categories:

- Process maturity — Is the workflow understood, stable and clearly owned?
- Data quality and availability — Is the required data accessible and suitable for the proposed use case?
- Change readiness — Are the people, responsibilities and human-review processes in place?
- Evaluation and monitoring — Can the team measure performance, identify failures and monitor results?

This produces an overall readiness score and tier, and surfaces *every* category that falls below a risk threshold as its own blocker with a specific recommendation — not just the single worst one. A sensitivity hint also shows how close a team is to the next tier: for example, whether improving the weakest category by one point would move the overall tier up.

**Step 3: Technology-approach recommendation.** A second, independent rules engine asks four further questions about the workflow itself, not the organisation: how structured the data is, whether the decision logic can be written down as explicit rules, whether the decision needs to be explainable or auditable, and whether the volume justifies building anything at all. It then recommends one of four approaches: deterministic rules-based automation, AI-assisted automation with mandatory human review, fixing the process first, or holding off entirely.

**Step 4: Action plan.** The blockers from Step 2 and the recommended approach from Step 3 are combined into a single ordered checklist.

**Step 5: Export.** The full result — score, blockers, recommended approach and action plan — can be downloaded as a report, generated entirely in the browser with nothing stored.

Rather than treating the output as a definitive verdict, the tool is designed to help teams work through the decision in order and leave with a concrete next step, not just a number.

## How I approached the design

1. **Frame the decision.** I focused on a specific business decision: whether a team is sufficiently prepared to run an AI pilot for a particular workflow, and if so, what technology approach actually fits it.
2. **Structure the assessment.** I translated readiness into four categories and 12 questions, aiming to cover operational, data, organisational and evaluation considerations.
3. **Make the scoring transparent.** I defined category weights, scoring thresholds and recommendation logic so users can understand how their answers affect the output.
4. **Account for critical risks.** During testing, I identified that a weighted average could conceal a serious gap. I updated the logic to override the overall tier when a critical issue is detected, and to surface every at-risk category rather than only the worst one.
5. **Extend from a single score to a full decision journey.** External feedback pointed out that a single readiness score is less useful than carrying a team through to a concrete next step. I added a second, independent rules engine for the technology-approach recommendation, deliberately kept rules-based and auditable rather than defaulting to generative AI to make the project "look more like AI," then layered an action-plan generator and a downloadable report on top, so the tool now mirrors how a team would actually use this in practice.

## My contribution

I led the product framing and designed the full assessment framework: the readiness categories, questions, weights, thresholds and recommendation logic, plus the separate workflow-nature questions, technology-approach decision rules, action-plan logic and report generation. I also directed development of the full five-step interactive prototype using Claude Code.

My focus was on making the assessment understandable, transparent and useful as a decision-support tool at every step, not just at the final score.

## Evaluation and limitations

This is an exploratory product prototype, not a validated predictive model or certified AI-readiness assessment.

The scoring and decision-rule framework reflects my own reasoned design choices. Its weights, thresholds and technology-approach rules have not been validated against real-world pilot outcomes, and the tool has not been tested with real teams to establish whether its recommendations predict implementation success. The four workflow-nature questions behind the technology recommendation cover the most common cases but are not an exhaustive decision framework, and the generated action plan is a starting checklist, not a project plan.

Evaluation to date has focused on the internal consistency and transparency of the scoring and decision logic, including how the tool handles critical readiness gaps and how it routes between the four technology approaches.

The assessment should therefore be used as a structured conversation-starter, not as the sole basis for approving or rejecting an AI investment.

## What I'd explore next

- Test the full journey with operations and transformation professionals.
- Gather feedback on whether the readiness questions and the workflow-nature questions capture the most important considerations.
- Review the technology-approach recommendations and action plans for clarity and practical usefulness.
- Compare assessment results and recommended approaches with real pilot outcomes over time, before making claims about predictive validity.

## Tools and methods

Product framing · Weighted scoring framework · Rules-based decision engine · Decision-support design · Next.js · TypeScript · Claude Code
