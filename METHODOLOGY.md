# Methodology

How Compliance Canary is computed, what its limits are, and how to read its numbers honestly.

## One question

Is the crypto sector actually staffing up for federal regulation, or hoping the rules don't arrive?

## The metric

**Regulatory Readiness Signal**, defined corpus-wide and per-credential:

```
total_signals = Σ (mentions of any tracked credential across all open finance JDs)
```

Where:
- **"Open"** means the listing was present in the most recent scan of the company's public job-board feed.
- **"Finance JDs"** are job postings matching the same fixed taxonomy of accounting and finance roles used by [The CFO Gap](https://jschulman.github.io/cfo-gap): Controller, Assistant Controller, Corporate Controller, VP Finance, Head of Finance, CFO, Accounting Manager, Senior Accounting Manager, Accounting Lead, Senior Accountant, Tax Manager, Tax Director, FP&A Manager, FP&A Director, Technical Accounting Manager, Revenue Accountant, Staff Accountant, AP/AR Specialist, Treasury Manager, Internal Audit Manager, SOX/Compliance Manager.
- **"Tracked credential"** is one of the regulatory readiness markers listed below. Each JD body is scanned once per credential; a JD that mentions both "CPA" and "SOX" contributes one mention to each, for a total of two signals.

The headline metric is the **sum across all tracked credentials**, not the count of JDs. A single JD listing CPA + SOX + PCAOB contributes 3 signals.

## Tracked credentials

The current tracked list:

- **cpa** — Certified Public Accountant license (active, in-process, or required)
- **big-4** — Big Four audit firm experience (Deloitte, EY, KPMG, PwC) as a required or preferred qualification
- **sox** — Sarbanes-Oxley internal-controls experience (SOX 404, SOX-readiness, ICFR)
- **pcaob** — PCAOB-registered audit experience, or PCAOB inspection familiarity
- **msb-mtl** — Money Services Business registration, state money transmitter licensing
- **finra-sec** — FINRA registration (Series 7/24/27/28/63/79), SEC registered investment adviser supervisory experience, broker-dealer compliance
- **gaap-asc** — Specific US GAAP / FASB ASC technical accounting experience (ASC 350, ASC 606, ASC 842, ASC 820, etc.)
- **genius-act** — Explicit mention of the GENIUS Act, federal stablecoin legislation, or stablecoin-specific federal regulatory readiness

The list is intentionally focused on credentials and keywords that signal *federal-grade* compliance readiness — not generic "compliance" language. The list is reviewed quarterly and changes will be noted in this file with a version bump.

## Data source

The scanner queries public job-board APIs:
- **Ashby:** `https://api.ashbyhq.com/posting-api/job-board/{slug}`
- **Greenhouse:** `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true`
- **Lever:** `https://api.lever.co/v0/postings/{slug}?mode=json`

For each company in the curated target list, the scanner pulls all open postings, classifies titles into the finance taxonomy, then keyword-matches the full JD body against the credential list. Matches are case-insensitive and use credential-specific patterns (e.g., `\bCPA\b` to avoid matching "incapable", whole-phrase match for "GENIUS Act", boundary-aware match for "Series 7" / "Series 24").

All data is **public**. No portal logins. No robots.txt bypass. Per-domain rate limiting. User-Agent identifies the project.

## Target universe

The curated target list is the same crypto-native middle-market universe used by The CFO Gap:
- Primary business is crypto-native (not "crypto-curious" fintech)
- Last priced round: Series B, C, or D (or equivalent token raise scale)
- Headcount: roughly 50–500
- Last funding event within 36 months
- US or US-adjacent operations

Hard exclusions: too small (seed / pre-seed / Series A under $10M raised), too big (Coinbase, Binance, Kraken, Block, Robinhood Crypto, Tether, Circle, public crypto companies), dead or distressed.

The target list is maintained privately and refreshed quarterly.

## Update cadence

The dashboard refreshes daily. Each snapshot includes:
- A timestamp
- Total readiness signal count (sum across all credentials)
- Per-credential mention count
- Total tracked JD count (`n_jds`, for context)
- A point in the daily time series

Snapshots are versioned under `data/snapshots/YYYY-MM-DD.json`. The dashboard reads `data/latest.json`.

## Caveats and limits

- **Mentions ≠ readiness.** A JD asking for a CPA tells us the company wants one — not that they've hired one. The metric is a *demand* signal, not a coverage signal.
- **Double-counting is by design.** A JD mentioning CPA + SOX + PCAOB is a stronger readiness signal than a JD mentioning only CPA. The headline sum captures that.
- **Negation is not handled.** A JD that says "no SOX experience required" still mentions SOX. The signal works in aggregate, not per individual JD.
- **The tracked credential list is curated.** Adding or removing a credential will shift the headline. Changes are documented in this file.
- **The target list is curated.** We are intentionally focused on crypto-native middle-market companies. Larger crypto companies (Series E+) already have these credentials and would distort the signal.
- **First-pass classifier.** Finance role titles are matched against the same regex taxonomy as The CFO Gap. Real-world title variation is captured but not perfectly.

## What this cannot tell you

- Whether a company has actually hired a CPA (only that they're asking for one)
- The quality of the credential (a brand-new CPA and a 20-year Big 4 partner both register as one mention)
- Whether the sector will pass an actual federal audit
- Anything about non-US regulatory readiness (MiCA, MAS, FCA — out of scope)

## Versioning

Methodology versions are tracked in this file. Material changes (a credential added, a regex tightened) will bump the `version` field in `data/latest.json` and be noted here.

Current version: **1.0** (2026-05-19).

## Reproducibility

You can replicate Compliance Canary if you:
1. Curate your own list of crypto-native middle-market companies and their ATS slugs.
2. Poll their public job-board APIs daily.
3. Apply the finance role taxonomy.
4. Keyword-match each JD body against the tracked credential list, one increment per credential.
5. Sum the per-credential counts for the headline.

The target list and scanner code are maintained privately (the source repository contains operational exclusions and rubric weights that are not appropriate for public release). The methodology above is the canonical specification.
