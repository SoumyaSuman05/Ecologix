// ── ui.js ─────────────────────────────────────────────────────────────────────
// All DOM rendering functions

var UI = {

  // ── CLOCK ────────────────────────────────────────────
  updateClock: function () {
    var el = document.getElementById('clock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-GB');
  },

  // ── DRIVER LIST ──────────────────────────────────────
  renderDrivers: function () {
    var html = '';
    for (var i = 0; i < State.drivers.length; i++) {
      var d = State.drivers[i];
      var selected = (i === State.selectedDriver) ? ' selected' : '';
      html +=
        '<div class="driver-row' + selected + '" data-index="' + i + '">' +
          '<div class="avatar" style="background:' + d.av + ';color:' + d.ac + ';">' + d.init + '</div>' +
          '<div class="driver-info">' +
            '<div class="driver-name">' + d.name + '</div>' +
            '<div class="driver-loc">' + d.loc + '</div>' +
          '</div>' +
          '<span class="ds ' + STATUS_CLASS[d.status] + '">' + STATUS_LABEL[d.status] + '</span>' +
        '</div>';
    }
    document.getElementById('driver-list').innerHTML = html;

    // Bind click events
    var rows = document.querySelectorAll('.driver-row');
    for (var j = 0; j < rows.length; j++) {
      (function (index) {
        rows[index].addEventListener('click', function () {
          State.selectDriver(index);
          UI.renderDrivers();
        });
      })(j);
    }
  },

  // ── SMS THREAD ───────────────────────────────────────
  renderSMS: function () {
    var html = '';
    for (var i = 0; i < State.smsMessages.length; i++) {
      var m = State.smsMessages[i];
      if (m.type === 'sys') {
        html += '<div class="sms-bubble sms-sys">' + m.text + '</div>';
      } else {
        var isIn   = (m.type === 'in');
        var align  = isIn ? 'flex-end' : 'flex-start';
        var cls    = isIn ? 'sms-in' : 'sms-out';
        html +=
          '<div class="sms-bubble-wrap" style="align-items:' + align + ';">' +
            '<div class="sms-bubble ' + cls + '">' + m.text + '</div>' +
            '<span class="sms-ts">' + m.ts + '</span>' +
          '</div>';
      }
    }
    var el = document.getElementById('sms-thread');
    el.innerHTML = html;
    el.scrollTop = el.scrollHeight;
  },

  // ── EVENT LOG ────────────────────────────────────────
  renderLog: function () {
    var html = '';
    var limit = Math.min(State.logEntries.length, 30);
    for (var i = 0; i < limit; i++) {
      var e = State.logEntries[i];
      html +=
        '<div class="log-entry">' +
          '<span class="log-ts">' + e.ts + '</span>' +
          '<span class="log-msg">' + e.msg + '</span>' +
          '<span class="log-tag lt-' + e.tag + '">' + e.tag + '</span>' +
        '</div>';
    }
    document.getElementById('event-log').innerHTML = html;
  },

  // ── ROUTE STEPS ──────────────────────────────────────
  renderRouteSteps: function () {
    var html = '';
    for (var i = 0; i < ROUTE_STEPS.length; i++) {
      var s = ROUTE_STEPS[i];
      html +=
        '<div class="route-step">' +
          '<div class="step-num">' + s.num + '</div>' +
          '<div>' +
            '<div class="step-txt">' + s.txt + '</div>' +
            '<div class="step-sub">' + s.sub + '</div>' +
          '</div>' +
        '</div>';
    }
    document.getElementById('route-steps').innerHTML = html;
  },

  // ── FALLBACK STEPS ───────────────────────────────────
  renderFallbackSteps: function () {
    var html = '';
    for (var i = 0; i < FALLBACK_STEPS.length; i++) {
      html +=
        '<div class="fallback-step">' +
          '<span class="fstep-n">→</span>' +
          '<span>' + FALLBACK_STEPS[i] + '</span>' +
        '</div>';
    }
    document.getElementById('fallback-steps').innerHTML = html;
  },

  // ── TABS ─────────────────────────────────────────────
  switchTab: function (tab) {
    var names = ['sms', 'route', 'log'];
    for (var i = 0; i < names.length; i++) {
      var content = document.getElementById('tab-' + names[i]);
      if (content) {
        content.classList.toggle('hidden', names[i] !== tab);
      }
    }
    var tabEls = document.querySelectorAll('.tab');
    for (var j = 0; j < tabEls.length; j++) {
      tabEls[j].classList.toggle('active', tabEls[j].dataset.tab === tab);
    }
  },

  // ── NOTIFICATIONS ────────────────────────────────────
  showNotif: function (msg, color) {
    var el = document.getElementById('notif-area');
    el.innerHTML = '<div class="notif notif-' + color + '" style="margin-bottom:10px;">' + msg + '</div>';
    setTimeout(function () { el.innerHTML = ''; }, 4500);
  },

  // ── TRUCK ANIMATION ──────────────────────────────────
  animateTruck: function () {
    var truck = document.getElementById('truck');
    if (truck) {
      truck.style.left = '62%';
      truck.style.top  = '60%';
    }
  },

  // ── OPT RESULT ───────────────────────────────────────
  showOptResult: function (text) {
    var el = document.getElementById('opt-result');
    el.style.display = 'block';
    el.textContent = text;
  }
};
