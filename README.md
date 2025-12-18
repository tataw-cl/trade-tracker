# Trade Tracker (React)

Lightweight React prototype for a trade checklist/dashboard. This repository contains a small Vite + React app used to prototype pages and UI for tracking trades, balances and quick statistics.

This README documents the initial work done, how to run the project locally, and troubleshooting steps.

## What I implemented so far

- Project scaffolded with Vite + React.
- Pages: `Landing`, `History`, `Dashboard` (basic placeholder data and layout).
- Routing: `src/App.jsx` wired with React Router (routes for `/landing`, `/history`, `/dashboard`).
- Components: `Header`, `Footer`, `Tile`, `Property` (toggle control), and `Tile` usage on the landing page.
- Chart example: `Dashboard` uses Chart.js + react-chartjs-2 to render a sample line chart.
- Styling: single global stylesheet at `src/index.css` styled to a dark, glassy theme with accent colors. Header and footer have been styled, header links include inline SVG icons, and tiles have an accent stripe to stand out from the page background.
- Toggle control: interactive `Property` component with a small SVG toggle where the small knob changes color when toggled.

## How to run

Prerequisites: Node.js 16+ (LTS recommended) and npm.

1. Install dependencies

```powershell
cd trade-tracker
npm install
```

2. Start dev server

```powershell
npm run dev
```

Open the dev URL printed by Vite (usually `http://localhost:5173`).

## Files of interest

- `src/main.jsx` — app entry (mounts React)
- `src/App.jsx` — routing
- `src/pages/Landing.jsx` — landing / tile grid
- `src/pages/History.jsx` — trade history mockup
- `src/pages/Dashboard.jsx` — sample balances + Line chart
- `src/components/Header.jsx`, `Footer.jsx` — top and bottom bar
- `src/components/Tile.jsx`, `src/components/Property.jsx` — tile and property row with toggle
- `src/index.css` — application stylesheet and theme

## Known issues / notes

- The project uses local inline SVGs for icons that inherit `currentColor`. Styling is in `src/index.css`.
- If React hooks runtime errors appear (e.g. "useRef of null") check for mismatched React versions. Run `npm ls react react-dom` to verify only one copy is installed.
- If imports fail (e.g. `react-router-dom` or `react-chartjs-2`), re-run `npm install` inside the `trade-tracker` folder and check `package.json`.

## Next steps / suggestions

- Add unit tests for `Property` and `Tile` components (Jest + React Testing Library).
- Convert inline SVG icons to a small shared `icons/` component for reuse.
- Replace placeholder sample data with real API integrations.
- Break stylesheet into component-level CSS or use CSS Modules / Tailwind for maintainability.

---

If you want, I can also:

- Run the dev server and capture console output.
- Revert any specific files to their prior committed state.
- Add a minimal GitHub Actions workflow for lint/test.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
