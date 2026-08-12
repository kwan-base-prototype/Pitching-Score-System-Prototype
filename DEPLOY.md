# Deployment — BASE Lab

Everything needed to put this app on **Vercel** at **baselab.site**, backed by **Supabase**.
Written for whoever runs the deploy.

The app used to run on Firebase. It no longer does — Firebase is gone from the code, the
dependencies and the repo. There is nothing left to deploy on the Firebase side and no Firestore
rules to worry about.

---

## 1. What has to happen, in order

Roughly an hour, most of it waiting.

| # | Step | Where |
|---|------|-------|
| 1 | Create a Supabase project | supabase.com |
| 2 | Apply the schema (`npm run db:push`) | terminal |
| 3 | Turn off "Confirm email", or plan to confirm each account | Supabase dashboard |
| 4 | Set two env vars and deploy | Vercel |
| 5 | Attach `baselab.site` | Vercel + DNS |
| 6 | Create the admin account and check the list in §5 | the deployed site |

Nothing works until steps 1, 2 and 4 are done — without the env vars the app loads and says so
in a banner rather than pretending the database is empty.

---

## 2. Supabase

### Create the project
supabase.com → New project. Pick the **Singapore (ap-southeast-1)** region — closest to Bangkok,
and every scoring keystroke is a round trip to it. Save the database password somewhere safe;
it is needed once, in the next step.

### Apply the schema
```bash
npx supabase login
npx supabase link --project-ref YOUR-PROJECT-REF
npm run db:push
```

That applies `supabase/migrations/20260812000000_init.sql`, which is the whole backend: four
tables, row level security on all of them, realtime, and the two storage buckets. It is written to
be safe to re-run.

**Read the RLS section of that file before pushing.** One decision in it is deliberate and worth
agreeing with: hackathons are `is_public = true` by default, which means **anyone with the link can
read a hackathon and its scores without signing in.** That is what makes the projector link
(`/hackathon-hub/p/:id/present`) work on a second screen with no login. To lock one down:

```sql
update hackathons set is_public = false where id = '...';
```

### Turn off email confirmation (or don't)
Supabase → Authentication → Providers → Email. With **Confirm email** on, a new account cannot sign
in until the link in the email is clicked; the app says so instead of silently bouncing back to the
sign-in screen. For an internal tool with a handful of accounts, off is simpler.

### The schema, in short

`hackathons` keeps `phases`, `teams`, `judges` and `mentors` as `jsonb`. That is on purpose: the app
loads and saves a hackathon whole, exactly as it did with a single Firestore document, so the UI did
not have to be restructured around a relational model it does not use.

`scores` and `decisions` are real tables, because many people write them at the same time, each to
their own row, and everyone else needs to see it immediately. Their composite primary keys are
`(hackathon_id, team_id, scorer_id, criterion_id, phase_id)` — the same identity Firestore used.

`on delete cascade` on both means deleting a hackathon takes its scores with it. That used to be
hand-written batch deletes, and was a source of orphaned-score bugs.

`scorer_id` holds a judge id *or* a mentor id; the app treats them the same way.

---

## 3. Vercel

### Project settings
| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |
| Node version | 22 |

`vercel.json` is committed and handles the two things Vercel needs:
- **SPA rewrite**, so `/hackathon-hub/h/:id/teams` and friends survive a refresh instead of 404ing
- Cache headers: hashed assets immutable, `index.html` never cached

### Environment variables
Set both for **Production, Preview and Development**. Vite only exposes variables prefixed `VITE_`,
and only these two exist:

```
VITE_SUPABASE_URL       https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY  the "anon public" key
```

Both are from Supabase → Project Settings → API. **The anon key belongs in the client** — it is a
publishable key and grants nothing by itself, because every table is behind row level security.

> **The `service_role` key must never go in Vercel env vars, this repo, or any client code.** It
> bypasses row level security entirely. There is no step in this deploy that needs it.

### Base path
Defaults to `/`, which is right for a root domain. `/home` is the BASE Lab home (a tools launcher)
and each tool owns a namespace beside it:

| URL | Page |
|---|---|
| `baselab.site/` | Redirects to `/home` |
| `baselab.site/home` | BASE Lab home — tools launcher |
| `baselab.site/hackathon-hub` | Hackathon picker |
| `baselab.site/hackathon-hub/h/:id/dashboard` | Inside a hackathon |
| `baselab.site/hackathon-hub/s/:id/judge/:judgeId` | Share link for a judge |
| `baselab.site/hackathon-hub/p/:id/present` | Projector link, no sign-in |

Adding a second tool means adding it to `Tool`/`TOOL_SEGMENT` in `src/router.ts` and to the `TOOLS`
list in `src/ToolLauncher.tsx`; its routes cannot collide with Hackathon Hub's.

To serve from a subpath instead, set `BASE_PATH` (e.g. `/pitching/`) as a build-time env var **and**
change the `vercel.json` rewrite destination to match. A subdomain is simpler.

### Domain
Vercel → Domains → add `baselab.site`, then point DNS as Vercel instructs.

---

## 4. The admin account

`ADMIN_EMAIL` in `src/App.tsx` and `is_platform_admin()` in the migration both hardcode
`kwanthananon.ar@baseplayhouse.co`. That account can administer every hackathon; everyone else can
only edit hackathons they created. **Both places have to change together** — the app decides what to
show, the database decides what is allowed.

Sign up with that address on the deployed site first. An empty database bootstraps a starter
hackathon on that account's first visit.

---

## 5. What to verify after deploying

Deep links are the thing most likely to break, because they depend on the rewrite.

- [ ] `/` rewrites itself to `/home` and shows the BASE Lab home with the Hackathon Hub card
- [ ] No red banner about Supabase configuration ← proves the env vars reached the build
- [ ] Sign up, then sign in; you land on `/home`
- [ ] `/hackathon-hub` lists hackathons, "All Tools" returns to `/home`
- [ ] `/hackathon-hub/h/<id>/dashboard` loads **and survives a hard refresh** ← proves the rewrite
- [ ] Edit the hackathon name, refresh: it persisted
- [ ] Enter a score; the leaderboard total changes and is **not** `0.00`
- [ ] Open the same hackathon in a second window and score in one — the other updates without a
      refresh ← proves realtime and the publication
- [ ] `/hackathon-hub/p/<id>/present` loads **in a private window with no login**
- [ ] `/hackathon-hub/s/<id>/judge/<judgeId>` loads a scoring sheet with no sidebar
- [ ] Upload a hackathon logo and a music file; both survive a refresh ← proves the storage buckets
- [ ] Background music plays in present mode (needs a click first — browser autoplay policy)
- [ ] Delete a throwaway hackathon; its scores go too

---

## 6. Known limitations

| Issue | Effect | Fix |
|---|---|---|
| Scoring links (`/s/…`) require an account | A mentor cannot score from a link alone | Per-scorer tokens, below |
| Any signed-in account can write any score | Fine internally, wrong for outside judges | Same |
| Demo data is preview-only | "Load Demo Data" is never saved | Intentional — it cannot damage real scores |
| No automated tests | Scoring changes are unverified | The formula was checked with throwaway fuzz scripts that were not kept |

### Why `/s/…` needs a login

Judges and mentors are identified by the app's own ids (`j1`, `m2`), which are not auth user ids, so
the database cannot tell which account is which scorer. The RLS policy therefore allows any
authenticated user to write scores for a hackathon they can read.

Fixing it properly means issuing a token per scorer and routing writes through an RPC that validates
it, which removes the login requirement at the same time:

```sql
create table scoring_tokens (
  token        uuid primary key default gen_random_uuid(),
  hackathon_id text not null references hackathons(id) on delete cascade,
  scorer_id    text not null,
  role         text check (role in ('judge', 'mentor'))
);
```

Not built. It is a product decision — worth it for external judges, unnecessary for a team that all
have accounts.

---

## 7. Migrating the old Firebase data

Probably nothing to migrate: the Firestore rules were never deployed, so scores could not be read or
written, and leaderboards showed `0.00`. Check the old project before assuming.

If a hackathon's structure (teams, criteria, weights) is worth keeping, the fastest route is to open
the old app, use **Export Data (JSON)** on the System Management page, and re-enter or insert it.
Field mapping is in `hackathonToRow` in `src/supabase.ts` — camelCase in the app, snake_case in the
database.

The Firebase web config that used to be committed here has been deleted, but it is still in git
history. Those keys are not secrets (Firebase web API keys are designed to be public), so nothing
needs rotating — but the old Firebase project should be shut down so it cannot be written to.

---

## 8. Repo notes

- `src/supabase.ts` is the entire backend: auth, queries, realtime, uploads. Nothing else talks to
  the database.
- `src/assets/default-background-music.mp3` is **4.4 MB** and committed on purpose so presentations
  are never silent. Served from `/assets/` with immutable caching.
- `npm run lint` is `tsc --noEmit` in `strict` mode and must stay clean.
- react-player pulls in `hls.js` and `dash.js` (~1.5 MB). They are separate chunks and are not
  fetched for an mp3, so they do not affect load time — but dropping react-player for a plain
  `<audio>` element would remove them.
- `.claude/` is local agent tooling, not needed to deploy.
