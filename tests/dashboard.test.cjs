const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../docs/dashboard.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../docs/index.html'), 'utf8');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/latest.json'), 'utf8'));
async function render(data) {
  const nodes = new Map([...html.matchAll(/id="([^"]+)"/g)].map(([,id]) => [id, {textContent:'',innerHTML:'',style:{},getContext:() => ({id})}]));
  const charts = [];
  const errors = [];
  const context = vm.createContext({
    document: {getElementById: id => { assert.ok(nodes.has(id), `Missing DOM node: ${id}`); return nodes.get(id); }},
    fetch: async () => ({ok:true,json:async() => data}),
    Chart: function(canvas, config) { charts.push({id:canvas.id, ...config}); },
    console: {error:error => errors.push(error)},
  });
  vm.runInContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(errors.length, 0, errors.map(String).join(' | '));
  return {nodes, charts, get:id => nodes.get(id).textContent, context};
}

test('existing published snapshot renders without invented data', async () => {
  const page = await render(structuredClone(baseline));
  assert.ok(page.charts.length > 0);
  assert.doesNotMatch(page.get('hero-score'), /NaN|undefined/);
  for (const chart of page.charts) assert.equal(chart.data.datasets[0].spanGaps, false);
});

test('a missing calendar day remains an explicit chart gap', async () => {
  const data = structuredClone(baseline);
  data.timeseries = [{...data.timeseries.at(-1),date:'2026-09-01'}, {...data.timeseries.at(-1),date:'2026-09-03'}];
  const page = await render(data);
  assert.equal(page.charts[0].data.labels[1], '2026-09-02');
  assert.equal(page.charts[0].data.datasets[0].data[1], null);
});

test('snapshot observation date takes precedence over export date', async () => {
  const data = structuredClone(baseline);
  data.metadata.last_updated = '2099-01-01';
  data.metadata.as_of_date = '2026-08-01';
  const page = await render(data);
  assert.match(page.get('last-updated'), /Observation: 2026-08-01/);
  assert.doesNotMatch(page.get('last-updated'), /2099/);
});

test('unique-job prevalence is primary and raw mention history stays separate', async () => {
  const data = structuredClone(baseline);
  data.headline = {value:7,n_jds:10};
  data.prevalence = {value:0.3,n_matching_jds:3,n_jds:10,matching_companies:2,n_companies:4};
  data.blockchain_requirements = {value:0.1,n_matching_jds:1,n_jds:10,matching_companies:1,n_companies:4};
  data.by_credential = [{credential:'cpa',n:2,pct:0.2,n_companies:1}];
  data.timeseries = [{date:'2026-09-24',total_signals:7,n_jds:10,unique_matching_jds:null,pct:null},{date:'2026-09-25',total_signals:7,n_jds:10,unique_matching_jds:3,pct:0.3}];
  const page = await render(data);
  assert.equal(page.get('hero-score'), '30.0%');
  assert.match(page.get('hero-description'), /2 of 4 companies/);
  assert.match(page.nodes.get('credential-tbody').innerHTML, /20.0%/);
  assert.equal(JSON.stringify(page.charts[0].data.datasets[0].data), '[null,30]');
  assert.equal(JSON.stringify(page.charts[1].data.datasets[0].data), '[7,7]');
});

test('empty sample is unknown; legacy mentions never masquerade as prevalence', async () => {
  const data = structuredClone(baseline);
  delete data.prevalence;
  const legacy = await render(data);
  assert.equal(legacy.get('hero-phase'), 'Legacy mention count');
  assert.doesNotMatch(legacy.get('hero-score'), /%/);
  data.prevalence = {n_matching_jds:0,n_jds:0,n_companies:0,matching_companies:0,value:null};
  assert.equal((await render(data)).get('hero-score'), '—');
});

test('isolated known observations remain visible in sparse long history', async () => {
  const page = await render(structuredClone(baseline));
  vm.runInContext(`lineChart('timeline-chart', Array.from({length: 40}, (_, i) => ({date: String(i)})), Array.from({length: 40}, (_, i) => i === 39 ? 12 : null), 'test')`, page.context);
  const points = page.charts.at(-1).data.datasets[0].pointRadius;
  assert.equal(points[39], 3);
  assert.equal(points[38], 0);
});
