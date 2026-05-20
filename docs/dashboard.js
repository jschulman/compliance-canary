// Compliance Canary — dashboard renderer
// Reads data/latest.json and renders three views:
//   1. Headline total signal count + phase label
//   2. Per-credential mention count, sorted descending
//   3. Time series of total readiness signals

'use strict';

const PHASES = [
  { max: 10,  label: 'Asleep',    desc: 'Sector is not hiring for regulation; no demand signal.' },
  { max: 30,  label: 'Stirring',  desc: 'Early hires for compliance; concentrated at a few issuers.' },
  { max: 75,  label: 'Alert',     desc: 'Real, distributed demand for regulatory-ready finance staff.' },
  { max: Infinity, label: 'Mobilized', desc: 'Crypto is staffing up to meet federal oversight at scale.' },
];

function phaseFor(count) {
  for (const p of PHASES) {
    if (count <= p.max) return p;
  }
  return PHASES[PHASES.length - 1];
}

function formatInt(x) {
  if (x == null || !isFinite(x)) return '—';
  return Math.round(x).toLocaleString('en-US');
}

function formatPct(x, digits) {
  if (x == null || !isFinite(x)) return '—';
  const d = (typeof digits === 'number') ? digits : 1;
  return (x * 100).toFixed(d) + '%';
}

async function loadLatest() {
  const res = await fetch('../data/latest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to load data/latest.json');
  return res.json();
}

async function loadSnapshots() {
  // Fall back to the timeseries embedded in latest.json if no separate manifest exists.
  try {
    const res = await fetch('../data/timeseries.json', { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {}
  return null;
}

function renderHeadline(data) {
  const count = data.headline.value;
  const phase = phaseFor(count);
  document.getElementById('hero-score').textContent = formatInt(count);
  document.getElementById('hero-score-label').textContent = (count === 1) ? 'signal' : 'signals';
  document.getElementById('hero-phase').textContent = phase.label;
  document.getElementById('hero-description').textContent = phase.desc;
  document.getElementById('last-updated').textContent =
    `Last updated: ${data.metadata.last_updated} · ${count} mentions across ${data.headline.n_jds} crypto-native finance JDs`;
}

function renderCredentialTable(data) {
  const total = data.headline.value;
  const rows = (data.by_credential || [])
    .slice()
    .sort((a, b) => b.n - a.n);

  const tbody = document.getElementById('credential-tbody');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-secondary);padding:1.5rem;">No data yet</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(c => {
    const share = total > 0 ? (c.n / total) : 0;
    const pct = formatPct(share, 1);
    const widthPct = Math.max(2, Math.min(100, share * 100));
    return `
      <tr>
        <td class="subsector-name">${escapeHtml(c.credential)}</td>
        <td class="subsector-numeric">${c.n}</td>
        <td class="subsector-numeric">
          ${pct}
          <span class="ratio-bar" aria-hidden="true"><span class="ratio-bar-fill" style="width:${widthPct}%"></span></span>
        </td>
      </tr>
    `;
  }).join('');
}

function renderTimeline(data, ts) {
  const series = (ts && ts.points) ? ts.points : (data.timeseries || []);
  const labels = series.map(p => p.date);
  const values = series.map(p => Number(p.total_signals || 0));

  const ctx = document.getElementById('timeline-chart').getContext('2d');
  // eslint-disable-next-line no-new
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Regulatory readiness signal (total mentions)',
        data: values,
        borderColor: '#f6c440',
        backgroundColor: 'rgba(246, 196, 64, 0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: series.length > 30 ? 0 : 3,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `${item.parsed.y.toFixed(0)} signal mentions`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#8b949e', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
          grid:  { color: 'rgba(139,148,158,0.08)' },
        },
        y: {
          min: 0,
          ticks: { color: '#8b949e', precision: 0 },
          grid:  { color: 'rgba(139,148,158,0.08)' },
        },
      },
    },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

(async function init() {
  try {
    const [data, ts] = await Promise.all([loadLatest(), loadSnapshots()]);
    renderHeadline(data);
    renderCredentialTable(data);
    renderTimeline(data, ts);
  } catch (err) {
    document.getElementById('hero-score').textContent = '—';
    document.getElementById('hero-score-label').textContent = '';
    document.getElementById('hero-phase').textContent = 'Data unavailable';
    document.getElementById('hero-description').textContent = String(err && err.message ? err.message : err);
    console.error(err);
  }
})();
