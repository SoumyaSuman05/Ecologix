// ── app.js ────────────────────────────────────────────────────────────────────
// Entry point — bootstraps the app and binds all events

(function () {

  // ── INIT ──────────────────────────────────────────────
  function init() {
    // Static renders
    UI.renderDrivers();
    UI.renderRouteSteps();
    UI.renderFallbackSteps();

    // Boot messages
    SMS.system('System online. SMS gateway connected via Twilio.');
    SMS.send('New Load: Port Jebel Ali to Warehouse B. Reply 1 to Accept or 2 to Reject.');
    Log.add('Headless SMS Assistant initialized', 'sys');
    Log.add('Twilio SMS gateway connected', 'sys');
    Log.add('Load #LD-2024-008 queued for dispatch', 'sys');
    Log.add('Edge cache ready — offline GPS available', 'route');

    // Clock
    setInterval(UI.updateClock.bind(UI), 1000);
    UI.updateClock();

    // Event bindings
    bindTabs();
    bindReplyButtons();
    bindDispatchButtons();
  }

  // ── TAB SWITCHING ─────────────────────────────────────
  function bindTabs() {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        UI.switchTab(this.dataset.tab);
      });
    }
  }

  // ── REPLY BUTTONS ─────────────────────────────────────
  function bindReplyButtons() {
    var newLoadBtn = document.querySelector('[data-reply="*"]'); 
if (newLoadBtn) {
    newLoadBtn.addEventListener('click', function() {
        Dispatch.sendLoad(); // This triggers the fetch code you just wrote
    });
}
  }

  // ── DISPATCH & OPTIMIZER ──────────────────────────────
  function bindDispatchButtons() {
    var dispatchBtn = document.getElementById('btn-dispatch');
    var optimizeBtn = document.getElementById('btn-optimize');

    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', function () {
        Dispatch.sendLoad();
      });
    }

    if (optimizeBtn) {
      optimizeBtn.addEventListener('click', function () {
        Dispatch.runOptimizer();
      });
    }
  }

  // ── BOOT ──────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
