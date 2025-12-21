# Trade Tracker (React)

A lightweight Vite + React prototype for a trade checklist, summary, and basic analytics.

This repository contains a small frontend app (trade-tracker) that lets a user evaluate trades across multiple timeframe tiles, toggle checklist properties, save a summary to Supabase, and view history and a dashboard.

## Current features

- Landing page with multiple timeframe `Tile` components. Each tile contains `Property` rows with toggles.
- A special `Stop Loss & Take Profit` tile: its toggles (Stop Loss, Take Profit) are saved as boolean fields rather than a percentage, and the tile does not show a percentage in the UI.
- Summary card that aggregates tile percentages and shows an overall score. Summary displays icons for Stop Loss / Take Profit instead of ON/OFF.
- Save summary to Supabase `trades` table (payload includes `tiles` JSON and top-level `stop_loss` and `take_profit` boolean fields).
- History page shows saved trades in a modern card layout and renders stop/take icons from saved data.
- Dashboard renders aggregated metrics and a small chart derived from saved trades (falls back to sample data if none found).
- Supabase-based authentication (sign-up / sign-in / sign-out). Protected routes enforce auth for Landing, History, and Dashboard.

## Important files

- `src/pages/Landing.jsx` — main checklist UI and tiles grid
- `src/components/Tile.jsx` — tile component (computes totals and reports property state)
- `src/components/Property.jsx` — toggle control for each property
- `src/components/Summary.jsx` — summary UI and save-to-Supabase logic
- `src/pages/History.jsx` — displays saved trades (card layout)
- `src/pages/Dashboard.jsx` — aggregates trades into a simple chart and balances
- `src/services/tradeServices.js` — Supabase queries (getTradesByUser, createTrade, deleteTrade, saveTradeWithProfileCheck)
- `src/contexts/AuthContext.jsx` — Supabase auth wrapper
- `src/lib/supabaseClient.js` — Supabase client using Vite env vars
- `src/index.css` — global styles and small UI theming

## Supabase setup (quick)

1. Create a project at https://app.supabase.com
2. In Project Settings → API copy the `URL` and `anon` key.
3. Add environment variables in `trade-tracker/.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Create the `profiles` and `trades` tables in the SQL editor. Minimal schema:

```sql
-- profiles table (user metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tiles jsonb NOT NULL,
  overall numeric,
  stop_loss boolean DEFAULT false,
  take_profit boolean DEFAULT false,
  notes text,
  pnl numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON public.trades (user_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON public.trades (created_at DESC);
```

(If you already have `trades`, use ALTER TABLE to add `stop_loss` and `take_profit`.)

## Run locally

Prereqs: Node.js 16+ and npm

```powershell
cd trade-tracker
npm install
# add .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Open the dev URL (Vite prints it — typically `http://localhost:5173`).

## Notes on behavior

- The `Stop Loss & Take Profit` tile saves booleans in the `tiles` JSON and also populates top-level `stop_loss` and `take_profit` columns (if available in your DB schema).
- Summary's Save button requires a signed-in user. The `tradeServices.saveTradeWithProfileCheck` helper attempts to create a minimal profile row when missing and then inserts the trade.
- History reads saved trades and renders stop/take icons from the saved JSON; you can add RLS policies to restrict access to row owners if using Supabase Auth.

## Next improvements (suggestions)

- Add DB trigger to copy stopLoss/takeProfit from tiles JSON into top-level columns automatically.
- Normalize `tiles` into a `trade_tiles` table for easier filtering and reporting.
- Add unit tests (Jest + React Testing Library) for Tile and Property components.
- Improve visual accessibility (aria labels/tooltips) for toggle controls and status icons.

If you want any of the next improvements implemented (trigger, normalization, tests, or UI accessibility), tell me which one and I will implement it.
