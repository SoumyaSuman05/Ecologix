/**
 * EcoLogix.ai — Sustainable Logistics Dashboard
 * Self-contained JS module. Drop into any page:
 *
 *   <div id="ecologix-root"></div>
 *   <script src="ecologix-dashboard.js"></script>
 *
 * Dependencies loaded automatically: Chart.js 4.4.1, Google Fonts.
 * Mounts into #ecologix-root (or document.body if absent).
 */

(function () {
  'use strict';

  const BASE_URL = "";

// Test backend connection
fetch(`${BASE_URL}/api/dashboard`)
  .then(res => res.json())
  .then(data => {
    console.log("✅ Backend connected:", data);
  })
  .catch(err => console.error("❌ Error:", err));

  /* ═══════════════════════════════════════════════════════════════
     1. DEPENDENCY LOADER
  ═══════════════════════════════════════════════════════════════ */
  function loadDeps(onReady) {
    const fontsHref =
      'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700' +
      '&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap';
    const chartSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';

    if (!document.querySelector(`link[href="${fontsHref}"]`)) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect);

      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = fontsHref;
      document.head.appendChild(fontLink);
    }

    if (window.Chart) {
      onReady();
    } else {
      const script = document.createElement('script');
      script.src = chartSrc;
      script.onload = onReady;
      document.head.appendChild(script);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. CSS INJECTION
  ═══════════════════════════════════════════════════════════════ */
  function injectStyles() {
    const css = `
:root {
  --elx-bg: #0a0f0a;
  --elx-surface: #0f1a0f;
  --elx-surface2: #141f14;
  --elx-surface3: #1a2a1a;
  --elx-border: #1e2e1e;
  --elx-border2: #243524;
  --elx-green: #2dff6f;
  --elx-green2: #1aed5a;
  --elx-green-dim: rgba(45,255,111,0.12);
  --elx-green-glow: rgba(45,255,111,0.35);
  --elx-amber: #f5a623;
  --elx-amber-dim: rgba(245,166,35,0.12);
  --elx-red: #ff4545;
  --elx-red-dim: rgba(255,69,69,0.12);
  --elx-blue: #4da6ff;
  --elx-blue-dim: rgba(77,166,255,0.12);
  --elx-text: #e8f5e8;
  --elx-text2: #8aab8a;
  --elx-text3: #4a6a4a;
  --elx-mono: 'Space Mono', monospace;
  --elx-sans: 'DM Sans', sans-serif;
  --elx-display: 'Bebas Neue', sans-serif;
}

#ecologix-root *, #ecologix-root *::before, #ecologix-root *::after {
  box-sizing: border-box; margin: 0; padding: 0;
}

#ecologix-root {
  background: var(--elx-bg);
  color: var(--elx-text);
  font-family: var(--elx-sans);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

#ecologix-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(45,255,111,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45,255,111,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* ── HEADER ── */
.elx-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,15,10,0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--elx-border2);
  padding: 0 28px; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.elx-logo { display: flex; align-items: center; gap: 10px; }
.elx-logo-icon {
  width: 32px; height: 32px; background: var(--elx-green);
  border-radius: 6px; display: flex; align-items: center;
  justify-content: center; font-size: 16px;
}
.elx-logo-text {
  font-family: var(--elx-display); font-size: 22px;
  letter-spacing: 1px; color: var(--elx-text);
}
.elx-logo-text span { color: var(--elx-green); }
.elx-header-right { display: flex; align-items: center; gap: 20px; }
.elx-live-badge {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--elx-mono); font-size: 11px; color: var(--elx-green);
  padding: 4px 10px; border: 1px solid var(--elx-green-dim);
  border-radius: 20px; background: var(--elx-green-dim);
}
.elx-live-dot {
  width: 7px; height: 7px; background: var(--elx-green);
  border-radius: 50%; animation: elx-pulse 1.5s infinite;
}
@keyframes elx-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.5; transform:scale(0.7); }
}
.elx-header-time { font-family: var(--elx-mono); font-size: 12px; color: var(--elx-text3); }

/* ── DASH GRID ── */
.elx-dash {
  position: relative; z-index: 1;
  padding: 20px 28px 40px; display: grid; gap: 16px;
}

/* ── STAT ROW ── */
.elx-stat-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.elx-stat-card {
  background: var(--elx-surface); border: 1px solid var(--elx-border2);
  border-radius: 12px; padding: 20px; position: relative; overflow: hidden;
}
.elx-stat-card::before {
  content: ''; position: absolute; top:0; left:0; right:0; height:2px;
}
.elx-stat-card.green::before { background: var(--elx-green); }
.elx-stat-card.amber::before { background: var(--elx-amber); }
.elx-stat-card.blue::before  { background: var(--elx-blue);  }
.elx-stat-card.red::before   { background: var(--elx-red);   }
.elx-stat-label {
  font-size: 11px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--elx-text2); margin-bottom: 8px;
  font-family: var(--elx-mono);
}
.elx-stat-value { font-family: var(--elx-display); font-size: 46px; line-height:1; margin-bottom:4px; }
.elx-stat-card.green .elx-stat-value { color: var(--elx-green); }
.elx-stat-card.amber .elx-stat-value { color: var(--elx-amber); }
.elx-stat-card.blue  .elx-stat-value { color: var(--elx-blue);  }
.elx-stat-card.red   .elx-stat-value { color: var(--elx-red);   }
.elx-stat-unit  { font-size:13px; color:var(--elx-text3); font-family:var(--elx-mono); }
.elx-stat-delta {
  position:absolute; top:16px; right:16px;
  font-family:var(--elx-mono); font-size:10px; padding:3px 7px; border-radius:10px;
}
.elx-delta-up   { background:var(--elx-green-dim); color:var(--elx-green); }
.elx-delta-down { background:var(--elx-red-dim);   color:var(--elx-red);   }
.elx-sparkline { position:absolute; bottom:0; left:0; right:0; height:40px; opacity:.25; }

/* ── GRID HELPERS ── */
.elx-two-col   { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.elx-three-col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }

/* ── PANEL ── */
.elx-panel {
  background:var(--elx-surface); border:1px solid var(--elx-border2);
  border-radius:12px; overflow:hidden;
}
.elx-panel-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; border-bottom:1px solid var(--elx-border);
}
.elx-panel-title {
  font-family:var(--elx-mono); font-size:11px;
  text-transform:uppercase; letter-spacing:1.5px; color:var(--elx-text2);
}
.elx-panel-badge {
  font-family:var(--elx-mono); font-size:10px; padding:3px 8px;
  border-radius:8px; background:var(--elx-green-dim); color:var(--elx-green);
  border:1px solid rgba(45,255,111,0.2);
}
.elx-panel-body { padding:16px 18px; }

/* ── MAP ── */
#elx-mapCanvas { width:100%; height:320px; display:block; border-radius:0 0 12px 12px; }
.elx-map-legend {
  display:flex; gap:16px; padding:10px 18px; border-bottom:1px solid var(--elx-border);
}
.elx-legend-item {
  display:flex; align-items:center; gap:6px;
  font-size:11px; font-family:var(--elx-mono); color:var(--elx-text2);
}
.elx-legend-line { width:24px; height:2px; border-radius:2px; }
.elx-legend-dot  { width:10px; height:10px; border-radius:50%; }

/* ── ROUTE COMPARISON ── */
.elx-route-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.elx-route-col {
  background:var(--elx-surface2); border-radius:8px;
  padding:14px; border:1px solid var(--elx-border);
}
.elx-route-col-title {
  font-family:var(--elx-mono); font-size:10px;
  text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px;
}
.elx-eco-route .elx-route-col-title { color:var(--elx-green); }
.elx-std-route .elx-route-col-title { color:var(--elx-text3); }
.elx-route-metric {
  display:flex; justify-content:space-between; align-items:center;
  padding:6px 0; border-bottom:1px solid var(--elx-border); font-size:12px;
}
.elx-route-metric:last-child { border-bottom:none; }
.elx-rm-label { color:var(--elx-text3); font-family:var(--elx-mono); font-size:10px; }
.elx-rm-val   { color:var(--elx-text);  font-family:var(--elx-mono); font-size:12px; font-weight:700; }
.elx-eco-route .elx-rm-val { color:var(--elx-green); }

/* ── WEIGHT ROUTING ── */
.elx-weight-items { display:flex; flex-direction:column; gap:10px; }
.elx-weight-item {
  background:var(--elx-surface2); border-radius:8px;
  padding:12px 14px; border:1px solid var(--elx-border);
}
.elx-weight-header { display:flex; justify-content:space-between; margin-bottom:8px; }
.elx-weight-id { font-family:var(--elx-mono); font-size:11px; color:var(--elx-text2); }
.elx-weight-kg { font-family:var(--elx-mono); font-size:11px; color:var(--elx-amber); }
.elx-weight-bar-bg { height:6px; background:var(--elx-border); border-radius:3px; overflow:hidden; }
.elx-weight-bar-fill { height:100%; border-radius:3px; transition:width .5s ease; }
.elx-weight-note { margin-top:6px; font-size:10px; color:var(--elx-text3); font-family:var(--elx-mono); }

/* ── CHARTS ── */
.elx-chart-wrap { position:relative; height:180px; }

/* ── GOAL TRACKER ── */
.elx-goal-section { padding:16px 18px; }
.elx-goal-header { display:flex; justify-content:space-between; margin-bottom:10px; align-items:flex-end; }
.elx-goal-label { font-size:13px; color:var(--elx-text2); }
.elx-goal-pct   { font-family:var(--elx-display); font-size:36px; color:var(--elx-green); }
.elx-goal-bar-bg {
  height:12px; background:var(--elx-surface3); border-radius:6px;
  overflow:hidden; position:relative;
}
.elx-goal-bar-fill {
  height:100%; background:linear-gradient(90deg,var(--elx-green2),var(--elx-green));
  border-radius:6px; box-shadow:0 0 12px var(--elx-green-glow); transition:width 2s ease;
}
.elx-goal-bar-target {
  position:absolute; top:-4px; height:20px; width:2px; background:var(--elx-amber);
}
.elx-goal-sub {
  margin-top:8px; font-family:var(--elx-mono); font-size:10px;
  color:var(--elx-text3); display:flex; justify-content:space-between;
}

/* ── TABLE ── */
.elx-shipments-table { width:100%; border-collapse:collapse; font-size:12px; }
.elx-shipments-table th {
  font-family:var(--elx-mono); font-size:9px; text-transform:uppercase;
  letter-spacing:1.5px; color:var(--elx-text3); padding:8px 10px;
  text-align:left; border-bottom:1px solid var(--elx-border);
}
.elx-shipments-table td {
  padding:9px 10px; border-bottom:1px solid rgba(30,46,30,.5);
  color:var(--elx-text2); font-family:var(--elx-mono); font-size:11px;
}
.elx-shipments-table tr:hover td { background:var(--elx-surface2); }
.elx-shipments-table tr:last-child td { border-bottom:none; }
.elx-priority-high { color:var(--elx-red); }
.elx-priority-med  { color:var(--elx-amber); }
.elx-priority-low  { color:var(--elx-text3); }
.elx-status-badge  { padding:2px 8px; border-radius:10px; font-size:10px; display:inline-block; }
.elx-status-transit   { background:var(--elx-blue-dim);  color:var(--elx-blue);  }
.elx-status-loading   { background:var(--elx-amber-dim); color:var(--elx-amber); }
.elx-status-delayed   { background:var(--elx-red-dim);   color:var(--elx-red);   }
.elx-status-delivered { background:var(--elx-green-dim); color:var(--elx-green); }

/* ── LEADERBOARD ── */
.elx-driver-row {
  display:flex; align-items:center; gap:12px; padding:10px 0;
  border-bottom:1px solid rgba(30,46,30,.5);
}
.elx-driver-row:last-child { border-bottom:none; }
.elx-driver-rank {
  font-family:var(--elx-display); font-size:22px;
  width:28px; text-align:center; color:var(--elx-text3);
}
.elx-driver-rank.gold   { color:#FFD700; }
.elx-driver-rank.silver { color:#C0C0C0; }
.elx-driver-rank.bronze { color:#CD7F32; }
.elx-driver-avatar {
  width:34px; height:34px; border-radius:50%; display:flex;
  align-items:center; justify-content:center; font-size:14px; font-weight:700;
  font-family:var(--elx-mono); background:var(--elx-surface3);
  border:1px solid var(--elx-border2); color:var(--elx-text2); flex-shrink:0;
}
.elx-driver-info { flex:1; }
.elx-driver-name { font-size:13px; font-weight:600; color:var(--elx-text); margin-bottom:2px; }
.elx-driver-stats { display:flex; gap:10px; font-family:var(--elx-mono); font-size:10px; color:var(--elx-text3); }
.elx-driver-score { font-family:var(--elx-display); font-size:24px; color:var(--elx-green); }

/* ── ALERTS ── */
.elx-alert-feed { display:flex; flex-direction:column; gap:8px; }
.elx-alert-item {
  display:flex; align-items:flex-start; gap:10px;
  background:var(--elx-surface2); border-radius:8px;
  padding:10px 12px; border-left:3px solid;
  animation:elx-slideIn .4s ease;
}
@keyframes elx-slideIn {
  from { transform:translateX(-10px); opacity:0; }
  to   { transform:translateX(0);     opacity:1; }
}
.elx-alert-warn   { border-color:var(--elx-amber); }
.elx-alert-danger { border-color:var(--elx-red);   }
.elx-alert-info   { border-color:var(--elx-blue);  }
.elx-alert-ok     { border-color:var(--elx-green); }
.elx-alert-icon { font-size:14px; flex-shrink:0; margin-top:1px; }
.elx-alert-msg  { font-size:12px; color:var(--elx-text2); font-family:var(--elx-mono); line-height:1.4; }
.elx-alert-time { font-size:10px; color:var(--elx-text3); margin-top:2px; }

/* ── SAVINGS ── */
.elx-savings-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
.elx-savings-box {
  background:var(--elx-surface2); border-radius:8px; padding:14px;
  border:1px solid var(--elx-border); text-align:center;
}
.elx-savings-val   { font-family:var(--elx-display); font-size:32px; color:var(--elx-green); line-height:1; }
.elx-savings-label { font-family:var(--elx-mono); font-size:9px; text-transform:uppercase; letter-spacing:1.5px; color:var(--elx-text3); margin-top:4px; }
.elx-savings-total {
  background:linear-gradient(135deg,var(--elx-green-dim),transparent);
  border:1px solid rgba(45,255,111,.2); border-radius:8px; padding:14px;
  display:flex; justify-content:space-between; align-items:center;
}
.elx-savings-total-label { font-size:12px; color:var(--elx-text2); }
.elx-savings-total-val   { font-family:var(--elx-display); font-size:38px; color:var(--elx-green); text-shadow:0 0 20px var(--elx-green-glow); }

/* ── DELIVERY RATE ── */
.elx-rate-ring-wrap { display:flex; align-items:center; gap:20px; padding:8px 0; }
.elx-rate-ring { position:relative; width:100px; height:100px; flex-shrink:0; }
.elx-rate-ring canvas { position:absolute; inset:0; }
.elx-rate-pct {
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  font-family:var(--elx-display); font-size:26px; color:var(--elx-green); line-height:1;
}
.elx-rate-pct small { font-family:var(--elx-mono); font-size:9px; color:var(--elx-text3); font-weight:normal; }
.elx-rate-breakdown { flex:1; }
.elx-rate-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:5px 0; font-family:var(--elx-mono); font-size:11px;
  border-bottom:1px solid rgba(30,46,30,.5);
}
.elx-rate-row:last-child { border:none; }
.elx-rate-row-label { color:var(--elx-text3); }
.elx-rate-row-val   { color:var(--elx-text2); }

/* ── MICRO HUB ── */
.elx-hub-items { display:flex; flex-direction:column; gap:8px; }
.elx-hub-item  { display:flex; align-items:center; gap:10px; }
.elx-hub-name  { font-family:var(--elx-mono); font-size:11px; color:var(--elx-text2); width:80px; flex-shrink:0; }
.elx-hub-bar-bg  { flex:1; height:8px; background:var(--elx-surface3); border-radius:4px; overflow:hidden; }
.elx-hub-bar-fill{ height:100%; border-radius:4px; background:linear-gradient(90deg,var(--elx-green2),var(--elx-green)); box-shadow:0 0 8px var(--elx-green-glow); }
.elx-hub-pct { font-family:var(--elx-mono); font-size:11px; color:var(--elx-green); width:38px; text-align:right; flex-shrink:0; }

/* ── SCROLLBAR ── */
#ecologix-root ::-webkit-scrollbar       { width:4px; height:4px; }
#ecologix-root ::-webkit-scrollbar-track { background:transparent; }
#ecologix-root ::-webkit-scrollbar-thumb { background:var(--elx-border2); border-radius:2px; }
`;
    const style = document.createElement('style');
    style.id = 'ecologix-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════════════
     3. HTML TEMPLATE BUILDER
  ═══════════════════════════════════════════════════════════════ */
  function buildHTML() {
    return `
<header class="elx-header">
  <div class="elx-logo">
    <div class="elx-logo-icon">🌿</div>
    <div class="elx-logo-text">Eco<span>Logix</span>.ai</div>
  </div>
  <div class="elx-header-right">
    <div class="elx-live-badge"><div class="elx-live-dot"></div> LIVE DATA</div>
    <div class="elx-header-time" id="elx-headerTime">—</div>
  </div>
</header>

<div class="elx-dash">

  <!-- STAT CARDS -->
  <div class="elx-stat-row">
    ${['green|CO₂ Saved Today|elx-co2Val|kg CO₂e|elx-co2Delta|elx-sparkCO2',
       'amber|Fuel Saved|elx-fuelVal|litres|elx-fuelDelta|elx-sparkFuel',
       'blue|Active Trips|elx-tripsVal|in progress|elx-tripsDelta|elx-sparkTrips',
       'red|Empty Miles Eliminated|elx-emptyVal|km today|elx-emptyDelta|elx-sparkEmpty']
      .map(s => {
        const [color, label, valId, unit, deltaId, sparkId] = s.split('|');
        return `<div class="elx-stat-card ${color}">
          <div class="elx-stat-label">${label}</div>
          <div class="elx-stat-value" id="${valId}">0</div>
          <div class="elx-stat-unit">${unit}</div>
          <div class="elx-stat-delta elx-delta-up" id="${deltaId}">+0.0%</div>
          <svg class="elx-sparkline" id="${sparkId}" viewBox="0 0 200 40" preserveAspectRatio="none"></svg>
        </div>`;
      }).join('')}
  </div>

  <!-- MAP + ROUTE COMPARISON -->
  <div class="elx-two-col">
    <div class="elx-panel" style="grid-column:span 2;display:grid;grid-template-columns:2fr 1fr;overflow:hidden;">
      <div>
        <div class="elx-panel-header">
          <div class="elx-panel-title">🗺 Live Route Map — Eco vs Standard</div>
          <div class="elx-panel-badge" id="elx-truckStatus">TRK-007 EN ROUTE</div>
        </div>
        <div class="elx-map-legend">
          <div class="elx-legend-item"><div class="elx-legend-line" style="background:var(--elx-green)"></div>Eco Route</div>
          <div class="elx-legend-item"><div class="elx-legend-line" style="border-top:2px dashed var(--elx-text3);height:0;width:24px"></div>Standard</div>
          <div class="elx-legend-item"><div class="elx-legend-dot" style="background:var(--elx-amber)"></div>Micro-Hub</div>
          <div class="elx-legend-item"><div class="elx-legend-dot" style="background:var(--elx-red)"></div>Congestion</div>
          <div class="elx-legend-item"><div class="elx-legend-dot" style="background:var(--elx-green)"></div>Truck</div>
        </div>
        <canvas id="elx-mapCanvas"></canvas>
      </div>
      <div style="border-left:1px solid var(--elx-border);">
        <div class="elx-panel-header"><div class="elx-panel-title">Route Comparison</div></div>
        <div class="elx-panel-body">
          <div class="elx-route-grid">
            <div class="elx-route-col elx-eco-route">
              <div class="elx-route-col-title">🌿 Eco Route</div>
              ${[['Distance','142 km'],['Est. Time','2h 18m'],['Fuel Use','18.4 L'],['CO₂','48.6 kg'],['Inclines','Low'],['Congestion','None']]
                .map(([l,v])=>`<div class="elx-route-metric"><span class="elx-rm-label">${l}</span><span class="elx-rm-val">${v}</span></div>`).join('')}
            </div>
            <div class="elx-route-col elx-std-route">
              <div class="elx-route-col-title">📍 Standard</div>
              ${[['Distance','138 km','var(--elx-text2)'],['Est. Time','2h 41m','var(--elx-text2)'],['Fuel Use','24.1 L','var(--elx-red)'],['CO₂','63.8 kg','var(--elx-red)'],['Inclines','High','var(--elx-amber)'],['Congestion','2 zones','var(--elx-red)']]
                .map(([l,v,c])=>`<div class="elx-route-metric"><span class="elx-rm-label">${l}</span><span class="elx-rm-val" style="color:${c}">${v}</span></div>`).join('')}
            </div>
          </div>
          <div style="margin-top:12px;background:var(--elx-green-dim);border:1px solid rgba(45,255,111,.2);border-radius:8px;padding:10px 12px;font-family:var(--elx-mono);font-size:11px;color:var(--elx-green);">
            ✓ Eco route saves <strong>5.7L fuel</strong> & <strong>15.2 kg CO₂</strong> — ETA 23 min earlier
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- WEIGHT + CARBON + FLEET PIE -->
  <div class="elx-three-col">
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">⚖ Weight-Aware Routing</div><div class="elx-panel-badge">LIVE</div></div>
      <div class="elx-panel-body"><div class="elx-weight-items" id="elx-weightItems"></div></div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">📈 Weekly Carbon Impact</div><div class="elx-panel-badge">7-DAY</div></div>
      <div class="elx-panel-body"><div class="elx-chart-wrap"><canvas id="elx-carbonChart"></canvas></div></div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">🚛 Fleet Load Distribution</div><div class="elx-panel-badge">NOW</div></div>
      <div class="elx-panel-body">
        <div class="elx-chart-wrap" style="height:160px"><canvas id="elx-fleetPie"></canvas></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;">
          <div style="font-family:var(--elx-mono);font-size:10px;color:var(--elx-green)">■ Full Load: 34%</div>
          <div style="font-family:var(--elx-mono);font-size:10px;color:var(--elx-blue)">■ Partial &gt;70%: 28%</div>
          <div style="font-family:var(--elx-mono);font-size:10px;color:var(--elx-amber)">■ Partial &lt;70%: 22%</div>
          <div style="font-family:var(--elx-mono);font-size:10px;color:var(--elx-red)">■ Empty Return: 16%</div>
        </div>
      </div>
    </div>
  </div>

  <!-- EMPTY MILES + SAVINGS + DELIVERY RATE -->
  <div class="elx-three-col">
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">📉 Empty Miles — 6 Month Reduction</div><div class="elx-panel-badge">BEFORE / AFTER</div></div>
      <div class="elx-panel-body"><div class="elx-chart-wrap"><canvas id="elx-emptyMilesChart"></canvas></div></div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">💰 Cost Savings Calculator</div><div class="elx-panel-badge">THIS MONTH</div></div>
      <div class="elx-panel-body">
        <div class="elx-savings-grid">
          <div class="elx-savings-box"><div class="elx-savings-val">$<span id="elx-fuelSavingsUSD">4,820</span></div><div class="elx-savings-label">Fuel Savings</div></div>
          <div class="elx-savings-box"><div class="elx-savings-val">$<span id="elx-carbonSavingsUSD">1,340</span></div><div class="elx-savings-label">Carbon Credits</div></div>
          <div class="elx-savings-box"><div class="elx-savings-val">$<span id="elx-routeSavingsUSD">2,190</span></div><div class="elx-savings-label">Route Efficiency</div></div>
          <div class="elx-savings-box"><div class="elx-savings-val">$<span id="elx-maintenanceSavingsUSD">890</span></div><div class="elx-savings-label">Maintenance Saved</div></div>
        </div>
        <div class="elx-savings-total">
          <div class="elx-savings-total-label">Total Monthly Savings</div>
          <div class="elx-savings-total-val">$<span id="elx-totalSavings">9,240</span></div>
        </div>
      </div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">✅ Delivery Success Rate</div><div class="elx-panel-badge">THIS WEEK</div></div>
      <div class="elx-panel-body">
        <div class="elx-rate-ring-wrap">
          <div class="elx-rate-ring">
            <canvas id="elx-rateRing" width="100" height="100"></canvas>
            <div class="elx-rate-pct">94%<small>ON-TIME</small></div>
          </div>
          <div class="elx-rate-breakdown">
            <div class="elx-rate-row"><span class="elx-rate-row-label">On-Time</span><span class="elx-rate-row-val" style="color:var(--elx-green)">247</span></div>
            <div class="elx-rate-row"><span class="elx-rate-row-label">Early</span><span class="elx-rate-row-val" style="color:var(--elx-blue)">18</span></div>
            <div class="elx-rate-row"><span class="elx-rate-row-label">Delayed</span><span class="elx-rate-row-val" style="color:var(--elx-amber)">10</span></div>
            <div class="elx-rate-row"><span class="elx-rate-row-label">Failed</span><span class="elx-rate-row-val" style="color:var(--elx-red)">5</span></div>
            <div class="elx-rate-row"><span class="elx-rate-row-label">Total</span><span class="elx-rate-row-val">280</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SHIPMENTS + LEADERBOARD -->
  <div class="elx-two-col">
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">📦 Active Shipments</div><div class="elx-panel-badge" id="elx-shipCount">12 ACTIVE</div></div>
      <div style="overflow-x:auto;">
        <table class="elx-shipments-table">
          <thead><tr><th>ID</th><th>Route</th><th>Weight</th><th>Priority</th><th>Deadline</th><th>Status</th></tr></thead>
          <tbody id="elx-shipmentsBody"></tbody>
        </table>
      </div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">🏆 Driver Eco-Leaderboard</div><div class="elx-panel-badge">WEEK RANK</div></div>
      <div class="elx-panel-body" id="elx-leaderboard"></div>
    </div>
  </div>

  <!-- ALERTS + MICRO-HUB + GOAL -->
  <div class="elx-three-col">
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">🔔 Live Alerts Feed</div><div class="elx-panel-badge" id="elx-alertCount">0 NEW</div></div>
      <div class="elx-panel-body"><div class="elx-alert-feed" id="elx-alertFeed"></div></div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">📍 Micro-Hub Utilization</div><div class="elx-panel-badge">THIS WEEK</div></div>
      <div class="elx-panel-body"><div class="elx-hub-items" id="elx-hubItems"></div></div>
    </div>
    <div class="elx-panel">
      <div class="elx-panel-header"><div class="elx-panel-title">🎯 DP World Emission Target</div><div class="elx-panel-badge">42% GOAL BY 2030</div></div>
      <div class="elx-goal-section">
        <div class="elx-goal-header">
          <div class="elx-goal-label">Emission Reduction Progress</div>
          <div class="elx-goal-pct" id="elx-goalPct">0%</div>
        </div>
        <div class="elx-goal-bar-bg">
          <div class="elx-goal-bar-fill" id="elx-goalBar" style="width:0%"></div>
          <div class="elx-goal-bar-target" style="left:42%"></div>
        </div>
        <div class="elx-goal-sub">
          <span>0%</span>
          <span style="color:var(--elx-amber)">▲ Target: 42%</span>
          <span>100%</span>
        </div>
        <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
          <div style="background:var(--elx-surface2);border-radius:8px;padding:10px;border:1px solid var(--elx-border);">
            <div style="font-family:var(--elx-display);font-size:24px;color:var(--elx-green)">28.4%</div>
            <div style="font-family:var(--elx-mono);font-size:9px;color:var(--elx-text3)">ACHIEVED</div>
          </div>
          <div style="background:var(--elx-surface2);border-radius:8px;padding:10px;border:1px solid var(--elx-border);">
            <div style="font-family:var(--elx-display);font-size:24px;color:var(--elx-amber)">13.6%</div>
            <div style="font-family:var(--elx-mono);font-size:9px;color:var(--elx-text3)">REMAINING</div>
          </div>
          <div style="background:var(--elx-surface2);border-radius:8px;padding:10px;border:1px solid var(--elx-border);">
            <div style="font-family:var(--elx-display);font-size:24px;color:var(--elx-blue)">2030</div>
            <div style="font-family:var(--elx-mono);font-size:9px;color:var(--elx-text3)">TARGET YEAR</div>
          </div>
        </div>
        <div style="margin-top:12px;">
          <div style="font-family:var(--elx-mono);font-size:9px;color:var(--elx-text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Reduction by Category</div>
          <div class="elx-hub-items">
            <div class="elx-hub-item"><span class="elx-hub-name" style="font-size:10px">Route Opt.</span><div class="elx-hub-bar-bg"><div class="elx-hub-bar-fill" style="width:78%"></div></div><span class="elx-hub-pct">11.2%</span></div>
            <div class="elx-hub-item"><span class="elx-hub-name" style="font-size:10px">Fleet EV</span><div class="elx-hub-bar-bg"><div class="elx-hub-bar-fill" style="width:55%;background:linear-gradient(90deg,var(--elx-blue),#6ec6ff)"></div></div><span class="elx-hub-pct" style="color:var(--elx-blue)">8.1%</span></div>
            <div class="elx-hub-item"><span class="elx-hub-name" style="font-size:10px">Load Mgmt</span><div class="elx-hub-bar-bg"><div class="elx-hub-bar-fill" style="width:40%;background:linear-gradient(90deg,var(--elx-amber),#ffd080)"></div></div><span class="elx-hub-pct" style="color:var(--elx-amber)">5.8%</span></div>
            <div class="elx-hub-item"><span class="elx-hub-name" style="font-size:10px">Micro-Hubs</span><div class="elx-hub-bar-bg"><div class="elx-hub-bar-fill" style="width:22%"></div></div><span class="elx-hub-pct">3.3%</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div><!-- /elx-dash -->
`;
  }

  /* ═══════════════════════════════════════════════════════════════
     4. DASHBOARD LOGIC
  ═══════════════════════════════════════════════════════════════ */
  function initDashboard() {

    /* ── CLOCK ── */
    function updateClock() {
      const el = document.getElementById('elx-headerTime');
      if (el) el.textContent =
        new Date().toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' GST';
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* ── STAT CARDS TICK ── */
    const stats = {
      co2:   { el:'elx-co2Val',   val:2847, target:3100, color:'#2dff6f' },
      fuel:  { el:'elx-fuelVal',  val:1204, target:1340, color:'#f5a623' },
      trips: { el:'elx-tripsVal', val:34,   target:42,   color:'#4da6ff' },
      empty: { el:'elx-emptyVal', val:891,  target:980,  color:'#ff4545' },
    };
    const sparkData = { co2:[], fuel:[], trips:[], empty:[] };
    const SPARK_LEN = 20;

    function renderSparkline(id, data, color) {
      const svg = document.getElementById(id);
      if (!svg || data.length < 2) return;
      const min = Math.min(...data), max = Math.max(...data);
      const range = max - min || 1;
      const W = 200, H = 40;
      const pts = data.map((v,i) => `${(i/(data.length-1))*W},${H-((v-min)/range)*H}`).join(' ');
      svg.innerHTML = `
        <polyline points="${pts} ${W},${H} 0,${H}" fill="${color}" opacity="0.3"/>
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    }

    function tickStats() {
      Object.entries(stats).forEach(([key, s]) => {
        s.val = Math.min(s.val + s.target * 0.002 * (0.5 + Math.random()), s.target);
        const el = document.getElementById(s.el);
        if (el) el.textContent = key === 'trips' ? Math.round(s.val) : Math.round(s.val).toLocaleString();
        sparkData[key].push(s.val);
        if (sparkData[key].length > SPARK_LEN) sparkData[key].shift();
        renderSparkline(`elx-spark${key.charAt(0).toUpperCase()+key.slice(1)}`, sparkData[key], s.color);
        if (s.val >= s.target * 0.99) s.target *= 1.02 + Math.random() * 0.02;
      });
    }
    setInterval(tickStats, 800);
    for (let i = 0; i < 8; i++) tickStats();

    /* ── ANIMATED MAP ── */
    const canvas = document.getElementById('elx-mapCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width  = canvas.parentElement.getBoundingClientRect().width;
      canvas.height = 320;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ecoRoute = [{x:.05,y:.5},{x:.15,y:.35},{x:.28,y:.25},{x:.42,y:.3},{x:.55,y:.45},{x:.68,y:.4},{x:.80,y:.55},{x:.92,y:.5}];
    const stdRoute = [{x:.05,y:.5},{x:.18,y:.65},{x:.30,y:.7},{x:.45,y:.62},{x:.58,y:.72},{x:.70,y:.65},{x:.82,y:.6},{x:.92,y:.5}];
    const microHubs   = [{x:.28,y:.25,name:'MH-01'},{x:.55,y:.45,name:'MH-02'},{x:.80,y:.55,name:'MH-03'}];
    const congestion  = [{x:.30,y:.7,r:18},{x:.58,y:.72,r:14}];

    let truckT = 0, trailPoints = [];

    function lerpRoute(route, t) {
      const seg = t * (route.length - 1);
      const i = Math.floor(seg), f = seg - i;
      const a = route[Math.min(i, route.length-1)], b = route[Math.min(i+1, route.length-1)];
      return {x: a.x+(b.x-a.x)*f, y: a.y+(b.y-a.y)*f};
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.arcTo(x+w,y,x+w,y+r,r);
      c.lineTo(x+w,y+h-r); c.arcTo(x+w,y+h,x+w-r,y+h,r);
      c.lineTo(x+r,y+h); c.arcTo(x,y+h,x,y+h-r,r);
      c.lineTo(x,y+r); c.arcTo(x,y,x+r,y,r); c.closePath();
    }

    function drawMap() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);

      // BG
      const bg = ctx.createLinearGradient(0,0,W,H);
      bg.addColorStop(0,'#0a130a'); bg.addColorStop(1,'#0d170d');
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      // Grid
      ctx.strokeStyle='rgba(45,255,111,0.06)'; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      const tc = pt => ({x:pt.x*W, y:pt.y*H});

      // Congestion
      congestion.forEach(c => {
        const p = tc(c);
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,c.r*2);
        g.addColorStop(0,'rgba(255,69,69,.3)'); g.addColorStop(1,'rgba(255,69,69,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,c.r*2,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='rgba(255,69,69,.4)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(p.x,p.y,c.r,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='rgba(255,69,69,.9)'; ctx.font='9px Space Mono,monospace';
        ctx.textAlign='center'; ctx.fillText('⚠ CONGESTION', p.x, p.y+c.r+14);
      });

      // Standard route (dashed)
      const stdPts = stdRoute.map(tc);
      ctx.strokeStyle='rgba(100,130,100,.45)'; ctx.lineWidth=2; ctx.setLineDash([6,5]);
      ctx.beginPath(); stdPts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke();
      ctx.setLineDash([]);

      // Eco route glow
      const ecoPts = ecoRoute.map(tc);
      ctx.shadowColor='rgba(45,255,111,.6)'; ctx.shadowBlur=12;
      ctx.strokeStyle='rgba(45,255,111,.4)'; ctx.lineWidth=6;
      ctx.beginPath(); ecoPts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke();
      ctx.shadowBlur=0; ctx.strokeStyle='#2dff6f'; ctx.lineWidth=2;
      ctx.beginPath(); ecoPts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke();

      // Origin / Destination
      [ecoPts[0], ecoPts[ecoPts.length-1]].forEach((p,i) => {
        const col = i===0?'#4da6ff':'#2dff6f';
        ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.font='bold 10px Space Mono,monospace';
        ctx.textAlign='center'; ctx.fillText(i===0?'ORIGIN':'DEST',p.x,p.y-10);
      });

      // Micro-hub markers
      microHubs.forEach(h => {
        const p = tc(h);
        ctx.fillStyle='rgba(245,166,35,.15)'; ctx.beginPath(); ctx.arc(p.x,p.y,14,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#f5a623'; ctx.lineWidth=1.5; ctx.shadowColor='#f5a623'; ctx.shadowBlur=8;
        ctx.beginPath(); ctx.arc(p.x,p.y,7,0,Math.PI*2); ctx.stroke();
        ctx.shadowBlur=0; ctx.fillStyle='#f5a623'; ctx.font='9px Space Mono,monospace';
        ctx.textAlign='center'; ctx.fillText(h.name,p.x,p.y-12);
      });

      // Trail
      const truckPos = tc(lerpRoute(ecoRoute, truckT));
      trailPoints.push({...truckPos});
      if(trailPoints.length>30) trailPoints.shift();
      for(let i=1;i<trailPoints.length;i++){
        const a=i/trailPoints.length;
        ctx.strokeStyle=`rgba(45,255,111,${a*.5})`; ctx.lineWidth=a*3;
        ctx.beginPath(); ctx.moveTo(trailPoints[i-1].x,trailPoints[i-1].y);
        ctx.lineTo(trailPoints[i].x,trailPoints[i].y); ctx.stroke();
      }

      // Truck dot
      const pulse=(Math.sin(Date.now()/400)+1)*.5;
      ctx.fillStyle=`rgba(45,255,111,${.15+pulse*.15})`;
      ctx.beginPath(); ctx.arc(truckPos.x,truckPos.y,14+pulse*4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#2dff6f'; ctx.shadowColor='#2dff6f'; ctx.shadowBlur=16;
      ctx.beginPath(); ctx.arc(truckPos.x,truckPos.y,6,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.fillStyle='#fff'; ctx.font='10px sans-serif';
      ctx.textAlign='center'; ctx.fillText('🚛',truckPos.x,truckPos.y+4);

      // Speed tag
      ctx.fillStyle='rgba(10,20,10,.85)';
      roundRect(ctx,truckPos.x+10,truckPos.y-20,56,16,4); ctx.fill();
      ctx.fillStyle='#2dff6f'; ctx.font='9px Space Mono,monospace'; ctx.textAlign='left';
      ctx.fillText('TRK-007 64km/h',truckPos.x+13,truckPos.y-9);

      truckT+=.0015;
      if(truckT>1){truckT=0;trailPoints=[];}
      requestAnimationFrame(drawMap);
    }
    drawMap();

    /* ── WEIGHT PANEL ── */
    const weightData = [
      {id:'TRK-001',kg:14200,cap:18000,note:'Grade limit: 6% max — rerouted via N44'},
      {id:'TRK-003',kg:8400, cap:12000,note:'Eco cluster: 3 stops consolidated'},
      {id:'TRK-007',kg:17800,cap:18000,note:'Near max — bridge restriction applied'},
      {id:'TRK-012',kg:5100, cap:12000,note:'Backhaul match available on E11'},
    ];
    const weightEl = document.getElementById('elx-weightItems');
    if (weightEl) weightEl.innerHTML = weightData.map(d => {
      const pct = (d.kg/d.cap)*100;
      const col = pct>90?'#ff4545':pct>70?'#f5a623':'#2dff6f';
      return `<div class="elx-weight-item">
        <div class="elx-weight-header">
          <span class="elx-weight-id">${d.id}</span>
          <span class="elx-weight-kg">${d.kg.toLocaleString()} kg / ${d.cap.toLocaleString()} kg</span>
        </div>
        <div class="elx-weight-bar-bg">
          <div class="elx-weight-bar-fill" style="width:${pct}%;background:${col}"></div>
        </div>
        <div class="elx-weight-note">↳ ${d.note}</div>
      </div>`;
    }).join('');

    /* ── CHARTS ── */
    Chart.defaults.color = '#4a6a4a';
    Chart.defaults.font.family = 'Space Mono, monospace';
    Chart.defaults.font.size = 10;

    // Carbon area chart
    const carbonCtx = document.getElementById('elx-carbonChart').getContext('2d');
    const gGrad = carbonCtx.createLinearGradient(0,0,0,180);
    gGrad.addColorStop(0,'rgba(45,255,111,.35)'); gGrad.addColorStop(1,'rgba(45,255,111,0)');
    const rGrad = carbonCtx.createLinearGradient(0,0,0,180);
    rGrad.addColorStop(0,'rgba(255,69,69,.25)'); rGrad.addColorStop(1,'rgba(255,69,69,0)');

    new Chart(carbonCtx, {
      type:'line',
      data:{
        labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets:[
          {label:'CO₂ Saved', data:[340,410,390,480,520,460,490], borderColor:'#2dff6f', backgroundColor:gGrad, fill:true, tension:.4, borderWidth:2, pointRadius:3, pointBackgroundColor:'#2dff6f'},
          {label:'CO₂ Emitted', data:[820,780,800,740,700,760,730], borderColor:'#ff4545', backgroundColor:rGrad, fill:true, tension:.4, borderWidth:2, pointRadius:3, pointBackgroundColor:'#ff4545'}
        ]
      },
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:true,labels:{boxWidth:10,color:'#8aab8a'}}},
        scales:{x:{grid:{color:'rgba(45,255,111,.05)'},ticks:{color:'#4a6a4a'}},
                y:{grid:{color:'rgba(45,255,111,.05)'},ticks:{color:'#4a6a4a'}}}}
    });

    // Fleet pie
    new Chart(document.getElementById('elx-fleetPie').getContext('2d'), {
      type:'doughnut',
      data:{labels:['Full Load','Partial >70%','Partial <70%','Empty Return'],
            datasets:[{data:[34,28,22,16],backgroundColor:['#2dff6f','#4da6ff','#f5a623','#ff4545'],borderColor:'#0a0f0a',borderWidth:3}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}
    });

    // Empty miles bar
    new Chart(document.getElementById('elx-emptyMilesChart').getContext('2d'), {
      type:'bar',
      data:{labels:['Nov','Dec','Jan','Feb','Mar','Apr'],
            datasets:[
              {label:'Before', data:[2840,2760,2690,2540,2430,2310], backgroundColor:'rgba(255,69,69,.5)', borderColor:'#ff4545', borderWidth:1, borderRadius:3},
              {label:'After EcoLogix', data:[2200,1980,1740,1520,1320,1140], backgroundColor:'rgba(45,255,111,.5)', borderColor:'#2dff6f', borderWidth:1, borderRadius:3}
            ]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:true,labels:{boxWidth:10,color:'#8aab8a'}}},
        scales:{x:{grid:{color:'rgba(45,255,111,.05)'},ticks:{color:'#4a6a4a'}},
                y:{grid:{color:'rgba(45,255,111,.05)'},ticks:{color:'#4a6a4a'}}}}
    });

    // Rate ring
    new Chart(document.getElementById('elx-rateRing').getContext('2d'), {
      type:'doughnut',
      data:{datasets:[{data:[94,6],backgroundColor:['#2dff6f','rgba(45,255,111,.08)'],borderColor:['#2dff6f','transparent'],borderWidth:[2,0]}]},
      options:{responsive:false,cutout:'80%',plugins:{legend:{display:false},tooltip:{enabled:false}},animation:{duration:1500,easing:'easeOutQuart'}}
    });

    /* ── SHIPMENTS TABLE ── */
    const shipments = [
      {id:'SH-4821',route:'DXB → AUH',weight:'14.2t',priority:'HIGH',deadline:'14:30',status:'transit'},
      {id:'SH-4822',route:'SHJ → DXB',weight:'8.7t', priority:'MED', deadline:'16:00',status:'loading'},
      {id:'SH-4823',route:'AUH → RAK',weight:'11.4t',priority:'HIGH',deadline:'13:45',status:'delayed'},
      {id:'SH-4824',route:'DXB → FUJ',weight:'5.1t', priority:'LOW', deadline:'18:00',status:'transit'},
      {id:'SH-4825',route:'RAK → DXB',weight:'9.8t', priority:'MED', deadline:'15:30',status:'transit'},
      {id:'SH-4826',route:'DXB → SHJ',weight:'12.6t',priority:'HIGH',deadline:'14:00',status:'delivered'},
      {id:'SH-4827',route:'AUH → DXB',weight:'7.3t', priority:'LOW', deadline:'19:00',status:'loading'},
    ];
    const shipBody = document.getElementById('elx-shipmentsBody');
    if (shipBody) shipBody.innerHTML = shipments.map(s => {
      const pClass = s.priority==='HIGH'?'elx-priority-high':s.priority==='MED'?'elx-priority-med':'elx-priority-low';
      return `<tr>
        <td style="color:var(--elx-text)">${s.id}</td>
        <td>${s.route}</td><td>${s.weight}</td>
        <td class="${pClass}">${s.priority}</td>
        <td>${s.deadline}</td>
        <td><span class="elx-status-badge elx-status-${s.status}">${s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td>
      </tr>`;
    }).join('');

    /* ── LEADERBOARD ── */
    const drivers = [
      {name:'Khalid Al-Mansouri',score:97,fuel:'91%',ontime:'98%',initials:'KM',rank:'gold'},
      {name:'Sara Okonkwo',      score:94,fuel:'88%',ontime:'96%',initials:'SO',rank:'silver'},
      {name:'Raj Subramaniam',   score:91,fuel:'85%',ontime:'94%',initials:'RS',rank:'bronze'},
      {name:'Mei Lan Chen',      score:88,fuel:'83%',ontime:'92%',initials:'ML',rank:''},
      {name:'Andrei Popescu',    score:85,fuel:'80%',ontime:'90%',initials:'AP',rank:''},
    ];
    const lbEl = document.getElementById('elx-leaderboard');
    if (lbEl) lbEl.innerHTML = drivers.map((d,i) => `
      <div class="elx-driver-row">
        <div class="elx-driver-rank ${d.rank}">${i+1}</div>
        <div class="elx-driver-avatar">${d.initials}</div>
        <div class="elx-driver-info">
          <div class="elx-driver-name">${d.name}</div>
          <div class="elx-driver-stats"><span>Fuel: ${d.fuel}</span><span>On-Time: ${d.ontime}</span></div>
        </div>
        <div class="elx-driver-score">${d.score}</div>
      </div>`).join('');

    /* ── LIVE ALERTS ── */
    const alertPool = [
      {type:'danger',icon:'⛽',msg:'TRK-004 fuel critically low — dispatch to nearest station',mins:0},
      {type:'warn',  icon:'⏰',msg:'SH-4823 deadline approaching in 18 minutes',mins:1},
      {type:'warn',  icon:'🚦',msg:'Congestion detected on E11 — rerouting TRK-002',mins:2},
      {type:'info',  icon:'📍',msg:'MH-02 micro-hub at 89% capacity — gap fill scheduled',mins:3},
      {type:'ok',    icon:'✅',msg:'TRK-011 eco milestone: 500 km CO₂-optimized today',mins:4},
      {type:'warn',  icon:'🌡',msg:'TRK-008 engine temperature elevated — check flagged',mins:6},
      {type:'info',  icon:'📦',msg:'SH-4830 weight variance detected — load rebalanced',mins:8},
      {type:'danger',icon:'🛑',msg:'SH-4823 now 12 min late — priority escalated',mins:0},
      {type:'ok',    icon:'🌿',msg:'Eco route saved 8.3 kg CO₂ on DXB→AUH run',mins:1},
      {type:'warn',  icon:'🔋',msg:'EV-006 battery at 18% — charge stop recommended',mins:2},
    ];
    let alertIdx = 0, alertCount = 0;
    const MAX_ALERTS = 6;

    function addAlert() {
      const feed = document.getElementById('elx-alertFeed');
      const a = alertPool[alertIdx++ % alertPool.length];
      alertCount++;
      const div = document.createElement('div');
      div.className = `elx-alert-item elx-alert-${a.type}`;
      div.innerHTML = `<div class="elx-alert-icon">${a.icon}</div>
        <div><div class="elx-alert-msg">${a.msg}</div>
        <div class="elx-alert-time">${a.mins===0?'just now':a.mins+'m ago'}</div></div>`;
      feed.insertBefore(div, feed.firstChild);
      if (feed.children.length > MAX_ALERTS) feed.removeChild(feed.lastChild);
      const el = document.getElementById('elx-alertCount');
      if (el) el.textContent = `${alertCount} NEW`;
    }
    for (let i=0; i<5; i++) addAlert();
    setInterval(addAlert, 6000);

    /* ── MICRO-HUBS ── */
    const hubs = [
      {name:'MH-01 DXB',pct:89},{name:'MH-02 SHJ',pct:74},
      {name:'MH-03 AUH',pct:62},{name:'MH-04 RAK',pct:48},{name:'MH-05 FUJ',pct:35},
    ];
    const hubEl = document.getElementById('elx-hubItems');
    if (hubEl) hubEl.innerHTML = hubs.map(h => {
      const col = h.pct>80?'var(--elx-green)':h.pct>60?'var(--elx-amber)':'var(--elx-text3)';
      return `<div class="elx-hub-item">
        <span class="elx-hub-name">${h.name}</span>
        <div class="elx-hub-bar-bg"><div class="elx-hub-bar-fill" style="width:${h.pct}%;background:linear-gradient(90deg,${col},${col})"></div></div>
        <span class="elx-hub-pct" style="color:${col}">${h.pct}%</span>
      </div>`;
    }).join('');

    /* ── GOAL ANIMATION ── */
    const GOAL_PCT = 28.4, GOAL_TARGET = 42;
    const FILL = (GOAL_PCT / GOAL_TARGET) * 100;
    setTimeout(() => {
      const bar = document.getElementById('elx-goalBar');
      const pct = document.getElementById('elx-goalPct');
      if (bar) bar.style.width = FILL + '%';
      let cur = 0;
      const step = GOAL_PCT / 60;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, GOAL_PCT);
        if (pct) pct.textContent = cur.toFixed(1) + '%';
        if (cur >= GOAL_PCT) clearInterval(iv);
      }, 30);
    }, 500);

    /* ── SAVINGS TICKER ── */
    const savings = {fuel:4820, carbon:1340, route:2190, maintenance:890};
    function tickSavings() {
      Object.keys(savings).forEach(k => { savings[k] += Math.floor(Math.random()*5); });
      const total = Object.values(savings).reduce((a,b)=>a+b,0);
      const ids = {fuel:'elx-fuelSavingsUSD',carbon:'elx-carbonSavingsUSD',route:'elx-routeSavingsUSD',maintenance:'elx-maintenanceSavingsUSD'};
      Object.entries(ids).forEach(([k,id]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = savings[k].toLocaleString();
      });
      const totEl = document.getElementById('elx-totalSavings');
      if (totEl) totEl.textContent = total.toLocaleString();
    }
    setInterval(tickSavings, 3000);
  }

  /* ═══════════════════════════════════════════════════════════════
     5. MOUNT
  ═══════════════════════════════════════════════════════════════ */
  function mount() {
    const root = document.getElementById('ecologix-root') || document.body;
    injectStyles();
    root.innerHTML = buildHTML();
    loadDeps(initDashboard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

})();
