import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel, User as SupabaseUser } from '@supabase/supabase-js';
import type { HackathonData, JudgeDecision, ScoreEntry } from './types';

/**
 * The whole backend, in one file: auth, data, realtime and file uploads.
 *
 * The app is a single large component that holds one in-memory `state` object, so rather than
 * spreading Supabase queries through it, everything the UI needs is exposed here as a handful of
 * functions. That is also what made replacing Firebase contained — the UI still just asks for
 * "the hackathons" and gets told when they change.
 *
 * Two shapes exist for the same data and the mapping lives here, nowhere else:
 *   - `HackathonData` — camelCase, what the UI uses
 *   - the `hackathons` row — snake_case columns, arrays as jsonb
 *
 * Configuration comes from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. The anon key is meant to
 * ship in the bundle; it grants nothing on its own, because every table is protected by row level
 * security (see supabase/migrations/). A service-role key must never appear in this file.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/**
 * True when the app has been given a backend to talk to. Checked before anything is attempted so a
 * missing env var produces one clear message instead of a wall of failed requests.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const MISSING_CONFIG_MESSAGE =
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then reload. ' +
  'See DEPLOY.md.';

if (!isSupabaseConfigured) {
  console.error(MISSING_CONFIG_MESSAGE);
}

// A dummy URL keeps createClient from throwing when the env vars are absent, so the app can render
// and show the message above rather than dying at import time with a blank page.
export const supabase = createClient(
  SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_ANON_KEY || 'anon-key-not-set',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } },
);

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * The signed-in user, in the shape the UI already used. Keeping `uid`/`displayName`/`photoURL`
 * rather than Supabase's `id`/`user_metadata` means the components did not have to change.
 */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

function toAppUser(user: SupabaseUser | null | undefined): AppUser | null {
  if (!user) return null;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === 'string' && value ? value : null);
  return {
    uid: user.id,
    email: user.email ?? null,
    displayName: str(meta.full_name) ?? str(meta.name) ?? null,
    photoURL: str(meta.avatar_url) ?? str(meta.picture) ?? null,
  };
}

/**
 * Calls back with the current user, then again on every sign-in and sign-out.
 *
 * Supabase fires an initial event once it has restored any stored session, so — like the Firebase
 * listener this replaced — the first call is what tells the app that auth is settled and it is safe
 * to decide between the sign-in screen and the app.
 */
export function onAuthChange(callback: (user: AppUser | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toAppUser(session?.user));
  });
  // onAuthStateChange only fires on a *change*, and whether the restore has already happened by
  // the time this runs is a race. Reading the session directly settles it either way.
  void supabase.auth.getSession().then(({ data: { session } }) => callback(toAppUser(session?.user)));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email: string, password: string): Promise<AppUser> {
  requireConfig();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const user = toAppUser(data.user);
  if (!user) throw new Error('Signed in but no account came back.');
  return user;
}

export async function signUp(email: string, password: string): Promise<AppUser> {
  requireConfig();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  const user = toAppUser(data.user);
  if (!user) throw new Error('Account created but no account came back.');
  // With "Confirm email" enabled in the Supabase project, sign-up succeeds but grants no session,
  // so the app would drop straight back to the sign-in screen with no explanation.
  if (!data.session) {
    throw new Error(
      'Account created. Check your inbox for the confirmation link, then sign in. ' +
        '(Turn off Confirm email in Supabase → Authentication → Providers to skip this.)',
    );
  }
  return user;
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Records the account in `profiles` so the app has a readable copy of who exists. */
export async function upsertProfile(user: AppUser, adminEmail: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.uid, email: user.email, role: user.email === adminEmail ? 'admin' : 'user' });
  if (error) throw error;
}

function requireConfig() {
  if (!isSupabaseConfigured) throw new Error(MISSING_CONFIG_MESSAGE);
}

// ─── Errors ──────────────────────────────────────────────────────────────────

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface DataErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  userId: string | undefined;
}

let currentUserId: string | undefined;
export function rememberCurrentUserId(uid: string | undefined) {
  currentUserId = uid;
}

/**
 * A readable message for any failure.
 *
 * Needed because most Supabase failures are plain objects (`{message, details, hint, code}`), not
 * `Error` instances — so the usual `String(err)` renders them as "[object Object]" and the reason
 * is lost both from the log and from the banner the user sees.
 */
export function describeError(error: unknown): string {
  if (error === null || error === undefined) return 'Unknown error';
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  const e = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
  const parts = [e.message, e.details, e.hint].filter(
    (part): part is string => typeof part === 'string' && part.length > 0,
  );
  if (parts.length > 0) {
    const text = parts.join(' — ');
    return e.code ? `${text} (${e.code})` : text;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/**
 * Logs a failed operation and returns the details.
 *
 * Deliberately does not throw: every caller is already inside a `.catch()`, so throwing turned a
 * handled rejection into an unhandled one, and an ErrorBoundary never sees async errors anyway.
 */
export function handleDataError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): DataErrorInfo {
  const info: DataErrorInfo = {
    error: describeError(error),
    operationType,
    path,
    userId: currentUserId,
  };
  console.error('Supabase error: ', JSON.stringify(info));
  return info;
}

/** True when the failure is row level security refusing, rather than a network or data problem. */
export function isPermissionDenied(error: unknown): boolean {
  const err = error as { code?: string; message?: string; status?: number } | null;
  // 42501 is Postgres "insufficient privilege"; PostgREST returns PGRST301 for a failed policy.
  if (err?.code === '42501' || err?.code === 'PGRST301') return true;
  if (err?.status === 401 || err?.status === 403) return true;
  return /row-level security|violates row-level|permission denied|not authorized/i.test(
    describeError(error),
  );
}

export async function testConnection(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('hackathons').select('id', { head: true, count: 'exact' });
  if (error) {
    console.error('Supabase connection failed:', error.message);
    return;
  }
  console.log('Supabase connection successful');
}

// ─── Row mapping ─────────────────────────────────────────────────────────────

interface HackathonRow {
  id: string;
  owner_id: string | null;
  name: string | null;
  subtitle: string | null;
  logo_url: string | null;
  color: string | null;
  music_url: string | null;
  phases: HackathonData['phases'] | null;
  teams: HackathonData['teams'] | null;
  judges: HackathonData['judges'] | null;
  mentors: HackathonData['mentors'] | null;
  hidden_criteria_ids: string[] | null;
  award_slides: HackathonData['awardSlides'] | null;
  is_public?: boolean;
  updated_at: string;
}

/** Scores and decisions arrive from their own tables, so they start empty here. */
function rowToHackathon(row: HackathonRow): HackathonData {
  return {
    id: row.id,
    ownerId: row.owner_id ?? undefined,
    hackathonName: row.name ?? undefined,
    hackathonSubtitle: row.subtitle ?? undefined,
    hackathonLogo: row.logo_url ?? undefined,
    hackathonColor: row.color ?? undefined,
    musicUrl: row.music_url ?? undefined,
    phases: row.phases ?? [],
    teams: row.teams ?? [],
    judges: row.judges ?? [],
    mentors: row.mentors ?? [],
    hiddenCriteriaIds: row.hidden_criteria_ids ?? [],
    awardSlides: row.award_slides ?? [],
    scores: [],
    decisions: [],
    updatedAt: row.updated_at,
  };
}

/**
 * `is_public` is intentionally absent: an upsert only overwrites the columns it names, so leaving
 * it out preserves whatever the hackathon is already set to rather than resetting it on every save.
 */
function hackathonToRow(h: HackathonData): Omit<HackathonRow, 'is_public'> {
  return {
    id: h.id,
    owner_id: h.ownerId ?? null,
    name: h.hackathonName ?? null,
    subtitle: h.hackathonSubtitle ?? null,
    logo_url: h.hackathonLogo ?? null,
    color: h.hackathonColor ?? null,
    music_url: h.musicUrl ?? null,
    phases: h.phases ?? [],
    teams: h.teams ?? [],
    judges: h.judges ?? [],
    mentors: h.mentors ?? [],
    hidden_criteria_ids: h.hiddenCriteriaIds ?? [],
    award_slides: h.awardSlides ?? [],
    updated_at: new Date().toISOString(),
  };
}

interface ScoreRow {
  hackathon_id: string;
  team_id: string;
  scorer_id: string;
  criterion_id: string;
  phase_id: string;
  score: number | string | null;
  selected_sub_criteria_ids: string[] | null;
  sub_criteria_values: Record<string, number> | null;
}

// `numeric` comes back as a string from PostgREST, which would then be compared and averaged as
// text. Everything downstream expects a number or null.
function rowToScore(row: ScoreRow): ScoreEntry {
  const entry: ScoreEntry = {
    teamId: row.team_id,
    judgeId: row.scorer_id,
    criterionId: row.criterion_id,
    phaseId: row.phase_id,
    score: row.score === null || row.score === '' ? null : Number(row.score),
  };
  if (row.selected_sub_criteria_ids) entry.selectedSubCriteriaIds = row.selected_sub_criteria_ids;
  if (row.sub_criteria_values) entry.subCriteriaValues = row.sub_criteria_values;
  return entry;
}

function scoreToRow(hackathonId: string, e: ScoreEntry): ScoreRow & { updated_at: string } {
  return {
    hackathon_id: hackathonId,
    team_id: e.teamId,
    scorer_id: e.judgeId,
    criterion_id: e.criterionId,
    phase_id: e.phaseId,
    score: e.score,
    selected_sub_criteria_ids: e.selectedSubCriteriaIds ?? null,
    sub_criteria_values: e.subCriteriaValues ?? null,
    updated_at: new Date().toISOString(),
  };
}

interface DecisionRow {
  hackathon_id: string;
  team_id: string;
  scorer_id: string;
  phase_id: string;
  decision: JudgeDecision['decision'];
}

function rowToDecision(row: DecisionRow): JudgeDecision {
  return {
    teamId: row.team_id,
    judgeId: row.scorer_id,
    phaseId: row.phase_id,
    decision: row.decision ?? null,
  };
}

function decisionToRow(hackathonId: string, d: JudgeDecision): DecisionRow & { updated_at: string } {
  return {
    hackathon_id: hackathonId,
    team_id: d.teamId,
    scorer_id: d.judgeId,
    phase_id: d.phaseId,
    decision: d.decision ?? null,
    updated_at: new Date().toISOString(),
  };
}

export const scoreKey = (s: ScoreEntry) =>
  `${s.teamId} ${s.judgeId} ${s.criterionId} ${s.phaseId}`;
export const decisionKey = (d: JudgeDecision) => `${d.teamId} ${d.judgeId} ${d.phaseId}`;

// ─── Reads ───────────────────────────────────────────────────────────────────

/**
 * PostgREST caps a response at 1000 rows by default, and one hackathon can easily exceed that
 * (20 teams × 8 judges × 5 criteria × 2 phases = 1600 scores), so a plain select would silently
 * return a truncated leaderboard. This pages until a short page comes back.
 */
const PAGE = 1000;

async function selectAll<T>(
  table: string,
  apply: (q: any) => any = q => q,
): Promise<{ rows: T[]; error: unknown }> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await apply(
      supabase.from(table).select('*').range(from, from + PAGE - 1),
    );
    if (error) return { rows, error };
    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < PAGE) return { rows, error: null };
  }
}

/**
 * A live view of a table, delivered as the whole array every time anything changes — which is what
 * the UI expects, having been written against Firestore snapshots.
 *
 * Changes are applied one row at a time instead of re-fetching, because during active scoring the
 * events arrive continuously and re-reading every score on each keystroke would not keep up.
 *
 * The subscription is opened *before* the first read, and rows already delivered live are kept in
 * preference to the read's version, so a write landing mid-read is neither missed nor resurrected.
 */
function liveTable<TRow, TItem>(
  table: string,
  hackathonId: string,
  keyOf: (item: TItem) => string,
  fromRow: (row: TRow) => TItem,
  onData: (items: TItem[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  if (!isSupabaseConfigured) return () => {};

  let items: TItem[] = [];
  const liveKeys = new Set<string>();
  let cancelled = false;

  const channel: RealtimeChannel = supabase
    .channel(`${table}:${hackathonId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter: `hackathon_id=eq.${hackathonId}` },
      payload => {
        if (cancelled) return;
        // DELETE only carries the old row, which is why the tables use REPLICA IDENTITY FULL —
        // without it there would be no key to remove.
        const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as TRow;
        if (!row) return;
        const item = fromRow(row);
        const key = keyOf(item);
        liveKeys.add(key);
        items = items.filter(existing => keyOf(existing) !== key);
        if (payload.eventType !== 'DELETE') items = [...items, item];
        onData(items);
      },
    )
    .subscribe();

  void (async () => {
    const { rows, error } = await selectAll<TRow>(table, q => q.eq('hackathon_id', hackathonId));
    if (cancelled) return;
    if (error) {
      onError?.(error);
      return;
    }
    const fetched = rows.map(fromRow).filter(item => !liveKeys.has(keyOf(item)));
    items = [...fetched, ...items];
    onData(items);
  })();

  return () => {
    cancelled = true;
    void supabase.removeChannel(channel);
  };
}

export function subscribeScores(
  hackathonId: string,
  onData: (scores: ScoreEntry[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  return liveTable<ScoreRow, ScoreEntry>(
    'scores', hackathonId, scoreKey, rowToScore, onData, onError,
  );
}

export function subscribeDecisions(
  hackathonId: string,
  onData: (decisions: JudgeDecision[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  return liveTable<DecisionRow, JudgeDecision>(
    'decisions', hackathonId, decisionKey, rowToDecision, onData, onError,
  );
}

/**
 * A live view of every hackathon the caller may read, newest edit first.
 *
 * Unlike scores this re-reads the table on each change rather than patching one row: the list is
 * short, and re-reading keeps the sort order correct without re-implementing it here.
 */
export function subscribeHackathons(
  onData: (hackathons: HackathonData[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  if (!isSupabaseConfigured) return () => {};

  let cancelled = false;
  let inFlight = false;
  let again = false;

  const load = async () => {
    if (inFlight) {
      // A burst of edits would otherwise start a read per event and let them finish out of order,
      // so the newest state could be overwritten by an older reply.
      again = true;
      return;
    }
    inFlight = true;
    const { rows, error } = await selectAll<HackathonRow>('hackathons', q =>
      q.order('updated_at', { ascending: false }),
    );
    inFlight = false;
    if (cancelled) return;
    if (error) onError?.(error);
    else onData(rows.map(rowToHackathon));
    if (again) {
      again = false;
      void load();
    }
  };

  const channel = supabase
    .channel('hackathons:all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hackathons' }, () => void load())
    .subscribe();

  void load();

  return () => {
    cancelled = true;
    void supabase.removeChannel(channel);
  };
}

// ─── Writes ──────────────────────────────────────────────────────────────────

/** Saves a hackathon's settings. Scores and decisions have their own tables and are untouched. */
export async function saveHackathon(hackathon: HackathonData): Promise<void> {
  // The UI falls back to a blank hackathon when none is selected; saving that would insert a junk
  // row keyed on the empty string.
  if (!hackathon.id) return;
  const { error } = await supabase.from('hackathons').upsert(hackathonToRow(hackathon));
  if (error) throw error;
}

/** Saves only the named fields, leaving the rest of the row as it is. */
export async function patchHackathon(
  id: string,
  patch: Partial<{ logo_url: string | null; music_url: string | null }>,
): Promise<void> {
  if (!id) return;
  const { error } = await supabase
    .from('hackathons')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteHackathon(id: string): Promise<void> {
  // Scores and decisions go with it — the foreign keys cascade, which is what used to have to be
  // done by hand, one batch at a time.
  const { error } = await supabase.from('hackathons').delete().eq('id', id);
  if (error) throw error;
}

export async function saveScore(hackathonId: string, entry: ScoreEntry): Promise<void> {
  const { error } = await supabase.from('scores').upsert(scoreToRow(hackathonId, entry));
  if (error) throw error;
}

export async function saveDecision(hackathonId: string, decision: JudgeDecision): Promise<void> {
  const { error } = await supabase.from('decisions').upsert(decisionToRow(hackathonId, decision));
  if (error) throw error;
}

/**
 * Removes scores and verdicts for teams, judges, phases or criteria that have been deleted.
 *
 * Saving a hackathon never touches these tables, so dropping them from local state alone left the
 * server copies behind and the next realtime read brought them straight back.
 *
 * Goes through an RPC rather than a filtered delete: expressing hundreds of composite keys as URL
 * filters produced a query string far longer than a proxy will accept. Posting them as JSON is one
 * round trip regardless of how many rows are involved, and row level security still applies.
 */
export async function deleteScoreRows(
  hackathonId: string,
  scores: ScoreEntry[],
  decisions: JudgeDecision[],
): Promise<void> {
  if (scores.length === 0 && decisions.length === 0) return;
  const { error } = await supabase.rpc('delete_score_rows', {
    h_id: hackathonId,
    score_keys: scores.map(s => ({
      team_id: s.teamId,
      scorer_id: s.judgeId,
      criterion_id: s.criterionId,
      phase_id: s.phaseId,
    })),
    decision_keys: decisions.map(d => ({
      team_id: d.teamId,
      scorer_id: d.judgeId,
      phase_id: d.phaseId,
    })),
  });
  if (error) throw error;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

/**
 * Uploads a file to a public bucket and returns the URL to store on the hackathon.
 *
 * `upsert` is on so re-uploading a file of the same name replaces it instead of failing, and
 * contentType is passed explicitly — without it an mp3 was served as application/octet-stream and
 * refused to play.
 */
export async function uploadAsset(
  bucket: 'logos' | 'music',
  path: string,
  file: File,
): Promise<string> {
  requireConfig();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type || undefined, upsert: true });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
