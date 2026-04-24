# grapplers2 — Deploy to Vercel

> **Naming**: Use **`grapplers2`** for the Vercel project and GitHub repo (there's already an existing `grapplers`).

Pure static site. No build step. Just upload and go.

## What's in the package

- `index.html` — the real, live app (marketing → onboarding → mobile app, responsive, persistent)
- `Grapplers.html` — the design canvas viewer (all artboards, zoomable)
- `grapplers/` — React/JSX components, tokens, data, screens, `AppRoot.jsx`
- `vercel.json` — routes:
  - `/` → `index.html` (live app)
  - `/canvas` → `Grapplers.html` (design canvas)
  - `/app` → `index.html`

## Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
cd <this-folder>
vercel --name grapplers2            # first time: creates project named grapplers2
vercel --prod --name grapplers2     # deploys to production
```

## Option B — Vercel web UI (no CLI)

1. Go to https://vercel.com/new
2. Drag-and-drop this folder, OR push it to a GitHub repo and import
3. **Project name:** `grapplers2`
4. **Framework preset:** "Other" (no framework)
5. **Build command:** leave empty
6. **Output directory:** leave empty (root)
7. Click **Deploy**

## Option C — GitHub + Vercel

```bash
git init
git add .
git commit -m "grapplers2 v0.1 — real app"
git branch -M main
git remote add origin git@github.com:<you>/grapplers2.git
git push -u origin main
```

Then import the repo at https://vercel.com/new as `grapplers2`. Every push auto-deploys.

## Local development

```bash
python3 -m http.server 4173
# open http://localhost:4173/
```

## Custom domain

After deploying, add a custom domain in Vercel → grapplers2 → Settings → Domains. Point your DNS there.
