/*! Sharma Home — notifications panel (self-contained module, no kit changes).
 *
 * What it does: renders the whole notifications enable experience into any
 * element with [data-sharma-push] (or call SharmaPush.mount(el)):
 *   - state detection: unsupported browser / iPhone-not-installed tip /
 *     permission denied / not subscribed / subscribed
 *   - "Enable notifications": Notification permission -> GET the VAPID
 *     public key from the push worker -> PushManager.subscribe ->
 *     POST /subscribe with { subscription, person, role, app }
 *   - person name + role picker (Owner / Office / Crew), persisted on the
 *     phone; alert switches start at the role's defaults
 *   - per-alert switches synced to the worker: GET/POST /prefs
 *   - "Send test notification": POST /send { test: true, person, role }
 *
 * Push server: https://sharma-push.sharma-crew.workers.dev
 *   GET  /vapid-public-key  -> { publicKey } (plain text also accepted)
 *   POST /subscribe         -> { subscription, person, role, app }
 *   GET  /prefs?person=&role= -> { prefs: {...} } (bare object also accepted)
 *   POST /prefs             -> { person, role, prefs }
 *   POST /send              -> { person, role, test, title, body, url }
 * Every server call is best-effort: if the worker is unreachable the panel
 * still works from the on-phone copy of the preferences.
 *
 * HOOK STILL NEEDED in docs/index.html (left for the Home rebuild stream,
 * whose index.html edits are in flight — this file does not touch it):
 *   1) In <head>:  <link rel="stylesheet" href="push.css">
 *      Before </body>: <script src="push.js" defer></script>
 *   2) In the About sheet (#about-sheet), replace the static "Notifications"
 *      row in the Install list (the one that says alerts live in each app)
 *      with:  <div data-sharma-push></div>
 * Until that hook lands, the same panel is live at notifications.html. */
(function () {
  "use strict";

  var BASE = "https://sharma-push.sharma-crew.workers.dev";
  var APP = "sharma-home";
  var LS_PERSON = "shpush.person";
  var LS_ROLE = "shpush.role";
  var LS_PREFS = "shpush.prefs";

  var ALERTS = [
    { key: "bid_due_24h",       label: "Bid due in 24 hours" },
    { key: "inspection",        label: "Inspection booked, passed or failed" },
    { key: "permit_issued",     label: "Permit issued" },
    { key: "new_lead",          label: "New service call or lead" },
    { key: "billing",           label: "Invoice paid or past due" },
    { key: "builder_reply",     label: "Builder replied" },
    { key: "schedule_tomorrow", label: "Crew schedule change for tomorrow" },
    { key: "punch",             label: "New punch items" }
  ];
  var ROLE_DEFAULTS = {
    owner: { bid_due_24h: true,  inspection: true,  permit_issued: true,  new_lead: true,  billing: true,  builder_reply: true,  schedule_tomorrow: true,  punch: true },
    office:{ bid_due_24h: true,  inspection: true,  permit_issued: true,  new_lead: false, billing: true,  builder_reply: false, schedule_tomorrow: false, punch: false },
    crew:  { bid_due_24h: false, inspection: false, permit_issued: false, new_lead: false, billing: false, builder_reply: false, schedule_tomorrow: true,  punch: true }
  };
  var ROLES = [
    { key: "owner", label: "Owner" },
    { key: "office", label: "Office" },
    { key: "crew", label: "Crew" }
  ];
  var IOS_TIP = "On iPhone, notifications only work after you add Sharma Home to your Home Screen: tap Share, then \u2018Add to Home Screen\u2019, open it from there, and come back to this switch.";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isIOS() {
    var ua = navigator.userAgent || "";
    return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function isInstalled() {
    try { if (window.matchMedia("(display-mode: standalone)").matches) return true; } catch (e) {}
    return window.navigator.standalone === true;
  }
  function supported() {
    return ("serviceWorker" in navigator) && ("PushManager" in window) && ("Notification" in window);
  }
  function urlB64ToUint8Array(b64) {
    var padding = "=".repeat((4 - (b64.length % 4)) % 4);
    var base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = window.atob(base64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function jsonFetch(path, opts) {
    return fetch(BASE + path, opts).then(function (r) {
      if (!r.ok) throw new Error("push server " + r.status);
      return r.text().then(function (t) {
        try { return JSON.parse(t); } catch (e) { return t; }
      });
    });
  }

  function mount(root) {
    if (!root || root.getAttribute("data-shp-done")) return;
    root.setAttribute("data-shp-done", "1");
    root.classList.add("shp");

    var state = {
      person: lsGet(LS_PERSON) || "Sanjay Sharma",
      role: lsGet(LS_ROLE) || "owner",
      prefs: null,
      sub: null,
      busy: false,
      msg: "",
      err: ""
    };
    try { state.prefs = JSON.parse(lsGet(LS_PREFS) || "null"); } catch (e) { state.prefs = null; }
    if (!state.prefs) state.prefs = copyPrefs(ROLE_DEFAULTS[state.role] || ROLE_DEFAULTS.owner);

    function copyPrefs(p) { var o = {}; for (var k in p) o[k] = !!p[k]; return o; }
    function saveLocal() {
      lsSet(LS_PERSON, state.person);
      lsSet(LS_ROLE, state.role);
      lsSet(LS_PREFS, JSON.stringify(state.prefs));
    }

    function render() {
      var perm = ("Notification" in window) ? Notification.permission : "unsupported";
      var installed = isInstalled();
      var ios = isIOS();
      var html = "";

      html += '<div class="shp-card"><h3 class="shp-title">Notifications</h3>';

      if (!supported()) {
        html += '<p class="shp-status shp-status--off">This browser cannot receive notifications.</p>' +
          '<p class="shp-note">On iPhone, open Sharma Home in Safari and add it to your Home Screen first (see below). On a computer, use Chrome or Edge.</p>';
      } else if (state.sub) {
        html += '<p class="shp-status shp-status--on">Notifications are ON for this phone.</p>' +
          '<p class="shp-note">Alerts for ' + esc(state.person) + ' (' + esc(state.role) + ') are delivered to this device.</p>';
      } else if (perm === "denied") {
        html += '<p class="shp-status shp-status--off">Notifications are blocked for Sharma Home on this phone.</p>' +
          '<p class="shp-note">Turn them on in this phone\u2019s Settings for Sharma Home, then come back here.</p>';
      } else {
        html += '<p class="shp-status shp-status--off">Notifications are not turned on yet for this phone.</p>';
      }
      if (state.msg) html += '<p class="shp-note">' + esc(state.msg) + '</p>';
      if (state.err) html += '<p class="shp-err">' + esc(state.err) + '</p>';
      html += "</div>";

      if (ios && !installed) {
        html += '<div class="shp-card shp-card--tip"><p class="shp-status">First, add Sharma Home to your Home Screen</p>' +
          '<p class="shp-note">' + esc(IOS_TIP) + "</p></div>";
      } else if (!installed && supported()) {
        html += '<div class="shp-card shp-card--tip"><p class="shp-status">Tip: install Sharma Home first</p>' +
          '<p class="shp-note">Notifications work best when Sharma Home is installed (Add to Home Screen / Install app) and opened from its icon.</p></div>';
      }

      /* identity + role */
      html += '<div class="shp-card">' +
        '<label class="shp-label" for="shp-person">Your name</label>' +
        '<input class="shp-input" id="shp-person" type="text" autocomplete="name" value="' + esc(state.person) + '">' +
        '<span class="shp-label">I am</span><div class="shp-roles" role="group" aria-label="Role">';
      for (var i = 0; i < ROLES.length; i++) {
        html += '<button type="button" class="shp-role" data-shp-role="' + ROLES[i].key + '" aria-pressed="' +
          (state.role === ROLES[i].key ? "true" : "false") + '">' + ROLES[i].label + "</button>";
      }
      html += "</div>" +
        '<p class="shp-note">The switches below start at your role\u2019s standard set \u2014 change any of them.</p></div>';

      /* enable / test / off */
      html += '<div class="shp-card">';
      if (supported() && !state.sub && perm !== "denied") {
        html += '<button type="button" class="shp-btn" data-shp-enable' + (state.busy ? " disabled" : "") + ">" +
          (state.busy ? "Turning on\u2026" : "Enable notifications") + "</button>";
      }
      if (state.sub) {
        html += '<button type="button" class="shp-btn" data-shp-test' + (state.busy ? " disabled" : "") + ">Send test notification</button>" +
          '<button type="button" class="shp-btn shp-btn--ghost" data-shp-off' + (state.busy ? " disabled" : "") + ">Turn off notifications on this phone</button>";
      }
      html += "</div>";

      /* alert switches */
      html += '<div class="shp-card"><h3 class="shp-title">Which alerts</h3>' +
        '<p class="shp-sub">Saved to the Sharma push server for ' + esc(state.person) + ".</p>";
      for (var j = 0; j < ALERTS.length; j++) {
        var a = ALERTS[j];
        html += '<label class="shp-row"><span class="shp-row__body"><span class="shp-row__title">' + esc(a.label) + "</span></span>" +
          '<span class="shp-switch"><input type="checkbox" data-shp-alert="' + a.key + '"' +
          (state.prefs[a.key] ? " checked" : "") + (state.sub ? "" : " disabled") + '><span class="shp-track"></span></span></label>';
      }
      if (!state.sub) html += '<p class="shp-note">Turn notifications on above to change these switches.</p>';
      html += "</div>";

      root.innerHTML = html;
      wire();
    }

    function wire() {
      var person = root.querySelector("#shp-person");
      if (person) person.addEventListener("change", function () {
        state.person = person.value.trim() || state.person;
        saveLocal(); loadServerPrefs();
      });
      var roles = root.querySelectorAll("[data-shp-role]");
      for (var i = 0; i < roles.length; i++) roles[i].addEventListener("click", function () {
        var r = this.getAttribute("data-shp-role");
        if (r === state.role) return;
        state.role = r;
        state.prefs = copyPrefs(ROLE_DEFAULTS[r] || ROLE_DEFAULTS.owner);
        saveLocal(); pushPrefs(); render();
      });
      var en = root.querySelector("[data-shp-enable]");
      if (en) en.addEventListener("click", enable);
      var te = root.querySelector("[data-shp-test]");
      if (te) te.addEventListener("click", sendTest);
      var off = root.querySelector("[data-shp-off]");
      if (off) off.addEventListener("click", turnOff);
      var boxes = root.querySelectorAll("[data-shp-alert]");
      for (var j = 0; j < boxes.length; j++) boxes[j].addEventListener("change", function () {
        state.prefs[this.getAttribute("data-shp-alert")] = this.checked;
        saveLocal(); pushPrefs();
      });
    }

    function getRegistration() {
      /* Any synchronous throw (partial serviceWorker implementations in
         some webviews) becomes a rejection the callers already handle. */
      try {
        if (!("serviceWorker" in navigator)) return Promise.reject(new Error("no service worker"));
        return navigator.serviceWorker.getRegistration().then(function (reg) {
          if (reg) return reg;
          /* Standalone panel page (notifications.html): register the app's own
             worker, the same file Sharma Home uses. */
          return navigator.serviceWorker.register("sw.js");
        }).then(function () { return navigator.serviceWorker.ready; });
      } catch (e) { return Promise.reject(e); }
    }

    function enable() {
      state.busy = true; state.err = ""; state.msg = ""; render();
      Notification.requestPermission().then(function (perm) {
        if (perm !== "granted") throw new Error("Permission was not granted.");
        return getRegistration();
      }).then(function (reg) {
        return reg.pushManager.getSubscription().then(function (existing) {
          if (existing) return existing;
          return jsonFetch("/vapid-public-key").then(function (d) {
            var key = (d && d.publicKey) || d;
            if (!key || typeof key !== "string") throw new Error("Push server did not return a key.");
            return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(key) });
          });
        });
      }).then(function (sub) {
        state.sub = sub;
        return jsonFetch("/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: sub.toJSON ? sub.toJSON() : sub, person: state.person, role: state.role, app: APP })
        }).catch(function () { /* subscription exists on the phone even if the server hiccups */ });
      }).then(function () {
        state.busy = false;
        state.msg = "You are subscribed. Send yourself a test to check it lands.";
        pushPrefs(); render();
      }).catch(function (e) {
        state.busy = false;
        state.err = "Could not turn notifications on: " + (e && e.message ? e.message : e);
        render();
      });
    }

    function turnOff() {
      if (!state.sub) return;
      state.busy = true; render();
      state.sub.unsubscribe().then(function () {
        state.sub = null; state.busy = false;
        state.msg = "Notifications are off for this phone. Your alert choices are kept for next time.";
        render();
      }).catch(function () {
        state.busy = false; state.err = "Could not turn notifications off on this phone."; render();
      });
    }

    function sendTest() {
      state.busy = true; state.err = ""; state.msg = ""; render();
      jsonFetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person: state.person, role: state.role, test: true,
          title: "Sharma Home test",
          body: "Test notification \u2014 push is working on this phone.",
          url: "/sharma-home/"
        })
      }).then(function () {
        state.busy = false; state.msg = "Test sent \u2014 it should land on this phone in a few seconds."; render();
      }).catch(function (e) {
        state.busy = false; state.err = "Test could not be sent: " + (e && e.message ? e.message : e); render();
      });
    }

    var prefsTimer = null;
    function pushPrefs() {
      if (prefsTimer) clearTimeout(prefsTimer);
      prefsTimer = setTimeout(function () {
        jsonFetch("/prefs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ person: state.person, role: state.role, prefs: state.prefs })
        }).catch(function () { /* on-phone copy already saved */ });
      }, 350);
    }
    function loadServerPrefs() {
      jsonFetch("/prefs?person=" + encodeURIComponent(state.person) + "&role=" + encodeURIComponent(state.role))
        .then(function (d) {
          var p = (d && d.prefs) || d;
          if (p && typeof p === "object") {
            for (var i = 0; i < ALERTS.length; i++) {
              var k = ALERTS[i].key;
              if (typeof p[k] === "boolean") state.prefs[k] = p[k];
            }
            saveLocal(); render();
          }
        }).catch(function () { /* keep the on-phone copy */ });
    }

    render();
    if (supported()) {
      getRegistration().then(function (reg) { return reg.pushManager.getSubscription(); })
        .then(function (sub) {
          if (sub) { state.sub = sub; render(); loadServerPrefs(); }
        }).catch(function () { /* panel still renders; Enable retries */ });
    }
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-sharma-push]");
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.SharmaPush = { mount: mount, base: BASE };
})();
