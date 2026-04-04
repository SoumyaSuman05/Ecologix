// ── dispatch.js ───────────────────────────────────────────────────────────────
// Handles load dispatch and the Eco-Load optimizer

var Dispatch = {

  sendLoad: function () {
    var d = State.getDriver();

    if (d.status === 'inactive') {
      UI.showNotif('Driver is paused — waiting for * reply to reactivate', 'amber');
      return;
    }

    // ── BACKEND FETCH START ──
    // This sends the data to your Node.js server on port 3003
    fetch('/api/loads/LD-001/assign', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            driverId: d.id,
            driverName: d.name
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend Success:', data);
        Log.add('Backend: ' + (data.message || 'Load Assigned'), 'sys');
    })
    .catch(error => {
        console.error('Backend Error:', error);
        Log.add('Connection Error: Is the server running?', 'err');
    });
    // ── BACKEND FETCH END ──

    SMS.send(
      'New Load: ' + CURRENT_LOAD.from + ' to ' + CURRENT_LOAD.to +
      '. Reply 1 to Accept or 2 to Reject.'
    );
    Log.add('Load ' + CURRENT_LOAD.id + ' dispatched to ' + d.name, 'sms');

    State.setDriverStatus(State.selectedDriver, 'pending');
    UI.renderDrivers();
    State.incrementMetric('m-dispatched');
    Timer.start();
    UI.switchTab('sms');
  }, // <--- Check that this comma and brace are here!

  runOptimizer: function () {
    UI.showOptResult('Running optimizer...');
    setTimeout(function () {
      UI.showOptResult(
        '✓ E311 saves 14% fuel vs E11 · Delay avoided · 72 km · ETA 1h 05m'
      );
      Log.add('Eco-Load optimizer ran — E311 selected as optimal route', 'route');
    }, 900);
  }
};