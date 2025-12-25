# trade-tracker

A lightweight Vite + React single-page app for creating and saving pre-trade checklists, reviewing history, and viewing simple analytics.

This README documents the repository layout, how to run the app locally, how to configure Supabase for auth and persistence, the minimal DB schema used by the app, and developer guidance for extending the project.

---

## Table of contents

- [Features](#features)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Supabase minimal schema](#supabase-minimal-schema)
- [How it works (high level)](#how-it-works-high-level)
- [Developer notes](#developer-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Per-tile checklist UI with multiple properties
- Live per-tile percentage aggregation and overall Summary
- Special handling for `Stop Loss & Take Profit` (saved as booleans)
- Save summaries (trades) to Supabase `trades` table
- Supabase authentication with protected routes
- History and Dashboard pages for review and simple analytics
- User-friendly error handling (local UI messages + ErrorBoundary)

## Repository layout (important files)

- `src/` — application source
  - `src/App.jsx` — route definitions
  - `src/main.jsx` — app bootstrap
  - `src/index.css` — global styles (Linear dark theme)
  - `src/pages/` — page components (Landing, History, Dashboard, About, Privacy, Terms)
  - `src/components/` — UI components (Tile, Property, Summary, Header, Footer, ErrorBoundary)
  - `src/services/tradeServices.js` — Supabase CRUD and save helper
  - `src/contexts/AuthContext.jsx` — Supabase auth wrapper
  - `src/lib/supabaseClient.js` — Supabase client init (reads VITE\_ env vars)

---

## Getting started

Prerequisites

- Node.js 16+ and npm (or your preferred package manager)

Local dev steps

1. Open a terminal and change into the app folder:

```powershell
cd trade-tracker
```

2. Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

3. Open the URL printed by Vite (usually `http://localhost:5173`).

Note: Without Supabase keys the app will still run but features that require auth or persistence (saving/loading trades) will be disabled or throw client-side errors.

---

## Environment variables

Create a `.env` file inside the `trade-tracker` folder with the following values when using Supabase:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The app reads these from `src/lib/supabaseClient.js` to initialize the Supabase client.

---

## Supabase minimal schema

The app expects a minimal `profiles` table for authenticated users and a `trades` table for saved summaries. Create these tables in Supabase SQL editor if you want to store data.

```sql
-- profiles table
create table if not exists public.profiles (
	id uuid primary key,
	email text,
	created_at timestamptz default now()
);

-- trades table
create table if not exists public.trades (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null references public.profiles(id) on delete cascade,
	tiles jsonb not null,
	overall numeric,
	stop_loss boolean default false,
	take_profit boolean default false,
	notes text,
	pnl numeric default 0,
	created_at timestamptz default now()
);

create index if not exists idx_trades_user_id on public.trades (user_id);
create index if not exists idx_trades_created_at on public.trades (created_at desc);
```

Notes:

- `tiles` stores an array of objects representing each tile and its properties (JSON). The app's save helper will upsert a minimal `profiles` row (id only) prior to inserting a trade to avoid FK errors if the profile is missing.
- You can add additional columns to `profiles` (display name, avatar) without breaking the app, but the save helper only relies on `profiles.id`.

---

## How it works (high level)

- UI: The Landing page renders a set of tiles. Each tile has multiple `Property` toggles. Toggling a property updates the tile's percentage (sum of property weights) and the Summary.
- Summary: Shows per-tile computed percentage and an overall score. Save sends a payload with `tiles` JSON and top-level `stop_loss` / `take_profit` booleans to the `trades` table.
- Persistence: `src/services/tradeServices.js` contains a `saveTradeWithProfileCheck` helper that upserts a minimal `profiles` record (id only) and then inserts a row into `trades`.
- Auth: `src/contexts/AuthContext.jsx` wraps the app and exposes the authenticated user; certain routes use a `PrivateRoute` wrapper.

---

## Developer notes

- Logging: noisy `console.*` usage was removed from the UI; services throw errors and UI pages display friendly messages.
- Styling: global stylesheet uses a Linear-inspired dark theme and imports Google Fonts at the top to avoid PostCSS issues.
- Tests: none included by default. Consider adding Jest + React Testing Library for unit/component tests.
- Extensibility ideas:
  - Add server-side triggers to populate top-level `stop_loss`/`take_profit` columns from the JSON payload
  - Normalize `tiles` into a relational table for advanced reporting
  - Add pagination / filters to the History page

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo and create a feature branch
2. Run the app locally and add tests for new behavior
3. Open a PR with a clear description and screenshots

---

## License

See the repository root `LICENSE` file for license terms.

---
