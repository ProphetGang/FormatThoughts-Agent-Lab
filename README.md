![FormatThoughts Logo](public/assets/logo/format_thoughts_logo.png)

# FormatThoughts Agent Lab

A scoped demo environment for practicing architecture-aware change review using a small React frontend.

---

## What this repo is

A bounded lab built from the FormatThoughts frontend foundation.

It is used to run small, structured GitHub issue → agent → pull request workflows, which can then be reviewed privately and turned into case studies.

Current structure:
- `src/App.jsx` — route shell (BrowserRouter / Routes / Route)
- `src/pages/BlogHome.jsx` — full blog page logic, separated from display
- `src/pages/Labs.jsx` — placeholder for future lab surfaces
- `/labs` route available

---

## What this repo is not

This is not the governance engine. It does not include ingest logic, policy evaluation, rule grammars, or enforcement mechanics. Those live elsewhere.

This repo is a proposal sandbox — changes happen here, review happens outside.

---

## How it works

1. A bounded issue is created
2. A GitHub coding agent proposes a change
3. A pull request is opened
4. The change is reviewed privately
5. A lesson may later be published from that workflow

---

## Good tasks for this repo

- frontend shell refactors
- route organization
- page/component separation
- display-layer cleanup
- small structural improvements

---

## Updates

**my_second_thought** | [FormatThoughts](https://formatthoughts.com)

`src/App.jsx` was reduced from a 185-line monolith to a 14-line router shell. All page logic, state management, and data access were moved into `src/pages/BlogHome.jsx`. A placeholder `src/pages/Labs.jsx` was added at `/labs`. Display components now accept props only — no component imports directly from `src/data/`. `react-router-dom` was introduced as the only new dependency.

---

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```
