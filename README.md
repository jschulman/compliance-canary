# Compliance Canary

Tracking credential and control demand in finance job descriptions using aggregate public job-posting observations.

**[View the dashboard](https://jschulman.github.io/compliance-canary)**

## What this measures

What share of eligible finance JDs names a tracked credential or control term, and how many companies account for those requests?

```
credential_prevalence = unique eligible JDs with at least one tracked term / eligible JDs
company_breadth = matching companies / companies with eligible JDs
```

Eligible JDs were **last observed within the preceding 90 days** at baseline employers, including jobs that have since closed. A JD naming CPA, SOX and PCAOB counts once in headline prevalence and once in each category. Each category's percentage uses eligible JDs, not total mentions. Company counts show whether demand spans employers or is concentrated in a few.

The original total-mention series remains as a separate historical chart. That count is the sum of category matches, so the example above contributes three mentions. It is not a count of jobs or a score of regulatory readiness. Old snapshots without unique matching-job counts show explicitly labeled legacy mention counts; the dashboard does not estimate prevalence by dividing total mentions by jobs.


The crypto-native baseline is preserved. It is a selected employer sample, not a measure of adoption across incumbent banks, brokers or payment processors. See [Financial Rails](https://jschulman.github.io/stablecoin-signal/#financial-rails) and the separate [incumbent employer panel](https://jayschulman.com/blockchain#incumbent-panel).

See [METHODOLOGY.md](METHODOLOGY.md) for the current definitions, role coverage, historical changes and limitations. Missing percentages display as unknown; historical charts preserve gaps. Requested skills, persistent job listings and advertised pay do not by themselves establish adoption or demand for professional services.

## Architecture and refresh

- `docs/` — static HTML, JavaScript and CSS, served by GitHub Pages.
- `data/` and `docs/data/` — published aggregate snapshots from the private producer.
- `.github/workflows/` — publishing automation.
- `tests/` — renderer regression checks for measured zero, missing data and historical compatibility.

The private producer polls public Ashby, Greenhouse and Lever job-board feeds. Daily refresh is intended, but the observation date and coverage determine freshness. No individual job descriptions or private employer records are published here. The source location and scheduled publishing roots remain unchanged.

Run the renderer checks with `node --test tests/*.test.cjs`.

## The Crypto Canaries

- [CFO Gap](https://jschulman.github.io/cfo-gap) — persistent finance listings.
- [Crypto Tool Curve](https://jschulman.github.io/crypto-tool-curve) — tool and operational-skill demand.
- [Compliance Canary](https://jschulman.github.io/compliance-canary) — credential and control demand.
- [Comp Pulse](https://jschulman.github.io/comp-pulse) — advertised salary-range index.

Related: [Stablecoin Signal](https://jschulman.github.io/stablecoin-signal) · [Displacement Curve](https://jschulman.github.io/displacement-curve) · [Quantum Qanary](https://jschulman.github.io/quantum-qanary).

MIT — see [LICENSE](LICENSE).

— Jay Schulman · [jayschulman.com](https://jayschulman.com)
