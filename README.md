# Sharma Home

Private phone-first home screen for Sanjay Sharma, Sharma Electric & HVAC.

**Live:** https://sharma-home.sharma-crew.workers.dev

Unlisted (noindex). No login on this page — Collections and Bid Tracker keep their own access.

## Deploy

```bash
python3 scripts/make-icons.py
WRANGLER_CACHE_DIR=/tmp/wcache npx wrangler deploy
```

Worker name: `sharma-home`, same Cloudflare account as `sharma-crew`.

## Images

Icons and review screenshots are listed in `MANIFEST.md`. They live on the box and the live Worker, not in this repo.
