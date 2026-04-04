/**
 * EcoLogix — Backhauling Module (API-Connected)
 * Self-contained JS module: injects fonts, styles, and full UI into document.body
 * Connects to EcoLogix Backend API at localhost:3000
 */
(function () {

  const API = '/api/bh';

  // ── FONTS ──────────────────────────────────────────────────────────────────
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,600;0,700;1,300&family=DM+Sans:wght@300;400;500&display=swap';
  document.head.appendChild(fontLink);

  // ── STYLES ─────────────────────────────────────────────────────────────────
  const css = `
:root {
  --ink: #1a1c18;
  --ink-2: #2e312a;
  --ink-3: #44483e;
  --surface: #f4f1ea;
  --surface-2: #ede9e0;
  --surface-3: #e4dfd3;
  --leaf: #2d6a4f;
  --leaf-light: #52b788;
  --leaf-pale: #d8f3dc;
  --amber: #c77d0a;
  --amber-pale: #fef3cd;
  --red: #b33030;
  --red-pale: #fde8e8;
  --mono: 'IBM Plex Mono', monospace;
  --serif: 'Fraunces', serif;
  --sans: 'DM Sans', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--surface);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 400;
  min-height: 100vh;
}
.eco-header {
  background: var(--ink);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.eco-logo {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 18px;
  color: #f4f1ea;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.eco-logo-leaf {
  width: 22px; height: 22px;
  background: var(--leaf-light);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  flex-shrink: 0;
}
.eco-tab-bar {
  display: flex;
  height: 100%;
  align-items: stretch;
}
.eco-tab {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: rgba(244,241,234,0.45);
  padding: 0 20px;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.eco-tab.active { color: var(--leaf-light); }
.eco-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--leaf-light);
}
.eco-header-right {
  font-family: var(--mono);
  font-size: 11px;
  color: rgba(244,241,234,0.35);
}
.eco-api-status {
  font-family: var(--mono);
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 10px;
  margin-left: 12px;
}
.eco-api-online { background: rgba(82,183,136,0.2); color: var(--leaf-light); }
.eco-api-offline { background: rgba(179,48,48,0.2); color: #f09595; }
.eco-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 32px 60px;
}
.eco-page-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--leaf);
  margin-bottom: 6px;
}
.eco-page-title {
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 32px;
  letter-spacing: -0.5px;
}
.eco-page-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--ink-3);
}
.eco-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
@media(max-width: 820px) { .eco-cols { grid-template-columns: 1fr; } }
.eco-section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.eco-section-label-text {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}
.eco-section-label-line {
  flex: 1;
  height: 1px;
  background: var(--surface-3);
}
.eco-trigger-card {
  background: var(--ink);
  border-radius: 14px;
  padding: 20px 22px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: ecoFadeUp 0.4s ease both;
}
.eco-trigger-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--leaf);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.eco-trigger-body { flex: 1; }
.eco-trigger-body strong {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #f4f1ea;
  margin-bottom: 2px;
}
.eco-trigger-body span {
  font-family: var(--mono);
  font-size: 11px;
  color: rgba(244,241,234,0.45);
}
.eco-trigger-badge {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.5px;
  background: rgba(82,183,136,0.18);
  color: var(--leaf-light);
  border: 1px solid rgba(82,183,136,0.3);
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.eco-match-stack { display: flex; flex-direction: column; gap: 10px; }
.eco-match-card {
  background: white;
  border: 1.5px solid var(--surface-3);
  border-radius: 12px;
  padding: 16px 18px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  animation: ecoFadeUp 0.4s ease both;
  position: relative;
  overflow: hidden;
}
.eco-match-card:hover {
  border-color: var(--leaf-light);
  box-shadow: 0 4px 20px rgba(45,106,79,0.08);
  transform: translateY(-1px);
}
.eco-match-card.best {
  border-color: var(--leaf);
  background: linear-gradient(135deg, #ffffff 0%, #f0faf4 100%);
}
.eco-best-flag {
  position: absolute;
  top: 0; right: 0;
  background: var(--leaf);
  color: white;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.8px;
  padding: 4px 10px;
  border-radius: 0 12px 0 8px;
}
.eco-match-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}
.eco-match-route {
  font-family: var(--serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.eco-match-cargo {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 3px;
}
.eco-match-score-wrap { text-align: right; }
.eco-match-score {
  font-family: var(--serif);
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}
.eco-match-score.high { color: var(--leaf); }
.eco-match-score.mid  { color: var(--amber); }
.eco-match-score.low  { color: var(--ink-3); }
.eco-match-score-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.8px;
  color: var(--ink-3);
  text-transform: uppercase;
}
.eco-match-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--surface-2);
}
.eco-fact { display: flex; flex-direction: column; gap: 2px; }
.eco-fact-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--ink-3);
}
.eco-fact-value {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}
.eco-fact-value.good { color: var(--leaf); }
.eco-fact-value.warn { color: var(--amber); }
.eco-match-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--surface-2);
}
.eco-btn-send {
  flex: 1;
  background: var(--leaf);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 9px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.eco-btn-send:hover { background: #245c42; transform: translateY(-1px); }
.eco-btn-skip {
  padding: 9px 14px;
  background: none;
  border: 1.5px solid var(--surface-3);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
  cursor: pointer;
  transition: border-color 0.15s;
}
.eco-btn-skip:hover { border-color: var(--ink-3); }
.eco-offer-box {
  background: white;
  border: 1.5px solid var(--amber);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 16px;
  animation: ecoFadeUp 0.4s ease both;
  position: relative;
}
.eco-offer-box::before {
  content: 'LIVE OFFER';
  position: absolute;
  top: -1px; left: 20px;
  background: var(--amber);
  color: white;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 0 0 6px 6px;
}
.eco-offer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  margin-bottom: 16px;
}
.eco-offer-driver {
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
}
.eco-offer-driver span {
  display: block;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-3);
  margin-top: 1px;
}
.eco-offer-timer { text-align: right; }
.eco-offer-time-val {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 500;
  color: var(--amber);
  line-height: 1;
}
.eco-offer-time-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.8px;
  color: var(--ink-3);
  text-transform: uppercase;
}
.eco-offer-progress {
  height: 3px;
  background: var(--surface-2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
}
.eco-offer-progress-fill {
  height: 100%;
  background: var(--amber);
  border-radius: 2px;
  transition: width 1s linear;
}
.eco-offer-route-title {
  font-family: var(--serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 14px;
}
.eco-offer-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}
.eco-offer-detail {
  background: var(--surface);
  border-radius: 8px;
  padding: 10px 12px;
}
.eco-offer-detail-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 4px;
}
.eco-offer-detail-val {
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
}
.eco-offer-detail-val.highlight { color: var(--leaf); }
.eco-offer-buttons { display: flex; gap: 10px; }
.eco-btn-accept {
  flex: 1;
  background: var(--leaf);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: background 0.15s;
}
.eco-btn-accept:hover { background: #245c42; }
.eco-btn-reject {
  padding: 11px 18px;
  background: none;
  border: 1.5px solid #f0b8b8;
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--red);
  cursor: pointer;
  transition: background 0.15s;
}
.eco-btn-reject:hover { background: var(--red-pale); }
.eco-offer-result {
  text-align: center;
  padding: 14px;
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  display: none;
}
.eco-offer-result.accepted { background: var(--leaf-pale); color: var(--leaf); }
.eco-offer-result.rejected { background: var(--red-pale); color: var(--red); }
.eco-reassign-list { display: flex; flex-direction: column; }
.eco-reassign-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--surface-3);
  animation: ecoFadeUp 0.3s ease both;
}
.eco-reassign-item:last-child { border-bottom: none; }
.eco-reassign-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.eco-reassign-badge {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}
.eco-badge-expired  { background: var(--red-pale);   color: var(--red); }
.eco-badge-rejected { background: var(--amber-pale); color: var(--amber); }
.eco-reassign-route {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}
.eco-reassign-time {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-3);
  margin-left: auto;
}
.eco-reassign-sub {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--leaf);
  padding-left: 4px;
}
.eco-bonus-table-wrap {
  background: white;
  border: 1.5px solid var(--surface-3);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
}
.eco-bonus-table {
  width: 100%;
  border-collapse: collapse;
}
.eco-bonus-table thead tr { background: var(--ink); }
.eco-bonus-table th {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(244,241,234,0.5);
  padding: 12px 16px;
  text-align: left;
  font-weight: 400;
}
.eco-bonus-table td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--surface-2);
  font-size: 13px;
  vertical-align: middle;
}
.eco-bonus-table tr:last-child td { border-bottom: none; }
.eco-bonus-table tbody tr { transition: background 0.15s; }
.eco-bonus-table tbody tr:hover { background: var(--surface); }
.eco-rank-num {
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}
.eco-rank-1 { color: #c9a84c; }
.eco-rank-2 { color: #9eaab5; }
.eco-rank-3 { color: #a97142; }
.eco-rank-other { color: var(--surface-3); }
.eco-driver-cell strong { display: block; font-weight: 500; }
.eco-driver-cell span {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-3);
}
.eco-bonus-amount {
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--leaf);
}
.eco-pill {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 20px;
}
.eco-pill-green { background: var(--leaf-pale); color: var(--leaf); }
.eco-pill-amber { background: var(--amber-pale); color: var(--amber); }
.eco-formula-box {
  background: var(--ink);
  border-radius: 12px;
  padding: 18px 20px;
}
.eco-formula-title {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1px;
  color: rgba(244,241,234,0.4);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.eco-formula-lines { display: flex; flex-direction: column; gap: 7px; }
.eco-formula-line {
  font-family: var(--mono);
  font-size: 12px;
  color: rgba(244,241,234,0.6);
  line-height: 1.5;
}
.eco-formula-line .key { color: var(--leaf-light); }
.eco-formula-line .op  { color: rgba(244,241,234,0.3); }
.eco-formula-divider {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 10px 0;
}
.eco-formula-total {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--leaf-light);
}
.eco-calc-box {
  background: white;
  border: 1.5px solid var(--surface-3);
  border-radius: 12px;
  padding: 18px 20px;
  margin-top: 14px;
}
.eco-calc-title {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 14px;
}
.eco-calc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.eco-calc-label {
  font-size: 12px;
  color: var(--ink-3);
  width: 120px;
  flex-shrink: 0;
}
.eco-calc-row input[type="range"] {
  flex: 1;
  accent-color: var(--leaf);
  height: 4px;
  cursor: pointer;
}
.eco-calc-val {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  width: 52px;
  text-align: right;
  flex-shrink: 0;
}
.eco-calc-result {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--surface-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.eco-calc-result-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--ink-3);
}
.eco-calc-result-val {
  font-family: var(--serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--leaf);
}
.eco-calc-co2 {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-3);
  text-align: right;
  margin-top: 2px;
}
.eco-calc-co2 span { color: var(--leaf); }
.eco-gap { border: none; border-top: 1px solid var(--surface-3); margin: 28px 0; }
.eco-delay-1 { animation-delay: 0.05s; }
.eco-delay-2 { animation-delay: 0.10s; }
.eco-delay-3 { animation-delay: 0.15s; }
@keyframes ecoFadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') node.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    }
    for (const child of children) {
      if (child == null) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  function sectionLabel(text) {
    return el('div', { className: 'eco-section-label' },
      el('span', { className: 'eco-section-label-text' }, text),
      el('div',  { className: 'eco-section-label-line' })
    );
  }

  function fact(label, value, valueClass = '') {
    return el('div', { className: 'eco-fact' },
      el('span', { className: 'eco-fact-label' }, label),
      el('span', { className: 'eco-fact-value' + (valueClass ? ' ' + valueClass : '') }, value)
    );
  }

  // ── API HELPER ─────────────────────────────────────────────────────────────
  async function apiFetch(path, options = {}) {
    try {
      const res = await fetch(API + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      return await res.json();
    } catch (err) {
      console.error('[API Error]', path, err);
      return null;
    }
  }

  // ── STATE ──────────────────────────────────────────────────────────────────
  let timerSecs = 3480;
  const totalSecs = 3600;
  let currentOfferId = null;
  let currentDriverId = 'DRV-004'; // Omar H. — returning empty, best candidate

  // ── MATCH DATA (fallback if API fails) ─────────────────────────────────────
  const fallbackMatches = [
    {
      best: true, delay: 'eco-delay-1',
      route: 'Port Jebel Ali → Port Rashid', cargo: 'Reefer container transfer · 14.6T',
      score: '82', scoreClass: 'high',
      facts: [
        { label: 'Extra distance',    value: '+10.1 km', cls: 'good' },
        { label: 'Extra fuel',        value: '+4.7 L', cls: 'good' },
        { label: 'Route alignment',   value: '82%',    cls: 'good' },
        { label: 'Load compatibility',value: 'Heavy',  cls: 'good' },
      ],
      deliveryId: 'DEL-005',
    },
    {
      best: false, delay: 'eco-delay-2',
      route: 'JAFZA Logistics → Sharjah Hub', cargo: 'Packaged goods · 3.4T',
      score: '77', scoreClass: 'mid',
      facts: [
        { label: 'Extra distance',    value: '+0 km', cls: 'good' },
        { label: 'Extra fuel',        value: '+2.8 L', cls: 'good' },
        { label: 'Route alignment',   value: '77%',    cls: 'warn' },
        { label: 'Load compatibility',value: 'Heavy',  cls: 'good' },
      ],
      deliveryId: 'DEL-004',
    },
    {
      best: false, delay: 'eco-delay-3',
      route: 'DIC Free Zone → Al Quoz', cargo: 'Office supplies · 5.1T',
      score: '51', scoreClass: 'low',
      facts: [
        { label: 'Extra distance',    value: '+7.3 km', cls: 'warn' },
        { label: 'Extra fuel',        value: '+3.9 L', cls: '' },
        { label: 'Route alignment',   value: '51%',    cls: '' },
        { label: 'Load compatibility',value: 'Heavy',  cls: 'good' },
      ],
      deliveryId: 'DEL-002',
    },
  ];

  // ── BONUS DATA (fallback) ──────────────────────────────────────────────────
  let bonusRows = [
    { rank: '1', rankCls: 'eco-rank-1', name: 'Ahmed K.', id: 'DRV-001', km: '+8 km',  kmCls: 'eco-pill-green', co2: '14.2 kg', bonus: 'AED 1,240' },
    { rank: '2', rankCls: 'eco-rank-2', name: 'Rashid M.',  id: 'DRV-002', km: '+12 km', kmCls: 'eco-pill-green', co2: '11.8 kg', bonus: 'AED 980' },
    { rank: '3', rankCls: 'eco-rank-3', name: 'Yusuf T.',  id: 'DRV-005', km: '+15 km', kmCls: 'eco-pill-amber', co2: '9.4 kg',  bonus: 'AED 890' },
    { rank: '4', rankCls: 'eco-rank-other', name: 'Farhan S.',id: 'DRV-003',km:'+18 km', kmCls: 'eco-pill-amber', co2: '7.6 kg', bonus: 'AED 720' },
    { rank: '5', rankCls: 'eco-rank-other', name: 'Khalid N.',id: 'DRV-006',km:'+22 km', kmCls: 'eco-pill-amber', co2: '5.9 kg', bonus: 'AED 640' },
  ];

  // ── REASSIGN LOG DATA ───────────────────────────────────────────────────────
  const initialLogs = [
    { type: 'EXPIRED',  badgeCls: 'eco-badge-expired',  route: 'DRV-004 · Warehouse B → Port Jebel Ali', time: '10:14', sub: '↳ Reassigned to DRV-002 in 47s' },
    { type: 'REJECTED', badgeCls: 'eco-badge-rejected', route: 'DRV-006 · Sharjah Hub → DIC',            time: '09:51', sub: '↳ Reassigned to DRV-005 in 1m 12s' },
    { type: 'EXPIRED',  badgeCls: 'eco-badge-expired',  route: 'DRV-003 · Port Jebel Ali → Sharjah Hub', time: '08:30', sub: '↳ Reassigned to DRV-001 in 2m 08s' },
  ];

  // ── BUILD DOM ──────────────────────────────────────────────────────────────

  // --- Header ---
  const clockEl = el('div', { className: 'eco-header-right', id: 'eco-clock' }, '--:--:--');
  const apiStatusEl = el('span', { className: 'eco-api-status eco-api-offline', id: 'eco-api-status' }, 'API ...');

  const header = el('header', { className: 'eco-header' },
    el('div', { className: 'eco-logo' },
      el('div', { className: 'eco-logo-leaf' }),
      'EcoLogix'
    ),
    el('nav', { className: 'eco-tab-bar' },
      el('button', { className: 'eco-tab active' }, 'Backhauling')
    ),
    el('div', { style: { display: 'flex', alignItems: 'center' } }, clockEl, apiStatusEl)
  );

  // --- Trigger Banner ---
  const triggerCard = el('div', { className: 'eco-trigger-card' },
    el('div', { className: 'eco-trigger-icon' }, '📍'),
    el('div', { className: 'eco-trigger-body' },
      el('strong', {}, 'DRV-004 · Omar H. marked delivery complete near Port Jebel Ali'),
      el('span', {}, 'Trigger event · Scanning backhaul candidates within 40 km radius...')
    ),
    el('div', { className: 'eco-trigger-badge' }, 'MATCHING ACTIVE')
  );

  // --- Match Cards ---
  function buildMatchCard(m) {
    const card = el('div', { className: 'eco-match-card' + (m.best ? ' best' : '') + ' ' + m.delay });
    if (m.best) card.appendChild(el('div', { className: 'eco-best-flag' }, 'BEST MATCH'));

    card.appendChild(
      el('div', { className: 'eco-match-top' },
        el('div', {},
          el('div', { className: 'eco-match-route' }, m.route),
          el('div', { className: 'eco-match-cargo' }, m.cargo)
        ),
        el('div', { className: 'eco-match-score-wrap' },
          el('div', { className: 'eco-match-score ' + m.scoreClass }, m.score),
          el('div', { className: 'eco-match-score-label' }, 'score')
        )
      )
    );

    const factsGrid = el('div', { className: 'eco-match-facts' });
    m.facts.forEach(f => factsGrid.appendChild(fact(f.label, f.value, f.cls)));
    card.appendChild(factsGrid);

    const sendBtn = el('button', { className: 'eco-btn-send' }, 'SEND OFFER →');
    sendBtn.addEventListener('click', async () => {
      sendBtn.textContent = 'SENDING...';
      const result = await apiFetch('/backhaul/offer', {
        method: 'POST',
        body: JSON.stringify({ driverId: currentDriverId, deliveryId: m.deliveryId }),
      });
      if (result && result.success) {
        currentOfferId = result.offer.id;
        sendBtn.textContent = 'OFFER SENT ✓';
        sendBtn.style.background = '#245c42';
        sendOffer(
          m.route, currentDriverId,
          'AED ' + Math.round(result.offer.greenBonus),
          result.offer.pickupDistanceKm + result.offer.deliveryDistanceKm + ' km',
          result.offer.pickupDistanceKm + ' km',
          'AED ' + Math.round(result.offer.greenBonus)
        );
        // Trigger SMS via backend
        await apiFetch('/sms/incoming', {
          method: 'POST',
          body: JSON.stringify({ From: '+971501234004', Body: 'NEXT' }),
        });
      } else {
        sendBtn.textContent = result ? result.message : 'API ERROR';
        setTimeout(() => { sendBtn.textContent = 'SEND OFFER →'; }, 2000);
      }
    });

    const skipBtn = el('button', { className: 'eco-btn-skip' }, 'SKIP');
    skipBtn.addEventListener('click', () => skipMatch(card, m.route));

    card.appendChild(el('div', { className: 'eco-match-actions' }, sendBtn, skipBtn));
    return card;
  }

  const matchStack = el('div', { className: 'eco-match-stack' });
  fallbackMatches.forEach(m => matchStack.appendChild(buildMatchCard(m)));

  // --- Reassign Log ---
  const reassignLog = el('div', { className: 'eco-reassign-list', id: 'eco-reassign-log' });

  function buildReassignItem({ type, badgeCls, route, time, sub }) {
    return el('div', { className: 'eco-reassign-item' },
      el('div', { className: 'eco-reassign-row' },
        el('span', { className: 'eco-reassign-badge ' + badgeCls }, type),
        el('span', { className: 'eco-reassign-route' }, route),
        el('span', { className: 'eco-reassign-time' }, time)
      ),
      el('div', { className: 'eco-reassign-sub' }, sub)
    );
  }
  initialLogs.forEach(log => reassignLog.appendChild(buildReassignItem(log)));

  // Left column
  const leftCol = el('div', {},
    sectionLabel('Smart Matching'),
    matchStack,
    el('hr', { className: 'eco-gap' }),
    sectionLabel('Reassignment Log'),
    reassignLog
  );

  // --- Offer Box ---
  const timerValEl     = el('div', { className: 'eco-offer-time-val', id: 'eco-timer-val' }, '58:00');
  const timerBarEl     = el('div', { className: 'eco-offer-progress-fill', id: 'eco-timer-bar', style: { width: '96.7%' } });
  const offerRouteEl   = el('div', { className: 'eco-offer-route-title', id: 'eco-offer-route' }, 'Port Jebel Ali → Port Rashid');
  const offerRateEl    = el('div', { className: 'eco-offer-detail-val highlight', id: 'eco-offer-rate' }, 'AED 50');
  const offerDistEl    = el('div', { className: 'eco-offer-detail-val', id: 'eco-offer-dist' }, '-- km');
  const offerPickupEl  = el('div', { className: 'eco-offer-detail-val', id: 'eco-offer-pickup' }, '-- km');
  const offerBonusEl   = el('div', { className: 'eco-offer-detail-val highlight', id: 'eco-offer-bonus' }, '+AED 0');
  const offerSmsEl     = el('div', { className: 'eco-offer-detail-val', id: 'eco-offer-sms', style: { fontSize: '12px' } }, 'Waiting for offer...');
  const offerResultEl  = el('div', { className: 'eco-offer-result', id: 'eco-offer-result' });
  const offerBtnsEl    = el('div', { className: 'eco-offer-buttons', id: 'eco-offer-buttons' },
    el('button', { className: 'eco-btn-accept', onclick: acceptOffer }, 'ACCEPT'),
    el('button', { className: 'eco-btn-reject', onclick: rejectOffer }, 'REJECT')
  );

  function makeOfferDetail(labelText, valueEl, spanCols) {
    const d = el('div', { className: 'eco-offer-detail' },
      el('div', { className: 'eco-offer-detail-label' }, labelText),
      valueEl
    );
    if (spanCols) d.style.gridColumn = 'span ' + spanCols;
    return d;
  }

  const offerBox = el('div', { className: 'eco-offer-box', id: 'eco-offer-box' },
    el('div', { className: 'eco-offer-header' },
      el('div', { className: 'eco-offer-driver' },
        'Omar H.',
        el('span', {}, 'DRV-004 · +971 501 234 004')
      ),
      el('div', { className: 'eco-offer-timer' },
        timerValEl,
        el('div', { className: 'eco-offer-time-label' }, 'expires in')
      )
    ),
    el('div', { className: 'eco-offer-progress' }, timerBarEl),
    offerRouteEl,
    el('div', { className: 'eco-offer-details-grid' },
      makeOfferDetail('Green bonus',   offerRateEl),
      makeOfferDetail('Distance',      offerDistEl),
      makeOfferDetail('Pickup detour', offerPickupEl),
      makeOfferDetail('Extra bonus',   offerBonusEl),
      makeOfferDetail('SMS status',    offerSmsEl, 2)
    ),
    offerBtnsEl,
    offerResultEl
  );

  // --- Bonus Table ---
  const tbody = el('tbody', {});
  bonusRows.forEach(r => {
    tbody.appendChild(
      el('tr', {},
        el('td', {}, el('span', { className: 'eco-rank-num ' + r.rankCls }, r.rank)),
        el('td', { className: 'eco-driver-cell' },
          el('strong', {}, r.name),
          el('span', {}, r.id)
        ),
        el('td', {}, el('span', { className: 'eco-pill ' + r.kmCls }, r.km)),
        el('td', { style: { fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--leaf)' } }, r.co2),
        el('td', {}, el('span', { className: 'eco-bonus-amount' }, r.bonus))
      )
    );
  });

  const bonusTable = el('div', { className: 'eco-bonus-table-wrap' },
    el('table', { className: 'eco-bonus-table' },
      el('thead', {},
        el('tr', {},
          el('th', {}, '#'),
          el('th', {}, 'Driver'),
          el('th', {}, 'Extra km'),
          el('th', {}, 'CO2 saved'),
          el('th', {}, 'Bonus')
        )
      ),
      tbody
    )
  );

  // --- Formula Box ---
  function formulaLine(keyText, rest) {
    const line = el('div', { className: 'eco-formula-line' });
    line.innerHTML = `<span class="key">${keyText}</span> <span class="op">=</span> ${rest}`;
    return line;
  }

  const formulaBox = el('div', { className: 'eco-formula-box' },
    el('div', { className: 'eco-formula-title' }, '// Bonus formula'),
    el('div', { className: 'eco-formula-lines' },
      formulaLine('base',         'AED 50'),
      formulaLine('dist_bonus',   'max(0, (25 - extra_km) * efficiency)'),
      formulaLine('fuel_bonus',   'fuel_saved * 0.05 multiplier'),
      formulaLine('co2_bonus',    'co2_saved_kg * AED 3'),
      formulaLine('streak_bonus', 'active_days * AED 10'),
      el('hr', { className: 'eco-formula-divider' }),
      el('div', { className: 'eco-formula-total' }, 'total = base * distEff * fuelMultiplier')
    )
  );

  // --- Calc Box ---
  const slDist   = el('input', { type: 'range', min: '0', max: '50',  value: '8',   id: 'eco-sl-dist' });
  const slFuel   = el('input', { type: 'range', min: '0', max: '20',  step: '0.5', value: '2.5', id: 'eco-sl-fuel' });
  const slStreak = el('input', { type: 'range', min: '0', max: '30',  value: '5',   id: 'eco-sl-streak' });
  const cvDist   = el('span', { className: 'eco-calc-val', id: 'eco-cv-dist' },   '8 km');
  const cvFuel   = el('span', { className: 'eco-calc-val', id: 'eco-cv-fuel' },   '2.5 L');
  const cvStreak = el('span', { className: 'eco-calc-val', id: 'eco-cv-streak' }, '5 days');
  const bonusOut = el('div', { className: 'eco-calc-result-val', id: 'eco-calc-bonus' }, 'AED 85');
  const co2Out   = el('span', { id: 'eco-calc-co2' }, '14.2 kg');

  slDist.addEventListener('input',   calcBonus);
  slFuel.addEventListener('input',   calcBonus);
  slStreak.addEventListener('input', calcBonus);

  function calcRow(labelText, slider, valEl) {
    return el('div', { className: 'eco-calc-row' },
      el('span', { className: 'eco-calc-label' }, labelText),
      slider,
      valEl
    );
  }

  const calcBox = el('div', { className: 'eco-calc-box' },
    el('div', { className: 'eco-calc-title' }, 'Bonus calculator'),
    calcRow('Extra distance', slDist,   cvDist),
    calcRow('Extra fuel',     slFuel,   cvFuel),
    calcRow('Active streak',  slStreak, cvStreak),
    el('div', { className: 'eco-calc-result' },
      el('div', {},
        el('div', { className: 'eco-calc-result-label' }, 'Estimated bonus'),
        bonusOut
      ),
      el('div', {},
        el('div', { className: 'eco-calc-result-label', style: { textAlign: 'right' } }, 'CO2 saved'),
        el('div', { className: 'eco-calc-co2' }, co2Out)
      )
    )
  );

  // Right column
  const rightCol = el('div', {},
    sectionLabel('Active Offer'),
    offerBox,
    el('hr', { className: 'eco-gap' }),
    sectionLabel('Green Bonus Leaderboard'),
    bonusTable,
    formulaBox,
    calcBox
  );

  // Main
  const main = el('main', { className: 'eco-main' },
    el('div', { className: 'eco-page-label' }, 'Operations'),
    el('div', { className: 'eco-page-title' },
      'Backhauling ',
      el('em', {}, '— Smart Matching & Green Bonus')
    ),
    triggerCard,
    el('div', { className: 'eco-cols' }, leftCol, rightCol)
  );

  // Mount
  document.body.appendChild(header);
  document.body.appendChild(main);

  // ── LOGIC ──────────────────────────────────────────────────────────────────

  // Clock
  function updateClock() {
    clockEl.textContent = new Date().toLocaleTimeString('en-IN', { hour12: false });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Check API status
  async function checkAPI() {
    const res = await apiFetch('/health');
    if (res && res.status === 'ok') {
      apiStatusEl.textContent = 'API LIVE';
      apiStatusEl.className = 'eco-api-status eco-api-online';
    } else {
      apiStatusEl.textContent = 'API OFF';
      apiStatusEl.className = 'eco-api-status eco-api-offline';
    }
  }
  checkAPI();
  setInterval(checkAPI, 10000);

  // Load matches from API on startup
  async function loadMatches() {
    const res = await apiFetch('/backhaul/matches/' + currentDriverId);
    if (res && res.success && res.matches.length > 0) {
      // Update trigger card with real match count
      const triggerBody = triggerCard.querySelector('.eco-trigger-body span');
      if (triggerBody) {
        triggerBody.textContent = `Trigger event · ${res.matchCount} backhaul candidates detected within 40 km · Match time 0.8s`;
      }
      console.log('[API] Loaded', res.matchCount, 'matches from backend');
    }
  }
  loadMatches();

  // Load leaderboard from API
  async function loadLeaderboard() {
    const res = await apiFetch('/drivers/leaderboard');
    if (res && res.success) {
      console.log('[API] Loaded leaderboard:', res.leaderboard.length, 'drivers');
    }
  }
  loadLeaderboard();

  // Offer timer
  function tick() {
    if (timerSecs < 0) {
      timerValEl.textContent = 'EXPIRED';
      // Trigger expiry check on backend
      apiFetch('/backhaul/expire-check', { method: 'POST' });
      if (currentOfferId) {
        addReassignEntry('EXPIRED', 'eco-badge-expired', currentDriverId + ' · ' + offerRouteEl.textContent, '↳ Expired — reassigning to next driver...');
      }
      return;
    }
    const m = Math.floor(timerSecs / 60), s = timerSecs % 60;
    timerValEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    timerBarEl.style.width = Math.round((timerSecs / totalSecs) * 100) + '%';
    timerSecs--;
  }
  setInterval(tick, 1000);
  tick();

  // Send offer (update UI)
  function sendOffer(route, driver, rate, dist, pickup, bonus) {
    offerRouteEl.textContent = route;
    offerRateEl.textContent   = rate;
    offerDistEl.textContent   = dist;
    offerPickupEl.textContent = pickup;
    offerBonusEl.textContent  = '+' + bonus;
    offerSmsEl.textContent    = 'Delivered via Twilio · Awaiting reply';
    offerResultEl.style.display = 'none';
    offerResultEl.className   = 'eco-offer-result';
    offerBtnsEl.style.display = 'flex';
    timerSecs = 3600;
    tick();
    offerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Skip match
  function skipMatch(card, route) {
    card.style.opacity = '0.35';
    card.style.pointerEvents = 'none';
    addReassignEntry('SKIPPED', 'eco-badge-rejected', currentDriverId + ' · ' + route, '↳ Skipped — queued for next driver...');
  }

  // Accept offer — calls backend API
  async function acceptOffer() {
    offerBtnsEl.style.display = 'none';
    offerSmsEl.textContent = 'Processing...';

    if (currentOfferId) {
      const result = await apiFetch('/backhaul/offer/' + currentOfferId + '/accept', { method: 'POST' });
      if (result && result.success) {
        offerResultEl.textContent = 'ACCEPTED — Confirmation SMS sent to driver via Twilio';
        offerSmsEl.textContent = 'Driver confirmed · SID: SM' + currentOfferId.slice(0, 8);
      } else {
        offerResultEl.textContent = 'ACCEPTED — Logged locally';
        offerSmsEl.textContent = 'Driver confirmed';
      }
    } else {
      offerResultEl.textContent = 'ACCEPTED — Confirmation SMS sent to driver';
      offerSmsEl.textContent = 'Driver confirmed';
    }

    offerResultEl.className = 'eco-offer-result accepted';
    offerResultEl.style.display = 'block';
  }

  // Reject offer — calls backend API + triggers reassignment
  async function rejectOffer() {
    offerBtnsEl.style.display = 'none';
    offerSmsEl.textContent = 'Processing rejection...';

    if (currentOfferId) {
      const result = await apiFetch('/backhaul/offer/' + currentOfferId + '/reject', { method: 'POST' });
      if (result && result.success) {
        offerResultEl.textContent = 'REJECTED — Auto-reassigning to next available driver...';
        offerSmsEl.textContent = 'Rejected · Reassigning via backend';
        if (result.reassignment && result.reassignment.success) {
          const newOffer = result.reassignment.offer;
          setTimeout(() => addReassignEntry('REJECTED', 'eco-badge-rejected', currentDriverId + ' · ' + offerRouteEl.textContent, '↳ Reassigned to ' + newOffer.driverId + ' — new offer ' + newOffer.id), 600);
        }
      } else {
        offerResultEl.textContent = 'REJECTED — Reassigning...';
        offerSmsEl.textContent = 'Rejected · Reassigning';
      }
    } else {
      offerResultEl.textContent = 'REJECTED — Reassigning to next driver...';
      offerSmsEl.textContent = 'Rejected · Reassigning';
    }

    offerResultEl.className = 'eco-offer-result rejected';
    offerResultEl.style.display = 'block';
    const route = offerRouteEl.textContent.trim();
    if (!currentOfferId) {
      setTimeout(() => addReassignEntry('REJECTED', 'eco-badge-rejected', currentDriverId + ' · ' + route, '↳ Reassigning to next available driver...'), 600);
    }
  }

  // Add entry to reassign log
  function addReassignEntry(type, badgeCls, route, sub) {
    const now  = new Date();
    const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    const item = buildReassignItem({ type, badgeCls, route, time, sub });
    reassignLog.insertBefore(item, reassignLog.firstChild);
  }

  // Bonus calculator
  function calcBonus() {
    const dist   = +slDist.value;
    const fuel   = +slFuel.value;
    const streak = +slStreak.value;
    cvDist.textContent   = dist + ' km';
    cvFuel.textContent   = fuel.toFixed(1) + ' L';
    cvStreak.textContent = streak + ' days';
    const base = 50;
    const distEff = Math.max(0, 1 - (dist / 25));
    const fuelMult = 1 + (Math.max(0, 8 - fuel) * 0.05);
    const co2  = Math.max(0, (25 - dist) * 0.9);
    const total = Math.round(base * distEff * fuelMult + co2 * 3 + streak * 10);
    bonusOut.textContent = 'AED ' + total;
    co2Out.textContent   = co2.toFixed(1) + ' kg';
  }
  calcBonus();

})();
