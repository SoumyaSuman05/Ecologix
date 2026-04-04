// ── sms.js ────────────────────────────────────────────────────────────────────
// SMS message and event log management

var SMS = {

  // Add an outbound (system→driver), inbound (driver→system), or system note
  add: function (text, type) {
    var ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    State.smsMessages.push({ text: text, type: type, ts: ts });
    UI.renderSMS();
  },

  // Shorthand helpers
  send: function (text)   { this.add(text, 'out'); },
  receive: function (text){ this.add(text, 'in');  },
  system: function (text) { this.add(text, 'sys'); },

  // Handle driver key press (1, 2, 3, 4, *)
  handleReply: function (key) {
    this.receive(key);

    switch (key) {
      case '1': this._onAccept();    break;
      case '2': this._onReject();    break;
      case '3': this._onStatus();    break;
      case '4': this._onArrived();   break;
      case '*': this._onReactivate();break;
      default: break;
    }
  },

  // ── REPLY HANDLERS ───────────────────────────────────

  _onAccept: function () {
    Timer.stop();
    Log.add('Driver accepted — start time logged', 'sms');
    Log.add('Running Eco-Load & Route Optimizer...', 'sys');

    State.setDriverStatus(State.selectedDriver, 'enroute');
    UI.renderDrivers();

    var self = this;
    setTimeout(function () {
      self.send(
        'Proceed via E311 for optimal fuel. Avoid E11 due to delay. ' +
        'Reply 3 for Status Update or 4 for Arrived.'
      );
      Log.add('Optimized route instructions sent to driver', 'route');
      Log.add('Route cached locally for offline GPS navigation', 'sys');

      self.send('Rest stop nearby: Al Quoz 24h Station — 3 km ahead on E311.');
      Log.add('Rest stop notification sent', 'sms');

      UI.animateTruck();
    }, 700);
  },

  _onReject: function () {
    Timer.stop();
    Log.add('Driver rejected — finding next best driver', 'warn');

    State.setDriverStatus(State.selectedDriver, 'available');
    UI.renderDrivers();

    this.system(
      'Load rejected. Reassigning to next available driver ' +
      'based on proximity and route alignment...'
    );

    var next = State.getNextAvailableDriver();
    if (next) {
      Log.add('Load reassigned to ' + next.name + ' (proximity match)', 'sys');
      UI.showNotif('🔄 Reassigned to ' + next.name + ' — zero idle time', 'green');
    } else {
      UI.showNotif('🔄 No available driver found — queuing load', 'amber');
    }
  },

  _onStatus: function () {
    this.send(
      'Status: En route via E311. Current position: km 28. ' +
      'ETA ~35 min. Next landmark: Al Quoz blue water tower.'
    );
    Log.add('Status update requested and delivered', 'sms');
  },

  _onArrived: function () {
    Timer.stop();
    Log.add('Driver confirmed arrival at Warehouse B, Gate 3', 'route');

    State.setDriverStatus(State.selectedDriver, 'available');
    State.setDriverLoc(State.selectedDriver, 'Warehouse B');
    UI.renderDrivers();

    this.send('Arrival confirmed. Load #LD-2024-008 complete. Standby for next assignment.');
    UI.showNotif('✓ Delivery complete — driver now available', 'green');
  },

  _onReactivate: function () {
    Log.add('Driver re-activated — ready for new load order', 'sys');
    State.setDriverStatus(State.selectedDriver, 'available');
    UI.renderDrivers();

    this.send('You are now active. A new load will be assigned shortly.');
    UI.showNotif('Driver re-activated successfully', 'green');
  }
};

// ── EVENT LOG ────────────────────────────────────────────────────────────────
var Log = {
  add: function (msg, tag) {
    var ts = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    State.logEntries.unshift({ ts: ts, msg: msg, tag: tag });
    UI.renderLog();
  }
};
