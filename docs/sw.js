/*! Sharma design kit v1.3 service worker. Copy to the app as /sw.js and call SK.registerSW("/sw.js").
   What it does:
   - App shell ("/") : network first (so a locked or expired phone goes to the lock screen), saved copy if
     there is no signal or the network takes over 2.5 s. Only a real unlocked page is saved.
   - Kit files (css, js, logo): served from the phone at once, refreshed in the background.
   - Never touches: /login, /logout (it wipes saved data first), /api/* (the app's SK.data handles
     last-data-first in the page), POSTs, or anything else.
   Holds no data, passcodes or keys. */
var VERSION = "sk-shell-v1.3-home-apple-1132";
var DATA = "sk-data-v1";
var KIT = new URL((new URL(self.location.href).searchParams.get("kit") || "https://sharma-kit.sharma-crew.workers.dev").replace(/\/$/, ""), self.location.href).href.replace(/\/$/, "");
var KIT_FILES = [KIT + "/sharma-kit.css", KIT + "/sharma-kit.js", KIT + "/assets/logo-white-header.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    /* the app shell, only if this phone is unlocked right now (a lock screen or redirect is never saved) */
    var page = fetch("/sharma-home/", { credentials: "same-origin", redirect: "manual", cache: "no-store" }).then(function (r) {
      if (r.ok && r.type === "basic" && (r.headers.get("content-type") || "").indexOf("text/html") === 0) return c.put("/sharma-home/", r);
    }).catch(function () {});
    return Promise.all([page].concat(KIT_FILES.map(function (u) {
      return fetch(u, { mode: "cors", cache: "no-cache" }).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
    })));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("sk-shell-") === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function wipe() { return Promise.all([caches.delete(DATA), caches.open(VERSION).then(function (c) { return c.delete("/sharma-home/"); })]); }

function shell(req) {
  var net = fetch(req).then(function (r) {
    if (r.type === "opaqueredirect" || r.redirected || r.status === 401 || r.status === 403) { wipe(); return r; }
    if (r.ok && (r.headers.get("content-type") || "").indexOf("text/html") === 0) {
      var copy = r.clone(); caches.open(VERSION).then(function (c) { return c.put("/sharma-home/", copy); });
    }
    return r;
  });
  var saved = caches.open(VERSION).then(function (c) { return c.match("/sharma-home/"); });
  return new Promise(function (resolve, reject) {
    var done = false;
    function give(r) { if (!done && r) { done = true; resolve(r); } }
    net.then(give, function () { saved.then(function (s) { if (s) give(s); else if (!done) { done = true; reject(new Error("offline")); } }); });
    setTimeout(function () { saved.then(give); }, 2500);
  });
}

function kitFile(e) {
  var req = e.request;
  return caches.open(VERSION).then(function (c) {
    return c.match(req.url).then(function (hit) {
      var fresh = fetch(req.url, { mode: "cors", cache: "no-cache" }).then(function (r) { if (r.ok) c.put(req.url, r.clone()); return r; });
      if (hit) { e.waitUntil(fresh.catch(function () {})); return hit; }
      return fresh.catch(function () { return fetch(req); });
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request; if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (req.url.indexOf(KIT + "/") === 0 && /\.(css|js|png|svg)$/.test(url.pathname)) { e.respondWith(kitFile(e)); return; }
  if (url.origin === self.location.origin) {
    if (url.pathname === "/sharma-home/logout") { e.respondWith(wipe().then(function () { return fetch(req); })); return; }
    if (url.pathname === "/sharma-home/" && req.mode === "navigate") { e.respondWith(shell(req)); return; }
    return; /* /login, /api/*, everything else: straight to the network, never saved here */
  }
});

/* --- Web push (added 2026-11-20 for the Sharma Home notifications panel) ---
   Purely additive: everything above is the kit shell worker, unchanged, and
   the cache VERSION is deliberately left as-is so the refresh-on-open and
   cache-purge behavior is untouched (a changed sw.js file is picked up by
   the browser's own service-worker update check). The push server
   (sharma-push.sharma-crew.workers.dev) sends a JSON payload:
   { "title": "...", "body": "...", "url": "/sharma-home/...", "tag": "..." }.
   Clicking a notification focuses the open app (navigating it to the
   target) or opens the target URL in a new window. */
self.addEventListener("push", function (e) {
  var d = {};
  if (e.data) {
    try { d = e.data.json(); } catch (err) { try { d = { body: e.data.text() }; } catch (err2) { d = {}; } }
  }
  var icon = self.registration.scope + "icons/icon-192.png";
  var opts = {
    body: d.body || "",
    icon: d.icon || icon,
    badge: icon,
    data: { url: d.url || "/sharma-home/" }
  };
  if (d.tag) opts.tag = d.tag;
  e.waitUntil(self.registration.showNotification(d.title || "SHARMA360", opts));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var target = (e.notification.data && e.notification.data.url) || "/sharma-home/";
  var targetUrl = new URL(target, self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(self.registration.scope) === 0 && "focus" in c) {
        if (c.url !== targetUrl && "navigate" in c) {
          return c.navigate(targetUrl).then(function (nc) { return (nc || c).focus(); });
        }
        return c.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
  }));
});
