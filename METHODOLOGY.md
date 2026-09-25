# Methodology

What share of eligible finance JDs names a tracked credential or control term, and how many companies account for those requests?

```
credential_prevalence = unique eligible JDs with at least one tracked term / eligible JDs
company_breadth = matching companies / companies with eligible JDs
```

Eligible JDs were **last observed within the preceding 90 days** at baseline employers, including jobs that have since closed. A JD naming CPA, SOX and PCAOB counts once in headline prevalence and once in each category. Each category's percentage uses eligible JDs, not total mentions. Company counts show whether demand spans employers or is concentrated in a few.

The original total-mention series remains as a separate historical chart. That count is the sum of category matches, so the example above contributes three mentions. It is not a count of jobs or a score of regulatory readiness. Old snapshots without unique matching-job counts show explicitly labeled legacy mention counts; the dashboard does not estimate prevalence by dividing total mentions by jobs.

## General credentials and blockchain requirements

The existing categories are CPA, Big Four experience, SOX, PCAOB, MSB/MTL, FINRA/SEC, GAAP/ASC, GENIUS Act, NYDFS and CMA. These mix credentials, experience and legal/control terms; ordinary CPA, GAAP or SOX requirements are not uniquely blockchain-related. Name matches do not establish whether a qualification is required, preferred, present or effective.

A **separate** set of requirements records integration, reconciliation, custody and controls language in descriptions that also contain blockchain-related context. It has its own unique-JD prevalence and company breadth, plus per-category counts. A whole-description context match is a screening signal, not proof that a specific control applies to blockchain or that the control has been implemented. It is not combined with generic credentials into a readiness score.

## Eligible finance roles

Controller and assistant-controller variants; finance leadership and CFO; strategic finance; accounting management and leads; senior, financial, staff, fund and other matched accountants; tax management; FP&A; technical accounting and financial reporting; AP/AR; treasury management; internal audit; and SOX/compliance roles. Titles are matched by ordered, case-insensitive patterns. Bookkeeper and payroll-manager capture-only roles are excluded. This includes individual contributors, so “senior finance” does not precisely describe the entire sample.

## Sources and coverage

The private producer polls public Ashby, Greenhouse and Lever job-board feeds and publishes aggregates here. The crypto-native baseline is a selected, evolving employer sample; it is not a census or a representative survey. Company additions, exclusions, title classification, job-board coverage and collection failures can change the sample. Companies without observed eligible jobs are not represented in a JD denominator.

The baseline is retained separately from any expanded panel of incumbent financial businesses. An incumbent employer must not be added to this series simply to widen market observation. Employer type, infrastructure-provider role and use case are separate attributes in the expanded research panel. A crypto-native firm can also provide financial infrastructure.

Daily refresh is the intended cadence. The date shown in the dashboard is the observation date, which can precede publication. A scheduled workflow or recent export is not proof that every employer feed was refreshed successfully. Snapshots live in `data/` and `docs/data/`; the dashboard reads `docs/data/latest.json`.

## Interpretation

Demand can rise because employers request more credentials, the sample grows, or its employer and role mix changes. Normalized prevalence and company breadth improve interpretation but do not eliminate selection bias. Job descriptions cannot establish staffing coverage, regulatory readiness, audit quality or future assurance fees. Multiple credentials in a JD do not make it a stronger measured readiness outcome.

## Material historical changes

On **2026-06-24**, the producer switched demand measurement to a 90-day active window and broadened finance title matching. Version 2.0 adds unique-JD prevalence, company breadth and separately scoped blockchain requirements. Older mention totals are retained. Unknown historical unique-job counts and denominators remain null; current listings cannot recreate past prevalence. Compare periods only with compatible definitions and known coverage.

## Missing data and historical comparability

An unknown numerator or a zero/unknown denominator produces an unknown percentage, displayed as `—`; it is never interpreted as 0%. Missing calendar dates and unavailable values remain gaps in charts. A measured zero requires a known, positive denominator. Material definition changes can break comparability even where a chart is continuous.

The 2026-09-25 interpretation update removes unsupported success/failure verdicts. Version 2.0 producer snapshots identify the updated methodology in metadata; older snapshots retain their original version. Original aggregate series and URLs remain available. Generated snapshots are published by the producer, not fabricated by the dashboard.

## Reproducibility

Replicate the selected employer feeds, eligibility rules, title and text patterns, and snapshot date. Keep dated counts and denominators together. Save unique-job and company counts at collection time; do not derive old coverage from today’s database. The private producer owns collection and aggregation; this repository renders the published aggregates.
