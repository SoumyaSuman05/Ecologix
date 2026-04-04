// ── state.js ──────────────────────────────────────────────────────────────────
// Central mutable state for the application

var State = {
  drivers:        JSON.parse(JSON.stringify(DRIVERS)), // deep copy so we can mutate
  selectedDriver: 0,
  smsMessages:    [],
  logEntries:     [],
  timerInterval:  null,
  timerSeconds:   0,
  dispatched:     false,

  // Getters
  getDriver: function () {
    return this.drivers[this.selectedDriver];
  },

  // Mutators
  setDriverStatus: function (index, status) {
    this.drivers[index].status = status;
  },

  setDriverLoc: function (index, loc) {
    this.drivers[index].loc = loc;
  },

  selectDriver: function (index) {
    this.selectedDriver = index;
  },

  incrementMetric: function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = parseInt(el.textContent, 10) + 1;
  },

  getNextAvailableDriver: function () {
    for (var i = 0; i < this.drivers.length; i++) {
      if (i !== this.selectedDriver && this.drivers[i].status === 'available') {
        return this.drivers[i];
      }
    }
    return null;
  }
};
