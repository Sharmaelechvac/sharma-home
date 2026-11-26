/*! Sharma Home — refresh + freshness check (app-owned snippet, not the kit).
 *
 * 1) Refresh button ([data-refresh]): purges EVERY Cache Storage entry for
 *    this origin, asks the service worker to update, then hard-reloads, so
 *    the app comes back on the newest published copy. localStorage is NEVER
 *    touched — settings/Appearance, the TV dashboard cache and the lock
 *    flag live there and must survive a refresh. A sessionStorage stamp
 *    guards against reload loops: a second purge within 10 s becomes a
 *    plain reload, and if the purge hangs the reload still happens.
 * 2) Freshness check (Sanjay 2026-11-19: "make the page refresh every time
 *    it is opened"): on open, and on return-to-foreground at most once a
 *    minute, version.json is fetched with cache:"no-store" (plus a
 *    cache-busting query). If its stamp differs from APP_VERSION below,
 *    the same purge+reload runs — once per stamp per session. A matching
 *    stamp or a failed fetch changes nothing: the app just opens.
 *
 * ⚠ PUBLISH RULE: every publish of Sharma Home MUST bump version.json
 * ("v") and APP_VERSION below together, to the same new stamp. If they
 * drift, phones either never update or refresh on every open. */
(function () {
  "use strict";
  var APP_VERSION = "2026-11-25.17";
  var GUARD_KEY = "sharma-refresh-at";    // sessionStorage: last purge stamp
  var CHECK_KEY = "sharma-vercheck-at";   // sessionStorage: last version check
  var DONE_KEY = "sharma-vercheck-done";  // sessionStorage: stamp already refreshed onto
  var GUARD_MS = 10000;
  var CHECK_EVERY_MS = 60000;

  function now() { return Date.now(); }
  function sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  function purgeCaches() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }).then(function () {}, function () {});
  }
  function updateWorker() {
    if (!("serviceWorker" in navigator)) return Promise.resolve();
    return navigator.serviceWorker.getRegistration().then(function (reg) {
      if (reg && reg.update) return reg.update().then(function () {}, function () {});
    }).then(function () {}, function () {});
  }
  /* .21 hardening: also UNREGISTER the worker during a repair refresh. A
     still-registered worker controls the repair reload itself and can
     re-serve (or re-save) the old shell mid-repair; unregistering takes it
     out of the loop. The fresh page re-registers the current worker on
     boot, so nothing is lost. */
  function dropWorker() {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.getRegistrations) return Promise.resolve();
    return navigator.serviceWorker.getRegistrations().then(function (regs) {
      return Promise.all(regs.map(function (r) { return r.unregister().then(function () {}, function () {}); }));
    }).then(function () {}, function () {});
  }
  /* .33: open the page again with a throw-away query so the phone's own web
     cache (GitHub keeps pages for 10 minutes) can never hand back the old copy. */
  function freshLoad() {
    try {
      var u = location.pathname + "?r=" + now() + (location.hash || "");
      location.replace(u);
    } catch (e) { location.reload(); }
  }
  function markUpdating(btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add("is-updating");
    var label = btn.querySelector(".refresh-label");
    if (label) label.textContent = "Updating…";
  }
  function hardRefresh(btn) {
    var last = parseInt(sget(GUARD_KEY) || "0", 10) || 0;
    if (now() - last < GUARD_MS) { freshLoad(); return; }
    sset(GUARD_KEY, String(now()));
    markUpdating(btn);
    var done = false;
    function go() { if (!done) { done = true; freshLoad(); } }
    var slow = setTimeout(go, 3500); // a hung purge must never dead-end the button
    Promise.all([purgeCaches(), updateWorker(), dropWorker()]).then(function () { clearTimeout(slow); go(); }, function () { clearTimeout(slow); go(); });
  }
  function checkVersion() {
    var last = parseInt(sget(CHECK_KEY) || "0", 10) || 0;
    if (now() - last < CHECK_EVERY_MS) return;
    sset(CHECK_KEY, String(now()));
    if (typeof fetch !== "function") return;
    fetch("version.json?ts=" + now(), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("version " + r.status);
      return r.json();
    }).then(function (d) {
      if (!d || !d.v || d.v === APP_VERSION) return;
      /* DONE_KEY carries a timestamp (stamp@ms). .21: a stamp recorded more
         than 5 minutes ago no longer blocks a retry — the old behaviour let
         one failed repair (old shell re-served during the reload) suppress
         every later check for the whole session, and an installed app's
         session can live for days. */
      var doneRaw = sget(DONE_KEY) || "";
      var doneAt = parseInt(doneRaw.split("@")[1] || "0", 10) || 0;
      if (doneRaw.split("@")[0] === d.v && now() - doneAt < 300000) return; // already refreshed onto this stamp, recently
      sset(DONE_KEY, d.v + "@" + now());
      hardRefresh(null);
    }).catch(function () { /* offline or no version file: open as-is, never reload */ });
  }

  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-refresh]") : null;
    if (!t) return;
    e.preventDefault();
    hardRefresh(t);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") checkVersion();
  });
  checkVersion();

  window.SharmaRefresh = { hardRefresh: hardRefresh, checkVersion: checkVersion, version: APP_VERSION };
})();
