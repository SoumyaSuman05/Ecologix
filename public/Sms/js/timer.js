// ── timer.js ──────────────────────────────────────────────────────────────────
// Handles the response buffer: 2.5-min reminder, 5-min auto-reassign

var Timer = {

  REMINDER_AT:   150,   // seconds — 2.5 minutes
  TIMEOUT_AT:    300,   // seconds — 5 minutes

  start: function () {
    this.stop();
    State.timerSeconds = 0;
    this._updateBar(0);
    document.getElementById('timer-label').textContent = '0s elapsed';

    var self = this;
    State.timerInterval = setInterval(function () {
      State.timerSeconds++;
      self._tick(State.timerSeconds);
    }, 1000);
  },

  stop: function () {
    if (State.timerInterval) {
      clearInterval(State.timerInterval);
      State.timerInterval = null;
    }
    this._updateBar(0);
    document.getElementById('timer-label').textContent = 'Idle — dispatch a load to begin';
  },

  _tick: function (s) {
    var pct = Math.min(s / this.TIMEOUT_AT * 100, 100);
    this._updateBar(pct, s);
    document.getElementById('timer-label').textContent = s + 's elapsed';

    if (s === this.REMINDER_AT) {
      this._onReminder();
    }
    if (s >= this.TIMEOUT_AT) {
      this._onTimeout();
    }
  },

  _onReminder: function () {
    SMS.send('Reminder: Load pending. Reply 1 to Accept or 2 to Reject.');
    Log.add('Reminder SMS sent — no response after 2.5 min', 'warn');
    UI.showNotif('⏱ 2.5 min elapsed — reminder sent to ' + State.getDriver().name, 'amber');
  },

  _onTimeout: function () {
    this.stop();
    SMS.send('Load transferred to another driver. Reply * to get a new load order.');
    Log.add('Timeout — load auto-reassigned, driver paused', 'sys');

    State.setDriverStatus(State.selectedDriver, 'inactive');
    State.incrementMetric('m-reassign');
    UI.renderDrivers();
    UI.showNotif('🔄 No response — load reassigned to next best driver', 'red');
  },

  _updateBar: function (pct, s) {
    var fill = document.getElementById('timer-fill');
    if (!fill) return;
    fill.style.width = pct + '%';
    fill.style.background =
      (s > 150) ? '#ef4444' :
      (s > 100) ? '#f59e0b' : '#3b82f6';
  }
};
