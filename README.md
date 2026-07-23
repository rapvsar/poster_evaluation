# PhD Research Day — Poster Evaluation

A lightweight, phone-friendly web app for scoring posters at the PhD Research Day.
Jury members score posters against a weighted rubric; organizers see live rankings
and export results. Results are stored in a shared online database (Supabase) so
every juror's scores aggregate on one dashboard, and the platform can be reused
each year.

## How it works

- **Jury:** enter your name once → pick a PhD year (1–4) → pick a poster → move the
  sliders (1–9) for each rubric criterion → submit. You can score as many posters
  as you like.
- **Organizer:** open the dashboard (passcode-gated), watch live rankings per year,
  export a CSV, and clear all results to start a new event.

No build step. It's plain HTML/CSS/JS and can be hosted on GitHub Pages.

## One-time setup (Supabase)

You need a free Supabase project. Do this once.

1. In your Supabase project, open **SQL Editor** and run:

   ```sql
   -- Key/value table the app reads and writes.
   create table if not exists public.kv (
     key        text primary key,
     value      text not null,
     updated_at timestamptz not null default now()
   );

   alter table public.kv enable row level security;

   -- Soft-security tool: anyone with the site URL can read/write results.
   -- This matches the app's existing "soft gate" (the organizer passcode is not
   -- a real security boundary). Fine for an internal event; tighten later if needed.
   create policy "public read"   on public.kv for select using (true);
   create policy "public insert" on public.kv for insert with check (true);
   create policy "public update" on public.kv for update using (true) with check (true);
   create policy "public delete" on public.kv for delete using (true);
   ```

2. In Supabase go to **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon public** key

3. Paste both into `assets/js/supabase-config.js`:

   ```js
   const SUPABASE_URL = 'https://abcdefgh.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJ...';
   ```

4. Commit and deploy (GitHub Pages: Settings → Pages → deploy from the `main` branch).

If the keys are missing or wrong, the app automatically falls back to per-browser
`localStorage` (single-device only) and logs a message to the browser console.

## Candidate list (uploaded by the organizer)

The organizer sets the candidate list by uploading a **CSV or Excel** file on the
dashboard — no code editing required. The file needs four columns (header names are
matched loosely, so `Family name` / `family` / `Surname` all work):

| Column | Meaning |
| --- | --- |
| `ID` | Poster number (unique) |
| `Family name` | Last name |
| `First name` | Given name |
| `Year` | PhD year (used to group posters) |

A **"Download template CSV"** button on the dashboard produces a correctly-formatted
starter file. The uploaded list is saved to the shared database, so every juror's
device picks it up automatically. If no list has been uploaded, the app uses the
default roster baked into `script.js`.

## Reusing the platform next year

Everything is one button on the organizer dashboard: **"Start new event"**. It:

1. Offers to download the previous event's results as a CSV backup (if any exist).
2. Asks for this year's participant file (CSV or Excel).
3. Shows a summary (students per year, duplicate-ID warnings) for confirmation.
4. Saves the new roster to the shared database **and** clears the previous event's
   scores together — so every device is ready for the new event.

(Optional) change the organizer passcode — `ORG_PASSCODE` in `script.js`.

## Files

- `index.html` — page shell; loads supabase-js, the config, then the app.
- `assets/js/supabase-config.js` — Supabase credentials + the `window.storage` shim.
- `assets/js/script.js` — the whole app (data, rubric, screens, dashboard).
- `assets/css/styles.css` — styling.

## Scoring rubric (weights)

| Criterion | Weight |
| --- | --- |
| Introduction, objectives, hypothesis, methods & scientific rigour | 35% |
| Appearance, legibility & correctness | 25% |
| Results and significance | 15% |
| Organizational flow | 15% |
| Knowledge and answering questions | 10% |

The weighted score is out of 9. Rankings use each candidate's average weighted
score across all jury submissions; the top candidate per year is flagged as winner.
