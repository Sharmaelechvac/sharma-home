const NOINDEX = {
  "content-type": "text/html;charset=utf-8",
  "cache-control": "no-store",
  "x-robots-tag": "noindex, nofollow",
  "referrer-policy": "same-origin",
  "x-content-type-options": "nosniff",
};

const ICONS = {
  leads: '<path d="M11 5a7 7 0 1 0 4.5 12.4L21 21"/><circle cx="11" cy="11" r="7"/>',
  follow: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  bids: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  collections: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M7 15h4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3" r="1"/><path d="M9 13v1M15 13v1"/>',
  pipeline: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.2 7.6 10.5 15M15.8 7.6 13.5 15"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  badge: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.8-1.5 5.2-1.5 6 0M14 10h4M14 14h3"/>',
  snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.5-5 6.5-5s5.7 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.5 5"/>',
  track: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h4M7 13h10M7 17h7"/>',
  hard: '<path d="M3 17h18v2H3z"/><path d="M5 17v-3a7 7 0 0 1 14 0v3"/><path d="M10 7V5h4v2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  crane: '<path d="M6 21V3l14 4H6"/><path d="M18 7v6"/><rect x="16" y="13" width="4" height="3"/><path d="M3 21h8"/>',
  clipboard: '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 12l2 2 4-4"/>',
  punch: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10h8M8 14h5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
  house: '<path d="M3 11 12 4l9 7"/><path d="M6 10v10h12V10"/><rect x="10" y="14" width="4" height="6"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
  muse: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l6 3-6 3z"/>',
  snowflake: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.5-5 6.5-5s5.7 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.5 5"/>',
  builders: '<path d="M2 12 7 8l5 4v8H2z"/><path d="M12 9l5-4 5 4v11H12"/><path d="M6 20v-3h2v3M16 20v-3h2v3"/>',
  sample: '<path d="M3 21h18"/><path d="M5 21V10l7-6 7 6v11"/><path d="M10 21v-6h4v6"/>',
  keystone: '<path d="M12 3 4 8v11h16V8z"/><path d="M10 19v-6h4v6"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3.2-.4 6.5-1.6 6.5-7a5.5 5.5 0 0 0-1.5-3.8 5.1 5.1 0 0 0-.1-3.8s-1.2-.4-4 1.5a13.4 13.4 0 0 0-7 0c-2.8-1.9-4-1.5-4-1.5a5.1 5.1 0 0 0-.1 3.8A5.5 5.5 0 0 0 3.5 9c0 5.4 3.3 6.6 6.5 7a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1.5-4.5-2.5-6-3"/>',
  relay: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.6 10.5 15.4 7.5M8.6 13.5 15.4 16.5"/>',
  links: '<path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.7 5.23"/><path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07l1.41-1.41"/>',
  hub: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
  draft: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  cloud: '<path d="M18 10h-1.3A6 6 0 1 0 6 17h12a4 4 0 0 0 0-8z"/>',
};

const SECTIONS = [
  {
    id: "business",
    title: "Run the Business",
    apps: [
      { name: "Lead Finder", desc: "Daily permit scan for active builders near Orlando, plus Lee and Charlotte", url: "https://sharma-leads.sharma-crew.workers.dev/", icon: "leads", check: true },
      { name: "Builder Follow-up", desc: "Call notes, follow-up dates, and pipeline from New to Won", url: "https://sharma-followup.sharma-crew.workers.dev/", icon: "follow", check: true },
      { name: "Bid Tracker", desc: "Every bid sent, its status, and your win rate", url: "https://sharma-bids.sharma-crew.workers.dev/", icon: "bids", check: true },
      { name: "Collections", desc: "Who owes you, how many days late, and when to follow up", url: "https://sharma-collections.sharma-crew.workers.dev/", icon: "collections", check: true },
      { name: "P&L 2026", desc: "Profit and loss for the year", url: "https://sharma-electric-and-hvac-p-and-l-2026-rcc6.pages.grok.bot/", icon: "chart" },
      { name: "Jarvis P&L", desc: "Jarvis P&L workspace (sign in)", url: "https://muse.ai/library/artifacts/sharma-electric-p-l", icon: "bot" },
      { name: "Builder Pipeline", desc: "Track builders through your pipeline", url: "https://builder-pipeline-tracker-tkp3.pages.grok.bot/", icon: "pipeline" },
      { name: "Owner App", desc: "Owner tools on the crew app", url: "https://sharma-crew.sharma-crew.workers.dev/app", icon: "home" },
      { name: "Licenses", desc: "License records and status", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/45aa1398-33fc-42c4-a286-f4acd330cfb2", icon: "badge" },
      { name: "HVAC Leads", desc: "HVAC lead list", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/a73752c1-108f-4000-92f4-298fa4796022", icon: "snow" },
      { name: "Service", desc: "Service work and follow-up", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/40b9bcd4-55f9-4a29-864e-6f88fd850b78", icon: "wrench" },
      { name: "Clients", desc: "Client list and notes", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/a1d275fa-a22f-4362-bfca-fa1b065d61fa", icon: "users" },
    ],
  },
  {
    id: "jobs",
    title: "Jobs & Crews",
    apps: [
      { name: "SharmaTrack", desc: "Job-tracking website and how it works", url: "https://sharmatrack.pages.dev/", icon: "track" },
      { name: "SharmaTrack Crew", desc: "Live crew job tracker for every house", url: "https://sharmatrack-crew.pages.dev/", icon: "hard" },
      { name: "Crew App", desc: "Field app for crews, houses, and owner tools", url: "https://sharma-crew.sharma-crew.workers.dev/", icon: "hard" },
      { name: "Crew Projects", desc: "SharmaTrack links hub for crews and jobs", url: "https://sharmatrack-crew.pages.dev/links/", icon: "grid" },
      { name: "EXJ Root Tracker", desc: "Job tracker for EXJ Root houses in Ocala", url: "https://exj-root-tracker.pages.dev/", icon: "crane" },
      { name: "Inspection Prep", desc: "Walk the house before inspection, with a photo per item", url: "https://sharma-inspect.sharma-crew.workers.dev/", icon: "clipboard", check: true },
      { name: "Pending Projects", desc: "Punch items and misc tasks, closed out with a photo", url: "https://sharma-punch.sharma-crew.workers.dev/", icon: "punch", check: true },
      { name: "Weekly Schedule", desc: "Who is on which house this week", url: "https://weekly-schedule-fput.pages.grok.bot/", icon: "cal" },
      { name: "Projects", desc: "Crew projects overview", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/85afd095-6b75-4ccf-90cc-8abcc7a43fb9", icon: "crane" },
      { name: "How-To", desc: "Crew how-to guides", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/831d1f38-ce09-41cc-998f-39141c551792", icon: "book" },
      { name: "How-To PDF", desc: "Crew instructions PDF", url: "https://sharma-crew.sharma-crew.workers.dev/Crew-Instructions-EN-ES.pdf", icon: "file" },
      { name: "Code of Conduct", desc: "Crew rules", url: "https://sharma-crew.sharma-crew.workers.dev/code-of-conduct", icon: "book" },
      { name: "LED Lights", desc: "LED lighting notes and standards", url: "https://cursor.com/canvas/store-574534cd-5493-4c40-bf2a-390e46810606/f6bfc9ed-914f-47c2-85c8-ca93f678583d", icon: "bulb" },
      { name: "3131 W Eunice", desc: "Job page · Dunnellon", url: "https://sharma-crew.sharma-crew.workers.dev/3131", icon: "house" },
      { name: "3262 W Eunice", desc: "Job page · Dunnellon", url: "https://sharma-crew.sharma-crew.workers.dev/3262", icon: "house" },
      { name: "3286 W Eunice", desc: "Job page · Dunnellon", url: "https://sharma-crew.sharma-crew.workers.dev/3286", icon: "house" },
      { name: "3274 W Eunice", desc: "Job page · Dunnellon", url: "https://sharma-crew.sharma-crew.workers.dev/3274", icon: "house" },
    ],
  },
  {
    id: "clients",
    title: "Clients & Builders",
    apps: [
      { name: "Smart Home Picker", desc: "Homeowner upgrades: outlets, EV, generators, smart home", url: "https://smart-home-picker.pages.dev/", icon: "wifi" },
      { name: "Smart Home Picker (Muse)", desc: "Client picker on Muse", url: "https://muse.ai/s/smart-home-picker-xna6yxo0xk6xwjxb/FouXzyZ-eAuHamCs67YzTvG1e9K0u6l-08g86JZ2zbQ", icon: "muse" },
      { name: "HVAC Picker", desc: "HVAC change-out options for homeowners", url: "https://hvac-picker.pages.dev/", icon: "snowflake" },
      { name: "Electrical Picker", desc: "Electrical upgrade options for homeowners", url: "https://electrical-app.pages.dev/", icon: "zap" },
      { name: "Homeowner Hub", desc: "Portal for homeowners", url: "https://homeowner-hub.pages.dev/", icon: "people" },
      { name: "Builders Application", desc: "Builders and GCs apply to work with you", url: "https://sharma-builders.pages.dev/", icon: "builders" },
      { name: "Sample House · Citrus Craft", desc: "Sample house tracking for Citrus Craft Homes", url: "https://sample-house-citrus-craft-homes.pages.dev/", icon: "sample" },
      { name: "Sample House · Template", desc: "Reusable sample-house template for any builder", url: "https://sample-house-any-builder-template.pages.dev/", icon: "sample" },
      { name: "Keystone Sample House", desc: "Sample house tracking for Keystone Energy & Power", url: "https://keystone-sample.sharma-crew.workers.dev/", icon: "keystone" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    apps: [
      { name: "GitHub", desc: "Sharmaelechvac repositories", url: "https://github.com/Sharmaelechvac", icon: "github" },
      { name: "Bot Relay", desc: "Internal bot relay", url: "https://bot-relay.sharma-crew.workers.dev/", icon: "relay" },
      { name: "App Launcher", desc: "Original crew links page", url: "https://sharma-crew.sharma-crew.workers.dev/links", icon: "links" },
      { name: "Sanjay's Hub", desc: "Earlier personal links hub", url: "https://sanjay-hub.pages.dev/", icon: "hub" },
      { name: "BuzzDrafts", desc: "Internal engineering drawing tool", url: "https://muse.ai/s/buzzdrafts-rxd6xcxyit0xtrz/4FW0cWLV2mE7J_SrrlzVtLW2pyqSUNzouYRWa2kpuPw", icon: "draft" },
      { name: "Cloudflare", desc: "Dashboard for Workers and Pages", url: "https://dash.cloudflare.com", icon: "cloud" },
    ],
  },
];

const CHECK_URLS = [...new Set(SECTIONS.flatMap((s) => s.apps.filter((a) => a.check).map((a) => a.url)))];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function svg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;
}

function tile(app) {
  const coming = app.coming ? " coming" : "";
  const badge = app.coming ? `<span class="badge">Coming tonight</span>` : "";
  const check = app.check ? ` data-check="${esc(app.url)}"` : "";
  return `<a class="tile${coming}" href="${esc(app.url)}" target="_blank" rel="noopener"${check} data-name="${esc(app.name)}" data-desc="${esc(app.desc)}">
      <span class="ico">${svg(app.icon)}</span>
      <span class="meta">
        <span class="name">${esc(app.name)}</span>
        <span class="desc">${esc(app.desc)}</span>
        ${badge}
      </span>
    </a>`;
}

function page() {
  const sections = SECTIONS.map(
    (s) => `<section id="${s.id}">
      <h2>${esc(s.title)}</h2>
      <div class="grid">${s.apps.map(tile).join("")}</div>
    </section>`
  ).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>Sharma Home</title>
  <meta name="description" content="Private home screen for Sharma Electric & HVAC apps.">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="theme-color" content="#003a6e">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Sharma Home">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" type="image/png" href="/icon-192.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <style>
    :root{
      --blue:#0058a3;
      --blue-dark:#004585;
      --blue-deep:#003a6e;
      --blue-light:#e8f2fa;
      --blue-mid:#cfe6f5;
      --blue-soft:#5b9bd5;
      --ink:#0a2e4f;
      --muted:#3d6488;
      --white:#ffffff;
      --bg:#f3f7fb;
      --line:#d7e4f0;
      --gold:#c98412;
      --gold-bg:#fff4d6;
    }
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    html,body{margin:0;padding:0;background:var(--bg);color:var(--ink)}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.4;-webkit-font-smoothing:antialiased;min-height:100vh}
    header{
      background:linear-gradient(180deg,var(--blue-deep),var(--blue-dark));
      color:#fff;
      padding:max(22px,env(safe-area-inset-top)) 20px 22px;
      border-bottom:3px solid var(--blue);
    }
    .head{max-width:1080px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px}
    header img{height:52px;background:#fff;border-radius:10px;padding:6px 10px}
    header .brand{min-width:0}
    header h1{margin:0;font-size:26px;letter-spacing:-.03em;font-weight:750;white-space:nowrap}
    header p{margin:4px 0 0;color:#cfe3f7;font-size:14px}
    @media(max-width:480px){
      header img{height:40px;padding:5px 8px}
      header h1{font-size:22px}
    }
    main{max-width:1080px;margin:0 auto;padding:18px 16px 48px}
    .search{
      position:sticky;top:0;z-index:10;background:linear-gradient(180deg,var(--bg) 70%,transparent);
      padding:4px 0 14px;
    }
    .search input{
      width:100%;border:1px solid var(--line);background:var(--white);color:var(--ink);
      border-radius:14px;padding:14px 16px;font-size:16px;outline:none;
      box-shadow:0 2px 8px rgba(10,46,79,.05);
    }
    .search input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(0,88,163,.15)}
    h2{margin:22px 4px 12px;font-size:13px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}
    .grid{display:grid;grid-template-columns:1fr;gap:12px}
    @media(min-width:520px){.grid{grid-template-columns:1fr 1fr}}
    @media(min-width:900px){.grid{grid-template-columns:1fr 1fr 1fr}}
    a.tile{
      display:flex;align-items:flex-start;gap:14px;background:var(--white);
      border:1px solid var(--line);border-radius:18px;padding:16px 16px 15px;
      text-decoration:none;color:var(--ink);
      box-shadow:0 2px 8px rgba(10,46,79,.05);
      transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
      min-height:92px;
    }
    a.tile:hover,a.tile:focus{border-color:var(--blue);box-shadow:0 8px 22px rgba(0,88,163,.12);transform:translateY(-1px)}
    a.tile:active{transform:scale(.99)}
    .ico{
      flex:0 0 48px;width:48px;height:48px;border-radius:14px;
      background:var(--blue-light);color:var(--blue-dark);
      display:grid;place-items:center;
    }
    .ico svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .meta{min-width:0;display:flex;flex-direction:column;gap:3px;padding-top:1px}
    .name{font-weight:700;font-size:16px;letter-spacing:-.02em}
    .desc{font-size:13px;color:var(--muted);line-height:1.35}
    .badge{
      display:inline-block;align-self:flex-start;margin-top:6px;
      background:var(--gold-bg);color:var(--gold);font-size:11px;font-weight:750;
      letter-spacing:.02em;border-radius:999px;padding:3px 8px;
    }
    a.tile.coming{opacity:.92}
    a.tile.coming .ico{background:#fff4d6;color:var(--gold)}
    .empty{display:none;margin:40px 8px;text-align:center;color:var(--muted)}
    body.no-results .empty{display:block}
    body.no-results section{display:none}
    footer{max-width:1080px;margin:0 auto;padding:8px 20px calc(28px + env(safe-area-inset-bottom));text-align:center;color:var(--muted);font-size:12.5px;line-height:1.55}
    footer .hint{margin-top:6px;color:#8aa0b5}
  </style>
</head>
<body>
  <header>
    <div class="head">
      <div class="brand">
        <h1>Sharma Home</h1>
        <p id="hello">Hello, Sanjay</p>
      </div>
      <img src="/logo.png" alt="Sharma Electric & HVAC">
    </div>
  </header>
  <main>
    <div class="search">
      <input id="q" type="search" placeholder="Search apps" autocomplete="off" enterkeyhint="search">
    </div>
    ${sections}
    <p class="empty">No apps match that search.</p>
  </main>
  <footer>
    Sharma Electric &amp; HVAC · Lic. EC13013924 · CAC1823596<br>
    Private hub for Sanjay Sharma. Add to Home Screen from your phone’s share menu.
    <div class="hint">Collections and bids keep their own access on those apps.</div>
  </footer>
  <script>
    (function(){
      var n=new Date(), hr=+n.toLocaleString("en-US",{timeZone:"America/New_York",hour:"numeric",hour12:false});
      var hello=hr<5?"Good evening":hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
      document.getElementById("hello").textContent=hello+", Sanjay";

      var q=document.getElementById("q");
      function filter(){
        var v=(q.value||"").trim().toLowerCase();
        var shown=0;
        document.querySelectorAll("section").forEach(function(sec){
          var any=false;
          sec.querySelectorAll("a.tile").forEach(function(t){
            var hay=(t.dataset.name+" "+t.dataset.desc).toLowerCase();
            var ok=!v || hay.indexOf(v)!==-1;
            t.style.display=ok?"":"none";
            if(ok) any=true;
          });
          sec.style.display=any?"":"none";
          if(any) shown++;
        });
        document.body.classList.toggle("no-results", !shown);
      }
      q.addEventListener("input", filter);

      /* Liveness for tonight's apps is baked in at deploy (Worker-to-Worker
         fetches on the same *.sharma-crew.workers.dev subdomain return 404).
         A "Coming tonight" badge is only shown when coming=true in the catalog. */
    })();
  </script>
</body>
</html>`;
}

function statusJson() {
  const out = {};
  for (const section of SECTIONS) {
    for (const app of section.apps) {
      if (app.check) out[app.url] = { live: !app.coming, coming: !!app.coming };
    }
  }
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/status") {
      const data = statusJson();
      return new Response(JSON.stringify(data), {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }

    if (path === "/" || path === "/index.html") {
      // Serve Jarvis's Sharma Home page (docs/index.html) as the live home page.
      if (env.ASSETS) {
        const asset = await env.ASSETS.fetch(new URL("/index.html", request.url));
        if (asset.status !== 404) {
          const headers = new Headers(asset.headers);
          headers.set("content-type", "text/html;charset=utf-8");
          headers.set("cache-control", "no-store");
          headers.set("x-robots-tag", "noindex, nofollow");
          headers.set("referrer-policy", "same-origin");
          headers.set("x-content-type-options", "nosniff");
          return new Response(asset.body, { status: asset.status, headers });
        }
      }
      return new Response(page(), { headers: NOINDEX });
    }

    if (path === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /\n", {
        headers: { "content-type": "text/plain;charset=utf-8", "x-robots-tag": "noindex, nofollow" },
      });
    }

    if (env.ASSETS) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        const headers = new Headers(asset.headers);
        headers.set("x-robots-tag", "noindex, nofollow");
        return new Response(asset.body, { status: asset.status, headers });
      }
    }

    return new Response("Not found", { status: 404, headers: { "x-robots-tag": "noindex, nofollow" } });
  },
};
