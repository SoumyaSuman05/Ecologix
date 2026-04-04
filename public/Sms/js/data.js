// ── data.js ──────────────────────────────────────────────────────────────────
// Static data: drivers, route steps, fallback nav, status maps

var DRIVERS = [
  { id: 'D1', name: 'Ahmed Al Rashid', init: 'AR', loc: 'Near Port Jebel Ali',  status: 'available', av: '#1e3a5f', ac: '#60a5fa' },
  { id: 'D2', name: 'Ravi Kumar',      init: 'RK', loc: 'E311, km 34',          status: 'enroute',   av: '#14403a', ac: '#2dd4bf' },
  { id: 'D3', name: 'Yusuf Okonkwo',  init: 'YO', loc: 'Al Quoz Industrial',   status: 'pending',   av: '#3d2e0f', ac: '#fbbf24' },
  { id: 'D4', name: 'Priya Nair',      init: 'PN', loc: 'Warehouse C area',     status: 'rest',      av: '#3a1f1f', ac: '#f87171' },
  { id: 'D5', name: 'Omar Diallo',     init: 'OD', loc: 'Offline',              status: 'inactive',  av: '#1e2433', ac: '#6b7280' }
];

var STATUS_LABEL = {
  available: 'Available',
  enroute:   'En Route',
  pending:   'Awaiting Reply',
  inactive:  'Inactive',
  rest:      'Rest Stop'
};

var STATUS_CLASS = {
  available: 'ds-available',
  enroute:   'ds-enroute',
  pending:   'ds-pending',
  inactive:  'ds-inactive',
  rest:      'ds-rest'
};

var ROUTE_STEPS = [
  { num: 1, txt: 'Depart Port Jebel Ali',       sub: 'Head east toward E311 on-ramp' },
  { num: 2, txt: 'Take E311 — optimal fuel route', sub: '56 km · Avoid E11 (delay reported)' },
  { num: 3, txt: 'Exit at Al Quoz Industrial Area', sub: 'Landmark: large blue water tower on left' },
  { num: 4, txt: 'Arrive Warehouse B — Gate 3', sub: 'Reply 4 to confirm arrival' }
];

var FALLBACK_STEPS = [
  'From Jebel Ali Port Gate, head east.',
  'Drive 12 km. Pass blue water tower on your left.',
  'Turn right at Al Quoz Industrial roundabout.',
  'Drive 3 km. Warehouse B on left — enter Gate 3.'
];

var CURRENT_LOAD = {
  id:    '#LD-2024-008',
  from:  'Port Jebel Ali',
  to:    'Warehouse B',
  dist:  '72 km est.',
  cargo: '3.2t cargo',
  tag:   'Eco-route active'
};
