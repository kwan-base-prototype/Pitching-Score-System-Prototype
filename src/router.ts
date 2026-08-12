import { useCallback, useEffect, useState } from 'react';

/**
 * URL routing. There is no router library — the whole UI switches on a single `activeTab`
 * string, so instead of restructuring it we treat the URL as the source of truth for that
 * string and keep the mapping in one place.
 *
 * `/home` is the BASE Lab home — the tools launcher — and each tool owns a namespace beside
 * it, so a second tool can be added later without its routes colliding with Hackathon Hub's.
 * The launcher has a named URL of its own rather than living on the bare root, so it can be
 * linked to, bookmarked, and returned to explicitly; `/` redirects there.
 *
 *   /                                       → redirects to /home
 *   /home                                   BASE Lab home: tools launcher
 *   /hackathon-hub                          hackathon picker
 *   /hackathon-hub/h/:id                    → redirects to the leaderboard
 *   /hackathon-hub/h/:id/dashboard          a plain tab (see SIMPLE_TABS)
 *   /hackathon-hub/h/:id/judge/:judgeId     a judge's scoring sheet, with the sidebar
 *   /hackathon-hub/h/:id/mentor/:mentorId   a mentor's scoring sheet, with the sidebar
 *   /hackathon-hub/h/:id/present            leaderboard + presentation overlay
 *   /hackathon-hub/h/:id/awards             award presentation overlay
 *   /hackathon-hub/s/:id/judge/:judgeId     the shared scoring link — same sheet, no sidebar
 *   /hackathon-hub/s/:id/mentor/:mentorId
 *   /hackathon-hub/p/:id/present            read-only projector link — no sign-in, no admin UI
 *   /hackathon-hub/p/:id/awards
 *
 * All of the above sit under the Vite base path, which is `/` by default — set BASE_PATH when
 * the app is served from a subdirectory (see vite.config.ts) and every route shifts with it.
 *
 * Legacy shared links (?role=judge&id=…&hackathonId=…) still parse and are rewritten to their
 * namespaced /s/… equivalent on load, so already-distributed links keep working.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Tools available from the launcher at the domain root. */
export type Tool = 'hackathon-hub';

/** The BASE Lab home. Kept out of `TOOL_SEGMENT` because it is the launcher, not a tool. */
const LAUNCHER_SEGMENT = 'home';

/** URL segment that namespaces each tool. */
const TOOL_SEGMENT: Record<Tool, string> = {
  'hackathon-hub': 'hackathon-hub',
};

export type Overlay = 'present' | 'awards';

export interface Route {
  /** null means the BASE Lab home — the tools launcher. */
  tool: Tool | null;
  /** null means the tool's own landing page (for Hackathon Hub, the hackathon picker). */
  hackathonId: string | null;
  /** The existing `activeTab` value, e.g. 'dashboard' or 'judge-abc123'. */
  tab: string;
  overlay: Overlay | null;
  /** A shared scoring link: renders the sheet without the admin sidebar. */
  external: boolean;
  /**
   * A /p/… projector link. Viewable without signing in, and renders nothing but the
   * presentation overlay — no sidebar, no tabs, no controls that write data.
   */
  publicView: boolean;
}

const SIMPLE_TABS = [
  'dashboard',
  'hackathon-leaderboard',
  'all-scores',
  'team-scoring-table',
  'team-scoring',
  'mentor-scoring',
  'teams',
  'judges',
  'mentors',
  'criteria',
  'scoring-structure',
  'internal',
];

const DEFAULT_TAB = 'dashboard';

/** Which tab renders behind each full-screen overlay. */
const OVERLAY_TAB: Record<Overlay, string> = {
  present: 'hackathon-leaderboard',
  awards: 'dashboard',
};

/** The BASE Lab home — the tools launcher, at /home. */
export const LAUNCHER_ROUTE: Route = {
  tool: null,
  hackathonId: null,
  tab: DEFAULT_TAB,
  overlay: null,
  external: false,
  publicView: false,
};

/** Hackathon Hub's own landing page — the list of hackathons. */
export const HOME_ROUTE: Route = { ...LAUNCHER_ROUTE, tool: 'hackathon-hub' };

export function hackathonRoute(hackathonId: string, tab = DEFAULT_TAB): Route {
  return { tool: 'hackathon-hub', hackathonId, tab, overlay: null, external: false, publicView: false };
}

/** The URL to hand to a judge or mentor so they can score without the admin UI. */
export function sharedScoringUrl(hackathonId: string, role: 'judge' | 'mentor', personId: string) {
  const path = buildPath({
    tool: 'hackathon-hub',
    hackathonId,
    tab: `${role}-${personId}`,
    overlay: null,
    external: true,
    publicView: false,
  });
  return `${window.location.origin}${path}`;
}

/** The URL to open on a second screen — read-only, and works without signing in. */
export function publicPresentationUrl(hackathonId: string, overlay: Overlay) {
  const path = buildPath({
    tool: 'hackathon-hub',
    hackathonId,
    tab: OVERLAY_TAB[overlay],
    overlay,
    external: false,
    publicView: true,
  });
  return `${window.location.origin}${path}`;
}

function segments(pathname: string): string[] {
  const path = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return path.split('/').filter(Boolean);
}

export function parseLocation(pathname: string, search: string): Route {
  const params = new URLSearchParams(search);
  const role = params.get('role');
  const personId = params.get('id');
  if ((role === 'judge' || role === 'mentor') && personId) {
    return {
      tool: 'hackathon-hub',
      hackathonId: params.get('hackathonId'),
      tab: `${role}-${personId}`,
      overlay: null,
      external: true,
      publicView: false,
    };
  }

  const all = segments(pathname);

  // The bare root, /home, and anything unrecognised all resolve to the launcher; the canonical
  // form is /home, which the address-bar rewrite in App.tsx settles on.
  if (all.length === 0) return LAUNCHER_ROUTE;
  if (all[0] !== TOOL_SEGMENT['hackathon-hub']) return LAUNCHER_ROUTE;

  const [prefix, hackathonId, ...rest] = all.slice(1);
  if (!prefix) return HOME_ROUTE;
  if (!['h', 's', 'p'].includes(prefix) || !hackathonId) return HOME_ROUTE;

  // /p only ever resolves to a presentation. Anything else under it is not public.
  if (prefix === 'p') {
    if (rest[0] === 'present' || rest[0] === 'awards') {
      return {
        tool: 'hackathon-hub',
        hackathonId,
        tab: OVERLAY_TAB[rest[0]],
        overlay: rest[0],
        external: false,
        publicView: true,
      };
    }
    return HOME_ROUTE;
  }

  // Only the shared scoring sheets live under /s — everything else is admin UI.
  const external = prefix === 's' && (rest[0] === 'judge' || rest[0] === 'mentor') && !!rest[1];

  if ((rest[0] === 'judge' || rest[0] === 'mentor') && rest[1]) {
    return { tool: 'hackathon-hub', hackathonId, tab: `${rest[0]}-${rest[1]}`, overlay: null, external, publicView: false };
  }

  if (rest[0] === 'present' || rest[0] === 'awards') {
    return {
      tool: 'hackathon-hub',
      hackathonId,
      tab: OVERLAY_TAB[rest[0]],
      overlay: rest[0],
      external: false,
      publicView: false,
    };
  }

  if (rest[0] && SIMPLE_TABS.includes(rest[0])) {
    return { tool: 'hackathon-hub', hackathonId, tab: rest[0], overlay: null, external: false, publicView: false };
  }

  return hackathonRoute(hackathonId);
}

export function buildPath(route: Route): string {
  // The launcher has its own segment, as does every tool.
  if (!route.tool) return `${BASE}/${LAUNCHER_SEGMENT}`;

  const toolHome = `${BASE}/${TOOL_SEGMENT[route.tool]}`;
  if (!route.hackathonId) return toolHome;
  // A projector link without an overlay has nothing to show — fall back to the picker.
  if (route.publicView && !route.overlay) return toolHome;

  const parts = [
    TOOL_SEGMENT[route.tool],
    route.publicView ? 'p' : route.external ? 's' : 'h',
    route.hackathonId,
  ];

  if (route.overlay) {
    parts.push(route.overlay);
  } else if (route.tab.startsWith('judge-')) {
    parts.push('judge', route.tab.slice('judge-'.length));
  } else if (route.tab.startsWith('mentor-') && route.tab !== 'mentor-scoring') {
    // 'mentor-scoring' is a plain tab, not a per-mentor sheet.
    parts.push('mentor', route.tab.slice('mentor-'.length));
  } else {
    parts.push(route.tab);
  }

  return `${BASE}/${parts.join('/')}`;
}

export interface NavigateOptions {
  /** Rewrite the current entry instead of adding one — use for normalising URLs. */
  replace?: boolean;
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() =>
    parseLocation(window.location.pathname, window.location.search),
  );

  useEffect(() => {
    const onPopState = () =>
      setRoute(parseLocation(window.location.pathname, window.location.search));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((next: Route, options?: NavigateOptions) => {
    const path = buildPath(next);
    const current = `${window.location.pathname}${window.location.search}`;
    if (path !== current) {
      window.history[options?.replace ? 'replaceState' : 'pushState'](null, '', path);
    }
    setRoute(next);
  }, []);

  return { route, navigate };
}
