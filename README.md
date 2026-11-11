# Sharma Home

Private phone-first home screen for Sanjay Sharma, Sharma Electric & HVAC.

**Live:** https://sharma-home.sharma-crew.workers.dev

The live home page is Jarvis's edition (`docs/index.html` and `docs/logo.png`). The previous launcher is kept in `src/index.js` as a fallback and for `/api/status`. Unlisted (noindex). No login on this page — Collections and Bid Tracker keep their own access.

## Deploy

```bash
python3 scripts/make-icons.py
WRANGLER_CACHE_DIR=/tmp/wcache npx wrangler deploy
```

Worker name: `sharma-home`, same Cloudflare account as `sharma-crew`.

## Images

Icons and review screenshots are listed in `MANIFEST.md`. They live on the box and the live Worker, not in this repo. Jarvis's `docs/logo.png` is already in this repo; the live Worker serves that same file as `/logo.png`.
