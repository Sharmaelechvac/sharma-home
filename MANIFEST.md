# Sharma Home images

Binary image files cannot be pushed with the GitHub text-only upload (max 4 text files per commit). They live on the box and on the live Worker.

Box folder: `/workspace/sharma-home`

| Path | Size (bytes) | On the box |
| --- | ---: | --- |
| `public/apple-touch-icon.png` | 7454 | `/workspace/sharma-home/public/apple-touch-icon.png` |
| `public/icon-192.png` | 8107 | `/workspace/sharma-home/public/icon-192.png` |
| `public/icon-512.png` | 33512 | `/workspace/sharma-home/public/icon-512.png` |
| `public/logo.png` | 128179 | `/workspace/sharma-home/public/logo.png` |
| `docs/logo.png` | 128179 | same file as `public/logo.png` after the 2026-11-10 Jarvis live swap |
| `shots/desktop-full.png` | 688810 | `/workspace/sharma-home/shots/desktop-full.png` |
| `shots/desktop.png` | 306966 | `/workspace/sharma-home/shots/desktop.png` |
| `shots/phone-full.png` | 816632 | `/workspace/sharma-home/shots/phone-full.png` |
| `shots/phone.png` | 153439 | `/workspace/sharma-home/shots/phone.png` |

`shots/` are review screenshots only. Live icons are under `public/`.

The live home page is Jarvis's `docs/index.html` (also at `public/index.html` in this branch) and Jarvis's logo. Rollback Worker version: `a0d240e8-1b9c-4078-ba50-78f659aaa055`. Live version after the swap: `fb8c7c42-9bfa-4bb6-acb3-5e78b2ae31f2`. Backup: `/tmp/sharma-home-bak-20261110-203458`.
