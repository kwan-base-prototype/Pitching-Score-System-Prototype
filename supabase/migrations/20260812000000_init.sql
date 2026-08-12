-- ============================================================================
-- BASE Lab — initial schema
--
-- Replaces the Firestore model. `hackathons` keeps the arrays (phases, teams,
-- judges, mentors) as jsonb because the app loads and saves a hackathon whole,
-- exactly as it did with a single Firestore document — so the UI code did not
-- have to be restructured. Only `scores` and `decisions` became real tables,
-- because those need per-row writes from many people at once plus realtime.
--
-- The composite primary keys match the Firestore document ids one-for-one
-- (team_scorer_criterion_phase), so migrating old data is a direct mapping.
--
-- Apply with:  npx supabase db push
-- ============================================================================

create extension if not exists pgcrypto;

-- ─── profiles ───────────────────────────────────────────────────────────────
-- Mirror of auth.users the app can read. Written on sign-up.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

-- ─── hackathons ─────────────────────────────────────────────────────────────
-- `id` is text, not uuid: ids already in use came from Firestore (and include
-- hand-written ones like 'default-hackathon'), so they must survive the move.
create table if not exists public.hackathons (
  id                  text primary key,
  owner_id            uuid references auth.users (id) on delete set null,
  name                text,
  subtitle            text,
  logo_url            text,
  color               text,
  music_url           text,
  phases              jsonb not null default '[]'::jsonb,
  teams               jsonb not null default '[]'::jsonb,
  judges              jsonb not null default '[]'::jsonb,
  mentors             jsonb not null default '[]'::jsonb,
  hidden_criteria_ids jsonb not null default '[]'::jsonb,
  award_slides        jsonb not null default '[]'::jsonb,
  -- Public hackathons can be read without signing in, which is what makes the
  -- /p/:id/present projector link work on a second screen. Set false to lock a
  -- hackathon to its owner.
  is_public           boolean not null default true,
  updated_at          timestamptz not null default now()
);

-- The hackathon list is ordered newest-edited first.
create index if not exists hackathons_updated_at_idx on public.hackathons (updated_at desc);
create index if not exists hackathons_owner_idx on public.hackathons (owner_id);

-- ─── scores ─────────────────────────────────────────────────────────────────
-- `scorer_id` holds a judge id or a mentor id — the app treats both the same.
create table if not exists public.scores (
  hackathon_id              text not null references public.hackathons (id) on delete cascade,
  team_id                   text not null,
  scorer_id                 text not null,
  criterion_id              text not null,
  phase_id                  text not null,
  score                     numeric,
  selected_sub_criteria_ids jsonb,
  sub_criteria_values       jsonb,
  updated_at                timestamptz not null default now(),
  primary key (hackathon_id, team_id, scorer_id, criterion_id, phase_id)
);

create index if not exists scores_hackathon_idx on public.scores (hackathon_id);

-- ─── decisions ──────────────────────────────────────────────────────────────
-- A scorer's verdict on a team for a phase, separate from the numeric scores.
create table if not exists public.decisions (
  hackathon_id text not null references public.hackathons (id) on delete cascade,
  team_id      text not null,
  scorer_id    text not null,
  phase_id     text not null,
  decision     text check (decision in
                 ('pass', 'fail', 'not_sure', 'high', 'medium', 'low', 'critical')),
  updated_at   timestamptz not null default now(),
  primary key (hackathon_id, team_id, scorer_id, phase_id)
);

create index if not exists decisions_hackathon_idx on public.decisions (hackathon_id);

-- ============================================================================
-- Row level security
-- ============================================================================

alter table public.profiles   enable row level security;
alter table public.hackathons enable row level security;
alter table public.scores     enable row level security;
alter table public.decisions  enable row level security;

-- The platform owner can administer every hackathon, matching the admin check
-- the app has always applied on the client.
create or replace function public.is_platform_admin() returns boolean
  language sql stable
  as $$
    select coalesce(auth.jwt() ->> 'email', '') = 'kwanthananon.ar@baseplayhouse.co'
  $$;

-- Is this hackathon visible to the caller? `security definer` matters: the
-- score policies below call this, and without it each call would re-enter the
-- hackathons policies and recurse.
create or replace function public.hackathon_is_readable(h_id text) returns boolean
  language sql stable security definer set search_path = public
  as $$
    select exists (
      select 1 from public.hackathons h
      where h.id = h_id
        and (h.is_public or h.owner_id = auth.uid() or public.is_platform_admin())
    )
  $$;

create or replace function public.hackathon_is_writable(h_id text) returns boolean
  language sql stable security definer set search_path = public
  as $$
    select exists (
      select 1 from public.hackathons h
      where h.id = h_id
        and (h.owner_id = auth.uid() or public.is_platform_admin())
    )
  $$;

-- ─── profiles: your own row only ────────────────────────────────────────────
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ─── hackathons ─────────────────────────────────────────────────────────────
-- Read is deliberately open for public hackathons, including to anon: that is
-- the whole point of the projector link. These policies reference the row
-- directly rather than the helper functions, to avoid policy recursion.
drop policy if exists hackathons_read on public.hackathons;
create policy hackathons_read on public.hackathons
  for select using (is_public or owner_id = auth.uid() or public.is_platform_admin());

drop policy if exists hackathons_insert on public.hackathons;
create policy hackathons_insert on public.hackathons
  for insert to authenticated
  with check (owner_id = auth.uid() or public.is_platform_admin());

drop policy if exists hackathons_update on public.hackathons;
create policy hackathons_update on public.hackathons
  for update to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin())
  with check (owner_id = auth.uid() or public.is_platform_admin());

drop policy if exists hackathons_delete on public.hackathons;
create policy hackathons_delete on public.hackathons
  for delete to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin());

-- ─── scores and decisions ───────────────────────────────────────────────────
-- Readable by whoever can read the hackathon, so the projector shows real
-- numbers without a login.
--
-- Writing needs only a signed-in account, not ownership. That is not an
-- oversight: judges and mentors are identified by the app's own ids ('j1',
-- 'm2'), which are not auth uids, so the database cannot tell which account
-- belongs to which scorer. Tightening this means issuing per-scorer tokens and
-- routing writes through an RPC — see DEPLOY.md.
drop policy if exists scores_read on public.scores;
create policy scores_read on public.scores
  for select using (public.hackathon_is_readable(hackathon_id));

drop policy if exists scores_insert on public.scores;
create policy scores_insert on public.scores
  for insert to authenticated with check (public.hackathon_is_readable(hackathon_id));

drop policy if exists scores_update on public.scores;
create policy scores_update on public.scores
  for update to authenticated
  using (public.hackathon_is_readable(hackathon_id))
  with check (public.hackathon_is_readable(hackathon_id));

-- Deleting scores happens when a team, judge, phase or criterion is removed, so
-- it is restricted to whoever may edit the hackathon itself.
drop policy if exists scores_delete on public.scores;
create policy scores_delete on public.scores
  for delete to authenticated using (public.hackathon_is_writable(hackathon_id));

drop policy if exists decisions_read on public.decisions;
create policy decisions_read on public.decisions
  for select using (public.hackathon_is_readable(hackathon_id));

drop policy if exists decisions_insert on public.decisions;
create policy decisions_insert on public.decisions
  for insert to authenticated with check (public.hackathon_is_readable(hackathon_id));

drop policy if exists decisions_update on public.decisions;
create policy decisions_update on public.decisions
  for update to authenticated
  using (public.hackathon_is_readable(hackathon_id))
  with check (public.hackathon_is_readable(hackathon_id));

drop policy if exists decisions_delete on public.decisions;
create policy decisions_delete on public.decisions
  for delete to authenticated using (public.hackathon_is_writable(hackathon_id));

-- ============================================================================
-- Bulk delete
--
-- Deleting a team, judge, phase or criterion orphans its scores. Enumerating them as URL filters
-- meant an 18 KB query string for a phase with 1,600 scores, well past what a proxy will accept,
-- so the keys are posted as JSON instead and matched in one statement.
--
-- Left as `security invoker` on purpose: the delete policies above still apply, so this cannot be
-- used to remove scores from a hackathon the caller may not edit.
-- ============================================================================

create or replace function public.delete_score_rows(
  h_id          text,
  score_keys    jsonb default '[]'::jsonb,
  decision_keys jsonb default '[]'::jsonb
) returns void
  language plpgsql
  set search_path = public
  as $$
  begin
    delete from public.scores s
     using jsonb_to_recordset(coalesce(score_keys, '[]'::jsonb))
             as k(team_id text, scorer_id text, criterion_id text, phase_id text)
     where s.hackathon_id = h_id
       and s.team_id      = k.team_id
       and s.scorer_id    = k.scorer_id
       and s.criterion_id = k.criterion_id
       and s.phase_id     = k.phase_id;

    delete from public.decisions d
     using jsonb_to_recordset(coalesce(decision_keys, '[]'::jsonb))
             as k(team_id text, scorer_id text, phase_id text)
     where d.hackathon_id = h_id
       and d.team_id      = k.team_id
       and d.scorer_id    = k.scorer_id
       and d.phase_id     = k.phase_id;
  end $$;

-- ============================================================================
-- Realtime
--
-- The app keeps the hackathon list, the scores and the verdicts live, so every
-- open scoring sheet and the leaderboard update without a refresh. Realtime
-- respects the select policies above.
-- ============================================================================

-- Adding a table that is already published is an error, not a no-op, so each one is checked
-- first — otherwise re-running this file would fail here. A publication declared FOR ALL TABLES
-- already covers them and must be left alone.
do $$
declare
  t text;
  all_tables boolean;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  select puballtables into all_tables from pg_publication where pubname = 'supabase_realtime';
  if all_tables then
    return;
  end if;

  foreach t in array array['hackathons', 'scores', 'decisions'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- Realtime sends only the changed columns unless the table records full rows.
-- The app applies incoming rows wholesale, so it needs all of them.
alter table public.hackathons replica identity full;
alter table public.scores     replica identity full;
alter table public.decisions  replica identity full;

-- ============================================================================
-- Storage
--
-- Two public buckets. Both are read by <img> and <audio> tags with no auth
-- header, so the objects have to be publicly readable; uploading needs an
-- account.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true), ('music', 'music', true)
on conflict (id) do update set public = true;

drop policy if exists "brand assets are publicly readable" on storage.objects;
create policy "brand assets are publicly readable" on storage.objects
  for select using (bucket_id in ('logos', 'music'));

drop policy if exists "signed-in users upload brand assets" on storage.objects;
create policy "signed-in users upload brand assets" on storage.objects
  for insert to authenticated with check (bucket_id in ('logos', 'music'));

-- Re-uploading the same filename replaces the object rather than failing.
drop policy if exists "signed-in users replace brand assets" on storage.objects;
create policy "signed-in users replace brand assets" on storage.objects
  for update to authenticated using (bucket_id in ('logos', 'music'));

drop policy if exists "signed-in users remove brand assets" on storage.objects;
create policy "signed-in users remove brand assets" on storage.objects
  for delete to authenticated using (bucket_id in ('logos', 'music'));
