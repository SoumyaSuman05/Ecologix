/**
 * EcoLogix.AI — Eco-Routing & Sustainable Logistics Platform
 * Self-contained JS module: injects fonts, styles, and full UI into document.body
 * Converted from ecologix-ai.html
 * Usage: <script src="ecologix_routing.js"><\/script>
 */

(function () {

  // ── FONTS ──
 
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Cabinet+Grotesk:wght@300;400;500;700;900&display=swap';
  document.head.appendChild(fontLink);

  // ── PRECONNECT ──
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect);

  // ── STYLES ──
  const styleEl = document.createElement('style');
  styleEl.textContent = `:root {
    --bg: #050f08;
    --bg2: #091410;
    --surface: #0d1f18;
    --surface2: #112920;
    --surface3: #163322;
    --border: #1e4030;
    --border2: #265040;
    --green: #00e87a;
    --green2: #00b55e;
    --green3: #00ff8a;
    --teal: #00d4aa;
    --amber: #f5a623;
    --red: #ff4d6a;
    --blue: #4db8ff;
    --purple: #a855f7;
    --text: #e8f5ef;
    --text2: #8fb8a0;
    --text3: #557565;
    --mono: 'DM Mono', monospace;
    --sans: 'Cabinet Grotesk', sans-serif;
    --display: 'Syne', sans-serif;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* NOISE OVERLAY */
  body::before {
    content:'';
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* GRID BG */
  body::after {
    content:'';
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image: linear-gradient(rgba(0,232,122,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,232,122,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* NAV */
  nav {
    position: fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding: 0 32px;
    height: 64px;
    background: rgba(5,15,8,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    display:flex; align-items:center; gap:10px;
    font-family: var(--display); font-size:1.25rem; font-weight:800;
    letter-spacing: -0.03em; color: var(--text);
  }
  .nav-logo .dot { color: var(--green); }
  .logo-icon {
    width:32px; height:32px;
    background: linear-gradient(135deg, var(--green), var(--teal));
    border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    font-size:1rem;
  }
  .nav-pills {
    display:flex; gap:4px;
    background: var(--surface); border:1px solid var(--border);
    border-radius:100px; padding:4px;
  }
  .nav-pill {
    padding:6px 16px; border-radius:100px;
    font-family: var(--mono); font-size:0.72rem; font-weight:500;
    color: var(--text3); cursor:pointer; border:none; background:none;
    transition: all 0.2s; letter-spacing:0.03em;
  }
  .nav-pill.active, .nav-pill:hover { background: var(--surface2); color: var(--green); }
  .nav-right { display:flex; align-items:center; gap:12px; }
  .badge-live {
    display:flex; align-items:center; gap:6px;
    background: rgba(0,232,122,0.1); border:1px solid rgba(0,232,122,0.3);
    border-radius:100px; padding:4px 12px;
    font-family:var(--mono); font-size:0.68rem; color:var(--green); letter-spacing:0.05em;
  }
  .pulse { width:6px; height:6px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(1.4);} }

  /* LAYOUT */
  .app { padding-top:64px; display:grid; grid-template-columns:260px 1fr; min-height:calc(100vh - 64px); position:relative; z-index:1; }

  /* SIDEBAR */
  .sidebar {
    background: var(--bg2);
    border-right:1px solid var(--border);
    padding: 24px 0;
    display:flex; flex-direction:column; gap:4px;
    overflow-y:auto;
  }
  .sidebar-section { padding:0 16px; margin-bottom:8px; }
  .sidebar-label {
    font-family:var(--mono); font-size:0.6rem; font-weight:500;
    color:var(--text3); letter-spacing:0.12em; text-transform:uppercase;
    padding: 0 8px; margin-bottom:4px;
  }
  .sidebar-item {
    display:flex; align-items:center; gap:10px;
    padding:9px 12px; border-radius:10px; cursor:pointer;
    transition:all 0.15s; font-size:0.85rem; font-weight:500;
    color:var(--text2); border:1px solid transparent;
  }
  .sidebar-item:hover { background:var(--surface); color:var(--text); }
  .sidebar-item.active {
    background: rgba(0,232,122,0.08);
    border-color: rgba(0,232,122,0.2);
    color: var(--green);
  }
  .sidebar-item .icon { width:18px; text-align:center; font-size:0.95rem; }
  .sidebar-item .count {
    margin-left:auto;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:100px; padding:1px 8px;
    font-family:var(--mono); font-size:0.6rem; color:var(--text3);
  }
  .sidebar-item.active .count { background:rgba(0,232,122,0.15); border-color:rgba(0,232,122,0.3); color:var(--green); }
  .sidebar-divider { height:1px; background:var(--border); margin:8px 16px; }
  .eco-score-card {
    margin:16px; background: linear-gradient(135deg, rgba(0,232,122,0.1), rgba(0,212,170,0.05));
    border:1px solid rgba(0,232,122,0.2); border-radius:14px; padding:16px;
  }
  .eco-score-label { font-family:var(--mono); font-size:0.62rem; color:var(--green); letter-spacing:0.1em; text-transform:uppercase; }
  .eco-score-value { font-family:var(--display); font-size:2.4rem; font-weight:800; color:var(--green); line-height:1; margin:4px 0; }
  .eco-score-sub { font-size:0.72rem; color:var(--text3); }
  .eco-score-bar { height:4px; background:var(--border); border-radius:2px; margin-top:10px; overflow:hidden; }
  .eco-score-fill { height:100%; background:linear-gradient(90deg, var(--green2),var(--green3)); border-radius:2px; width:87%; animation: barFill 1.5s ease forwards; }
  @keyframes barFill { from{width:0} }

  /* MAIN */
  main { overflow-y:auto; background:var(--bg); }

  /* HEADER AREA */
  .main-header {
    padding:28px 32px 0;
    display:flex; align-items:flex-start; justify-content:space-between;
  }
  .main-title { font-family:var(--display); font-size:1.6rem; font-weight:800; letter-spacing:-0.03em; }
  .main-subtitle { font-size:0.82rem; color:var(--text3); margin-top:3px; }
  .header-actions { display:flex; gap:10px; align-items:center; }
  .btn {
    padding:9px 18px; border-radius:10px; font-family:var(--sans);
    font-size:0.82rem; font-weight:700; cursor:pointer; border:none;
    transition:all 0.2s; display:flex; align-items:center; gap:7px;
  }
  .btn-primary { background:var(--green); color:#051008; }
  .btn-primary:hover { background:var(--green3); transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,232,122,0.3); }
  .btn-ghost { background:var(--surface); border:1px solid var(--border); color:var(--text2); }
  .btn-ghost:hover { border-color:var(--border2); color:var(--text); }

  /* KPI ROW */
  .kpi-row {
    display:grid; grid-template-columns:repeat(5,1fr); gap:12px;
    padding:20px 32px;
  }
  .kpi-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:14px; padding:16px;
    transition: all 0.2s; cursor:pointer;
    position:relative; overflow:hidden;
  }
  .kpi-card::before {
    content:''; position:absolute; inset:0; opacity:0;
    transition:opacity 0.2s;
  }
  .kpi-card:hover { border-color:var(--border2); transform:translateY(-2px); }
  .kpi-card:hover::before { opacity:1; }
  .kpi-card.green::before { background:radial-gradient(ellipse at top left, rgba(0,232,122,0.06),transparent 70%); }
  .kpi-card.teal::before  { background:radial-gradient(ellipse at top left, rgba(0,212,170,0.06),transparent 70%); }
  .kpi-card.amber::before { background:radial-gradient(ellipse at top left, rgba(245,166,35,0.06),transparent 70%); }
  .kpi-card.red::before   { background:radial-gradient(ellipse at top left, rgba(255,77,106,0.06),transparent 70%); }
  .kpi-card.blue::before  { background:radial-gradient(ellipse at top left, rgba(77,184,255,0.06),transparent 70%); }
  .kpi-label { font-family:var(--mono); font-size:0.62rem; color:var(--text3); letter-spacing:0.08em; text-transform:uppercase; }
  .kpi-value { font-family:var(--display); font-size:1.65rem; font-weight:800; margin:4px 0 2px; line-height:1; }
  .kpi-card.green .kpi-value { color:var(--green); }
  .kpi-card.teal  .kpi-value { color:var(--teal); }
  .kpi-card.amber .kpi-value { color:var(--amber); }
  .kpi-card.red   .kpi-value { color:var(--red); }
  .kpi-card.blue  .kpi-value { color:var(--blue); }
  .kpi-delta {
    font-family:var(--mono); font-size:0.65rem;
    display:flex; align-items:center; gap:4px;
  }
  .delta-up { color:var(--green); }
  .delta-down { color:var(--red); }
  .delta-neutral { color:var(--text3); }

  /* CONTENT GRID */
  .content-grid {
    display:grid; grid-template-columns:1fr 1fr 380px; gap:16px;
    padding:0 32px 24px;
  }
  .content-grid-wide {
    display:grid; grid-template-columns:1fr 420px; gap:16px;
    padding:0 32px;
  }

  /* CARDS */
  .card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; overflow:hidden;
  }
  .card-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px; border-bottom:1px solid var(--border);
  }
  .card-title { font-family:var(--display); font-size:0.95rem; font-weight:700; letter-spacing:-0.01em; }
  .card-badge {
    font-family:var(--mono); font-size:0.62rem; letter-spacing:0.05em;
    padding:3px 10px; border-radius:100px;
  }
  .badge-green { background:rgba(0,232,122,0.12); color:var(--green); border:1px solid rgba(0,232,122,0.25); }
  .badge-amber { background:rgba(245,166,35,0.12); color:var(--amber); border:1px solid rgba(245,166,35,0.25); }
  .badge-red   { background:rgba(255,77,106,0.12); color:var(--red); border:1px solid rgba(255,77,106,0.25); }
  .badge-blue  { background:rgba(77,184,255,0.12); color:var(--blue); border:1px solid rgba(77,184,255,0.25); }
  .badge-teal  { background:rgba(0,212,170,0.12); color:var(--teal); border:1px solid rgba(0,212,170,0.25); }
  .card-body { padding:20px; }

  /* MAP PLACEHOLDER */
  .map-area {
    background: var(--bg2);
    border-radius:12px; height:280px; position:relative; overflow:hidden;
  }
  .map-bg {
    width:100%; height:100%;
    background:
      linear-gradient(rgba(0,232,122,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,232,122,0.02) 1px, transparent 1px);
    background-size: 24px 24px;
    position:relative;
  }
  .map-route {
    position:absolute; inset:0;
  }
  .map-overlay-label {
    position:absolute; bottom:12px; left:12px;
    font-family:var(--mono); font-size:0.62rem; color:var(--text3); letter-spacing:0.06em;
  }
  .map-legend {
    position:absolute; top:12px; right:12px;
    display:flex; flex-direction:column; gap:6px;
    background:rgba(9,20,16,0.9); border:1px solid var(--border);
    border-radius:10px; padding:10px 12px;
  }
  .legend-row { display:flex; align-items:center; gap:7px; font-size:0.7rem; color:var(--text2); }
  .legend-dot { width:8px; height:8px; border-radius:50%; }

  /* ROUTE TABLE */
  .route-table { width:100%; border-collapse:collapse; }
  .route-table th {
    font-family:var(--mono); font-size:0.6rem; color:var(--text3);
    letter-spacing:0.1em; text-transform:uppercase;
    padding:8px 12px; text-align:left;
    border-bottom:1px solid var(--border);
  }
  .route-table td {
    padding:10px 12px; font-size:0.8rem; color:var(--text2);
    border-bottom:1px solid rgba(30,64,48,0.5);
    vertical-align:middle;
  }
  .route-table tr:last-child td { border-bottom:none; }
  .route-table tr:hover td { background:rgba(13,31,24,0.5); }
  .vehicle-id {
    font-family:var(--mono); font-size:0.72rem; color:var(--text);
    background:var(--surface2); border:1px solid var(--border);
    border-radius:6px; padding:2px 8px; display:inline-block;
  }
  .load-bar { height:4px; border-radius:2px; background:var(--border); overflow:hidden; margin-top:4px; }
  .load-fill { height:100%; border-radius:2px; }
  .load-fill.good { background:var(--green); }
  .load-fill.warn { background:var(--amber); }
  .load-fill.danger { background:var(--red); }
  .status-chip {
    display:inline-flex; align-items:center; gap:5px;
    font-family:var(--mono); font-size:0.62rem; letter-spacing:0.04em;
    padding:3px 9px; border-radius:100px;
  }
  .chip-dot { width:5px; height:5px; border-radius:50%; }

  /* ECO-LOAD OPTIMIZER */
  .optimizer-panel { padding:20px; }
  .golden-ratio-display {
    background: linear-gradient(135deg, rgba(0,232,122,0.07), rgba(0,212,170,0.04));
    border:1px solid rgba(0,232,122,0.2); border-radius:14px;
    padding:20px; margin-bottom:16px; text-align:center;
  }
  .gr-title { font-family:var(--mono); font-size:0.62rem; color:var(--green); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px; }
  .gr-value { font-family:var(--display); font-size:3rem; font-weight:800; color:var(--green3); line-height:1; }
  .gr-label { font-size:0.72rem; color:var(--text3); margin-top:4px; }
  .gr-bars { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:16px; }
  .gr-bar-item {}
  .gr-bar-label { display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text2); margin-bottom:5px; }
  .gr-bar-track { height:6px; background:var(--border); border-radius:3px; overflow:hidden; }
  .gr-bar-fill { height:100%; border-radius:3px; }

  /* WEATHER ALERTS */
  .alert-item {
    display:flex; gap:12px; padding:12px;
    border-radius:10px; border:1px solid var(--border);
    margin-bottom:8px; cursor:pointer;
    transition:all 0.15s;
  }
  .alert-item:hover { border-color:var(--border2); background:var(--surface2); }
  .alert-icon { font-size:1.4rem; flex-shrink:0; padding-top:2px; }
  .alert-content {}
  .alert-route { font-family:var(--mono); font-size:0.68rem; color:var(--amber); letter-spacing:0.06em; }
  .alert-msg { font-size:0.78rem; color:var(--text); margin:2px 0; }
  .alert-action { font-size:0.7rem; color:var(--text3); }
  .alert-sms {
    background:rgba(245,166,35,0.05); border-color:rgba(245,166,35,0.2);
  }
  .alert-danger {
    background:rgba(255,77,106,0.05); border-color:rgba(255,77,106,0.2);
  }

  /* TOLL OPTIMIZER */
  .toll-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 0; border-bottom:1px solid var(--border);
  }
  .toll-row:last-child { border:none; }
  .toll-route-name { font-size:0.82rem; font-weight:500; }
  .toll-detail { font-family:var(--mono); font-size:0.68rem; color:var(--text3); margin-top:2px; }
  .toll-cost { font-family:var(--display); font-size:1.1rem; font-weight:700; }
  .toll-savings { font-family:var(--mono); font-size:0.62rem; color:var(--green); }
  .toll-badge {
    width:8px; height:8px; border-radius:50%; margin-right:8px; flex-shrink:0;
  }

  /* MICRO HUB */
  .hub-item {
    display:flex; align-items:center; gap:12px;
    padding:12px; border-radius:10px;
    background:var(--bg2); border:1px solid var(--border);
    margin-bottom:8px; cursor:pointer; transition:all 0.15s;
  }
  .hub-item:hover { border-color:var(--border2); }
  .hub-icon {
    width:38px; height:38px; border-radius:10px;
    background:linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,232,122,0.1));
    border:1px solid rgba(0,212,170,0.25);
    display:flex; align-items:center; justify-content:center; font-size:1.1rem;
    flex-shrink:0;
  }
  .hub-name { font-size:0.82rem; font-weight:600; }
  .hub-detail { font-size:0.72rem; color:var(--text3); margin-top:2px; }
  .hub-add { margin-left:auto; }
  .btn-xs {
    padding:5px 12px; border-radius:8px; font-size:0.7rem; font-weight:700;
    cursor:pointer; border:none; transition:all 0.2s;
  }
  .btn-xs-green { background:rgba(0,232,122,0.15); color:var(--green); border:1px solid rgba(0,232,122,0.3); }
  .btn-xs-green:hover { background:rgba(0,232,122,0.25); }

  /* SMS PANEL */
  .sms-compose {
    background:var(--bg2); border:1px solid var(--border);
    border-radius:12px; padding:16px;
  }
  .sms-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .sms-title { font-family:var(--display); font-size:0.9rem; font-weight:700; }
  .driver-chip {
    display:flex; align-items:center; gap:7px;
    background:var(--surface2); border:1px solid var(--border);
    border-radius:8px; padding:6px 10px; margin-bottom:10px;
    font-size:0.78rem; cursor:pointer; transition:all 0.15s;
  }
  .driver-chip:hover { border-color:var(--border2); }
  .driver-avatar {
    width:24px; height:24px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:0.65rem; font-weight:700; color:#051008;
  }
  .sms-preview {
    background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:12px; font-size:0.75rem;
    color:var(--text2); line-height:1.6; margin-bottom:10px;
    font-family:var(--mono);
  }
  .sms-preview .highlight { color:var(--amber); }

  /* REOPT STREAM */
  .reopt-item {
    display:flex; gap:10px; padding:10px 0;
    border-bottom:1px solid rgba(30,64,48,0.4);
  }
  .reopt-item:last-child { border:none; }
  .reopt-time { font-family:var(--mono); font-size:0.62rem; color:var(--text3); min-width:52px; padding-top:2px; }
  .reopt-event { font-size:0.78rem; }
  .reopt-event strong { color:var(--text); }
  .reopt-tag {
    margin-left:auto; flex-shrink:0;
    font-family:var(--mono); font-size:0.6rem; padding:2px 8px;
    border-radius:100px; align-self:flex-start;
  }

  /* WEIGHT AWARE */
  .terrain-chart { padding:20px; }
  .terrain-bar-group { margin-bottom:14px; }
  .terrain-bar-label { display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text2); margin-bottom:5px; }
  .terrain-bar-track { height:8px; background:var(--border); border-radius:4px; overflow:hidden; position:relative; }
  .terrain-bar-fill { height:100%; border-radius:4px; position:relative; }
  .terrain-bar-fill::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent 70%, rgba(255,255,255,0.1));
  }
  .section-span { display:flex; gap:12px; padding:0 32px 32px; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--border2); }

  /* ANIMATED COUNTER */
  .counting { animation: countUp 2s ease forwards; }

  /* TABS */
  .tabs { display:flex; gap:0; border-bottom:1px solid var(--border); }
  .tab-btn {
    padding:12px 20px; font-size:0.8rem; font-weight:600;
    cursor:pointer; border:none; background:none; color:var(--text3);
    border-bottom:2px solid transparent; margin-bottom:-1px;
    transition:all 0.15s; font-family:var(--sans);
  }
  .tab-btn.active { color:var(--green); border-bottom-color:var(--green); }
  .tab-btn:hover:not(.active) { color:var(--text); }
  .tab-panel { display:none; }
  .tab-panel.active { display:block; }

  /* TOGGLE */
  .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; }
  .toggle-label { font-size:0.8rem; color:var(--text2); }
  .toggle {
    width:38px; height:20px; background:var(--border); border-radius:10px;
    position:relative; cursor:pointer; transition:background 0.2s; flex-shrink:0;
  }
  .toggle.on { background:var(--green2); }
  .toggle::after {
    content:''; position:absolute; top:3px; left:3px;
    width:14px; height:14px; border-radius:50%;
    background:white; transition:left 0.2s;
  }
  .toggle.on::after { left:21px; }

  /* FLOAT ALERT */
  .float-alert {
    position:fixed; bottom:24px; right:24px; z-index:200;
    background:rgba(245,166,35,0.12); border:1px solid rgba(245,166,35,0.4);
    border-radius:14px; padding:14px 18px; max-width:320px;
    backdrop-filter:blur(16px);
    animation: slideUp 0.4s ease;
  }
  @keyframes slideUp { from{transform:translateY(20px);opacity:0} }
  .float-alert-title { font-family:var(--display); font-weight:700; font-size:0.9rem; color:var(--amber); margin-bottom:4px; }
  .float-alert-msg { font-size:0.78rem; color:var(--text2); line-height:1.5; }
  .float-alert-close { position:absolute; top:10px; right:12px; cursor:pointer; color:var(--text3); font-size:1rem; }`;
  document.head.appendChild(styleEl);

  // ── HTML ──
  document.body.innerHTML = `<!-- NAV -->
<nav>
  <div class="nav-logo">
    <div class="logo-icon">🌿</div>
    EcoLogix<span class="dot">.</span>AI
  </div>
  <div class="nav-pills">
    <button class="nav-pill active" onclick="showSection('dashboard')">Dashboard</button>
    <button class="nav-pill" onclick="showSection('optimizer')">Optimizer</button>
    <button class="nav-pill" onclick="showSection('weather')">Weather</button>
    <button class="nav-pill" onclick="showSection('alerts')">Alerts</button>
    <button class="nav-pill" onclick="showSection('analytics')">Analytics</button>
  </div>
  <div class="nav-right">
    <div class="badge-live"><div class="pulse"></div>LIVE TRACKING</div>
    <button class="btn btn-primary" style="padding:7px 14px;font-size:0.78rem;">⚡ Optimize Now</button>
  </div>
</nav>

<div class="app">

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div style="padding:0 16px 4px">
      <div class="eco-score-card">
        <div class="eco-score-label">🌿 Eco Score</div>
        <div class="eco-score-value">87.4</div>
        <div class="eco-score-sub">Carbon efficiency index</div>
        <div class="eco-score-bar"><div class="eco-score-fill"></div></div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-label">Core Modules</div>
      <div class="sidebar-item active"><span class="icon">🗺</span> Route Control <span class="count">14</span></div>
      <div class="sidebar-item"><span class="icon">⚖️</span> Eco-Load Engine <span class="count">6</span></div>
      <div class="sidebar-item"><span class="icon">🌦</span> Weather Layer <span class="count">3</span></div>
      <div class="sidebar-item"><span class="icon">🔔</span> SMS Alerts <span class="count">5</span></div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <div class="sidebar-label">Fleet</div>
      <div class="sidebar-item"><span class="icon">🚛</span> Active Vehicles <span class="count">23</span></div>
      <div class="sidebar-item"><span class="icon">📦</span> Pending Loads <span class="count">41</span></div>
      <div class="sidebar-item"><span class="icon">🏭</span> Micro-Hubs <span class="count">7</span></div>
      <div class="sidebar-item"><span class="icon">💰</span> Toll Optimizer <span class="count">12</span></div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <div class="sidebar-label">Analytics</div>
      <div class="sidebar-item"><span class="icon">📊</span> Emissions Report</div>
      <div class="sidebar-item"><span class="icon">⛽</span> Fuel Savings</div>
      <div class="sidebar-item"><span class="icon">📈</span> Performance KPIs</div>
    </div>

    <div class="sidebar-divider"></div>

    <div style="padding:0 16px">
      <div class="toggle-row">
        <span class="toggle-label">🔄 Auto Re-Optimize</span>
        <div class="toggle on" onclick="this.classList.toggle('on')"></div>
      </div>
      <div class="toggle-row">
        <span class="toggle-label">🌧 Weather Avoidance</span>
        <div class="toggle on" onclick="this.classList.toggle('on')"></div>
      </div>
      <div class="toggle-row">
        <span class="toggle-label">💳 Toll Minimize</span>
        <div class="toggle on" onclick="this.classList.toggle('on')"></div>
      </div>
      <div class="toggle-row">
        <span class="toggle-label">📱 SMS Dispatch</span>
        <div class="toggle on" onclick="this.classList.toggle('on')"></div>
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <main id="main">

    <!-- KPI ROW -->
    <div class="main-header">
      <div>
        <div class="main-title">Route & Load Intelligence</div>
        <div class="main-subtitle">Eco-Load Optimizer · Real-Time Mode · Updated <span id="clock">--:--:--</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">📥 Export Report</button>
        <button class="btn btn-primary" onclick="runOptimization()">🧠 Run AI Optimization</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card green">
        <div class="kpi-label">CO₂ Saved Today</div>
        <div class="kpi-value">2.47t</div>
        <div class="kpi-delta delta-up">↑ 18.3% vs yesterday</div>
      </div>
      <div class="kpi-card teal">
        <div class="kpi-label">Avg Load Utilization</div>
        <div class="kpi-value">81.6%</div>
        <div class="kpi-delta delta-up">↑ 6.1% this week</div>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-label">Fuel Efficiency</div>
        <div class="kpi-value">94.2%</div>
        <div class="kpi-delta delta-up">↑ 3.8% optimized</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-label">On-Time Delivery</div>
        <div class="kpi-value">97.1%</div>
        <div class="kpi-delta delta-neutral">→ 0.3% stable</div>
      </div>
      <div class="kpi-card red">
        <div class="kpi-label">Weather Alerts</div>
        <div class="kpi-value">3</div>
        <div class="kpi-delta delta-down">⚠ 2 SMS sent</div>
      </div>
    </div>

    <!-- TABS FOR SECTIONS -->
    <div style="padding:0 32px">
      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab(this,'tab-routes')">🗺 Active Routes</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-ecoload')">⚖️ Eco-Load Engine</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-weather')">🌦 Weather & Alerts</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-tolls')">💳 Toll Optimizer</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-hubs')">🏭 Micro-Hubs</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-reopt')">🔄 Re-Optimization</button>
      </div>
    </div>

    <!-- TAB: ROUTES -->
    <div id="tab-routes" class="tab-panel active" style="padding:20px 32px">
      <div style="display:grid;grid-template-columns:1fr 340px;gap:16px">
        <div>
          <!-- MAP -->
          <div class="card" style="margin-bottom:16px">
            <div class="card-header">
              <span class="card-title">Live Route Map</span>
              <div style="display:flex;gap:8px">
                <span class="card-badge badge-green">23 Active</span>
                <span class="card-badge badge-amber">3 Rerouting</span>
              </div>
            </div>
            <div class="card-body" style="padding:16px">
              <div class="map-area">
                <div class="map-bg">
                  <svg class="map-route" viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
                    <!-- Grid dots -->
                    <defs>
                      <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#00e87a" stop-opacity="0.6"/>
                        <stop offset="100%" stop-color="#00e87a" stop-opacity="0"/>
                      </radialGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <!-- Route lines - optimized (green) -->
                    <path d="M60,200 C120,180 180,140 260,120 S380,90 480,80" stroke="#00e87a" stroke-width="2" fill="none" stroke-dasharray="6,3" opacity="0.8"/>
                    <path d="M60,200 C100,220 160,240 240,230 S380,210 520,190" stroke="#00e87a" stroke-width="2" fill="none" opacity="0.6"/>
                    <!-- Weather-avoided route (amber dashed) -->
                    <path d="M260,120 C300,100 340,70 400,60 S460,55 510,60" stroke="#f5a623" stroke-width="1.5" fill="none" stroke-dasharray="4,4" opacity="0.7"/>
                    <!-- Reroute (blue) -->
                    <path d="M240,230 C280,200 320,180 360,160 S420,130 480,120" stroke="#4db8ff" stroke-width="1.5" fill="none" stroke-dasharray="5,2" opacity="0.6"/>
                    <!-- Nodes / hubs -->
                    <circle cx="60" cy="200" r="10" fill="url(#nodeGlow)"/>
                    <circle cx="60" cy="200" r="5" fill="#00e87a" filter="url(#glow)"/>
                    <circle cx="260" cy="120" r="8" fill="rgba(0,232,122,0.2)"/>
                    <circle cx="260" cy="120" r="4" fill="#00e87a"/>
                    <circle cx="480" cy="80" r="8" fill="rgba(0,232,122,0.2)"/>
                    <circle cx="480" cy="80" r="4" fill="#00e87a"/>
                    <circle cx="520" cy="190" r="8" fill="rgba(0,232,122,0.2)"/>
                    <circle cx="520" cy="190" r="4" fill="#00e87a"/>
                    <!-- Micro hubs -->
                    <rect x="155" y="132" width="14" height="14" rx="3" fill="rgba(0,212,170,0.3)" stroke="#00d4aa" stroke-width="1"/>
                    <text x="162" y="143" font-size="8" fill="#00d4aa" text-anchor="middle">H</text>
                    <rect x="348" y="152" width="14" height="14" rx="3" fill="rgba(0,212,170,0.3)" stroke="#00d4aa" stroke-width="1"/>
                    <text x="355" y="163" font-size="8" fill="#00d4aa" text-anchor="middle">H</text>
                    <!-- Weather warning zone -->
                    <ellipse cx="400" cy="62" rx="55" ry="30" fill="rgba(255,77,106,0.08)" stroke="rgba(255,77,106,0.3)" stroke-width="1" stroke-dasharray="3,2"/>
                    <text x="400" y="58" font-size="9" fill="#ff4d6a" text-anchor="middle">⛈ Storm</text>
                    <text x="400" y="70" font-size="8" fill="rgba(255,77,106,0.7)" text-anchor="middle">AVOIDED</text>
                    <!-- Moving truck icons -->
                    <text x="200" y="133" font-size="13" fill="#00e87a" opacity="0.9">🚛</text>
                    <text x="330" y="200" font-size="13" fill="#00e87a" opacity="0.9">🚛</text>
                    <text x="430" y="105" font-size="13" fill="#4db8ff" opacity="0.9">🚛</text>
                    <!-- Labels -->
                    <text x="64" y="215" font-size="8" fill="#557565">DEPOT A</text>
                    <text x="475" y="96" font-size="8" fill="#557565">DEPOT B</text>
                    <text x="515" y="205" font-size="8" fill="#557565">DEPOT C</text>
                  </svg>
                </div>
                <div class="map-legend">
                  <div class="legend-row"><div class="legend-dot" style="background:#00e87a"></div>Optimized Route</div>
                  <div class="legend-row"><div class="legend-dot" style="background:#f5a623"></div>Weather Detour</div>
                  <div class="legend-row"><div class="legend-dot" style="background:#4db8ff"></div>Rerouting</div>
                  <div class="legend-row"><div class="legend-dot" style="background:#00d4aa"></div>Micro-Hub</div>
                </div>
                <div class="map-overlay-label">ECOLOGIX.AI · ROUTE INTELLIGENCE · LIVE</div>
              </div>
            </div>
          </div>

          <!-- ROUTE TABLE -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Active Routes</span>
              <button class="btn btn-ghost" style="padding:5px 12px;font-size:0.75rem;">Filter ▾</button>
            </div>
            <table class="route-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Route</th>
                  <th>Load</th>
                  <th>ETA</th>
                  <th>CO₂</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="routeTableBody"></tbody>
            </table>
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div>
          <!-- DISPATCH QUEUE -->
          <div class="card" style="margin-bottom:16px">
            <div class="card-header">
              <span class="card-title">Dispatch Queue</span>
              <span class="card-badge badge-amber">4 Pending</span>
            </div>
            <div class="card-body" style="padding:12px">
              <div id="dispatchQueue"></div>
            </div>
          </div>

          <!-- WEIGHT-AWARE -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">⛰ Weight-Aware Routing</span>
              <span class="card-badge badge-teal">Active</span>
            </div>
            <div class="terrain-chart">
              <div style="font-size:0.75rem;color:var(--text3);margin-bottom:12px">Terrain penalty analysis for loaded routes</div>
              <div class="terrain-bar-group">
                <div class="terrain-bar-label"><span>NH-44 (Steep: 8%)</span><span style="color:var(--red)">+18% fuel</span></div>
                <div class="terrain-bar-track"><div class="terrain-bar-fill" style="width:78%;background:linear-gradient(90deg,#ff4d6a,#f5a623)"></div></div>
              </div>
              <div class="terrain-bar-group">
                <div class="terrain-bar-label"><span>NH-48 (Moderate: 3%)</span><span style="color:var(--amber)">+6% fuel</span></div>
                <div class="terrain-bar-track"><div class="terrain-bar-fill" style="width:42%;background:linear-gradient(90deg,var(--amber),#ffe066)"></div></div>
              </div>
              <div class="terrain-bar-group">
                <div class="terrain-bar-label"><span>SH-27 (Flat: 0.5%)</span><span style="color:var(--green)">optimal</span></div>
                <div class="terrain-bar-track"><div class="terrain-bar-fill" style="width:12%;background:var(--green)"></div></div>
              </div>
              <div class="terrain-bar-group">
                <div class="terrain-bar-label"><span>Ring Road West (Flat)</span><span style="color:var(--green)">optimal</span></div>
                <div class="terrain-bar-track"><div class="terrain-bar-fill" style="width:8%;background:var(--green)"></div></div>
              </div>
              <div style="margin-top:14px;padding:10px;background:rgba(0,232,122,0.06);border:1px solid rgba(0,232,122,0.2);border-radius:8px;font-size:0.72rem;color:var(--text2)">
                <strong style="color:var(--green)">AI Recommendation:</strong> Routing 8 heavy-load vehicles via SH-27 + Ring Road West. Estimated fuel saving: <strong style="color:var(--green)">₹4,280</strong> today.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: ECO-LOAD ENGINE -->
    <div id="tab-ecoload" class="tab-panel" style="padding:20px 32px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <!-- GOLDEN RATIO -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">φ Dynamic Threshold — Golden Ratio Dispatch</span>
            <span class="card-badge badge-green">AI Active</span>
          </div>
          <div class="optimizer-panel">
            <div class="golden-ratio-display">
              <div class="gr-title">Eco-Dispatch Threshold (φ ratio)</div>
              <div class="gr-value" id="grValue">1.618</div>
              <div class="gr-label">Carbon Efficiency ÷ Delivery Urgency Balance</div>
              <div class="gr-bars">
                <div class="gr-bar-item">
                  <div class="gr-bar-label"><span>Carbon Efficiency</span><span style="color:var(--green)">72%</span></div>
                  <div class="gr-bar-track"><div class="gr-bar-fill" style="width:72%;background:linear-gradient(90deg,var(--green2),var(--green))"></div></div>
                </div>
                <div class="gr-bar-item">
                  <div class="gr-bar-label"><span>Delivery Urgency</span><span style="color:var(--amber)">44%</span></div>
                  <div class="gr-bar-track"><div class="gr-bar-fill" style="width:44%;background:linear-gradient(90deg,#d4870a,var(--amber))"></div></div>
                </div>
                <div class="gr-bar-item">
                  <div class="gr-bar-label"><span>Load Utilization</span><span style="color:var(--teal)">81%</span></div>
                  <div class="gr-bar-track"><div class="gr-bar-fill" style="width:81%;background:linear-gradient(90deg,#009e80,var(--teal))"></div></div>
                </div>
                <div class="gr-bar-item">
                  <div class="gr-bar-label"><span>Fuel Penalty Risk</span><span style="color:var(--red)">23%</span></div>
                  <div class="gr-bar-track"><div class="gr-bar-fill" style="width:23%;background:linear-gradient(90deg,#c01,var(--red))"></div></div>
                </div>
              </div>
            </div>
            <div style="font-size:0.78rem;color:var(--text2);line-height:1.7;background:var(--bg2);border-radius:10px;padding:14px;border:1px solid var(--border)">
              <strong style="color:var(--text);display:block;margin-bottom:6px">How the φ Engine Works</strong>
              Instead of dispatching when a vehicle is 100% full (wasteful waiting) or immediately (empty trips), EcoLogix.AI calculates the <em style="color:var(--green)">golden ratio balance point</em>: when the combined carbon saving from adding more load equals 1.618× the cost of urgency delay. This prevents under-loaded trips while avoiding late deliveries.
            </div>
            <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
              <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
                <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">DISPATCH THRESHOLD</div>
                <div style="font-family:var(--display);font-size:1.4rem;font-weight:800;color:var(--green)">62%</div>
                <div style="font-size:0.68rem;color:var(--text3)">min load to depart</div>
              </div>
              <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
                <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">SAVED TRIPS</div>
                <div style="font-family:var(--display);font-size:1.4rem;font-weight:800;color:var(--teal)">38</div>
                <div style="font-size:0.68rem;color:var(--text3)">consolidated today</div>
              </div>
              <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
                <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">CO₂ AVOIDED</div>
                <div style="font-family:var(--display);font-size:1.4rem;font-weight:800;color:var(--green)">1.2t</div>
                <div style="font-size:0.68rem;color:var(--text3)">from consolidation</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LOAD SIMULATION -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Load Simulation Engine</span>
            <span class="card-badge badge-teal">Live</span>
          </div>
          <div class="card-body">
            <div style="font-size:0.78rem;color:var(--text3);margin-bottom:16px">Drag sliders to simulate load scenarios and view real-time eco impact</div>
            <div id="loadSimPanel"></div>
            <div id="simResult" style="margin-top:16px;padding:14px;background:rgba(0,232,122,0.06);border:1px solid rgba(0,232,122,0.2);border-radius:10px;font-size:0.78rem;color:var(--text2)">
              <strong style="color:var(--green)">Simulation Result:</strong> At current load configuration, <span id="simCO2">2.1t</span> CO₂ saved vs full-trip dispatch. Dispatch recommended at <span id="simThreshold" style="color:var(--green)">φ threshold</span>.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: WEATHER -->
    <div id="tab-weather" class="tab-panel" style="padding:20px 32px">
      <div style="display:grid;grid-template-columns:1fr 380px;gap:16px">
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="card-header">
              <span class="card-title">🌦 Weather-Aware Route Intelligence</span>
              <span class="card-badge badge-red">3 Alerts Active</span>
            </div>
            <div class="card-body">
              <div id="weatherAlerts"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">Safe Route Alternatives</span>
              <span class="card-badge badge-green">AI Generated</span>
            </div>
            <div class="card-body">
              <div id="safeAlternatives"></div>
            </div>
          </div>
        </div>

        <!-- SMS PANEL -->
        <div>
          <div class="card">
            <div class="card-header">
              <span class="card-title">📱 Inter-State SMS Alerts</span>
              <span class="card-badge badge-amber">Auto-Dispatch</span>
            </div>
            <div class="card-body">
              <div class="sms-compose">
                <div class="sms-header-row">
                  <div class="sms-title">Alert Preview</div>
                  <span class="card-badge badge-red">Urgent</span>
                </div>
                <div id="smsDrivers" style="margin-bottom:12px"></div>
                <div class="sms-preview" id="smsPreview">
                  <span style="color:var(--teal)">[EcoLogix.AI Alert]</span><br>
                  Driver: <span class="highlight">Ravi Kumar</span><br>
                  Route: <span class="highlight">NH-44 · Nagpur→Hyderabad</span><br>
                  ⚠ <span class="highlight">Heavy Storm</span> detected at km 240–310<br>
                  Avoid: Yavatmal stretch<br>
                  Alt: <span style="color:var(--green)">SH-27 via Hingoli (+42km)</span><br>
                  ETA impact: <span class="highlight">+38 min</span><br>
                  Safe window: <span style="color:var(--green)">After 18:30 IST</span>
                </div>
                <button class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:8px" onclick="sendSMS()">📲 Send SMS Alerts (3 drivers)</button>
                <button class="btn btn-ghost" style="width:100%;justify-content:center">Schedule for Later</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: TOLLS -->
    <div id="tab-tolls" class="tab-panel" style="padding:20px 32px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="card">
          <div class="card-header">
            <span class="card-title">💳 Toll Cost Comparison</span>
            <span class="card-badge badge-green">₹8,420 saved today</span>
          </div>
          <div class="card-body" id="tollTable"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Route Efficiency Matrix</span>
            <span class="card-badge badge-teal">AI Ranked</span>
          </div>
          <div class="card-body">
            <div id="tollMatrix"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: MICRO-HUBS -->
    <div id="tab-hubs" class="tab-panel" style="padding:20px 32px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="card">
          <div class="card-header">
            <span class="card-title">🏭 Nearby Micro-Hub Pickups</span>
            <span class="card-badge badge-green">7 Available</span>
          </div>
          <div class="card-body" id="microHubs"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Detour Impact Analysis</span>
            <span class="card-badge badge-teal">Real-time</span>
          </div>
          <div class="card-body" id="detourAnalysis"></div>
        </div>
      </div>
    </div>

    <!-- TAB: RE-OPTIMIZATION -->
    <div id="tab-reopt" class="tab-panel" style="padding:20px 32px">
      <div style="display:grid;grid-template-columns:1fr 380px;gap:16px">
        <div class="card">
          <div class="card-header">
            <span class="card-title">🔄 Real-Time Re-Optimization Stream</span>
            <div style="display:flex;gap:8px">
              <span class="card-badge badge-green">Running</span>
              <span class="card-badge badge-blue">Cycle: 90s</span>
            </div>
          </div>
          <div class="card-body" id="reoptStream" style="max-height:400px;overflow-y:auto"></div>
        </div>
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="card-header">
              <span class="card-title">Optimization Settings</span>
            </div>
            <div class="card-body" id="reoptSettings"></div>
          </div>
          <div class="card">
            <div class="card-header">
              <span class="card-title">Performance Delta</span>
              <span class="card-badge badge-green">vs Baseline</span>
            </div>
            <div class="card-body" id="perfDelta"></div>
          </div>
        </div>
      </div>
    </div>

  </main>
</div>

<!-- FLOAT ALERT -->
<div class="float-alert" id="floatAlert">
  <div class="float-alert-close" onclick="document.getElementById('floatAlert').style.display='none'">✕</div>
  <div class="float-alert-title">⛈ Weather Alert Triggered</div>
  <div class="float-alert-msg">Heavy storm detected on NH-44 (km 240–310). 3 vehicles auto-rerouted via SH-27. SMS alerts dispatched.</div>
</div>`;

  // ── LOGIC ──
  // Clock
function updateClock() {
  const el = document.getElementById('clock');
  if(el) el.textContent = new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'});
}
setInterval(updateClock, 1000); updateClock();

// Tab switching
window.switchTab = function(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ROUTE TABLE DATA
const routes = [
  { id:'VH-041', route:'Pune → Mumbai', load:88, loadColor:'good', eta:'14:22', co2:'0.18t', status:'In Transit', chipColor:'badge-green' },
  { id:'VH-017', route:'Nagpur → Hyderabad', load:75, loadColor:'good', eta:'18:45', co2:'0.31t', status:'Rerouting', chipColor:'badge-amber' },
  { id:'VH-082', route:'Bangalore → Chennai', load:62, loadColor:'warn', eta:'15:10', co2:'0.22t', status:'In Transit', chipColor:'badge-green' },
  { id:'VH-055', route:'Delhi → Jaipur', load:91, loadColor:'good', eta:'13:30', co2:'0.14t', status:'On Route', chipColor:'badge-green' },
  { id:'VH-029', route:'Mumbai → Surat', load:47, loadColor:'warn', eta:'17:00', co2:'0.19t', status:'Loading', chipColor:'badge-blue' },
  { id:'VH-064', route:'Hyderabad → Vijayawada', load:33, loadColor:'danger', eta:'19:20', co2:'0.26t', status:'Pending', chipColor:'badge-red' },
];
const tbody = document.getElementById('routeTableBody');
routes.forEach(r => {
  tbody.innerHTML += `<tr>
    <td><span class="vehicle-id">${r.id}</span></td>
    <td style="color:var(--text);font-size:0.82rem">${r.route}</td>
    <td style="min-width:90px">
      <span style="font-family:var(--mono);font-size:0.7rem">${r.load}%</span>
      <div class="load-bar"><div class="load-fill ${r.loadColor}" style="width:${r.load}%"></div></div>
    </td>
    <td><span style="font-family:var(--mono);font-size:0.75rem">${r.eta}</span></td>
    <td><span style="font-family:var(--mono);font-size:0.75rem;color:var(--green)">${r.co2}</span></td>
    <td><span class="status-chip card-badge ${r.chipColor}"><span class="chip-dot" style="background:currentColor"></span>${r.status}</span></td>
  </tr>`;
});

// DISPATCH QUEUE
const dispatchItems = [
  { id:'VH-103', load:58, dest:'Nashik', urgency:'High', time:'12 min' },
  { id:'VH-107', load:41, dest:'Kolhapur', urgency:'Med', time:'28 min' },
  { id:'VH-112', load:67, dest:'Aurangabad', urgency:'High', time:'5 min' },
  { id:'VH-118', load:38, dest:'Solapur', urgency:'Low', time:'45 min' },
];
const dq = document.getElementById('dispatchQueue');
dispatchItems.forEach(d => {
  const urgColor = d.urgency==='High'?'var(--red)':d.urgency==='Med'?'var(--amber)':'var(--text3)';
  dq.innerHTML += `<div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;cursor:pointer" onmouseenter="this.style.borderColor='var(--border2)'" onmouseleave="this.style.borderColor='var(--border)'">
    <div style="font-family:var(--mono);font-size:0.68rem;color:var(--text)">${d.id}</div>
    <div style="flex:1;font-size:0.75rem;color:var(--text2)">${d.dest}</div>
    <div style="font-family:var(--mono);font-size:0.65rem;color:var(--green)">${d.load}%</div>
    <div style="font-family:var(--mono);font-size:0.6rem;color:${urgColor};background:rgba(0,0,0,0.3);padding:2px 7px;border-radius:6px">${d.urgency}</div>
    <div style="font-family:var(--mono);font-size:0.62rem;color:var(--text3)">${d.time}</div>
  </div>`;
});

// LOAD SIM PANEL
const simVehicles = [
  { id:'VH-041', capacity:100, current:88 },
  { id:'VH-029', capacity:100, current:47 },
  { id:'VH-064', capacity:100, current:33 },
];
const simPanel = document.getElementById('loadSimPanel');
simVehicles.forEach((v,i) => {
  simPanel.innerHTML += `<div style="margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span style="font-family:var(--mono);font-size:0.72rem;color:var(--text)">${v.id}</span>
      <span style="font-family:var(--mono);font-size:0.72rem;color:var(--green)" id="sim-val-${i}">${v.current}%</span>
    </div>
    <input type="range" min="0" max="100" value="${v.current}" style="width:100%;accent-color:var(--green);cursor:pointer"
      oninput="updateSim(${i},this.value)">
    <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--text3);margin-top:3px">
      <span>Empty</span><span>φ Threshold (62%)</span><span>Full</span>
    </div>
  </div>`;
});
function updateSim(idx, val) {
  document.getElementById('sim-val-'+idx).textContent = val+'%';
  const avg = Array.from(document.querySelectorAll('input[type=range]')).reduce((a,b)=>a+parseInt(b.value),0)/3;
  document.getElementById('simCO2').textContent = (avg*0.03).toFixed(1)+'t';
  document.getElementById('simThreshold').textContent = avg >= 62 ? '✓ READY TO DISPATCH' : `Wait for ${(62-avg).toFixed(0)}% more load`;
  document.getElementById('simThreshold').style.color = avg >= 62 ? 'var(--green)' : 'var(--amber)';
}

// WEATHER ALERTS
const weatherData = [
  { icon:'⛈', route:'NH-44 · Nagpur→Hyderabad', msg:'Heavy thunderstorm, 80mm/hr rainfall at km 240–310. Reduced visibility.', action:'Alt: SH-27 via Hingoli recommended', cls:'alert-danger' },
  { icon:'🌧', route:'NH-16 · Vijayawada→Chennai', msg:'Moderate to heavy rainfall expected 15:00–20:00 IST. Flooding risk near Nellore.', action:'Alt: NH-716 via Tirupati (safer, +55km)', cls:'alert-sms' },
  { icon:'🌬', route:'NH-48 · Bangalore→Pune', msg:'High wind advisory (>70 kmph) near Western Ghats section.', action:'Delay departure by 2hr OR use NH-4 lower route', cls:'alert-sms' },
];
const wa = document.getElementById('weatherAlerts');
weatherData.forEach(w => {
  wa.innerHTML += `<div class="alert-item ${w.cls}">
    <div class="alert-icon">${w.icon}</div>
    <div class="alert-content">
      <div class="alert-route">${w.route}</div>
      <div class="alert-msg">${w.msg}</div>
      <div class="alert-action">💡 ${w.action}</div>
    </div>
  </div>`;
});

// SAFE ALTERNATIVES
const safeAlts = [
  { from:'NH-44 Storm Zone', to:'SH-27 via Hingoli', extra:'+42km', delay:'+38 min', saving:'Safe arrival guaranteed', color:'var(--green)' },
  { from:'NH-16 Flood Risk', to:'NH-716 via Tirupati', extra:'+55km', delay:'+48 min', saving:'No weather risk', color:'var(--teal)' },
  { from:'NH-48 Wind Zone', to:'NH-4 Lower Route', extra:'+28km', delay:'+22 min', saving:'Stable conditions', color:'var(--green)' },
];
const sa = document.getElementById('safeAlternatives');
safeAlts.forEach(a => {
  sa.innerHTML += `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px">
    <div style="font-size:1.2rem">🛣</div>
    <div style="flex:1">
      <div style="font-size:0.72rem;color:var(--text3)">Avoid: <span style="color:var(--red)">${a.from}</span></div>
      <div style="font-size:0.82rem;font-weight:600;color:var(--text)">${a.to}</div>
    </div>
    <div style="text-align:right">
      <div style="font-family:var(--mono);font-size:0.68rem;color:var(--amber)">${a.extra} · ${a.delay}</div>
      <div style="font-family:var(--mono);font-size:0.62rem;color:${a.color}">${a.saving}</div>
    </div>
  </div>`;
});

// SMS DRIVERS
const drivers = [
  { name:'Ravi Kumar', route:'NH-44', avatar:'RK', color:'#00e87a', selected:true },
  { name:'Suresh Patil', route:'NH-16', avatar:'SP', color:'#4db8ff', selected:true },
  { name:'Manoj Singh', route:'NH-48', avatar:'MS', color:'#f5a623', selected:true },
];
const smsDiv = document.getElementById('smsDrivers');
drivers.forEach(d => {
  smsDiv.innerHTML += `<div class="driver-chip" onclick="toggleDriver(this)">
    <div class="driver-avatar" style="background:${d.color}">${d.avatar}</div>
    <div style="flex:1">
      <div style="font-size:0.78rem;font-weight:600">${d.name}</div>
      <div style="font-size:0.65rem;color:var(--text3)">${d.route}</div>
    </div>
    <div style="font-family:var(--mono);font-size:0.62rem;color:var(--green)">✓ SELECTED</div>
  </div>`;
});
function toggleDriver(el) {
  const span = el.querySelector('div:last-child');
  if(span.textContent==='✓ SELECTED'){span.textContent='○ SKIP';span.style.color='var(--text3)';}
  else{span.textContent='✓ SELECTED';span.style.color='var(--green)';}
}

// TOLL DATA
const tolls = [
  { route:'NH-44 Direct', tolls:8, cost:'₹1,840', saved:'—', badge:'#ff4d6a', recommended:false },
  { route:'SH-27 Alt (Weather Alt)', tolls:3, cost:'₹680', saved:'₹1,160', badge:'#00e87a', recommended:true },
  { route:'NH-48 Via Expressway', tolls:12, cost:'₹2,640', saved:'—', badge:'#f5a623', recommended:false },
  { route:'NH-48 Inner Road', tolls:4, cost:'₹880', saved:'₹1,760', badge:'#00e87a', recommended:true },
  { route:'Ring Road Express', tolls:2, cost:'₹420', saved:'₹2,220', badge:'#00d4aa', recommended:true },
];
const tollDiv = document.getElementById('tollTable');
tolls.forEach(t => {
  tollDiv.innerHTML += `<div class="toll-row">
    <div style="display:flex;align-items:center">
      <div class="toll-badge" style="background:${t.badge}"></div>
      <div>
        <div class="toll-route-name">${t.route} ${t.recommended?'<span style="font-size:0.6rem;color:var(--green);background:rgba(0,232,122,0.1);padding:1px 6px;border-radius:4px;margin-left:6px">✓ BEST</span>':''}</div>
        <div class="toll-detail">${t.tolls} toll points</div>
      </div>
    </div>
    <div style="text-align:right">
      <div class="toll-cost" style="color:${t.recommended?'var(--green)':'var(--text2)'}">${t.cost}</div>
      ${t.saved!=='—'?`<div class="toll-savings">saved ${t.saved}</div>`:''}
    </div>
  </div>`;
});

// TOLL MATRIX
const tollMatrixDiv = document.getElementById('tollMatrix');
const matrix = [
  { route:'Ring Road Express', score:94, distance:'148km', time:'2h10m', co2:'0.12t', color:'var(--green)' },
  { route:'SH-27 Alt', score:88, distance:'192km', time:'2h52m', co2:'0.16t', color:'var(--green)' },
  { route:'NH-48 Inner', score:76, distance:'165km', time:'2h30m', co2:'0.18t', color:'var(--teal)' },
  { route:'NH-44 Direct', score:51, distance:'210km', time:'3h15m', co2:'0.31t', color:'var(--amber)' },
];
matrix.forEach(m => {
  tollMatrixDiv.innerHTML += `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
    <div style="width:40px;height:40px;background:rgba(0,0,0,0.3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:1rem;font-weight:800;color:${m.color};border:1px solid ${m.color}33">${m.score}</div>
    <div style="flex:1">
      <div style="font-size:0.82rem;font-weight:600">${m.route}</div>
      <div style="font-family:var(--mono);font-size:0.65rem;color:var(--text3)">${m.distance} · ${m.time} · CO₂: ${m.co2}</div>
    </div>
  </div>`;
});

// MICRO HUBS
const hubs = [
  { name:'Wagholi Hub', pkgs:14, detour:'0.8km', saving:'4 trips consolidated', icon:'📦' },
  { name:'Hadapsar Pickup', pkgs:7, detour:'1.4km', saving:'2 vehicles merged', icon:'🏭' },
  { name:'Kharadi Depot', pkgs:22, detour:'0.3km', saving:'On-route, zero detour', icon:'⚡' },
  { name:'Viman Nagar Hub', pkgs:9, detour:'2.1km', saving:'3 trips saved', icon:'📦' },
];
const mh = document.getElementById('microHubs');
hubs.forEach(h => {
  mh.innerHTML += `<div class="hub-item">
    <div class="hub-icon">${h.icon}</div>
    <div style="flex:1">
      <div class="hub-name">${h.name}</div>
      <div class="hub-detail">${h.pkgs} packages · +${h.detour} detour · ${h.saving}</div>
    </div>
    <div class="hub-add"><button class="btn-xs btn-xs-green" onclick="this.textContent=this.textContent==='+ Add'?'✓ Added':'+ Add'">+ Add</button></div>
  </div>`;
});

const detourDiv = document.getElementById('detourAnalysis');
detourDiv.innerHTML = `
  <div style="font-size:0.75rem;color:var(--text3);margin-bottom:14px">Impact of adding all nearby micro-hub pickups</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">EXTRA DISTANCE</div>
      <div style="font-family:var(--display);font-size:1.5rem;font-weight:800;color:var(--amber)">+4.6km</div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">TRIPS AVOIDED</div>
      <div style="font-family:var(--display);font-size:1.5rem;font-weight:800;color:var(--green)">9</div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">FUEL SAVED</div>
      <div style="font-family:var(--display);font-size:1.5rem;font-weight:800;color:var(--green)">48L</div>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
      <div style="font-family:var(--mono);font-size:0.6rem;color:var(--text3)">CO₂ REDUCED</div>
      <div style="font-family:var(--display);font-size:1.5rem;font-weight:800;color:var(--teal)">0.38t</div>
    </div>
  </div>
  <div style="background:rgba(0,232,122,0.06);border:1px solid rgba(0,232,122,0.2);border-radius:10px;padding:12px;font-size:0.75rem;color:var(--text2)">
    <strong style="color:var(--green)">Net verdict:</strong> Adding all 4 micro-hubs adds only 4.6km of detour but eliminates 9 separate trips. Net CO₂ reduction: <strong style="color:var(--green)">87%</strong> per package delivered.
  </div>`;

// REOPT STREAM
const reoptEvents = [
  { time:'14:07:42', event:'<strong>VH-017</strong> rerouted via SH-27 — storm avoidance triggered', tag:'WEATHER', tc:'badge-amber' },
  { time:'14:06:18', event:'<strong>VH-041</strong> load rebalanced with Kharadi hub pickup (+8 pkgs)', tag:'LOAD', tc:'badge-green' },
  { time:'14:04:55', event:'Golden ratio threshold updated: Carbon urgency ratio → φ 1.618', tag:'ALGO', tc:'badge-teal' },
  { time:'14:03:30', event:'<strong>VH-055</strong> toll route switched — saved ₹340 via Ring Road', tag:'TOLL', tc:'badge-blue' },
  { time:'14:02:10', event:'Traffic congestion detected on NH-48, 3 vehicles pre-rerouted', tag:'TRAFFIC', tc:'badge-amber' },
  { time:'14:00:45', event:'SMS dispatched to 3 drivers re: NH-44 storm advisory', tag:'SMS', tc:'badge-red' },
  { 
  time: '13:59:22',
  event: `<strong>VH-082x</strong> weight routing: NH-27 selected over NH-44 (6% fuel)`,
  tag: 'WEIGHT',
  tc: 'badge-green'
},
  { time:'13:57:08', event:'Re-optimization cycle #48 completed. 6 routes improved.', tag:'CYCLE', tc:'badge-teal' },
];
const rs = document.getElementById('reoptStream');
reoptEvents.forEach(e => {
  rs.innerHTML += `<div class="reopt-item">
    <div class="reopt-time">${e.time}</div>
    <div class="reopt-event" style="flex:1;line-height:1.5">${e.event}</div>
    <span class="reopt-tag card-badge ${e.tc}">${e.tag}</span>
  </div>`;
});
// Simulate live append
setInterval(() => {
  const now = new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const events = [
    `<strong>VH-0${Math.floor(40+Math.random()*80)}</strong> load updated: ${Math.floor(50+Math.random()*45)}% — φ threshold ${Math.random()>0.5?'met':'approaching'}`,
    `Re-optimization cycle completed. ${Math.floor(2+Math.random()*5)} routes improved.`,
    `Micro-hub pickup added to VH-0${Math.floor(40+Math.random()*80)}: +${Math.floor(3+Math.random()*12)} packages`,
    `CO₂ projection updated: ${(2+Math.random()*0.8).toFixed(2)}t saved today`,
  ];
  const tags = [['LOAD','badge-green'],['CYCLE','badge-teal'],['MICRO','badge-blue'],['ECO','badge-green']];
  const idx = Math.floor(Math.random()*events.length);
  const newRow = document.createElement('div');
  newRow.className = 'reopt-item';
  newRow.style.animation = 'slideUp 0.3s ease';
  newRow.innerHTML = `<div class="reopt-time">${now}</div><div class="reopt-event" style="flex:1;line-height:1.5">${events[idx]}</div><span class="reopt-tag card-badge ${tags[idx][1]}">${tags[idx][0]}</span>`;
  rs.insertBefore(newRow, rs.firstChild);
  if(rs.children.length > 20) rs.removeChild(rs.lastChild);
}, 8000);

// REOPT SETTINGS
document.getElementById('reoptSettings').innerHTML = `
  <div class="toggle-row"><span class="toggle-label" style="font-size:0.75rem">Traffic-based rerouting</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
  <div class="toggle-row"><span class="toggle-label" style="font-size:0.75rem">Weather-triggered rerouting</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
  <div class="toggle-row"><span class="toggle-label" style="font-size:0.75rem">Toll minimization</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
  <div class="toggle-row"><span class="toggle-label" style="font-size:0.75rem">Load rebalancing</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
  <div class="toggle-row"><span class="toggle-label" style="font-size:0.75rem">Micro-hub inclusion</span><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
  <div style="margin-top:12px;padding:10px;background:var(--bg2);border:1px solid var(--border);border-radius:8px">
    <div style="font-family:var(--mono);font-size:0.62rem;color:var(--text3);margin-bottom:6px">CYCLE INTERVAL</div>
    <input type="range" min="30" max="300" value="90" style="width:100%;accent-color:var(--green)" oninput="document.getElementById('cycleVal').textContent=this.value+'s'">
    <div style="font-family:var(--mono);font-size:0.72rem;color:var(--green);margin-top:4px" id="cycleVal">90s</div>
  </div>`;

// PERF DELTA
document.getElementById('perfDelta').innerHTML = `
  <div style="display:flex;flex-direction:column;gap:8px">
    ${[['CO₂ Emissions','−23.4%','var(--green)'],['Fuel Consumption','−18.7%','var(--green)'],['Toll Costs','−31.2%','var(--green)'],['Delivery Time','−4.1%','var(--teal)'],['Empty Trips','−67.8%','var(--green)'],['Driver Idle Time','−28.5%','var(--green)']].map(([k,v,c])=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(30,64,48,0.4)">
      <span style="font-size:0.78rem;color:var(--text2)">${k}</span>
      <span style="font-family:var(--display);font-weight:700;color:${c}">${v}</span>
    </div>`).join('')}
  </div>`;

// SMS SEND
function sendSMS() {
  const btn = event.target;
  btn.textContent = '✓ SMS Sent to 3 Drivers';
  btn.style.background = 'rgba(0,232,122,0.3)';
  setTimeout(()=>{btn.textContent='📲 Send SMS Alerts (3 drivers)';btn.style.background='';}, 3000);
}

// OPTIMIZATION
function runOptimization() {
  const btn = event.target;
  btn.textContent = '⏳ Optimizing...';
  btn.disabled = true;
  setTimeout(()=>{
    btn.textContent = '✓ Optimized! 6 routes improved';
    setTimeout(()=>{ btn.textContent = '🧠 Run AI Optimization'; btn.disabled = false; }, 3000);
  }, 2000);
}

// Auto-hide float alert
setTimeout(() => {
  const fa = document.getElementById('floatAlert');
  if(fa) fa.style.opacity = '0'; fa.style.transition = 'opacity 0.5s';
  setTimeout(()=>{if(fa)fa.style.display='none';}, 500);
}, 6000);

// Golden ratio pulse animation
let grDir = 1;
setInterval(()=>{
  const el = document.getElementById('grValue');
  if(!el) return;
  const base = 1.618;
  const variation = (Math.random()-0.5)*0.04;
  el.textContent = (base + variation).toFixed(3);
}, 3000);
// your existing code above...

// 👇 ADD THIS HERE (near end of file)
window.onload = function () {
  fetch("/routes")
    .then(res => res.json())
    .then(data => {
      console.log("API Data:", data);
    })
    .catch(err => console.error(err));
};

// 👇 existing closing line
})();
