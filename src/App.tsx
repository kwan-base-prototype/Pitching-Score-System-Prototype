/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { 
  Trophy, 
  Users, 
  Gavel, 
  Settings, 
  Settings2,
  Mic2,
  ClipboardList, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  ChevronRight,
  ChevronLeft,
  XCircle,
  HelpCircle,
  Save,
  Download,
  Database,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Check,
  Network,
  Table,
  GitCompare,
  Terminal,
  Edit2,
  Maximize2,
  X,
  Gamepad2,
  Crown,
  BarChart3,
  Users2,
  CheckSquare,
  Play,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Sun,
  Moon,
  Star,
  List,
  Home,
  ArrowLeft,
  Music,
  Pause,
  Loader2,
  Upload,
  Link as LinkIcon,
  Mail,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Criterion, 
  Team, 
  Judge, 
  Mentor,
  Phase,
  ScoreEntry, 
  JudgeDecision, 
  AppState,
  HackathonData,
  SubCriterion,
  AwardSlide
} from './types';

import {
  handleDataError,
  describeError,
  isPermissionDenied,
  OperationType,
  testConnection,
  onAuthChange,
  rememberCurrentUserId,
  signIn,
  signUp,
  signOutUser,
  upsertProfile,
  subscribeHackathons,
  subscribeScores,
  subscribeDecisions,
  saveHackathon,
  patchHackathon,
  deleteHackathon as deleteHackathonRow,
  saveScore,
  saveDecision,
  deleteScoreRows,
  uploadAsset,
  isSupabaseConfigured,
  MISSING_CONFIG_MESSAGE,
  type AppUser,
} from './supabase';
// Bundled so the URL carries the right base path and needs no Storage upload.
import defaultBackgroundMusic from './assets/default-background-music.mp3';
import {
  useRoute,
  buildPath,
  hackathonRoute,
  sharedScoringUrl,
  publicPresentationUrl,
  HOME_ROUTE,
  LAUNCHER_ROUTE,
  Route,
  Tool
} from './router';
import ToolLauncher from './ToolLauncher';
import { BrandLogo } from './BrandMark';
const ReactPlayerAny = ReactPlayer as any;

/** The platform owner, who can administer every hackathon regardless of who created it. */
const ADMIN_EMAIL = 'kwanthananon.ar@baseplayhouse.co';

// Landing Page Component
function LandingPage({ onLogin, onSignup }: { onLogin: (e: string, p: string) => Promise<void>, onSignup: (e: string, p: string) => Promise<void> }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // BASE Playhouse CI from the official brand kit: Deep Pro Black, Uplifting Red,
    // Poppins/IBM Plex Sans Thai, pill controls. Deliberately unlike Hackathon Hub's light + rose
    // product styling — this is the company gateway, not the tool.
    <div className="min-h-screen bg-brand-ink font-brand flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[50%] h-[50%] bg-brand-red-900/25 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[26rem] relative z-10 space-y-10"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <BrandLogo variant="white" className="h-9 w-auto" />
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
              Uplifting<br />
              <span className="text-brand">human ability</span>
            </h1>
            <p className="text-white/40 text-sm font-medium">
              Sign in to reach the internal tools.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@baseplayhouse.co"
                className="w-full bg-white/[0.06] border border-white/10 rounded-full py-4 pl-13 pr-5 text-sm font-medium text-white placeholder:text-white/25 focus:border-brand focus:bg-white/[0.09] outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={17} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.06] border border-white/10 rounded-full py-4 pl-13 pr-5 text-sm font-medium text-white placeholder:text-white/25 focus:border-brand focus:bg-white/[0.09] outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2.5 p-4 bg-brand/10 border border-brand/30 rounded-lg text-brand text-xs font-semibold"
            >
              <XCircle size={16} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white rounded-full py-4 font-bold text-sm tracking-wide uppercase shadow-xl shadow-brand/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:hover:brightness-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Sign in' : 'Create account'}
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs font-medium text-white/40 hover:text-white transition-colors"
          >
            {isLogin ? (
              <>Need an account? <span className="text-brand font-bold">Create one</span></>
            ) : (
              <>Already have an account? <span className="text-brand font-bold">Sign in</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, errorInfo: string | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorInfo: error.message };
  }

  render() {
    if (this.state.hasError) {
      let displayMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.errorInfo || "");
        if (parsed.error && parsed.error.includes("insufficient permissions")) {
          displayMessage = "You don't have permission to perform this action. Please make sure you are logged in as an admin.";
        }
      } catch (e) {
        displayMessage = this.state.errorInfo || displayMessage;
      }

      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-ink/10">
            <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-ink mb-2">Application Error</h1>
            <p className="text-ink/60 mb-6">{displayMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const INITIAL_HACKATHON_DATA: HackathonData = {
  id: 'default-hackathon',
  hackathonName: 'BASE Playhouse Internal Hackathon',
  hackathonSubtitle: 'Internal Hackathon',
  hackathonLogo: '',
  hackathonColor: '#E11D48', // Default accent color
  phases: [
    {
      id: 'hack',
      name: 'Hackathon',
      weight: 40,
      type: 'mentor',
      criteria: [
        { id: 'h1', name: 'Progress', description: 'ความคืบหน้าของโปรเจกต์ในช่วง Hackathon', maxScore: 10, weight: 40 },
        { id: 'h2', name: 'Technical Complexity', description: 'ความยากและความซับซ้อนทางเทคนิค', maxScore: 10, weight: 40 },
        { id: 'h3', name: 'Teamwork', description: 'การทำงานร่วมกันภายในทีม', maxScore: 10, weight: 20 },
      ]
    },
    {
      id: 'mentoring',
      name: 'Mentoring',
      weight: 20,
      type: 'mentor',
      criteria: [
        { id: 'm1', name: 'Coachability', description: 'ความสามารถในการรับฟังและปรับปรุง', maxScore: 10, weight: 50 },
        { id: 'm2', name: 'Execution', description: 'ความสามารถในการลงมือทำ', maxScore: 10, weight: 50 },
      ]
    },
    {
      id: 'pitching',
      name: 'Pitching',
      weight: 40,
      type: 'judge',
      criteria: [
        { id: 'p1', name: 'Innovation', description: 'ความแปลกใหม่และความคิดสร้างสรรค์', maxScore: 10, weight: 30 },
        { id: 'p2', name: 'Market Potential', description: 'โอกาสในการเติบโตในตลาด', maxScore: 10, weight: 30 },
        { id: 'p3', name: 'Presentation', description: 'ทักษะการนำเสนอและการเล่าเรื่อง', maxScore: 10, weight: 20 },
        { id: 'p4', name: 'Q&A', description: 'การตอบคำถามของคณะกรรมการ', maxScore: 10, weight: 20 },
      ]
    }
  ],
  teams: [
    { id: 't1', name: 'Alpha Innovators', productName: 'EcoFlow', ideaDetail: 'Smart water management system', tagline: 'Saving every drop', hackScore: 0, isSortedUp: false },
    { id: 't2', name: 'Beta Builders', productName: 'SafeGuard', ideaDetail: 'AI-powered home security', tagline: 'Your safety, our priority', hackScore: 0, isSortedUp: false },
    { id: 't3', name: 'Gamma Gamers', productName: 'QuestMaster', ideaDetail: 'Educational RPG for kids', tagline: 'Learn while you play', hackScore: 0, isSortedUp: false },
    { id: 't4', name: 'Delta Designers', productName: 'StyleSync', ideaDetail: 'Virtual fashion assistant', tagline: 'Dress your best', hackScore: 0, isSortedUp: false },
    { id: 't5', name: 'Epsilon Engineers', productName: 'SolarGrid', ideaDetail: 'Community solar sharing platform', tagline: 'Power to the people', hackScore: 0, isSortedUp: false },
    { id: 't6', name: 'Zeta Zephyrs', productName: 'WindWatch', ideaDetail: 'Personal wind energy tracker', tagline: 'Catch the breeze', hackScore: 0, isSortedUp: false },
    { id: 't7', name: 'Eta Explorers', productName: 'GeoQuest', ideaDetail: 'AR-based historical exploration', tagline: 'Discover the past', hackScore: 0, isSortedUp: false },
    { id: 't8', name: 'Theta Thinkers', productName: 'MindMap', ideaDetail: 'Collaborative brainstorming tool', tagline: 'Connect your thoughts', hackScore: 0, isSortedUp: false },
    { id: 't9', name: 'Iota Inventors', productName: 'NanoTech', ideaDetail: 'Micro-filtration for clean water', tagline: 'Small tech, big impact', hackScore: 0, isSortedUp: false },
    { id: 't10', name: 'Kappa Knights', productName: 'ShieldUp', ideaDetail: 'Cybersecurity for small businesses', tagline: 'Defend your data', hackScore: 0, isSortedUp: false },
    { id: 't11', name: 'Lambda Leaders', productName: 'TeamFlow', ideaDetail: 'Agile project management for remote teams', tagline: 'Work together, anywhere', hackScore: 0, isSortedUp: false },
    { id: 't12', name: 'Mu Makers', productName: 'Print3D', ideaDetail: 'On-demand 3D printing marketplace', tagline: 'Create anything', hackScore: 0, isSortedUp: false },
    { id: 't13', name: 'Nu Nexus', productName: 'LinkUp', ideaDetail: 'Professional networking for creatives', tagline: 'Connect and create', hackScore: 0, isSortedUp: false },
    { id: 't14', name: 'Xi Xperts', productName: 'DataDive', ideaDetail: 'Advanced analytics for retail', tagline: 'Understand your customers', hackScore: 0, isSortedUp: false },
    { id: 't15', name: 'Omicron Ops', productName: 'LogiTrack', ideaDetail: 'Real-time logistics optimization', tagline: 'Move faster', hackScore: 0, isSortedUp: false },
    { id: 't16', name: 'Pi Pioneers', productName: 'SpaceSeed', ideaDetail: 'Hydroponics for space travel', tagline: 'Grow in the stars', hackScore: 0, isSortedUp: false },
    { id: 't17', name: 'Rho Runners', productName: 'FitTrack', ideaDetail: 'AI-based personal trainer', tagline: 'Reach your goals', hackScore: 0, isSortedUp: false },
    { id: 't18', name: 'Sigma Solvers', productName: 'FixIt', ideaDetail: 'Community-based repair network', tagline: 'Repair, don\'t replace', hackScore: 0, isSortedUp: false },
    { id: 't19', name: 'Tau Tech', productName: 'SmartHome', ideaDetail: 'Integrated home automation hub', tagline: 'Live smarter', hackScore: 0, isSortedUp: false },
    { id: 't20', name: 'Upsilon Unit', productName: 'HealthHub', ideaDetail: 'Personalized wellness platform', tagline: 'Your health, simplified', hackScore: 0, isSortedUp: false },
  ],
  judges: [
    { id: 'j1', name: 'Judge 1 (Tech)' },
    { id: 'j2', name: 'Judge 2 (Business)' },
    { id: 'j3', name: 'Judge 3 (UX)' },
    { id: 'j4', name: 'Judge 4 (Marketing)' },
    { id: 'j5', name: 'Judge 5 (Finance)' },
    { id: 'j6', name: 'Judge 6 (Strategy)' },
    { id: 'j7', name: 'Judge 7 (Product)' },
    { id: 'j8', name: 'Judge 8 (Innovation)' },
  ],
  mentors: [
    { id: 'm1', name: 'Mentor 1' },
    { id: 'm2', name: 'Mentor 2' },
    { id: 'm3', name: 'Mentor 3' },
  ],
  scores: [],
  decisions: [],
  hiddenCriteriaIds: [],
  awardSlides: [],
  // Deliberately empty: musicAudioUrl falls back to the bundled track at runtime. Storing the
  // asset URL here would persist a build-specific path (/src/assets/… in dev, /assets/…-HASH.mp3
  // in prod) into the database, which then 404s in the other environment.
  musicUrl: '',
};

const EMPTY_HACKATHON_DATA: HackathonData = {
  id: '',
  hackathonName: '',
  hackathonSubtitle: '',
  hackathonLogo: '',
  hackathonColor: '#E11D48',
  phases: [],
  teams: [],
  judges: [],
  mentors: [],
  scores: [],
  decisions: [],
  hiddenCriteriaIds: [],
  awardSlides: [],
  // Deliberately empty: musicAudioUrl falls back to the bundled track at runtime. Storing the
  // asset URL here would persist a build-specific path (/src/assets/… in dev, /assets/…-HASH.mp3
  // in prod) into the database, which then 404s in the other environment.
  musicUrl: '',
};

const INITIAL_APP_STATE: AppState = {
  hackathons: [INITIAL_HACKATHON_DATA],
  selectedHackathonId: null,
};

/**
 * Owns its own per-second tick. Kept separate from App on purpose: ticking that state in
 * App re-rendered the entire component tree every second, which cost a ~100ms long task
 * per tick and made the presentation visibly stutter.
 */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // hourCycle h23 rather than hour12:false — the latter lets some engines render midnight
  // as 24:00:00 instead of 00:00:00.
  return (
    <>
      {now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      })}
    </>
  );
}

function TeamOrderInput({ id, initialValue, onMove }: { id: string, initialValue: number, onMove: (id: string, newIdx: number) => void }) {
  const [val, setVal] = useState<string>(String(initialValue));

  useEffect(() => {
    setVal(String(initialValue));
  }, [initialValue]);

  const handleCommit = () => {
    const num = parseInt(val);
    if (!isNaN(num) && num !== initialValue) {
      onMove(id, num - 1);
    } else {
      setVal(String(initialValue));
    }
  };

  return (
    <input 
      type="number"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
      className="w-12 bg-bg/50 border border-ink/5 rounded px-2 py-1 text-xs font-mono font-bold text-center focus:bg-white focus:border-ink/20 outline-none"
    />
  );
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hackathonsLoaded, setHackathonsLoaded] = useState(false);
  // Surfaces failed writes. Scores update optimistically, so without this a rejected save looks
  // identical to a successful one and a whole sheet can be filled in and lost.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPresentationSettings, setShowPresentationSettings] = useState(false);

  // The URL is the source of truth for which hackathon, tab and overlay are showing.
  const { route, navigate } = useRoute();
  const activeTab = route.tab;
  const isExternalView = route.external;
  const isPublicView = route.publicView;
  const showHackathonPresentation = route.overlay === 'present';
  const showAwardPresentation = route.overlay === 'awards';

  const setActiveTab = (tab: string) => {
    if (!route.hackathonId) return;
    navigate({ ...route, tab, overlay: null });
  };

  const setOverlay = (overlay: Route['overlay']) => {
    if (!route.hackathonId) return;
    navigate({ ...route, overlay });
  };

  const setShowHackathonPresentation = (show: boolean) => setOverlay(show ? 'present' : null);
  const setShowAwardPresentation = (show: boolean) => setOverlay(show ? 'awards' : null);

  // Both overlays cover the viewport completely, so the sidebar and tab content behind them
  // are invisible but were still rendering and animating — doubling every table and motion
  // row on the page. Skip them while an overlay is up.
  const hasFullScreenOverlay = route.overlay !== null;
  const showAppShell = !isPublicView && !hasFullScreenOverlay;

  const [rawAppState, setAppState] = useState<AppState>(INITIAL_APP_STATE);

  // selectedHackathonId is derived from the route rather than stored, so a deep link,
  // a refresh and the browser's back button all agree on which hackathon is open.
  const appState = useMemo<AppState>(
    () => ({ ...rawAppState, selectedHackathonId: route.hackathonId }),
    [rawAppState, route.hackathonId]
  );

  const state = useMemo(() => {
    return appState.hackathons.find(h => h.id === appState.selectedHackathonId) || EMPTY_HACKATHON_DATA;
  }, [appState.hackathons, appState.selectedHackathonId]);

  /** Logs a failed database operation and tells the user, instead of failing silently. */
  const reportSaveFailure = (context: string, err: unknown) => {
    handleDataError(err, OperationType.WRITE, null);
    setSaveError(
      !isSupabaseConfigured
        ? `${context}: ${MISSING_CONFIG_MESSAGE}`
        : isPermissionDenied(err)
          ? `${context}: the database refused it. Row level security allows only the hackathon's ` +
            'owner to change its settings — check you are signed in as the right account.'
          : `${context}: ${describeError(err)}`,
    );
  };

  /**
   * The id of the hackathon with an unsaved local edit, or null. Holding the id rather than a
   * boolean matters: a bare flag could not tell which hackathon the pending write belonged to, so
   * switching hackathons mid-debounce saved the newly opened one and dropped the edit.
   */
  const pendingSaveRef = useRef<string | null>(null);

  /**
   * Applies a local edit. The database write is handled by the effect below rather than here:
   * this used to compute the next value from `appState` captured in the render closure, so two
   * edits in the same tick would both build on the older value and the second would clobber the
   * first. The updater form always sees the freshest state.
   */
  const setState = (updates: HackathonData | ((prev: HackathonData) => HackathonData)) => {
    pendingSaveRef.current = route.hackathonId;
    setAppState(prev => {
      const currentHackathon = prev.hackathons.find(h => h.id === route.hackathonId);
      if (!currentHackathon) return prev;
      const nextHackathon = typeof updates === 'function' ? updates(currentHackathon) : updates;
      return {
        ...prev,
        hackathons: prev.hackathons.map(h => (h.id === nextHackathon.id ? nextHackathon : h)),
      };
    });
  };

  const isAdmin = useMemo(() => {
    const currentHackathon = appState.hackathons.find(h => h.id === appState.selectedHackathonId);
    return user?.email === ADMIN_EMAIL || (user && currentHackathon?.ownerId === user.uid);
  }, [user, appState.hackathons, appState.selectedHackathonId]);

  /** Writes one hackathon's settings. Scores and decisions live in their own tables. */
  const writeHackathonMetadata = (hackathon: HackathonData) =>
    saveHackathon(hackathon).catch(err =>
      reportSaveFailure('Could not save the hackathon settings', err));

  /**
   * Persists local edits, debounced. Every keystroke used to write the whole hackathon document;
   * this collapses a burst of edits into one write once typing stops. Only runs when setState
   * flagged a local change, so an incoming snapshot is never echoed straight back to the server.
   */
  useEffect(() => {
    const pendingId = pendingSaveRef.current;
    if (!pendingId || !isAdmin) return;

    // Navigated to a different hackathon while a save was still pending — flush the one that was
    // actually edited now, rather than letting the timer be cleared and the edit disappear.
    if (pendingId !== state.id) {
      const edited = rawAppState.hackathons.find(h => h.id === pendingId);
      pendingSaveRef.current = null;
      if (edited) void writeHackathonMetadata(edited);
      return;
    }

    const timer = setTimeout(() => {
      pendingSaveRef.current = null;
      void writeHackathonMetadata(state);
    }, 600);

    return () => clearTimeout(timer);
  }, [state, isAdmin, rawAppState.hackathons]);

  /**
   * Flushes a pending save when the page is being hidden or closed. Without this, debouncing turned
   * "edit then immediately close the tab" into silent data loss, which the previous
   * write-on-every-keystroke behaviour did not have.
   */
  useEffect(() => {
    if (!isAdmin) return;

    const flush = () => {
      const pendingId = pendingSaveRef.current;
      if (!pendingId) return;
      const edited = rawAppState.hackathons.find(h => h.id === pendingId);
      pendingSaveRef.current = null;
      if (edited) void writeHackathonMetadata(edited);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isAdmin, rawAppState.hackathons]);

  // Keep the address bar canonical: rewrites legacy ?role=…&id=… scoring links to their
  // /s/… path, and collapses unroutable URLs onto what is actually being rendered.
  // Safe to run on every route change — replaceState alone never re-triggers parsing.
  useEffect(() => {
    const canonical = buildPath(route);
    if (canonical !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', canonical);
    }
  }, [route]);

  // A deep link to a hackathon that has been deleted (or never existed) would otherwise
  // render an empty shell forever, so send it back to the picker once the list is in.
  useEffect(() => {
    if (!hackathonsLoaded || !route.hackathonId) return;
    if (!rawAppState.hackathons.some(h => h.id === route.hackathonId)) {
      navigate(HOME_ROUTE, { replace: true });
    }
  }, [hackathonsLoaded, route.hackathonId, rawAppState.hackathons]);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedCompareTeamIds, setSelectedCompareTeamIds] = useState<string[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);
  // Hides rows where every selected team scored within COMPARISON_TIED_PCT of each other.
  const [compareOnlyDifferences, setCompareOnlyDifferences] = useState(false);
  const [showAwardConfig, setShowAwardConfig] = useState(false);
  const [awardPresentationStep, setAwardPresentationStep] = useState(0);
  const [awardSlides, setAwardSlides] = useState<{ teamId: string, awardName: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allScoresSort, setAllScoresSort] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'finalScore', direction: 'desc' });
  // Heat-map tinting on the Full Scoreboard. Worth switching off when reading exact figures or
  // printing, so it is a toggle rather than always-on.
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [activeTablePhaseId, setActiveTablePhaseId] = useState<string | null>(null);
  const [activeTableJudgeId, setActiveTableJudgeId] = useState<string | null>('all');
  const [activeHackathonCriterionIdx, setActiveHackathonCriterionIdx] = useState(0);
  const [isEditingHackathonInfo, setIsEditingHackathonInfo] = useState(false);
  const [presentationTheme, setPresentationTheme] = useState<'dark' | 'light'>('dark');
  const [isAutoCycling, setIsAutoCycling] = useState(false);

  // /h/:id/awards can be opened directly, without going through the config modal that
  // normally seeds the slides — fall back to the saved slide list in that case.
  useEffect(() => {
    if (showAwardPresentation && awardSlides.length === 0 && state.awardSlides?.length) {
      setAwardSlides(state.awardSlides);
      setAwardPresentationStep(0);
    }
  }, [showAwardPresentation, awardSlides.length, state.awardSlides]);


  // Music & Notification States
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  // 0–100 for the UI; the player takes a 0–1 fraction. Local only, like mute — a playback
  // preference of whoever is driving the screen, not something to sync to everyone.
  const [volume, setVolume] = useState(100);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [previousRankings, setPreviousRankings] = useState<string[]>([]);
  const [readyUrl, setReadyUrl] = useState<string>('');

  const musicAudioUrl = useMemo(() => {
    // No track configured — fall back to the bundled one so a presentation is never silent.
    if (!state.musicUrl) return defaultBackgroundMusic;

    // Handle Google Drive links
    if (state.musicUrl.includes('drive.google.com')) {
      const idMatch = state.musicUrl.match(/\/d\/([^\/]+)/) || state.musicUrl.match(/id=([^&]+)/);
      if (idMatch) {
        return `https://docs.google.com/uc?id=${idMatch[1]}&export=download`;
      }
    }
    return state.musicUrl;
  }, [state.musicUrl]);

  const isPlayerReady = !!musicAudioUrl && readyUrl === musicAudioUrl;

  // A deploy without the two Supabase env vars set otherwise looks like an empty database, so say
  // so up front rather than waiting for the first write to fail.
  useEffect(() => {
    if (!isSupabaseConfigured) setSaveError(MISSING_CONFIG_MESSAGE);
  }, []);

  // Auth listener. The first call tells us auth has settled, so it is safe to choose between the
  // sign-in screen and the app rather than flashing one then the other.
  useEffect(() => {
    const unsubscribe = onAuthChange(account => {
      setUser(account);
      rememberCurrentUserId(account?.uid);
      setIsAuthReady(true);
    });
    void testConnection();
    return unsubscribe;
  }, []);

  // Live hackathon list, newest edit first.
  useEffect(() => {
    if (!isAuthReady) return;

    const unsubscribe = subscribeHackathons(
      hackathons => {
        setAppState(prev => ({
          ...prev,
          hackathons: hackathons.length > 0 ? hackathons : prev.hackathons,
        }));
        // Only a non-empty read tells us which hackathons really exist. An empty one keeps the
        // seed list, so treating it as loaded would let the deep-link guard below bounce a
        // perfectly valid URL back to the picker.
        if (hackathons.length > 0) setHackathonsLoaded(true);

        // Bootstrap an empty database, but only for the platform owner.
        if (hackathons.length === 0 && user && user.email === ADMIN_EMAIL) {
          void saveHackathon({
            ...INITIAL_HACKATHON_DATA,
            id: generateId(),
            ownerId: user.uid,
          }).catch(err => reportSaveFailure('Could not create the starter hackathon', err));
        }
      },
      err => reportSaveFailure('Could not load hackathons', err),
    );

    return unsubscribe;
  }, [isAuthReady, user]);

  // Live scores and verdicts for the open hackathon. Kept in separate tables from the hackathon
  // itself because many people write them at once, each to their own row.
  useEffect(() => {
    const hackathonId = appState.selectedHackathonId;
    if (!hackathonId || !isAuthReady) return;

    const patch = (updates: Partial<HackathonData>) =>
      setAppState(prev => ({
        ...prev,
        hackathons: prev.hackathons.map(h => (h.id === hackathonId ? { ...h, ...updates } : h)),
      }));

    const unsubscribeScores = subscribeScores(
      hackathonId,
      scores => patch({ scores }),
      err => reportSaveFailure('Could not load scores', err),
    );
    const unsubscribeDecisions = subscribeDecisions(
      hackathonId,
      decisions => patch({ decisions }),
      err => reportSaveFailure('Could not load verdicts', err),
    );

    return () => {
      unsubscribeScores();
      unsubscribeDecisions();
    };
  }, [appState.selectedHackathonId, isAuthReady]);

  /**
   * Signing in lands on the BASE Lab home rather than on whatever URL was open, so the launcher
   * is always the entry point into the platform.
   *
   * Share links are the exception: /s/… and /p/… are handed to a specific person to open that
   * exact page, so bouncing them to the launcher would defeat the link. This only runs on a
   * fresh sign-in, not on a restored session, so deep links still survive a refresh.
   */
  const goToLabHome = () => {
    if (route.external || route.publicView) return;
    navigate(LAUNCHER_ROUTE, { replace: true });
  };

  /**
   * Recording the profile is best effort: it is a convenience copy of the account, so failing to
   * write it must not stop someone signing in.
   */
  const rememberProfile = (account: AppUser) =>
    upsertProfile(account, ADMIN_EMAIL).catch(err =>
      handleDataError(err, OperationType.WRITE, 'profiles'));

  const login = async (email: string, pass: string) => {
    const account = await signIn(email, pass);
    await rememberProfile(account);
    goToLabHome();
  };

  const signup = async (email: string, pass: string) => {
    const account = await signUp(email, pass);
    await rememberProfile(account);
    goToLabHome();
  };

  const logout = () => {
    void signOutUser().catch(err => reportSaveFailure('Could not sign out', err));
  };

  // Removed localStorage persistence

  const [collapsedCriteria, setCollapsedCriteria] = useState<Record<string, boolean>>({});
  const [collapsedPhaseSections, setCollapsedPhaseSections] = useState<Record<string, boolean>>({});
  const [activeScoringPhaseId, setActiveScoringPhaseId] = useState<string | null>(null);
  const [activeScoringJudgeId, setActiveScoringJudgeId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [demoStatus, setDemoStatus] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      // The upload path is unique per upload so replacing a logo shows immediately — reusing the
      // filename left the previous image in the CDN cache.
      const downloadURL = await uploadAsset('logos', `${state.id}/${Date.now()}-${file.name}`, file);
      await patchHackathon(state.id, { logo_url: downloadURL });
      setAppState(prev => ({
        ...prev,
        hackathons: prev.hackathons.map(h => h.id === state.id ? { ...h, hackathonLogo: downloadURL } : h)
      }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Initialize active phase when team is selected
  useEffect(() => {
    if (selectedTeamId && (state.phases?.length || 0) > 0 && !activeScoringPhaseId) {
      setActiveScoringPhaseId(state.phases[0].id);
    }
  }, [selectedTeamId, state.phases, activeScoringPhaseId]);

  // Initialize active judge when phase changes
  useEffect(() => {
    if (activeScoringPhaseId) {
      const phase = state.phases?.find(p => p.id === activeScoringPhaseId);
      if (phase?.type === 'judge' && (state.judges?.length || 0) > 0) {
        if (!activeScoringJudgeId || !state.judges.find(j => j.id === activeScoringJudgeId)) {
          setActiveScoringJudgeId(state.judges[0].id);
        }
      } else if (phase?.type === 'mentor' && (state.mentors?.length || 0) > 0) {
        if (!activeScoringJudgeId || !state.mentors.find(m => m.id === activeScoringJudgeId)) {
          setActiveScoringJudgeId(state.mentors[0].id);
        }
      } else {
        setActiveScoringJudgeId(null);
      }
    }
  }, [activeScoringPhaseId, state.phases, state.judges, state.mentors, activeScoringJudgeId]);

  // Ensure activeScoringPhaseId is valid for the current tab
  useEffect(() => {
    if (activeTab === 'mentor-scoring') {
      const currentPhase = state.phases.find(p => p.id === activeScoringPhaseId);
      if (!currentPhase || currentPhase.type !== 'mentor') {
        const firstRelevantPhase = state.phases.find(p => p.type === 'mentor');
        if (firstRelevantPhase) {
          setActiveScoringPhaseId(firstRelevantPhase.id);
        }
      }
    }
  }, [activeTab, state.phases, activeScoringPhaseId]);

  const toggleCriterionCollapse = (id: string) => {
    setCollapsedCriteria(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePhaseSectionCollapse = (id: string) => {
    setCollapsedPhaseSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Removed localStorage persistence

  /**
   * A criterion can only be scored meaningfully if it has a positive maximum to normalise
   * against — teamScores skips `maxScore` of 0 or null entirely. Returns null for those so the
   * inputs can refuse a value instead of banking one the ranking will ignore.
   */
  const scorableMax = (max: number | null | undefined) => (max && max > 0 ? max : null);

  /**
   * Team search, tolerant of missing fields. Documents written before `productName` existed come
   * back without it, and calling .toLowerCase() on undefined took the whole page down.
   */
  const matchesTeamSearch = (team: { name?: string; productName?: string }) => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return true;
    return `${team.name ?? ''} ${team.productName ?? ''}`.toLowerCase().includes(needle);
  };

  /** Clamps to 0 when there is no usable maximum, rather than leaving the field unbounded. */
  const clampScore = (value: number, max: number | null) =>
    max === null ? 0 : Math.max(0, Math.min(value, max));

  /** Criteria that are configured such that the scoring code silently ignores them. */
  const misconfiguredCriteria = useMemo(() => {
    const issues: { phase: string; criterion: string; problem: string }[] = [];
    (state.phases || []).forEach(phase => {
      (phase.criteria || []).forEach(criterion => {
        if (!scorableMax(criterion.maxScore)) {
          issues.push({ phase: phase.name, criterion: criterion.name, problem: 'no Max Score — cannot be scored or counted' });
        } else if (!criterion.weight) {
          issues.push({ phase: phase.name, criterion: criterion.name, problem: 'no Weight — scores are recorded but excluded from the phase total' });
        }
      });
    });
    return issues;
  }, [state.phases]);

  /** Phases whose criterion weights do not add up to 100%, which skews the phase score. */
  const phaseWeightIssues = useMemo(() => {
    return (state.phases || [])
      .map(phase => {
        const total = (phase.criteria || []).reduce((sum, c) => sum + (c.weight || 0), 0);
        return { name: phase.name, total, criteriaCount: phase.criteria?.length || 0 };
      })
      .filter(p => p.criteriaCount > 0 && Math.round(p.total) !== 100);
  }, [state.phases]);

  const totalPhaseWeight = useMemo(
    () => (state.phases || []).reduce((sum, p) => sum + (p.weight || 0), 0),
    [state.phases],
  );

  // Calculations
  const getEffectiveScore = (entry: ScoreEntry | undefined, criterion: Criterion | undefined) => {
    if (!entry || !criterion) return null;
    if (criterion.subCriteria && criterion.subCriteria.length > 0) {
      let total = 0;
      let hasInteraction = false;
      
      criterion.subCriteria.forEach(s => {
        if (s.type === 'numeric') {
          const val = entry.subCriteriaValues?.[s.id];
          if (val !== undefined && val !== null) {
            total += val;
            hasInteraction = true;
          }
        } else {
          // Checkbox type
          if ((s.score || 0) > 1) {
            // Multi-checkbox: score is the count of checked boxes stored in subCriteriaValues
            const val = entry.subCriteriaValues?.[s.id];
            if (val !== undefined && val !== null) {
              total += val;
              hasInteraction = true;
            }
          } else {
            // Single checkbox
            if (entry.selectedSubCriteriaIds?.includes(s.id)) {
              total += (s.score || 0);
            }
            if (entry.selectedSubCriteriaIds) hasInteraction = true;
          }
        }
      });
      
      if (!hasInteraction && (!entry.subCriteriaValues || Object.keys(entry.subCriteriaValues).length === 0)) return null;
      return total;
    }
    return entry.score;
  };

  const teamScores = useMemo(() => {
    return (state.teams || []).map((team, index) => {
      const currentTeamScores = (state.scores || []).filter(s => s.teamId === team.id);
      
      let finalScore = 0;
      const phaseScores: Record<string, number> = {};

      (state.phases || []).forEach(phase => {
        const phaseEntries = currentTeamScores.filter(s => s.phaseId === phase.id);
        let normalizedPhaseScore = 0;

        if ((phase.criteria?.length || 0) > 0) {
          if (phase.type === 'judge') {
            const judgesInPhase = Array.from(new Set(phaseEntries.map(e => e.judgeId)));
            let totalWeightedJudgeScore = 0;
            let totalJudgeWeightUsed = 0;

            judgesInPhase.forEach(judgeId => {
              const judge = (state.judges || []).find(j => j.id === judgeId);
              // ?? rather than ||: a judge deliberately set to weight 0 must not fall back to 1.
              const judgeWeight = judge?.weight ?? 1;

              const judgeScores = phaseEntries.filter(s => s.judgeId === judgeId);
              if (judgeScores.length > 0) {
                let judgeWeightedScore = 0;
                let totalWeightUsed = 0;
                phase.criteria.forEach(c => {
                  const entry = judgeScores.find(e => e.criterionId === c.id);
                  const score = getEffectiveScore(entry, c);
                  // An unscored criterion is left out of both sides of the ratio, so its weight is
                  // redistributed across whatever was scored instead of counting as a zero.
                  if (score !== null && c.maxScore && c.weight) {
                    judgeWeightedScore += (score / c.maxScore) * 100 * (c.weight / 100);
                    totalWeightUsed += c.weight;
                  }
                });
                if (totalWeightUsed > 0) {
                  const normalizedJudgeScore = (judgeWeightedScore / (totalWeightUsed / 100));
                  totalWeightedJudgeScore += normalizedJudgeScore * judgeWeight;
                  totalJudgeWeightUsed += judgeWeight;
                }
              }
            });
            normalizedPhaseScore = totalJudgeWeightUsed > 0 ? (totalWeightedJudgeScore / totalJudgeWeightUsed) : 0;
          } else if (phase.type === 'mentor') {
            // Mentor phase: Average of scores from assigned mentors
            const mentorsInPhase = Array.from(new Set(phaseEntries.map(e => e.judgeId)));
            let totalWeightedMentorScore = 0;
            let totalMentorCount = 0;

            mentorsInPhase.forEach(mentorId => {
              const mentor = (state.mentors || []).find(m => m.id === mentorId);
              const mentorScores = phaseEntries.filter(s => s.judgeId === mentorId);
              if (mentorScores.length > 0) {
                let mentorWeightedScore = 0;
                let totalWeightUsed = 0;
                phase.criteria.forEach(c => {
                  // Check if mentor is assigned to this criterion
                  const isAssigned = !mentor?.assignedCriteriaIds || 
                                    mentor.assignedCriteriaIds.length === 0 || 
                                    mentor.assignedCriteriaIds.includes(c.id);
                  
                  if (isAssigned) {
                    const entry = mentorScores.find(e => e.criterionId === c.id);
                    const score = getEffectiveScore(entry, c);
                    // Same redistribution as the judge branch: unscored criteria are excluded
                    // from the ratio rather than counted as zero.
                    if (score !== null && c.maxScore && c.weight) {
                      mentorWeightedScore += (score / c.maxScore) * 100 * (c.weight / 100);
                      totalWeightUsed += c.weight;
                    }
                  }
                });
                if (totalWeightUsed > 0) {
                  const normalizedMentorScore = (mentorWeightedScore / (totalWeightUsed / 100));
                  totalWeightedMentorScore += normalizedMentorScore;
                  totalMentorCount += 1;
                }
              }
            });
            normalizedPhaseScore = totalMentorCount > 0 ? (totalWeightedMentorScore / totalMentorCount) : 0;
          }
        }
        
        phaseScores[phase.id] = normalizedPhaseScore;
        if (phase.weight) {
          finalScore += (normalizedPhaseScore * (phase.weight / 100));
        }
      });

      const scoredByJudgeIds = (state.judges || [])
        .filter(judge => {
          return currentTeamScores.some(s => {
            const phase = (state.phases || []).find(p => p.id === s.phaseId);
            if (!phase || phase.type !== 'judge') return false;
            if (s.judgeId !== judge.id) return false;
            const criterion = phase.criteria.find(c => c.id === s.criterionId);
            if (!criterion) return false;
            return getEffectiveScore(s, criterion) !== null;
          });
        })
        .map(j => j.id);

      const scoredByMentorIds = (state.mentors || [])
        .filter(mentor => {
          return currentTeamScores.some(s => {
            const phase = (state.phases || []).find(p => p.id === s.phaseId);
            if (!phase || phase.type !== 'mentor') return false;
            if (s.judgeId !== mentor.id) return false;
            const criterion = phase.criteria.find(c => c.id === s.criterionId);
            if (!criterion) return false;
            return getEffectiveScore(s, criterion) !== null;
          });
        })
        .map(m => m.id);

      const judgeDecisions: Record<string, string | null> = {};
      const mentorDecisions: Record<string, string | null> = {};
      // The last *judge* phase, to mirror how mentorDecisions picks the last mentor phase. Using
      // the last phase overall returned nothing whenever the event ended on a mentor phase.
      const judgePhases = (state.phases || []).filter(p => p.type === 'judge');
      const lastPhaseId = judgePhases.length > 0 ? judgePhases[judgePhases.length - 1].id : null;
      
      (state.judges || []).forEach(j => {
        judgeDecisions[j.id] = (state.decisions || []).find(d => d.teamId === team.id && d.judgeId === j.id && d.phaseId === lastPhaseId)?.decision || null;
      });

      const mentorPhases = (state.phases || []).filter(p => p.type === 'mentor');
      if (mentorPhases.length > 0) {
        const lastMentorPhaseId = mentorPhases[mentorPhases.length - 1].id;
        (state.mentors || []).forEach(m => {
          mentorDecisions[m.id] = (state.decisions || []).find(d => d.teamId === team.id && d.judgeId === m.id && d.phaseId === lastMentorPhaseId)?.decision || null;
        });
      }

      const criteriaScores: Record<string, number | null> = {};
      (state.phases || []).forEach(phase => {
        const phaseEntries = currentTeamScores.filter(s => s.phaseId === phase.id);
        (phase.criteria || []).forEach(c => {
          if (phase.type === 'judge') {
            const judgeScores = phaseEntries.filter(s => s.criterionId === c.id);
            let weightedSum = 0;
            let weightTotal = 0;
            
            judgeScores.forEach(s => {
              const score = getEffectiveScore(s, c);
              if (score !== null) {
                const judge = (state.judges || []).find(j => j.id === s.judgeId);
                const weight = judge?.weight ?? 1;
                weightedSum += score * weight;
                weightTotal += weight;
              }
            });
            
            criteriaScores[c.id] = weightTotal > 0 ? weightedSum / weightTotal : null;
          } else if (phase.type === 'mentor') {
            const mentorScores = phaseEntries.filter(s => s.criterionId === c.id);
            let sum = 0;
            let count = 0;
            
            mentorScores.forEach(s => {
              const score = getEffectiveScore(s, c);
              if (score !== null) {
                sum += score;
                count += 1;
              }
            });
            
            criteriaScores[c.id] = count > 0 ? sum / count : null;
          }
        });
      });

      return {
        ...team,
        phaseScores,
        finalScore,
        scoredByJudgeIds,
        scoredByMentorIds,
        judgeDecisions,
        mentorDecisions,
        criteriaScores,
        originalIndex: index
      };
    });
  }, [state]);

  const sortedTeams = useMemo(() => {
    return [...teamScores].sort((a, b) => {
      if (a.isSortedUp && !b.isSortedUp) return -1;
      if (!a.isSortedUp && b.isSortedUp) return 1;
      return b.finalScore - a.finalScore;
    });
  }, [teamScores]);

  /**
   * Reshapes the selected teams into one row per metric so the comparison view can put the same
   * measure side by side. Each row carries its own spread (best minus worst) and who holds them,
   * which is what makes "where do these teams actually differ" answerable at a glance.
   *
   * `spreadPct` normalises the gap against the metric's own scale, so a 2-point gap on a /10
   * criterion and a 20-point gap on a /100 phase total are comparable.
   */
  const COMPARISON_TIED_PCT = 3;

  const comparison = useMemo(() => {
    const teams = selectedCompareTeamIds
      .map(id => teamScores.find(t => t.id === id))
      .filter((t): t is typeof teamScores[number] => !!t);

    if (teams.length < 2) return null;

    type Row = {
      key: string;
      label: string;
      kind: 'final' | 'phase' | 'criterion';
      scaleMax: number;
      suffix: string;
      note?: string;
      values: (number | null)[];
      best: number | null;
      worst: number | null;
      spread: number;
      spreadPct: number;
      tied: boolean;
    };

    const buildRow = (
      key: string,
      label: string,
      kind: Row['kind'],
      scaleMax: number,
      suffix: string,
      values: (number | null)[],
      note?: string,
    ): Row => {
      const present = values.filter((v): v is number => v !== null);
      const best = present.length ? Math.max(...present) : null;
      const worst = present.length ? Math.min(...present) : null;
      const spread = best !== null && worst !== null ? best - worst : 0;
      const spreadPct = scaleMax > 0 ? (spread / scaleMax) * 100 : 0;
      return {
        key, label, kind, scaleMax, suffix, note, values, best, worst, spread, spreadPct,
        tied: spreadPct < COMPARISON_TIED_PCT,
      };
    };

    const rows: Row[] = [
      buildRow('final', 'Final Score', 'final', 100, '%', teams.map(t => t.finalScore ?? 0)),
    ];

    (state.phases || []).forEach(phase => {
      rows.push(buildRow(
        `phase-${phase.id}`, phase.name, 'phase', 100, '%',
        teams.map(t => t.phaseScores?.[phase.id] ?? 0),
        phase.weight != null ? `${phase.weight}% of final` : undefined,
      ));
      (phase.criteria || []).forEach(criterion => {
        rows.push(buildRow(
          `criterion-${criterion.id}`, criterion.name, 'criterion', criterion.maxScore || 10, '',
          teams.map(t => (t.criteriaScores?.[criterion.id] ?? null)),
          // A criterion with no max is excluded from the phase total by the scoring code
          // (`if (c.maxScore && c.weight)`), so say that rather than printing "max 0".
          criterion.maxScore ? `max ${criterion.maxScore}` : 'no max set — not counted',
        ));
      });
    });

    // The headline: which criteria separate these teams, and which are effectively level.
    const criterionRows = rows.filter(r => r.kind === 'criterion');
    const biggestGaps = [...criterionRows].sort((a, b) => b.spreadPct - a.spreadPct).slice(0, 3);

    return {
      teams,
      rows,
      biggestGaps: biggestGaps.filter(r => !r.tied),
      tiedCount: criterionRows.filter(r => r.tied).length,
      criterionCount: criterionRows.length,
    };
  }, [selectedCompareTeamIds, teamScores, state.phases]);

  /**
   * The Full Scoreboard rows, plus the value range of every score column. Ranges are taken from
   * the rows actually on screen (so they follow the search filter) and are what the heat-map
   * colouring below scales against — a cell is only "green" relative to its own column.
   */
  const allScoresView = useMemo(() => {
    const rows = [...teamScores]
      .filter(t =>
        matchesTeamSearch(t))
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (allScoresSort.key === 'name') {
          valA = a.originalIndex;
          valB = b.originalIndex;
        } else if (allScoresSort.key === 'finalScore') {
          valA = a.finalScore;
          valB = b.finalScore;
        } else if (allScoresSort.key.startsWith('phase-')) {
          const phaseId = allScoresSort.key.replace('phase-', '');
          valA = a.phaseScores[phaseId] || 0;
          valB = b.phaseScores[phaseId] || 0;
        } else {
          valA = a.criteriaScores[allScoresSort.key] || 0;
          valB = b.criteriaScores[allScoresSort.key] || 0;
        }

        if (valA < valB) return allScoresSort.direction === 'desc' ? 1 : -1;
        if (valA > valB) return allScoresSort.direction === 'desc' ? -1 : 1;
        return 0;
      });

    const ranges = new Map<string, { min: number; max: number }>();
    const track = (key: string, value: number | null | undefined) => {
      if (value === null || value === undefined || Number.isNaN(value)) return;
      const current = ranges.get(key);
      if (!current) ranges.set(key, { min: value, max: value });
      else {
        current.min = Math.min(current.min, value);
        current.max = Math.max(current.max, value);
      }
    };

    rows.forEach(team => {
      track('finalScore', team.finalScore);
      (state.phases || []).forEach(phase => {
        track(`phase-${phase.id}`, team.phaseScores?.[phase.id] ?? 0);
        (phase.criteria || []).forEach(criterion => {
          track(criterion.id, team.criteriaScores?.[criterion.id]);
        });
      });
    });

    return { rows, ranges };
  }, [teamScores, searchQuery, allScoresSort, state.phases]);

  /**
   * Red (lowest in the column) through amber to green (highest), interpolated on the HSL hue so
   * mid-table values read as a gradient rather than falling into buckets. Returns nothing when a
   * column has no spread — tinting every cell the same colour would imply a ranking that is not there.
   */
  const heatCellStyle = (columnKey: string, value: number | null | undefined): React.CSSProperties | undefined => {
    if (!showHeatmap) return undefined;
    if (value === null || value === undefined || Number.isNaN(value)) return undefined;
    const range = allScoresView.ranges.get(columnKey);
    if (!range || range.max === range.min) return undefined;

    const t = (value - range.min) / (range.max - range.min);
    const hue = t * 120;
    return {
      backgroundColor: `hsl(${hue} 80% 92%)`,
      color: `hsl(${hue} 65% 25%)`,
    };
  };

  const hackathonPhaseId = useMemo(() => {
    return state.phases.find(p => p.name.toLowerCase().includes('hackathon'))?.id || 'hack';
  }, [state.phases]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showHackathonPresentation && isAutoCycling) {
      interval = setInterval(() => {
        const hackathonPhase = state.phases.find(p => p.id === hackathonPhaseId);
        const visibleCriteria = hackathonPhase?.criteria.filter(c => !state.hiddenCriteriaIds?.includes(c.id)) || [];
        if (visibleCriteria.length > 0) {
          setActiveHackathonCriterionIdx(prev => (prev + 1) % visibleCriteria.length);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [showHackathonPresentation, isAutoCycling, hackathonPhaseId, state.phases, state.hiddenCriteriaIds]);

  const hackathonSortedTeams = useMemo(() => {
    return [...teamScores].sort((a, b) => {
      const aScore = a.phaseScores[hackathonPhaseId] || 0;
      const bScore = b.phaseScores[hackathonPhaseId] || 0;
      return bScore - aScore;
    });
  }, [teamScores, hackathonPhaseId]);

  // Rank Change Notification
  useEffect(() => {
    if (!notificationsEnabled || !showHackathonPresentation) {
      setPreviousRankings(hackathonSortedTeams.map(t => t.id));
      return;
    }
    
    const currentRankIds = hackathonSortedTeams.map(t => t.id);
    if (previousRankings.length > 0) {
      const anyChanged = currentRankIds.some((id, idx) => id !== previousRankings[idx]);
      
      if (anyChanged) {
        // We could use a toast here if available, or just a console log for now
        console.log("Rankings changed!");
      }
    }
    setPreviousRankings(currentRankIds);
  }, [hackathonSortedTeams, notificationsEnabled, showHackathonPresentation]);

  // Points at the underlying media element so playback can be restarted if a source ever
  // ignores the `loop` attribute. A local file loops natively and never fires onEnded;
  // YouTube and SoundCloud go through their own elements, so this is the backstop.
  const mediaRef = useRef<HTMLVideoElement | null>(null);

  const lastToggleTime = useRef(0);
  const toggleMusic = () => {
    const now = Date.now();
    if (now - lastToggleTime.current < 500) return; // Prevent rapid toggling
    lastToggleTime.current = now;
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Please upload a file smaller than 10MB.');
      return;
    }

    setIsUploadingMusic(true);
    try {
      const downloadURL = await uploadAsset('music', `${state.id}/${Date.now()}-${file.name}`, file);

      const updatedHackathon = { ...state, musicUrl: downloadURL };
      await patchHackathon(state.id, { music_url: downloadURL });


      setAppState(prev => ({
        ...prev,
        hackathons: prev.hackathons.map(h => h.id === state.id ? updatedHackathon : h)
      }));
    } catch (error) {
      console.error('Error uploading music:', error);
      alert('Failed to upload music. Please try again.');
    } finally {
      setIsUploadingMusic(false);
    }
  };

  // Reset player state when URL changes
  useEffect(() => {
    if (musicAudioUrl) {
      setReadyUrl('');
      setIsLoadingMusic(true);
      setMusicError(null);
    } else {
      setReadyUrl('');
      setIsLoadingMusic(false);
      setIsPlayingMusic(false);
    }
  }, [musicAudioUrl]);

  // Dismiss the volume slider on an outside click, and on Escape.
  useEffect(() => {
    if (!showVolumeSlider) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!volumeControlRef.current?.contains(e.target as Node)) setShowVolumeSlider(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVolumeSlider(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showVolumeSlider]);

  // Close it along with the presentation so it is never left hanging open on re-entry.
  useEffect(() => {
    if (!hasFullScreenOverlay) setShowVolumeSlider(false);
  }, [hasFullScreenOverlay]);

  // The player is mounted globally, outside the overlay, and its only play/pause control
  // lives inside the presentation footer. Leaving the presentation therefore stripped away
  // the one way to stop the audio, so stop it on the way out.
  useEffect(() => {
    if (!hasFullScreenOverlay) setIsPlayingMusic(false);
  }, [hasFullScreenOverlay]);

  // Tracks the source the player is currently supposed to be on, so a late onReady fired by
  // a previous source cannot mark the new one as ready (which left readyUrl pointing at the
  // old URL and the safety timeout below armed against a player that was already loaded).
  const latestMusicUrl = useRef(musicAudioUrl);
  useEffect(() => {
    latestMusicUrl.current = musicAudioUrl;
  }, [musicAudioUrl]);

  // Last resort for a source whose onReady never arrives at all — a dead link or a stalled
  // network would otherwise leave the play button disabled forever. Deliberately leaves
  // musicError alone so a real playback error stays on screen.
  useEffect(() => {
    if (!musicAudioUrl) return;
    if (readyUrl === musicAudioUrl) return;

    const timeout = setTimeout(() => {
      console.warn("Music player never reported ready, enabling controls anyway:", musicAudioUrl);
      setIsLoadingMusic(false);
      setReadyUrl(musicAudioUrl);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [musicAudioUrl, readyUrl]);

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isManualScrollPaused, setIsManualScrollPaused] = useState(false);
  const [hackathonToDelete, setHackathonToDelete] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const lastAutoScrollTop = useRef<number>(0);

  const handleManualScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isAutoScrolling) return;
    
    const target = e.currentTarget;
    // If the difference between current scrollTop and last set scrollTop is more than 1 pixel,
    // it's likely a manual scroll.
    if (Math.abs(target.scrollTop - lastAutoScrollTop.current) > 1) {
      setIsManualScrollPaused(true);
      
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      
      pauseTimerRef.current = setTimeout(() => {
        setIsManualScrollPaused(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (!showHackathonPresentation || !isAutoScrolling || isManualScrollPaused) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;
    let scrollPos = scrollContainer.scrollTop;
    const scrollSpeed = 0.5; // pixels per frame

    const startScroll = () => {
      lastAutoScrollTop.current = scrollContainer.scrollTop;
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollPos += scrollSpeed;
          if (scrollPos >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
            scrollPos = 0;
          }
          scrollContainer.scrollTop = scrollPos;
          lastAutoScrollTop.current = scrollPos;
        }
      }, 30);
    };

    startScroll();

    return () => {
      clearInterval(scrollInterval);
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [showHackathonPresentation, isAutoScrolling, isManualScrollPaused, hackathonSortedTeams]);

  // Handlers
  const addTeam = () => {
    const newTeam: Team = {
      id: generateId(),
      name: 'New Team',
      productName: '',
      ideaDetail: '',
      tagline: '',
      hackScore: 0,
      isSortedUp: false
    };
    setState(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  /**
   * Removes score and verdict rows for teams, judges, phases or criteria that have been deleted.
   *
   * Saving a hackathon never touches those tables, so filtering the rows out of local state alone
   * left the server copies intact and the next realtime read brought them straight back.
   */
  const purgeScoreRows = async (scores: ScoreEntry[], decisions: JudgeDecision[]) => {
    const hackathonId = appState.selectedHackathonId;
    if (!hackathonId || (scores.length === 0 && decisions.length === 0)) return;
    await deleteScoreRows(hackathonId, scores, decisions).catch(err =>
      reportSaveFailure('Could not delete the related scores', err));
  };

  const deleteTeam = (id: string) => {
    const removedScores = (state.scores || []).filter(s => s.teamId === id);
    const removedDecisions = (state.decisions || []).filter(d => d.teamId === id);
    setState(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== id),
      scores: prev.scores.filter(s => s.teamId !== id),
      decisions: prev.decisions.filter(d => d.teamId !== id)
    }));
    void purgeScoreRows(removedScores, removedDecisions);
  };

  const toggleCompare = (teamId: string) => {
    setSelectedCompareTeamIds(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId) 
        : [...prev, teamId]
    );
  };

  const reorderTeams = (newTeams: Team[]) => {
    setState(prev => ({ ...prev, teams: newTeams }));
  };

  const moveTeam = (id: string, newIndex: number) => {
    // Reordered inside the updater. Building the array from the render closure and then handing
    // it over whole discards `prev`, so two moves in quick succession lose the first one.
    setState(prev => {
      const teams = [...prev.teams];
      const oldIndex = teams.findIndex(t => t.id === id);
      if (oldIndex === -1) return prev;

      const [movedTeam] = teams.splice(oldIndex, 1);
      const targetIndex = Math.max(0, Math.min(newIndex, teams.length));
      teams.splice(targetIndex, 0, movedTeam);

      return { ...prev, teams };
    });
  };

  /**
   * Fills the current hackathon with generated scores in memory only — nothing is written to the
   * database. It is a preview: instant, harmless to real data, and gone on reload.
   */
  const loadMockData = () => {
    if (!appState.selectedHackathonId) return;
    setDemoStatus(null);

    // Fall back to the built-in structure when the hackathon has no teams of its own. Kept local
    // too — the old version saved it, which quietly overwrote a real hackathon's setup.
    const baseState = state.teams.length > 0 ? state : { ...INITIAL_HACKATHON_DATA, id: appState.selectedHackathonId };

    const mockScores: ScoreEntry[] = [];
    const mockDecisions: JudgeDecision[] = [];

    /**
     * Scores are generated from a few latent factors rather than drawn independently, because
     * independent random numbers do not look like real judging: a team that impresses one judge
     * generally impresses the next, and a team strong on tech is often weaker on presentation.
     *
     *   fraction = teamAbility + criterionAffinity + scorerBias + scorerOpinion + noise
     *
     * teamAbility        how good the team is overall — drives the ranking
     * criterionAffinity  that team's strength or weakness on one criterion
     * scorerBias         a judge/mentor who marks consistently generously or harshly
     * scorerOpinion      this scorer's own read on this team — without it the panel agreed
     *                    almost perfectly (r≈0.96), where real panels land nearer 0.5–0.7
     * noise              everything else, kept small
     *
     * The result is a fraction of each criterion's own maxScore, so it adapts to any scale.
     */
    const gaussian = (stdDev: number) => {
      // Box–Muller. Math.random() never returns 0 here because of the 1 - x.
      const u = 1 - Math.random();
      const v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * stdDev;
    };
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    // Spread abilities over a believable band. Real events cluster mid-to-high with a couple of
    // standouts and a couple of stragglers, rather than spanning the whole 0–100 range.
    const teamAbility = new Map<string, number>();
    baseState.teams.forEach(team => {
      teamAbility.set(team.id, clamp(0.72 + gaussian(0.13), 0.35, 0.98));
    });

    const affinity = new Map<string, number>();
    const affinityFor = (teamId: string, criterionId: string) => {
      const key = `${teamId}:${criterionId}`;
      if (!affinity.has(key)) affinity.set(key, gaussian(0.09));
      return affinity.get(key)!;
    };

    const scorerBias = new Map<string, number>();
    [...baseState.judges, ...baseState.mentors].forEach(person => {
      scorerBias.set(person.id, gaussian(0.06));
    });

    const opinion = new Map<string, number>();
    const opinionFor = (scorerId: string, teamId: string) => {
      const key = `${scorerId}:${teamId}`;
      if (!opinion.has(key)) opinion.set(key, gaussian(0.1));
      return opinion.get(key)!;
    };

    const fractionFor = (teamId: string, criterionId: string, scorerId: string) =>
      clamp(
        (teamAbility.get(teamId) ?? 0.7) +
          affinityFor(teamId, criterionId) +
          (scorerBias.get(scorerId) ?? 0) +
          opinionFor(scorerId, teamId) +
          gaussian(0.05),
        0.12,
        1,
      );

    baseState.phases.forEach(phase => {
      // A phase is scored by whichever group it belongs to, read off the phase itself rather
      // than assuming the built-in 'hack'/'mentoring'/'pitching' ids the old version relied on.
      const scorers = phase.type === 'judge' ? baseState.judges : baseState.mentors;
      if (!scorers?.length || !phase.criteria?.length) return;

      baseState.teams.forEach(team => {
        scorers.forEach(scorer => {
          const mentor = phase.type === 'mentor'
            ? baseState.mentors.find(m => m.id === scorer.id)
            : undefined;

          // Respect mentor assignments — a mentor who is not on a team does not score it.
          const teamAssigned = !mentor?.assignedTeamIds?.length || mentor.assignedTeamIds.includes(team.id);
          if (!teamAssigned) return;

          const criteria = phase.criteria.filter(c =>
            // Skip criteria the scoring code ignores, so the demo never shows a value in a field
            // the real UI disables.
            (scorableMax(c.maxScore) || c.subCriteria?.length) &&
            (!mentor?.assignedCriteriaIds?.length || mentor.assignedCriteriaIds.includes(c.id)));
          if (!criteria.length) return;

          criteria.forEach(criterion => {
            const fraction = fractionFor(team.id, criterion.id, scorer.id);
            const entry: ScoreEntry = {
              teamId: team.id,
              judgeId: scorer.id,
              criterionId: criterion.id,
              phaseId: phase.id,
              score: null,
            };

            if (criterion.subCriteria?.length) {
              // Fill the sub-criteria the same way a scorer would, then let the criterion total
              // fall out of them — writing only `score` would leave the checkboxes blank in the UI.
              const selectedSubCriteriaIds: string[] = [];
              const subCriteriaValues: Record<string, number> = {};

              criterion.subCriteria.forEach(sub => {
                const max = sub.score || 0;
                if (sub.type === 'numeric') {
                  subCriteriaValues[sub.id] = clamp(Math.round(fraction * max), 0, max);
                } else if (max > 1) {
                  subCriteriaValues[sub.id] = clamp(Math.round(fraction * max), 0, max);
                } else if (Math.random() < fraction) {
                  selectedSubCriteriaIds.push(sub.id);
                }
              });

              entry.selectedSubCriteriaIds = selectedSubCriteriaIds;
              entry.subCriteriaValues = subCriteriaValues;
              entry.score = getEffectiveScore(entry, criterion);
            } else {
              const max = criterion.maxScore || 10;
              // Never a flat 0 — a scorer who filled the sheet in gave *something*.
              entry.score = clamp(Math.round(fraction * max), 1, max);
            }

            mockScores.push(entry);
          });

          // Verdicts track the scores, including this scorer's own read on the team — otherwise
          // someone could mark a team down and still vote 'pass'.
          const teamFraction = clamp(
            (teamAbility.get(team.id) ?? 0.7) +
              (scorerBias.get(scorer.id) ?? 0) +
              opinionFor(scorer.id, team.id) +
              gaussian(0.05),
            0,
            1,
          );
          const decision: JudgeDecision['decision'] = phase.type === 'judge'
            ? (teamFraction >= 0.74 ? 'pass' : teamFraction >= 0.56 ? 'not_sure' : 'fail')
            : (teamFraction >= 0.8 ? 'high' : teamFraction >= 0.63 ? 'medium' : teamFraction >= 0.45 ? 'low' : 'critical');

          mockDecisions.push({ teamId: team.id, judgeId: scorer.id, phaseId: phase.id, decision });
        });
      });
    });

    if (mockScores.length === 0 && mockDecisions.length === 0) {
      setDemoStatus({
        kind: 'error',
        message:
          'Nothing to generate — this hackathon needs at least one phase with criteria, plus ' +
          'judges for judge phases or mentors for mentor phases.',
      });
      return;
    }

    // In-memory only: a preview does not need to be persisted or shared to be useful, and this
    // way it can never overwrite a real hackathon's scores.
    setAppState(prev => ({
      ...prev,
      hackathons: prev.hackathons.some(h => h.id === baseState.id)
        ? prev.hackathons.map(h =>
            h.id === baseState.id
              ? { ...baseState, scores: mockScores, decisions: mockDecisions }
              : h)
        : [...prev.hackathons, { ...baseState, scores: mockScores, decisions: mockDecisions }],
    }));

    setDemoStatus({
      kind: 'ok',
      message:
        `Generated ${mockScores.length} scores and ${mockDecisions.length} verdicts across ` +
        `${baseState.teams.length} teams. Preview only — not saved to the database, and cleared on reload.`,
    });
  };

  const clearAllData = () => {
    const allScores = state.scores || [];
    const allDecisions = state.decisions || [];
    setState(prev => ({ ...EMPTY_HACKATHON_DATA, id: prev.id }));
    setShowClearConfirm(false);
    void purgeScoreRows(allScores, allDecisions);
  };

  const addJudge = () => {
    const newJudge: Judge = {
      id: generateId(),
      name: 'New Judge'
    };
    setState(prev => ({ ...prev, judges: [...prev.judges, newJudge] }));
  };

  const updateJudge = (id: string, updates: Partial<Judge>) => {
    setState(prev => ({
      ...prev,
      judges: prev.judges.map(j => j.id === id ? { ...j, ...updates } : j)
    }));
  };

  const deleteJudge = (id: string) => {
    const removedScores = (state.scores || []).filter(s => s.judgeId === id);
    const removedDecisions = (state.decisions || []).filter(d => d.judgeId === id);
    setState(prev => ({
      ...prev,
      judges: prev.judges.filter(j => j.id !== id),
      scores: prev.scores.filter(s => s.judgeId !== id),
      decisions: prev.decisions.filter(d => d.judgeId !== id)
    }));
    void purgeScoreRows(removedScores, removedDecisions);
  };

  const addMentor = () => {
    const newMentor: Mentor = {
      id: generateId(),
      name: 'New Mentor',
      assignedCriteriaIds: [],
      assignedTeamIds: []
    };
    setState(prev => ({ ...prev, mentors: [...prev.mentors, newMentor] }));
  };

  const updateMentor = (id: string, updates: Partial<Mentor>) => {
    setState(prev => ({
      ...prev,
      mentors: prev.mentors.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  };

  const deleteMentor = (id: string) => {
    // Mentor scores are stored under judgeId. This handler previously left them behind entirely,
    // locally as well as on the server.
    const removedScores = (state.scores || []).filter(s => s.judgeId === id);
    const removedDecisions = (state.decisions || []).filter(d => d.judgeId === id);
    setState(prev => ({
      ...prev,
      mentors: prev.mentors.filter(m => m.id !== id),
      scores: prev.scores.filter(s => s.judgeId !== id),
      decisions: prev.decisions.filter(d => d.judgeId !== id),
      teams: prev.teams.map(t => ({
        ...t,
        mentorIds: t.mentorIds?.filter(mid => mid !== id)
      }))
    }));
    void purgeScoreRows(removedScores, removedDecisions);
  };

  const updateScore = (teamId: string, judgeId: string, criterionId: string, score: number | null, phaseId: string, selectedSubCriteriaIds?: string[], subCriteriaValues?: Record<string, number>) => {
    if (!appState.selectedHackathonId) return;

    const scoreData: ScoreEntry = { teamId, judgeId, criterionId, score, phaseId };
    if (selectedSubCriteriaIds !== undefined) scoreData.selectedSubCriteriaIds = selectedSubCriteriaIds;
    if (subCriteriaValues !== undefined) scoreData.subCriteriaValues = subCriteriaValues;
    
    // Optimistic local update
    setAppState(prev => ({
      ...prev,
      hackathons: prev.hackathons.map(h => {
        if (h.id !== appState.selectedHackathonId) return h;
        const otherScores = h.scores.filter(s => !(s.teamId === teamId && s.judgeId === judgeId && s.criterionId === criterionId && s.phaseId === phaseId));
        return { ...h, scores: [...otherScores, scoreData] };
      })
    }));

    void saveScore(appState.selectedHackathonId, scoreData).catch(err =>
      reportSaveFailure('Score not saved', err));
  };

  const updateDecision = (teamId: string, judgeId: string, phaseId: string, decision: JudgeDecision['decision']) => {
    if (!appState.selectedHackathonId) return;

    const decisionData: JudgeDecision = { teamId, judgeId, phaseId, decision };

    // Optimistic local update
    setAppState(prev => ({
      ...prev,
      hackathons: prev.hackathons.map(h => {
        if (h.id !== appState.selectedHackathonId) return h;
        const otherDecisions = h.decisions.filter(d => !(d.teamId === teamId && d.judgeId === judgeId && d.phaseId === phaseId));
        return { ...h, decisions: [...otherDecisions, decisionData] };
      })
    }));

    void saveDecision(appState.selectedHackathonId, decisionData).catch(err =>
      reportSaveFailure('Verdict not saved', err));
  };

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const addPhase = () => {
    const newPhase: Phase = {
      id: generateId(),
      name: 'New Phase',
      weight: null,
      type: 'mentor',
      criteria: []
    };
    setState(prev => ({ ...prev, phases: [...prev.phases, newPhase] }));
    setEditingPhaseId(newPhase.id);
  };

  const updatePhase = (id: string, updates: Partial<Phase>) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const deletePhase = (id: string) => {
    const removedScores = (state.scores || []).filter(s => s.phaseId === id);
    const removedDecisions = (state.decisions || []).filter(d => d.phaseId === id);
    setState(prev => ({
      ...prev,
      phases: prev.phases.filter(p => p.id !== id),
      scores: prev.scores.filter(s => s.phaseId !== id),
      decisions: prev.decisions.filter(d => d.phaseId !== id)
    }));
    void purgeScoreRows(removedScores, removedDecisions);
  };

  const addCriterion = (phaseId: string) => {
    const newCriterion: Criterion = {
      id: generateId(),
      name: 'New Criterion',
      maxScore: null,
      weight: null
    };
    setState(prev => ({ 
      ...prev, 
      phases: prev.phases.map(p => p.id === phaseId ? { ...p, criteria: [...p.criteria, newCriterion] } : p)
    }));
  };

  const updateCriterion = (phaseId: string, criterionId: string, updates: Partial<Criterion>) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === phaseId ? {
        ...p,
        criteria: p.criteria.map(c => c.id === criterionId ? { ...c, ...updates } : c)
      } : p)
    }));
  };

  const deleteCriterion = (phaseId: string, criterionId: string) => {
    const removedScores = (state.scores || []).filter(s => s.criterionId === criterionId);
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === phaseId ? {
        ...p,
        criteria: p.criteria.filter(c => c.id !== criterionId)
      } : p),
      scores: prev.scores.filter(s => s.criterionId !== criterionId)
    }));
    // Decisions are per phase, not per criterion, so only scores are affected here.
    void purgeScoreRows(removedScores, []);
  };

  const addSubCriterion = (phaseId: string, criterionId: string) => {
    const newSub: SubCriterion = {
      id: generateId(),
      name: 'New Sub-Criterion',
      score: null,
      type: 'checkbox'
    };
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === phaseId ? {
        ...p,
        criteria: p.criteria.map(c => {
          if (c.id !== criterionId) return c;
          const newSubCriteria = [...(c.subCriteria || []), newSub];
          return {
            ...c,
            subCriteria: newSubCriteria,
            maxScore: newSubCriteria.reduce((acc, s) => acc + (s.score || 0), 0)
          };
        })
      } : p)
    }));
  };

  const updateSubCriterion = (phaseId: string, criterionId: string, subId: string, updates: Partial<SubCriterion>) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === phaseId ? {
        ...p,
        criteria: p.criteria.map(c => {
          if (c.id !== criterionId) return c;
          const newSubCriteria = c.subCriteria?.map(s => s.id === subId ? { ...s, ...updates } : s) || [];
          return {
            ...c,
            subCriteria: newSubCriteria,
            maxScore: newSubCriteria.reduce((acc, s) => acc + (s.score || 0), 0)
          };
        })
      } : p)
    }));
  };

  const deleteSubCriterion = (phaseId: string, criterionId: string, subId: string) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === phaseId ? {
        ...p,
        criteria: p.criteria.map(c => {
          if (c.id !== criterionId) return c;
          const newSubCriteria = c.subCriteria?.filter(s => s.id !== subId) || [];
          return {
            ...c,
            subCriteria: newSubCriteria,
            maxScore: newSubCriteria.reduce((acc, s) => acc + (s.score || 0), 0)
          };
        })
      } : p)
    }));
  };

  const createNewHackathon = () => {
    if (!user) return;
    const newId = generateId();
    const newHackathon: HackathonData = {
      ...EMPTY_HACKATHON_DATA,
      id: newId,
      ownerId: user.uid,
      hackathonName: 'New Hackathon',
    };
    
    // Optimistic local update
    setAppState(prev => ({
      ...prev,
      hackathons: [...prev.hackathons, newHackathon]
    }));
    navigate(hackathonRoute(newId));

    void saveHackathon(newHackathon).catch(err =>
      reportSaveFailure('Could not create the hackathon', err));
  };

  const openAwardConfig = () => {
    if (state.awardSlides && state.awardSlides.length > 0) {
      setAwardSlides(state.awardSlides);
    } else {
      const initialSlides = sortedTeams
        .filter(t => t.finalRank || t.award)
        .map(t => ({ teamId: t.id, awardName: t.finalRank || t.award || '' }));
      
      const rankOrder = ['Special Award', 'Honorable Mention', '2nd Runner Up', '1st Runner Up', 'Winner'];
      initialSlides.sort((a, b) => {
        const idxA = rankOrder.indexOf(a.awardName);
        const idxB = rankOrder.indexOf(b.awardName);
        return idxA - idxB;
      });

      setAwardSlides(initialSlides);
    }
    setShowAwardConfig(true);
  };

  const deleteHackathon = (id: string) => {
    setHackathonToDelete(id);
  };

  const confirmDeleteHackathon = () => {
    if (hackathonToDelete && isAdmin) {
      // Optimistic local update
      setAppState(prev => ({
        ...prev,
        hackathons: prev.hackathons.filter(h => h.id !== hackathonToDelete)
      }));
      if (route.hackathonId === hackathonToDelete) navigate(HOME_ROUTE, { replace: true });

      // Scores and verdicts go with it: the foreign keys cascade, which used to have to be done
      // by hand a batch at a time.
      void deleteHackathonRow(hackathonToDelete).catch(err =>
        reportSaveFailure('Could not delete the hackathon', err));
      
      setHackathonToDelete(null);
    }
  };

  /**
   * Copies a link and flags `key` as copied for a couple of seconds. Falls back to showing the URL
   * because clipboard access is refused outside a secure or focused context — reporting a copy that
   * did not happen would lose the link silently.
   */
  const copyLink = async (url: string, key: string, fallbackPrompt: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.prompt(fallbackPrompt, url);
    }
  };

  const copyPublicLink = (overlay: 'present' | 'awards') =>
    copyLink(
      publicPresentationUrl(state.id, overlay),
      `public-${overlay}`,
      'Copy this link to open the presentation on another screen:',
    );

  const exportData = () => {
    // Blob URL rather than a data: URL — encoding the whole hackathon inline grows past what
    // browsers accept in an href once an event has a few hundred scores.
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(state.hackathonName || 'hackathon').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-scores.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoked on a later tick: doing it synchronously after click() can cancel the download
    // before the browser has started reading the blob.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-ink" size={48} />
      </div>
    );
  }

  // /p/… projector links are the one route that renders without an account.
  if (!user && !isPublicView) {
    return <LandingPage onLogin={login} onSignup={signup} />;
  }

  // The domain root is the tools launcher; each tool owns a namespace below it.
  if (!route.tool) {
    return (
      <ErrorBoundary>
        <ToolLauncher
          user={user}
          onLogout={logout}
          onOpen={(tool: Tool) => navigate({ ...LAUNCHER_ROUTE, tool })}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {!appState.selectedHackathonId ? (
        <div className="min-h-screen bg-bg p-12">
          <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-3">
                {/* This tool now sits under the launcher at the domain root, so there has to be a
                    way back up to it. */}
                <button
                  onClick={() => navigate(LAUNCHER_ROUTE)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors"
                >
                  <ArrowLeft size={14} /> All tools
                </button>
                <div>
                  <h1 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tighter text-ink uppercase italic whitespace-nowrap">Hackathon Hub</h1>
                  <p className="text-muted font-bold tracking-widest uppercase text-xs mt-2">Select a hackathon to manage or score</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-ink uppercase tracking-wider">{user?.displayName || user?.email}</p>
                    <button onClick={logout} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline">Logout</button>
                  </div>
                  {user?.photoURL ? (
                    <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-ink text-accent flex items-center justify-center font-black text-xs border-2 border-white shadow-sm">
                      {user?.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <button 
                    onClick={createNewHackathon}
                    className="px-6 py-3 bg-ink text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-ink/90 transition-all shadow-xl shadow-ink/10"
                  >
                    <Plus size={20} />
                    CREATE NEW HACKATHON
                  </button>
                )}
              </div>
            </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appState.hackathons.map(hackathon => (
              <div 
                key={hackathon.id}
                onClick={() => navigate(hackathonRoute(hackathon.id))}
                className="group bg-white border border-border rounded-3xl p-8 space-y-6 cursor-pointer hover:border-ink transition-all hover:shadow-2xl hover:shadow-ink/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: hackathon.hackathonColor || '#E11D48' }}
                  >
                    {hackathon.hackathonLogo ? (
                      <img src={hackathon.hackathonLogo} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Trophy className="w-8 h-8 text-white" />
                    )}
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHackathon(hackathon.id);
                      }}
                      className="p-2 text-muted hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl font-black tracking-tight text-ink uppercase leading-tight">
                    {hackathon.hackathonName || 'Untitled Hackathon'}
                  </h3>
                  <p className="text-muted font-medium text-sm leading-relaxed">
                    {hackathon.hackathonSubtitle || 'No description provided'}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/50 relative z-10">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-bg border-2 border-white flex items-center justify-center text-[10px] font-bold text-muted">
                        {i === 2 ? `+${hackathon.teams.length}` : <Users size={12} />}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-widest group-hover:gap-3 transition-all">
                    Manage <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Hackathon Confirmation Modal */}
          <AnimatePresence>
            {hackathonToDelete && (
              <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-ink/10 space-y-6"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                      <Trash2 size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Delete Hackathon?</h3>
                    <p className="text-muted text-sm leading-relaxed">
                      This will permanently delete{' '}
                      <span className="font-black text-ink">
                        {appState.hackathons.find(h => h.id === hackathonToDelete)?.hackathonName}
                      </span>{' '}
                      and all its data. This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setHackathonToDelete(null)}
                      className="flex-1 px-6 py-3 bg-slate-100 text-ink rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmDeleteHackathon}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ) : (
      <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      {!isExternalView && showAppShell && (
        <nav className="w-64 bg-white border-r border-border flex flex-col p-6 gap-8 overflow-y-auto sticky top-0 h-screen shrink-0">
          <div className="flex items-center gap-3">
            {/* Company mark, from the brand kit. The dual-tone logo needs a dark container. */}
            <div className="w-10 h-10 bg-brand-ink rounded-xl flex items-center justify-center shadow-lg shadow-ink/10 shrink-0 p-1.5">
              <BrandLogo variant="icon-dark" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none">HACKATHON HUB</h1>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">BASE Playhouse</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-widest">Main</div>
            <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Leaderboard" />
            <NavItem active={activeTab === 'hackathon-leaderboard'} onClick={() => setActiveTab('hackathon-leaderboard')} icon={<Terminal size={18}/>} label={state.hackathonName || "Hackathon Leaderboard"} />
            <NavItem active={activeTab === 'all-scores'} onClick={() => setActiveTab('all-scores')} icon={<Trophy size={18}/>} label="All Scores" />
            <NavItem active={activeTab === 'team-scoring-table'} onClick={() => setActiveTab('team-scoring-table')} icon={<Table size={18}/>} label="Team Scoring Table" />
            <NavItem active={activeTab === 'team-scoring'} onClick={() => setActiveTab('team-scoring')} icon={<ClipboardList size={18}/>} label="Team Scoring" />
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-widest">Management</div>
            <NavItem active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} icon={<Users size={18}/>} label="Teams" badge={state.teams?.length || 0} />
            <NavItem active={activeTab === 'judges'} onClick={() => setActiveTab('judges')} icon={<Gavel size={18}/>} label="Judges" badge={state.judges?.length || 0} />
            <NavItem active={activeTab === 'mentors'} onClick={() => setActiveTab('mentors')} icon={<Users2 size={18}/>} label="Mentors" badge={state.mentors?.length || 0} />
            <NavItem active={activeTab === 'criteria'} onClick={() => setActiveTab('criteria')} icon={<Settings size={18}/>} label="Criteria" />
            <NavItem active={activeTab === 'scoring-structure'} onClick={() => setActiveTab('scoring-structure')} icon={<Network size={18}/>} label="Scoring Structure" />
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-widest">Mentor Scoring</div>
            {state.mentors?.map((mentor, idx) => (
              <NavItem 
                key={mentor.id}
                active={activeTab === `mentor-${mentor.id}`} 
                onClick={() => setActiveTab(`mentor-${mentor.id}`)} 
                icon={<Mic2 size={18}/>} 
                label={mentor.name} 
                badge={`M${idx + 1}`}
              />
            ))}
            {(state.mentors?.length || 0) === 0 && (
              <div className="px-3 py-2 text-[10px] text-muted italic">No mentors added</div>
            )}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-widest">Judge Scoring</div>
            {state.judges?.map((judge, idx) => (
              <NavItem 
                key={judge.id}
                active={activeTab === `judge-${judge.id}`} 
                onClick={() => setActiveTab(`judge-${judge.id}`)} 
                icon={<ClipboardList size={18}/>} 
                label={judge.name} 
                badge={`J${idx + 1}`}
              />
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <NavItem active={activeTab === 'internal'} onClick={() => setActiveTab('internal')} icon={<Settings size={18}/>} label="System Management" />
          </div>
          {user && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-ink text-accent flex items-center justify-center font-black text-[10px]">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-ink truncate">{user.displayName || user.email}</p>
                  <p className="text-[8px] text-muted uppercase tracking-widest">Logged In</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full py-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-widest border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          <div className="space-y-1 mt-auto pt-8 border-t border-border">
            {/* Two levels up now: the hackathon list, then the tools launcher. */}
            <NavItem active={false} onClick={() => navigate(HOME_ROUTE)} icon={<ArrowLeft size={18}/>} label="All Hackathons" />
            <NavItem active={false} onClick={() => navigate(LAUNCHER_ROUTE)} icon={<Home size={18}/>} label="All Tools" />
          </div>
        </nav>
      )}

      {/* Main Content — hidden behind a projector link or a full-screen presentation. */}
      {showAppShell && (
      <main className="flex-1 min-w-0 overflow-y-auto p-8">
        {isExternalView && (
          <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-ink rounded-xl flex items-center justify-center shadow-lg shadow-ink/10 shrink-0 p-1.5">
                <BrandLogo variant="icon-dark" className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight leading-none uppercase">{state.hackathonName || "PITCHING SYSTEM"}</h1>
                <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">External Scoring View</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-muted">Logged in as</p>
                <p className="text-xs font-black uppercase italic tracking-tighter">
                  {activeTab.startsWith('judge-') ? state.judges.find(j => j.id === activeTab.substring(6))?.name : state.mentors.find(m => m.id === activeTab.substring(7))?.name}
                </p>
              </div>
              <button
                onClick={() => navigate(HOME_ROUTE)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-muted"
                title="Exit External View"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        )}
        {/* No mode="wait": it withholds the incoming panel until the outgoing exit animation
            finishes, so if frames stall the previous tab stays on screen while the URL and
            sidebar have already moved on. */}
        {/* No exit animation, and therefore no AnimatePresence: keeping the outgoing panel alive
            until an exit finished meant two panels were mounted at once (a layout jump), and if
            frames stalled the old one stayed on screen while the URL had already moved on. */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
            {activeTab === 'scoring-structure' && (
              <div className="space-y-8">
                <div className="border-b border-ink/10 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Scoring Structure</h2>
                    <p className="text-ink/40 font-mono text-xs uppercase mt-1">Full breakdown of phases, criteria, and weights</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const allCriterionIds = state.phases.flatMap(p => p.criteria.map(c => c.id));
                        const newCollapsed = allCriterionIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
                        setCollapsedCriteria(newCollapsed);
                      }}
                      className="px-3 py-1.5 bg-white border border-ink/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Collapse All
                    </button>
                    <button 
                      onClick={() => {
                        setCollapsedCriteria({});
                      }}
                      className="px-3 py-1.5 bg-white border border-ink/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Expand All
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-border rounded-2xl p-10 overflow-x-auto shadow-sm">
                  <div className="flex flex-col items-center min-w-[1100px]">
                    {/* Root Node */}
                    <div className="relative mb-16 flex flex-col items-center">
                      <div className="bg-ink text-white px-12 py-8 rounded-2xl shadow-2xl flex flex-col items-center gap-1 border-2 border-accent/30 relative group">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-50">Final Score</span>
                        <span className="text-5xl font-black italic tracking-tighter">100%</span>
                        
                        <button 
                          onClick={addPhase}
                          className="absolute -right-16 top-1/2 -translate-y-1/2 p-3 bg-accent text-white rounded-full shadow-lg hover:scale-110 transition-all group-hover:opacity-100 opacity-0"
                          title="Add Phase"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-16 bg-border"></div>
                    </div>

                    {/* Phase Nodes */}
                    <div className="flex justify-center gap-24 relative">
                      {/* Horizontal connector for phases */}
                      <div className="absolute top-0 left-[20%] right-[20%] h-px bg-border -translate-y-16"></div>
                      
                      {state.phases.map((phase) => (
                        <div key={phase.id} className="flex flex-col items-center relative">
                          {/* Vertical connector to phase */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-16 bg-border"></div>
                          
                          <div className={`bg-slate-50 border-2 p-8 rounded-2xl shadow-sm flex flex-col items-center gap-2 w-72 group transition-all hover:shadow-md ${editingPhaseId === phase.id ? 'border-accent ring-4 ring-accent/10' : 'border-border hover:border-accent'}`}>
                            {editingPhaseId === phase.id ? (
                              <div className="w-full space-y-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold uppercase text-muted">Phase Name</label>
                                  <input 
                                    value={phase.name}
                                    onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                                    className="w-full bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-accent outline-none"
                                    autoFocus
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-muted">Weight (%)</label>
                                    <input 
                                      type="number"
                                      value={phase.weight || ''}
                                      onChange={(e) => updatePhase(phase.id, { weight: Number(e.target.value) })}
                                      className="w-full bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm font-mono focus:border-accent outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-muted">Type</label>
                                    <select 
                                      value={phase.type}
                                      onChange={(e) => updatePhase(phase.id, { type: e.target.value as any })}
                                      className="w-full bg-white border border-ink/10 rounded-lg px-2 py-2 text-[10px] font-bold uppercase focus:border-accent outline-none"
                                    >
                                      <option value="judge">Judge</option>
                                      <option value="system">System</option>
                                      <option value="mentor">Mentor</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <button 
                                    onClick={() => {
                                      deletePhase(phase.id);
                                      setEditingPhaseId(null);
                                    }}
                                    className="py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-200"
                                  >
                                    Delete
                                  </button>
                                  <button 
                                    onClick={() => setEditingPhaseId(null)}
                                    className="py-2 bg-ink text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-ink/80 transition-all"
                                  >
                                    Done
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-sm font-bold uppercase tracking-widest text-muted">{phase.name}</span>
                                  <button 
                                    onClick={() => setEditingPhaseId(phase.id)}
                                    className="p-1.5 text-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </div>
                                <span className="text-4xl font-black text-ink italic tracking-tighter">{phase.weight}%</span>
                                <Badge variant="default">{phase.type === 'judge' ? 'Judged' : phase.type === 'mentor' ? 'Mentor' : 'System'}</Badge>
                              </>
                            )}
                          </div>

                          {/* Vertical connector to criteria */}
                          <div className="w-px h-16 bg-border"></div>

                          {/* Criteria Nodes */}
                          <div className="flex flex-col gap-5 items-center relative">
                            {/* Horizontal connector for criteria */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-border -z-10"></div>
                            
                            {phase.criteria.map((criterion) => (
                              <div key={criterion.id} className={`bg-white border p-5 rounded-xl shadow-sm w-80 flex flex-col gap-3 hover:shadow-xl transition-all relative group hover:-translate-y-1 ${editingCriterionId === criterion.id ? 'border-accent ring-4 ring-accent/10 z-10' : 'border-border'}`}>
                                {/* Small connector to individual criterion */}
                                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-white border-t border-l border-border rotate-45 group-hover:border-accent transition-colors"></div>
                                
                                  {editingCriterionId === criterion.id ? (
                                    <div className="space-y-3">
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-muted">Criterion Name</label>
                                        <input 
                                          value={criterion.name}
                                          onChange={(e) => updateCriterion(phase.id, criterion.id, { name: e.target.value })}
                                          className="w-full bg-slate-50 border border-ink/5 rounded-lg px-3 py-2 text-xs font-bold focus:border-accent outline-none"
                                          autoFocus
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold uppercase text-muted">Weight (%)</label>
                                          <input 
                                            type="number"
                                            value={criterion.weight || ''}
                                            onChange={(e) => updateCriterion(phase.id, criterion.id, { weight: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-ink/5 rounded-lg px-3 py-2 text-xs font-mono focus:border-accent outline-none"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold uppercase text-muted">Max Score</label>
                                          <input 
                                            type="number"
                                            value={criterion.maxScore || ''}
                                            onChange={(e) => updateCriterion(phase.id, criterion.id, { maxScore: Number(e.target.value) })}
                                            className={`w-full bg-slate-50 border border-ink/5 rounded-lg px-3 py-2 text-xs font-mono focus:border-accent outline-none ${criterion.subCriteria && criterion.subCriteria.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            readOnly={criterion.subCriteria && criterion.subCriteria.length > 0}
                                            title={criterion.subCriteria && criterion.subCriteria.length > 0 ? "Max score is calculated from sub-criteria" : ""}
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-muted">Description</label>
                                        <textarea 
                                          value={criterion.description || ''}
                                          onChange={(e) => updateCriterion(phase.id, criterion.id, { description: e.target.value })}
                                          className="w-full bg-slate-50 border border-ink/5 rounded-lg px-3 py-2 text-[10px] min-h-[50px] resize-none focus:border-accent outline-none"
                                          placeholder="Description..."
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <button 
                                          onClick={() => {
                                            deleteCriterion(phase.id, criterion.id);
                                            setEditingCriterionId(null);
                                          }}
                                          className="py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-200"
                                        >
                                          Delete
                                        </button>
                                        <button 
                                          onClick={() => setEditingCriterionId(null)}
                                          className="py-2 bg-accent text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-accent/80 transition-all shadow-md shadow-accent/10"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black uppercase text-ink leading-tight">{criterion.name}</span>
                                            <button 
                                              onClick={() => setEditingCriterionId(criterion.id)}
                                              className="p-1 text-muted hover:text-accent hover:bg-accent/5 rounded transition-all opacity-0 group-hover:opacity-100"
                                            >
                                              <Edit2 size={12} />
                                            </button>
                                          </div>
                                          <p className="text-[10px] text-muted leading-relaxed line-clamp-2">{criterion.description || 'No description'}</p>
                                        </div>
                                        <span className="text-sm font-black text-accent italic ml-3 shrink-0">{criterion.weight}%</span>
                                      </div>

                                      <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-50">
                                        <span className="text-[9px] text-muted font-bold uppercase tracking-wider">Max Score</span>
                                        <span className="text-[10px] font-bold font-mono bg-slate-100 px-2 py-0.5 rounded text-ink">{criterion.maxScore}</span>
                                      </div>

                                      {/* Sub-criteria section */}
                                      <div className="mt-2 pt-2 border-t border-slate-50">
                                        <div className="flex justify-between items-center mb-1">
                                          <button 
                                            onClick={() => setCollapsedCriteria(prev => ({ ...prev, [criterion.id]: !prev[criterion.id] }))}
                                            className="flex items-center gap-1 text-[9px] font-bold uppercase text-muted hover:text-ink transition-colors"
                                          >
                                            {collapsedCriteria[criterion.id] ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                                            Sub-Criteria ({criterion.subCriteria?.length || 0})
                                          </button>
                                          {!collapsedCriteria[criterion.id] && (
                                            <button 
                                              onClick={() => addSubCriterion(phase.id, criterion.id)}
                                              className="p-1 text-accent hover:bg-accent/5 rounded transition-all"
                                              title="Add Sub-Criterion"
                                            >
                                              <Plus size={12} />
                                            </button>
                                          )}
                                        </div>
                                        
                                        {!collapsedCriteria[criterion.id] && criterion.subCriteria && criterion.subCriteria.length > 0 && (
                                          <div className="space-y-2 mt-2">
                                            {criterion.subCriteria.map(sub => (
                                              <div key={sub.id} className="bg-slate-50 p-2 rounded-lg border border-ink/5 space-y-2">
                                                <div className="flex gap-2">
                                                  <input 
                                                    value={sub.name}
                                                    onChange={(e) => updateSubCriterion(phase.id, criterion.id, sub.id, { name: e.target.value })}
                                                    className="flex-1 bg-white border border-ink/5 rounded px-2 py-1 text-[10px] font-bold outline-none focus:border-accent"
                                                    placeholder="Sub-criterion name"
                                                  />
                                                  <input 
                                                    type="number"
                                                    value={sub.score || ''}
                                                    onChange={(e) => updateSubCriterion(phase.id, criterion.id, sub.id, { score: Number(e.target.value) })}
                                                    className="w-12 bg-white border border-ink/5 rounded px-2 py-1 text-[10px] font-mono text-center outline-none focus:border-accent"
                                                    placeholder="Pts"
                                                  />
                                                  <button 
                                                    onClick={() => deleteSubCriterion(phase.id, criterion.id, sub.id)}
                                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-all"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                  <div className="flex gap-2">
                                                    <select 
                                                      value={sub.type}
                                                      onChange={(e) => updateSubCriterion(phase.id, criterion.id, sub.id, { type: e.target.value as any })}
                                                      className="flex-1 bg-white border border-ink/5 rounded px-2 py-1 text-[9px] font-bold uppercase outline-none focus:border-accent"
                                                    >
                                                      <option value="checkbox">Checkbox (Add Score)</option>
                                                      <option value="numeric">Numeric (Input Score)</option>
                                                    </select>
                                                  </div>
                                                  <textarea 
                                                    value={sub.description || ''}
                                                    onChange={(e) => updateSubCriterion(phase.id, criterion.id, sub.id, { description: e.target.value })}
                                                    className="w-full bg-white border border-ink/5 rounded px-2 py-1 text-[9px] outline-none focus:border-accent min-h-[40px] resize-none"
                                                    placeholder="Sub-criterion description (optional)"
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                              </div>
                            ))}

                            <button 
                              onClick={() => addCriterion(phase.id)}
                              className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 group/add"
                            >
                              <Plus size={16} className="group-hover/add:scale-110 transition-transform" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Add Criterion</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'all-scores' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-extrabold tracking-tight">Full Scoreboard</h2>
                      <p className="text-muted text-sm mt-2">Comprehensive view of all criteria scores across all teams</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* The legend doubles as the switch — one control, and it explains itself. */}
                      <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        aria-pressed={showHeatmap}
                        title={showHeatmap ? 'Turn the colour scale off' : 'Turn the colour scale on'}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${
                          showHeatmap
                            ? 'bg-white border-border shadow-sm'
                            : 'bg-slate-50 border-transparent hover:border-border'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                          showHeatmap ? 'bg-ink border-ink' : 'border-muted/40'
                        }`}>
                          {showHeatmap && <Check size={10} strokeWidth={4} className="text-white" />}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${
                          showHeatmap ? 'text-ink' : 'text-muted'
                        }`}>
                          Low
                        </span>
                        <span
                          className="h-2 w-20 rounded-full border border-border transition-all"
                          style={{
                            backgroundImage: showHeatmap
                              ? 'linear-gradient(to right, hsl(0 80% 92%), hsl(60 80% 92%), hsl(120 80% 92%))'
                              : 'linear-gradient(to right, hsl(0 0% 94%), hsl(0 0% 86%))',
                          }}
                        />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${
                          showHeatmap ? 'text-ink' : 'text-muted'
                        }`}>
                          High
                        </span>
                        <span className="text-[9px] font-medium text-muted/60">per column</span>
                      </button>
                      <div className="relative w-64">
                        <input
                          type="text"
                          placeholder="Search teams..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="input-field pl-10"
                        />
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                      </div>
                      <button onClick={exportData} className="btn-secondary">
                        <Download className="w-4 h-4" /> Export
                      </button>
                    </div>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-border">
                            <th className="p-4 text-center w-12 sticky left-0 bg-slate-50 z-30 border-r border-border">
                              <div className="flex items-center justify-center">
                                <GitCompare size={14} className="text-muted" />
                              </div>
                            </th>
                            <th className="p-4 text-center w-16 sticky left-12 bg-slate-50 z-20 border-r border-border">
                              <span className="label-micro mb-0">Rank</span>
                            </th>
                            <th 
                              className="p-4 cursor-pointer hover:bg-slate-100 transition-colors sticky left-[112px] bg-slate-50 z-10"
                              onClick={() => setAllScoresSort(prev => ({ key: 'name', direction: prev.key === 'name' && prev.direction === 'desc' ? 'asc' : 'desc' }))}
                            >
                              <div className="flex items-center gap-2">
                                <span className="label-micro mb-0">Team</span>
                                {allScoresSort.key === 'name' && (allScoresSort.direction === 'desc' ? <ChevronDown size={12}/> : <ChevronUp size={12}/>)}
                              </div>
                            </th>
                            {state.phases.map(phase => (
                              <React.Fragment key={phase.id}>
                                {phase.criteria.map(c => (
                                  <th 
                                    key={c.id} 
                                    className="p-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => setAllScoresSort(prev => ({ key: c.id, direction: prev.key === c.id && prev.direction === 'desc' ? 'asc' : 'desc' }))}
                                  >
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-[9px] text-muted uppercase font-bold tracking-widest">{phase.name}</span>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-black uppercase">{c.name}</span>
                                        {allScoresSort.key === c.id && (allScoresSort.direction === 'desc' ? <ChevronDown size={12}/> : <ChevronUp size={12}/>)}
                                      </div>
                                    </div>
                                  </th>
                                ))}
                                <th 
                                  className="p-4 text-center bg-slate-100/50 cursor-pointer hover:bg-slate-200 transition-colors"
                                  onClick={() => setAllScoresSort(prev => ({ key: `phase-${phase.id}`, direction: prev.key === `phase-${phase.id}` && prev.direction === 'desc' ? 'asc' : 'desc' }))}
                                >
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-[9px] text-muted uppercase font-bold tracking-widest">{phase.name}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-black uppercase">Total</span>
                                      {allScoresSort.key === `phase-${phase.id}` && (allScoresSort.direction === 'desc' ? <ChevronDown size={12}/> : <ChevronUp size={12}/>)}
                                    </div>
                                  </div>
                                </th>
                              </React.Fragment>
                            ))}
                            <th 
                              className="p-4 text-center bg-accent/10 cursor-pointer hover:bg-accent/20 transition-colors"
                              onClick={() => setAllScoresSort(prev => ({ key: 'finalScore', direction: prev.key === 'finalScore' && prev.direction === 'desc' ? 'asc' : 'desc' }))}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="label-micro mb-0 text-accent">Final Total</span>
                                {allScoresSort.key === 'finalScore' && (allScoresSort.direction === 'desc' ? <ChevronDown size={12}/> : <ChevronUp size={12}/>)}
                              </div>
                            </th>
                            <th className="p-4 text-center w-40">
                              <span className="label-micro mb-0">Award</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allScoresView.rows
                            .map((team, idx) => (
                              <tr key={team.id} className="border-b border-border hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-center sticky left-0 bg-white z-30 border-r border-border">
                                  <input 
                                    type="checkbox"
                                    checked={selectedCompareTeamIds.includes(team.id)}
                                    onChange={() => toggleCompare(team.id)}
                                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent transition-all cursor-pointer"
                                  />
                                </td>
                                <td className="p-4 text-center sticky left-12 bg-white z-20 border-r border-border font-mono font-bold text-xs text-muted">
                                  {idx + 1}
                                </td>
                                <td className="p-4 sticky left-[112px] bg-white z-10 border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-muted shrink-0">
                                      {team.originalIndex + 1}
                                    </div>
                                    <div>
                                      <div className="font-bold uppercase tracking-tight text-xs">{team.name}</div>
                                      <div className="text-[9px] text-muted font-mono">{team.productName}</div>
                                    </div>
                                  </div>
                                </td>
                                {state.phases.map(phase => {
                                  const phaseTotal = team.phaseScores[phase.id] || 0;
                                  return (
                                    <React.Fragment key={phase.id}>
                                      {phase.criteria.map(c => {
                                        const value = team.criteriaScores[c.id];
                                        return (
                                          <td
                                            key={c.id}
                                            className="p-4 text-center font-mono text-xs font-semibold"
                                            style={heatCellStyle(c.id, value)}
                                          >
                                            {value !== null && value !== undefined ? value.toFixed(2) : '-'}
                                          </td>
                                        );
                                      })}
                                      <td
                                        className={`p-4 text-center font-mono text-xs font-bold border-x border-border/60 ${
                                          showHeatmap ? '' : 'bg-slate-50/50'
                                        }`}
                                        style={heatCellStyle(`phase-${phase.id}`, phaseTotal)}
                                      >
                                        {phaseTotal.toFixed(2)}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                                <td
                                  className={`p-4 text-center font-mono font-black text-sm ${
                                    showHeatmap ? '' : 'bg-accent/5 text-accent'
                                  }`}
                                  style={heatCellStyle('finalScore', team.finalScore)}
                                >
                                  {(team.finalScore || 0).toFixed(2)}
                                </td>
                                <td className="p-4 text-center">
                                  <input 
                                    type="text"
                                    value={team.award || ''}
                                    onChange={(e) => updateTeam(team.id, { award: e.target.value })}
                                    className="w-full bg-white border border-ink/5 rounded px-2 py-1 text-[10px] font-bold outline-none focus:border-accent"
                                    placeholder="Assign Award..."
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            {activeTab === 'hackathon-leaderboard' && (() => {
              const hackathonPhase = state.phases.find(p => p.id === hackathonPhaseId);
              return (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex-1">
                      {isEditingHackathonInfo ? (
                        <div className="space-y-4 bg-white p-6 rounded-2xl border border-accent/20 shadow-xl shadow-accent/5 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Edit Event Details</h3>
                            <button 
                              onClick={() => setIsEditingHackathonInfo(false)}
                              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Event Name</label>
                              <input 
                                type="text" 
                                value={state.hackathonName}
                                onChange={(e) => setState(prev => ({ ...prev, hackathonName: e.target.value }))}
                                className="w-full input-field font-bold"
                                placeholder="e.g. BASE Playhouse Hackathon"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Subtitle / Category</label>
                              <input 
                                type="text" 
                                value={state.hackathonSubtitle}
                                onChange={(e) => setState(prev => ({ ...prev, hackathonSubtitle: e.target.value }))}
                                className="w-full input-field font-bold"
                                placeholder="e.g. Internal Innovation"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button 
                              onClick={() => setIsEditingHackathonInfo(false)}
                              className="btn-primary px-8"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="flex items-center gap-3">
                            {/* Never wraps — long event names scale down instead of stacking. */}
                            <h2 className="text-2xl md:text-3xl xl:text-4xl font-extrabold tracking-tight whitespace-nowrap">{state.hackathonName}</h2>
                            <button
                              onClick={() => setIsEditingHackathonInfo(true)}
                              className="shrink-0 p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-full transition-all text-accent"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                          {/* Only rendered when there is a subtitle — with the description line gone,
                              an empty subtitle would otherwise leave a blank pill floating here. */}
                          {state.hackathonSubtitle && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 uppercase tracking-widest text-[10px] px-3 py-1 whitespace-nowrap">
                                {state.hackathonSubtitle}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          setShowHackathonPresentation(true);
                        }}
                        className="btn-secondary flex items-center gap-2 bg-accent text-white border-none hover:bg-accent/90 shadow-lg shadow-accent/20"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Present Mode</span>
                      </button>
                      <button
                        onClick={() => copyPublicLink('present')}
                        className={`btn-secondary shrink-0 shadow-sm ${copiedId === 'public-present' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}`}
                        title="Copy a link to open this on another screen — no sign-in needed"
                      >
                        {copiedId === 'public-present' ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                        <span>{copiedId === 'public-present' ? 'Link Copied' : 'Share Screen Link'}</span>
                      </button>
                      <div className="relative flex-1 md:w-64">
                        <input 
                          type="text"
                          placeholder="Search teams..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="input-field pl-10"
                        />
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Top 3 Podium */}
                  {hackathonSortedTeams.length >= 3 && searchQuery === '' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-8">
                      {/* 2nd Place */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative group bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-400 rounded-2xl rotate-12 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200 group-hover:rotate-0 transition-transform">2</div>
                        <div className="mt-4 space-y-1">
                          <h3 className="font-black text-xl tracking-tighter uppercase leading-tight text-slate-800">{hackathonSortedTeams[1].name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[180px]">{hackathonSortedTeams[1].productName}</p>
                          {hackathonSortedTeams[1].award && (
                            <div className="mt-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                              {hackathonSortedTeams[1].award}
                            </div>
                          )}
                        </div>
                        <div className="my-6 py-4 border-y border-slate-100 w-full">
                          <div className="text-4xl font-black text-slate-900 tracking-tighter">{(hackathonSortedTeams[1].phaseScores[hackathonPhaseId] || 0).toFixed(2)}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Points</div>
                        </div>
                        <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">Runner Up</div>
                      </motion.div>

                      {/* 1st Place */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group bg-white border-2 border-accent/20 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl shadow-accent/10 hover:shadow-accent/20 transition-all duration-500 md:-translate-y-4"
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-accent rounded-2xl -rotate-12 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-accent/30 group-hover:rotate-0 transition-transform">
                          <Trophy size={24} />
                        </div>
                        <div className="mt-6 space-y-1">
                          <h3 className="font-black text-2xl tracking-tighter uppercase leading-tight text-accent">{hackathonSortedTeams[0].name}</h3>
                          <p className="text-[11px] font-bold text-accent/40 uppercase tracking-widest truncate max-w-[220px]">{hackathonSortedTeams[0].productName}</p>
                          {hackathonSortedTeams[0].award && (
                            <div className="mt-3 px-4 py-1.5 bg-accent/10 text-accent rounded-lg text-[11px] font-black uppercase tracking-widest border border-accent/20">
                              {hackathonSortedTeams[0].award}
                            </div>
                          )}
                        </div>
                        <div className="my-8 py-6 border-y border-accent/5 w-full bg-accent/[0.02] rounded-2xl">
                          <div className="text-6xl font-black text-accent tracking-tighter">{(hackathonSortedTeams[0].phaseScores[hackathonPhaseId] || 0).toFixed(2)}</div>
                          <div className="text-[10px] font-bold text-accent/40 uppercase tracking-widest mt-1">Grand Total Points</div>
                        </div>
                        <div className="px-6 py-2 bg-accent text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-accent/20">Winner</div>
                      </motion.div>

                      {/* 3rd Place */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-600 rounded-2xl -rotate-12 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-200 group-hover:rotate-0 transition-transform">3</div>
                        <div className="mt-4 space-y-1">
                          <h3 className="font-black text-xl tracking-tighter uppercase leading-tight text-slate-800">{hackathonSortedTeams[2].name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[180px]">{hackathonSortedTeams[2].productName}</p>
                          {hackathonSortedTeams[2].award && (
                            <div className="mt-2 px-3 py-1 bg-amber-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-700 border border-amber-100">
                              {hackathonSortedTeams[2].award}
                            </div>
                          )}
                        </div>
                        <div className="my-6 py-4 border-y border-slate-100 w-full">
                          <div className="text-4xl font-black text-slate-900 tracking-tighter">{(hackathonSortedTeams[2].phaseScores[hackathonPhaseId] || 0).toFixed(2)}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Points</div>
                        </div>
                        <div className="px-4 py-1.5 bg-amber-50 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-700">2nd Runner Up</div>
                      </motion.div>
                    </div>
                  )}

                  <div className="card">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-border">
                            <th className="p-4 text-center w-12">
                              <GitCompare size={14} className="text-muted mx-auto" />
                            </th>
                            <th className="p-4 text-center w-20">
                              <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Rank</div>
                            </th>
                            <th className="p-4">
                              <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Team</div>
                            </th>
                            {hackathonPhase?.criteria.map(c => (
                              <th key={c.id} className="p-4 text-center">
                                <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{c.name}</div>
                                <div className="text-[8px] opacity-50 font-bold uppercase tracking-tighter mt-0.5">Max: {c.maxScore}</div>
                              </th>
                            ))}
                            <th className="p-4 text-center bg-accent/5">
                            <div className="text-[10px] font-bold text-accent uppercase tracking-widest">{state.hackathonName} Score</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {hackathonSortedTeams
                            .filter(t => matchesTeamSearch(t))
                            .map((team, index) => (
                              <tr key={team.id} className="border-b border-border hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4 text-center">
                                  <input 
                                    type="checkbox"
                                    checked={selectedCompareTeamIds.includes(team.id)}
                                    onChange={() => toggleCompare(team.id)}
                                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent transition-all cursor-pointer"
                                  />
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-mono font-bold text-xs ${
                                    index === 0 ? 'bg-accent text-white' : 
                                    index === 1 ? 'bg-slate-200 text-slate-700' : 
                                    index === 2 ? 'bg-amber-100 text-amber-700' : 
                                    'bg-bg text-muted'
                                  }`}>
                                    {index + 1}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="font-black text-sm uppercase tracking-tight text-slate-800 leading-none">{team.name}</div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{team.productName}</div>
                                    {team.award && (
                                      <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 uppercase tracking-widest text-[8px] px-2 py-0">
                                        {team.award}
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                {hackathonPhase?.criteria.map(c => (
                                  <td key={c.id} className="p-4 text-center font-mono text-xs text-slate-500">
                                    {((team as any).criteriaScores[c.id] !== null) ? (team as any).criteriaScores[c.id].toFixed(2) : '-'}
                                  </td>
                                ))}
                                <td className="p-4 text-center bg-accent/[0.02]">
                                  <div className="text-2xl font-black text-accent tracking-tighter">
                                    {(team.phaseScores[hackathonPhaseId] || 0).toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'dashboard' && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="min-w-0">
                    {/* Never wraps — scales down on narrower viewports instead of stacking. */}
                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tighter italic uppercase whitespace-nowrap">Finalist Leaderboard</h2>
                    <p className="text-muted text-sm mt-2 font-medium">The ultimate ranking of innovation and execution</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={openAwardConfig}
                      className="btn-secondary shrink-0 shadow-sm bg-accent text-white border-none hover:bg-accent/90"
                    >
                      <Play className="w-4 h-4" /> Award Slides
                    </button>
                    <button
                      onClick={() => copyPublicLink('awards')}
                      className={`btn-secondary shrink-0 shadow-sm ${copiedId === 'public-awards' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}`}
                      title="Copy a link to open the award slides on another screen — no sign-in needed"
                    >
                      {copiedId === 'public-awards' ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                      {copiedId === 'public-awards' ? 'Link Copied' : 'Share Screen Link'}
                    </button>
                    <button
                      onClick={exportData}
                      className="btn-secondary shrink-0 shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>

                {/* Premium Winners Circle */}
                {/* No searchQuery condition: this tab has no search box, and searchQuery is shared
                    with the other tabs — a term typed elsewhere would silently hide the podium. */}
                {sortedTeams.length >= 3 && (
                  <div className="relative py-10">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent rounded-[3rem] -z-10" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                      {/* 2nd Place */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card-premium p-8 flex flex-col items-center text-center bg-white/80 backdrop-blur-sm"
                      >
                        <div className="absolute top-4 left-4 text-4xl font-black text-slate-100 italic px-4">02</div>
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl rotate-3 flex items-center justify-center text-slate-400 font-bold mb-6 shadow-inner">
                          <Trophy className="w-8 h-8" />
                        </div>
                        <h3 className="font-black text-xl leading-tight uppercase tracking-tighter mb-1">{sortedTeams[1].name}</h3>
                        <p className="text-xs text-muted font-bold uppercase tracking-widest mb-2">{sortedTeams[1].productName}</p>
                        {sortedTeams[1].award && (
                          <div className="mb-4 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                            {sortedTeams[1].award}
                          </div>
                        )}
                        <div className="text-4xl font-black text-slate-800 mb-4 italic px-2">{(sortedTeams[1].finalScore || 0).toFixed(2)}</div>
                        <div className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Runner Up</div>
                      </motion.div>

                      {/* 1st Place - The Grand Winner */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="card-premium p-12 flex flex-col items-center text-center bg-ink text-white border-gold shadow-2xl shadow-gold/20 scale-110 z-10"
                      >
                        <div className="absolute top-6 left-6 text-5xl font-black text-white/10 italic px-4">01</div>
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold" />
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-3xl" />
                        
                        <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-3xl rotate-6 flex items-center justify-center text-white mb-8 shadow-xl shadow-gold/30">
                          <Trophy className="w-12 h-12" />
                        </div>
                        
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-2">Grand Winner</div>
                        <h3 className="font-black text-3xl leading-none uppercase tracking-tighter mb-2">{sortedTeams[0].name}</h3>
                        <p className="text-sm text-white/50 font-bold uppercase tracking-widest mb-4">{sortedTeams[0].productName}</p>
                        {sortedTeams[0].award && (
                          <div className="mb-6 px-4 py-1.5 bg-gold/20 text-gold rounded-lg text-[11px] font-black uppercase tracking-widest border border-gold/30">
                            {sortedTeams[0].award}
                          </div>
                        )}
                        
                        <div className="relative">
                          <div className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gold-light to-gold px-6">
                            {(sortedTeams[0].finalScore || 0).toFixed(2)}
                          </div>
                        </div>
                      </motion.div>

                      {/* 3rd Place */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card-premium p-8 flex flex-col items-center text-center bg-white/80 backdrop-blur-sm"
                      >
                        <div className="absolute top-4 right-4 text-4xl font-black text-amber-50 italic px-4">03</div>
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl -rotate-3 flex items-center justify-center text-amber-600/40 font-bold mb-6 shadow-inner">
                          <Trophy className="w-8 h-8" />
                        </div>
                        <h3 className="font-black text-xl leading-tight uppercase tracking-tighter mb-1">{sortedTeams[2].name}</h3>
                        <p className="text-xs text-muted font-bold uppercase tracking-widest mb-2">{sortedTeams[2].productName}</p>
                        {sortedTeams[2].award && (
                          <div className="mb-4 px-3 py-1 bg-amber-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-700 border border-amber-100">
                            {sortedTeams[2].award}
                          </div>
                        )}
                        <div className="text-4xl font-black text-slate-800 mb-4 italic px-2">{(sortedTeams[2].finalScore || 0).toFixed(2)}</div>
                        <div className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">2nd Runner Up</div>
                      </motion.div>
                    </div>
                  </div>
                )}

                <div className="card-premium border-none shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="bg-ink text-white/40 border-b border-white/5">
                          <th className="p-6 text-center w-12">
                            <GitCompare size={14} className="mx-auto" />
                          </th>
                          <th className="p-6 text-center w-24">
                            <span className="text-[10px] font-black uppercase tracking-widest">Rank</span>
                          </th>
                          <th className="p-6">
                            <span className="text-[10px] font-black uppercase tracking-widest">Finalist Team</span>
                          </th>
                          {state.phases.map(phase => (
                            <th key={phase.id} className="p-6 text-center">
                              <span className="text-[10px] font-black uppercase tracking-widest">{phase.name}</span>
                              <div className="text-[8px] opacity-50 font-bold tracking-tighter">{phase.weight}% Weight</div>
                            </th>
                          ))}
                          <th className="p-6 text-center bg-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold">Final Score</span>
                          </th>
                          <th className="p-6 text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Judge & Mentor Status</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {/* Unfiltered for the same reason as the podium above. */}
                        {sortedTeams
                          .map((team, idx) => (
                          <tr key={team.id} className={`border-b border-border hover:bg-slate-50 transition-all group ${idx < 3 ? 'bg-gold/5' : ''}`}>
                            <td className="p-6 text-center">
                              <input 
                                type="checkbox"
                                checked={selectedCompareTeamIds.includes(team.id)}
                                onChange={() => toggleCompare(team.id)}
                                className="w-4 h-4 rounded border-border text-accent focus:ring-accent transition-all cursor-pointer"
                              />
                            </td>
                            <td className="p-6 text-center">
                              <div className={`text-xl font-black italic px-2 ${idx === 0 ? 'text-gold' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-slate-200'}`}>
                                {String(idx + 1).padStart(2, '0')}
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="font-black uppercase tracking-tighter text-lg leading-none mb-1 group-hover:text-accent transition-colors">{team.name}</div>
                              <div className="flex items-center gap-2">
                                <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{team.productName || 'Stealth Mode'}</div>
                                {team.award && (
                                  <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 uppercase tracking-widest text-[8px] px-2 py-0">
                                    {team.award}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            {state.phases.map(phase => (
                              <td key={phase.id} className="p-6 text-center font-mono text-sm font-bold text-slate-600">
                                {((team.phaseScores?.[phase.id] || 0) * ((phase.weight ?? 0) / 100)).toFixed(2)}
                              </td>
                            ))}
                            <td className="p-6 text-center bg-gold/5">
                              <span className="text-2xl font-black italic tracking-tighter text-ink px-2">
                                {(team.finalScore || 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-3">
                                {/* Judges */}
                                <div className="flex gap-1">
                                  {state.judges.map((judge) => {
                                    const decision = (team as any).judgeDecisions?.[judge.id];
                                    const hasScored = (team as any).scoredByJudgeIds?.includes(judge.id);
                                    
                                    let bgColor = 'bg-slate-100';
                                    let ringColor = 'ring-transparent';
                                    
                                    if (decision === 'pass') {
                                      bgColor = 'bg-emerald-500';
                                      ringColor = 'ring-emerald-500/20';
                                    } else if (decision === 'fail') {
                                      bgColor = 'bg-rose-500';
                                      ringColor = 'ring-rose-500/20';
                                    } else if (decision === 'not_sure') {
                                      bgColor = 'bg-amber-500';
                                      ringColor = 'ring-amber-500/20';
                                    } else if (hasScored) {
                                      bgColor = 'bg-blue-500';
                                      ringColor = 'ring-blue-500/20';
                                    }

                                    return (
                                      <div 
                                        key={judge.id} 
                                        className={`w-3 h-3 rounded-full ${bgColor} ring-4 ${ringColor} transition-all duration-500`}
                                        title={`Judge: ${judge.name}`}
                                      />
                                    );
                                  })}
                                </div>

                                {/* Mentors */}
                                {state.mentors && state.mentors.length > 0 && (
                                  <div className="flex gap-1 border-l border-border pl-3">
                                    {state.mentors.map((mentor) => {
                                      const hasScored = (team as any).scoredByMentorIds?.includes(mentor.id);
                                      
                                      let bgColor = hasScored ? 'bg-indigo-500' : 'bg-slate-100';
                                      let ringColor = hasScored ? 'ring-indigo-500/20' : 'ring-transparent';
                                      
                                      return (
                                        <div 
                                          key={mentor.id} 
                                          className={`w-3 h-3 rounded-full ${bgColor} ring-4 ${ringColor} transition-all duration-500`}
                                          title={`Mentor: ${mentor.name}`}
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {state.teams.length === 0 && (
                    <div className="p-20 text-center">
                      <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-muted font-medium">No teams added yet. Go to 'Teams' to add some.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'team-scoring-table' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-extrabold tracking-tight">Team Scoring Table</h2>
                    <p className="text-muted text-sm mt-2">Enter scores for all teams in a grid format</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="label-micro mb-0">Select Phase</span>
                      <select 
                        value={activeTablePhaseId || ''} 
                        onChange={(e) => {
                          const phaseId = e.target.value;
                          setActiveTablePhaseId(phaseId);
                          const phase = state.phases.find(p => p.id === phaseId);
                          if (phase?.type === 'judge' || phase?.type === 'mentor') {
                            setActiveTableJudgeId('all');
                          }
                        }}
                        className="bg-white border border-ink/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-ink/20 transition-all min-w-[150px]"
                      >
                        <option value="" disabled>Choose Phase</option>
                        {state.phases.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {activeTablePhaseId && (state.phases.find(p => p.id === activeTablePhaseId)?.type === 'judge' || state.phases.find(p => p.id === activeTablePhaseId)?.type === 'mentor') && (
                      <div className="flex flex-col gap-1.5">
                        <span className="label-micro mb-0">Select {state.phases.find(p => p.id === activeTablePhaseId)?.type === 'judge' ? 'Judge' : 'Mentor'}</span>
                        <select 
                          value={activeTableJudgeId || ''} 
                          onChange={(e) => setActiveTableJudgeId(e.target.value)}
                          className="bg-white border border-ink/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-ink/20 transition-all min-w-[150px]"
                        >
                          <option value="all">All {state.phases.find(p => p.id === activeTablePhaseId)?.type === 'judge' ? 'Judges' : 'Mentors'}</option>
                          {state.phases.find(p => p.id === activeTablePhaseId)?.type === 'judge' ? (
                            state.judges.map(j => (
                              <option key={j.id} value={j.id}>{j.name}</option>
                            ))
                          ) : (
                            state.mentors.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))
                          )}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {activeTablePhaseId ? (
                  <div className="card overflow-hidden">
                    {(() => {
                      const phase = state.phases.find(p => p.id === activeTablePhaseId);
                      if (!phase) return null;
                      const criteria = phase.criteria;
                      const isMultiJudge = (phase.type === 'judge' || phase.type === 'mentor') && (activeTableJudgeId === 'all' || !activeTableJudgeId);
                      const judgesToDisplay = isMultiJudge 
                        ? (phase.type === 'judge' ? state.judges : state.mentors)
                        : (phase.type === 'judge' 
                            ? state.judges.filter(j => j.id === activeTableJudgeId) 
                            : state.mentors.filter(m => m.id === activeTableJudgeId));
                      
                      return (
                        <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-200px)] border border-border rounded-lg">
                          <table className="w-full text-left border-separate border-spacing-0 min-w-max">
                            <thead>
                              {isMultiJudge ? (
                                <>
                                  <tr className="bg-slate-100">
                                    <th rowSpan={2} className="p-4 w-12 text-center border-r border-b border-border sticky left-0 top-0 bg-slate-100 z-50">
                                      <GitCompare size={14} className="text-muted mx-auto" />
                                    </th>
                                    <th rowSpan={2} className="p-4 w-16 text-center border-r border-b border-border sticky left-12 top-0 bg-slate-100 z-50">
                                      <span className="label-micro mb-0">#</span>
                                    </th>
                                    <th rowSpan={2} className="p-4 min-w-[200px] border-r border-b border-border sticky left-[112px] top-0 bg-slate-100 z-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                      <span className="label-micro mb-0">Team</span>
                                    </th>
                                    {judgesToDisplay.map(j => (
                                      <th key={j.id} colSpan={criteria.length + 2} className="p-2 text-center border-r border-b border-border bg-slate-50 sticky top-0 z-40">
                                        <div className="flex items-center justify-center gap-2">
                                          {phase.type === 'mentor' ? <Users2 size={14} className="text-muted" /> : <Gavel size={14} className="text-muted" />}
                                          <span className="text-[10px] font-black uppercase tracking-widest">{j.name}</span>
                                        </div>
                                      </th>
                                    ))}
                                    {/* Opaque rose rather than bg-accent/10: this column is sticky, so a
                                        translucent tint let the columns scrolling underneath show through. */}
                                    <th rowSpan={2} className="p-4 text-center bg-rose-100 w-24 border-b border-l border-border sticky right-0 top-0 z-50">
                                      <span className="label-micro mb-0 text-accent">Phase Total</span>
                                    </th>
                                  </tr>
                                  <tr className="bg-slate-50">
                                    {judgesToDisplay.map(j => (
                                      <React.Fragment key={j.id}>
                                        {criteria.map(c => (
                                          <th key={`${j.id}-${c.id}`} className="p-2 text-center min-w-[100px] border-r border-b border-border sticky top-[37px] bg-slate-50 z-40">
                                            <div className="flex flex-col items-center">
                                              <span className="text-[9px] font-bold uppercase truncate max-w-[80px]" title={c.name}>{c.name}</span>
                                              <span className="text-[8px] text-muted font-mono">Max: {c.maxScore}</span>
                                            </div>
                                          </th>
                                        ))}
                                        <th className="p-2 text-center bg-slate-100/50 w-20 border-r border-b border-border sticky top-[37px] z-40">
                                          <span className="text-[9px] font-black uppercase">Total</span>
                                        </th>
                                        <th className="p-2 text-center bg-slate-100/50 w-32 border-r border-b border-border sticky top-[37px] z-40">
                                          <span className="text-[9px] font-black uppercase">{phase.type === 'judge' ? 'Verdict' : 'Potential'}</span>
                                        </th>
                                      </React.Fragment>
                                    ))}
                                  </tr>
                                </>
                              ) : (
                                <tr className="bg-slate-50">
                                  <th className="p-4 w-12 text-center border-r border-b border-border sticky left-0 top-0 bg-slate-50 z-50">
                                    <GitCompare size={14} className="text-muted mx-auto" />
                                  </th>
                                  <th className="p-4 w-16 text-center border-r border-b border-border sticky left-12 top-0 bg-slate-50 z-50">
                                    <span className="label-micro mb-0">#</span>
                                  </th>
                                  <th className="p-4 min-w-[200px] border-r border-b border-border sticky left-[112px] top-0 bg-slate-50 z-50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                    <span className="label-micro mb-0">Team</span>
                                  </th>
                                  {criteria.map(c => (
                                    <th key={c.id} className="p-4 text-center min-w-[120px] border-b border-border sticky top-0 bg-slate-50 z-40">
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black uppercase">{c.name}</span>
                                        <span className="text-[9px] text-muted font-mono">Max: {c.maxScore}</span>
                                      </div>
                                    </th>
                                  ))}
                                  {/* Not sticky: the matching body cells are not either, and pinning
                                      both of these to right-0 stacked them on top of each other —
                                      the Total label was completely hidden behind Potential. */}
                                  <th className="p-4 text-center bg-slate-100 w-24 border-b border-l border-border sticky top-0 z-40">
                                    <span className="label-micro mb-0">Total</span>
                                  </th>
                                  <th className="p-4 text-center bg-slate-100 w-32 border-b border-border sticky top-0 z-40">
                                    <span className="label-micro mb-0">{phase.type === 'judge' ? 'Verdict' : 'Potential'}</span>
                                  </th>
                                  {/* The body always renders a Phase Total cell after the per-scorer
                                      columns; this header was missing, leaving the two out of step. */}
                                  <th className="p-4 text-center bg-rose-100 w-24 border-b border-l border-border sticky right-0 top-0 z-50">
                                    <span className="label-micro mb-0 text-accent">Phase Total</span>
                                  </th>
                                </tr>
                              )}
                            </thead>
                            <tbody>
                              {teamScores.map((team, idx) => {
                                return (
                                  <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 text-center border-r border-b border-border sticky left-0 bg-white z-20 group-hover:bg-slate-50 transition-colors">
                                      <input 
                                        type="checkbox"
                                        checked={selectedCompareTeamIds.includes(team.id)}
                                        onChange={() => toggleCompare(team.id)}
                                        className="w-4 h-4 rounded border-border text-accent focus:ring-accent transition-all cursor-pointer"
                                      />
                                    </td>
                                    <td className="p-4 text-center border-r border-b border-border font-mono text-xs text-muted sticky left-12 bg-white z-20 group-hover:bg-slate-50 transition-colors">
                                      {idx + 1}
                                    </td>
                                    <td className="p-4 border-r border-b border-border sticky left-[112px] bg-white z-10 group-hover:bg-slate-50 transition-colors shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                      <div className="font-bold uppercase tracking-tight text-xs">{team.name}</div>
                                      <div className="text-[9px] text-muted font-mono">{team.productName}</div>
                                    </td>
                                    {judgesToDisplay.map(judge => {
                                      const judgeId = judge.id;
                                      const judgeEntries = state.scores.filter(s => s.teamId === team.id && s.judgeId === judgeId && s.phaseId === phase.id);
                                      let judgeTotal = 0;
                                      
                                      // Check if mentor is assigned to this team
                                      const isMentor = phase.type === 'mentor';
                                      const mentor = isMentor ? (state.mentors || []).find(m => m.id === judgeId) : null;
                                      const isTeamAssigned = !isMentor || !mentor?.assignedTeamIds || mentor.assignedTeamIds.length === 0 || mentor.assignedTeamIds.includes(team.id);

                                      return (
                                        <React.Fragment key={judgeId}>
                                          {criteria.map(criterion => {
                                            const scoreObj = judgeEntries.find(s => s.criterionId === criterion.id);
                                            const scoreValue = scoreObj?.score;
                                            const hasSub = criterion.subCriteria && criterion.subCriteria.length > 0;
                                            
                                            // Check if mentor is assigned to this criterion
                                            const isCriterionAssigned = !isMentor || !mentor?.assignedCriteriaIds || mentor.assignedCriteriaIds.length === 0 || mentor.assignedCriteriaIds.includes(criterion.id);
                                            const isFullyAssigned = isTeamAssigned && isCriterionAssigned;

                                            if (scoreValue !== null) {
                                              judgeTotal += scoreValue || 0;
                                            }

                                            return (
                                              <td key={criterion.id} className={`p-4 border-r border-b border-border ${!isFullyAssigned ? 'bg-slate-50/50' : ''}`}>
                                                <div className="flex justify-center">
                                                  {!isFullyAssigned ? (
                                                    <div className="text-[8px] font-black uppercase text-muted/30 tracking-widest rotate-[-15deg] border border-dashed border-muted/20 px-2 py-1 rounded">
                                                      Not Assigned
                                                    </div>
                                                  ) : hasSub && criterion.subCriteria ? (
                                                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                                                      {criterion.subCriteria.map(sub => {
                                                        if (sub.type === 'numeric') {
                                                          const subVal = scoreObj?.subCriteriaValues?.[sub.id];
                                                          return (
                                                            <div key={sub.id} className="flex items-center justify-between gap-2">
                                                              <div className="flex-1 min-w-0">
                                                                <span className="text-[9px] font-bold uppercase text-muted truncate block" title={sub.name}>{sub.name}</span>
                                                                {sub.description && <span className="text-[8px] text-muted/60 block leading-tight">{sub.description}</span>}
                                                              </div>
                                                              <div className="flex items-center gap-1">
                                                                <input 
                                                                  type="number"
                                                                  placeholder="0"
                                                                  value={subVal ?? ''}
                                                                  onChange={(e) => {
                                                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                                                    const finalVal = val !== null ? clampScore(val, scorableMax(sub.score)) : null;
                                                                    const nextValues = { ...(scoreObj?.subCriteriaValues || {}) };
                                                                    if (finalVal === null) delete nextValues[sub.id];
                                                                    else nextValues[sub.id] = finalVal;
                                                                    
                                                                    const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                    const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                    const newScore = getEffectiveScore(tempEntry, criterion);
                                                                    updateScore(team.id, judgeId, criterion.id, newScore, phase.id, currentIds, nextValues);
                                                                  }}
                                                                  className="w-10 bg-white border border-ink/10 p-1 rounded font-mono text-center text-[10px] outline-none focus:border-accent transition-all"
                                                                />
                                                                <span className="text-[8px] text-muted font-mono">/{sub.score}</span>
                                                              </div>
                                                            </div>
                                                          );
                                                        } else {
                                                          const isMulti = (sub.score || 0) > 1;
                                                          const currentCount = scoreObj?.subCriteriaValues?.[sub.id] || 0;
                                                          const isCheckedSingle = scoreObj?.selectedSubCriteriaIds?.includes(sub.id);

                                                          return (
                                                            <div key={sub.id} className="flex flex-col gap-1">
                                                              <div className="flex items-center justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                  <span className="text-[9px] font-bold uppercase text-muted truncate block" title={sub.name}>{sub.name}</span>
                                                                  {sub.description && <span className="text-[8px] text-muted/60 block leading-tight">{sub.description}</span>}
                                                                </div>
                                                                <span className="text-[8px] text-muted font-mono">+{sub.score}</span>
                                                              </div>
                                                              <div className="flex flex-wrap gap-1">
                                                                {Array.from({ length: sub.score || 1 }).map((_, i) => {
                                                                  const isChecked = isMulti ? currentCount > i : isCheckedSingle;
                                                                  return (
                                                                    <button
                                                                      key={i}
                                                                      onClick={() => {
                                                                        if (isMulti) {
                                                                          const newCount = isChecked && currentCount === i + 1 ? i : i + 1;
                                                                          const nextValues = { ...(scoreObj?.subCriteriaValues || {}), [sub.id]: newCount };
                                                                          const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                          const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                          const newScore = getEffectiveScore(tempEntry, criterion);
                                                                          updateScore(team.id, judgeId, criterion.id, newScore, phase.id, currentIds, nextValues);
                                                                        } else {
                                                                          const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                          const newIds = isChecked 
                                                                            ? currentIds.filter(id => id !== sub.id)
                                                                            : [...currentIds, sub.id];
                                                                          const nextValues = scoreObj?.subCriteriaValues || {};
                                                                          const tempEntry = { ...scoreObj, selectedSubCriteriaIds: newIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                          const newScore = getEffectiveScore(tempEntry, criterion);
                                                                          updateScore(team.id, judgeId, criterion.id, newScore, phase.id, newIds, nextValues);
                                                                        }
                                                                      }}
                                                                      className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                                                                        isChecked 
                                                                          ? 'bg-ink border-ink text-accent shadow-sm' 
                                                                          : 'bg-white border-ink/10 hover:border-ink/20'
                                                                      }`}
                                                                    >
                                                                      {isChecked && <Check size={12} strokeWidth={4} />}
                                                                    </button>
                                                                  );
                                                                })}
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      })}
                                                    </div>
                                                  ) : (
                                                    <input 
                                                      type="number"
                                                      placeholder={scorableMax(criterion.maxScore) ? '-' : 'n/a'}
                                                      disabled={!scorableMax(criterion.maxScore)}
                                                      title={scorableMax(criterion.maxScore) ? undefined : `"${criterion.name}" has no Max Score, so it cannot be scored. Set one under Criteria.`}
                                                      value={scoreValue ?? ''}
                                                      onChange={(e) => {
                                                        const val = e.target.value === '' ? null : Number(e.target.value);
                                                        const finalVal = val !== null ? clampScore(val, scorableMax(criterion.maxScore)) : null;
                                                        updateScore(team.id, judgeId, criterion.id, finalVal, phase.id);
                                                      }}
                                                      className={`w-16 bg-white border p-2 rounded-lg font-mono text-center text-sm focus:border-ink/20 outline-none transition-all ${scoreValue == null ? 'border-red-200 bg-red-50/30' : 'border-ink/5'}`}
                                                    />
                                                  )}
                                                </div>
                                              </td>
                                            );
                                          })}
                                          <td className="p-4 text-center bg-slate-100/30 font-bold font-mono text-xs border-r border-b border-border">
                                            {judgeTotal.toFixed(2)}
                                          </td>
                                          <td className={`p-4 border-r border-b border-border ${!isTeamAssigned ? 'bg-slate-50/50' : ''}`}>
                                            <div className="flex justify-center gap-1">
                                              {!isTeamAssigned ? (
                                                <div className="text-[8px] font-black uppercase text-muted/30 tracking-widest border border-dashed border-muted/20 px-2 py-1 rounded">
                                                  Locked
                                                </div>
                                              ) : (phase.type === 'judge' ? [
                                                { id: 'pass', label: 'P', color: 'bg-emerald-500', activeColor: 'bg-emerald-500 text-white' },
                                                { id: 'fail', label: 'F', color: 'bg-rose-500', activeColor: 'bg-rose-500 text-white' },
                                                { id: 'not_sure', label: '?', color: 'bg-amber-500', activeColor: 'bg-amber-500 text-white' }
                                              ] : [
                                                { id: 'high', label: 'H', color: 'bg-emerald-500', activeColor: 'bg-emerald-500 text-white' },
                                                { id: 'medium', label: 'M', color: 'bg-amber-500', activeColor: 'bg-amber-500 text-white' },
                                                { id: 'low', label: 'L', color: 'bg-slate-400', activeColor: 'bg-slate-400 text-white' },
                                                { id: 'critical', label: 'C', color: 'bg-rose-500', activeColor: 'bg-rose-500 text-white' }
                                              ]).map(d => {
                                                const active = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === judgeId && dec.phaseId === phase.id)?.decision === d.id;
                                                return (
                                                    <button
                                                      key={d.id}
                                                      onClick={() => {
                                                        const currentDecision = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === judgeId && dec.phaseId === phase.id)?.decision;
                                                        updateDecision(team.id, judgeId, phase.id, currentDecision === d.id ? null : d.id as any);
                                                      }}
                                                      className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all border ${
                                                        active 
                                                          ? d.activeColor + ' border-transparent shadow-sm' 
                                                          : 'bg-white border-ink/5 text-muted hover:border-ink/20 hover:text-ink'
                                                      }`}
                                                      title={d.id}
                                                    >
                                                      {d.label}
                                                    </button>
                                                );
                                              })}
                                            </div>
                                          </td>
                                        </React.Fragment>
                                      );
                                    })}
                                    <td className="p-4 text-center bg-rose-50 sticky right-0 z-20 font-black font-mono text-sm text-accent group-hover:bg-rose-100 transition-colors border-b border-l border-border">
                                      {team.phaseScores[phase.id]?.toFixed(2) || '0.00'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 card border-dashed bg-transparent">
                    <Table size={48} className="opacity-10 mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs text-muted">Select a phase to start scoring</p>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'team-scoring' || activeTab === 'mentor-scoring') && (
                <div className="flex gap-8 h-[calc(100vh-120px)]">
                  {/* Left: Team List */}
                  <div className="w-80 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                      <h2 className="text-sm font-black uppercase italic tracking-widest text-muted">Teams</h2>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const currentIndex = teamScores.findIndex(t => t.id === selectedTeamId);
                            if (currentIndex > 0) setSelectedTeamId(teamScores[currentIndex - 1].id);
                          }}
                          disabled={!selectedTeamId || teamScores.findIndex(t => t.id === selectedTeamId) === 0}
                          className="p-1.5 rounded-lg border border-ink/10 hover:bg-white disabled:opacity-30 transition-all"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            const currentIndex = teamScores.findIndex(t => t.id === selectedTeamId);
                            if (currentIndex < teamScores.length - 1) setSelectedTeamId(teamScores[currentIndex + 1].id);
                          }}
                          disabled={!selectedTeamId || teamScores.findIndex(t => t.id === selectedTeamId) === teamScores.length - 1}
                          className="p-1.5 rounded-lg border border-ink/10 hover:bg-white disabled:opacity-30 transition-all"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar scroll-smooth">
                      {teamScores.map((team, idx) => {
                        const isSelected = selectedTeamId === team.id;
                        const relevantPhases = activeTab === 'mentor-scoring' ? (state.phases || []).filter(p => p.type === 'mentor') : (state.phases || []);
                        const teamScoresCount = (state.scores || []).filter(s => s.teamId === team.id && relevantPhases.some(p => p.id === s.phaseId)).length;
                        const totalPossibleScores = relevantPhases.reduce((acc, p) => {
                          const criteriaCount = p.criteria?.length || 0;
                          return acc + (p.type === 'judge' ? criteriaCount * (state.judges?.length || 0) : criteriaCount);
                        }, 0);
                        const progress = totalPossibleScores > 0 ? (teamScoresCount / totalPossibleScores) * 100 : 0;
                        const isDone = progress >= 100;

                        return (
                          <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all relative group overflow-hidden ${
                              isSelected 
                                ? 'bg-ink text-white border-ink shadow-xl shadow-ink/20' 
                                : 'bg-white border-ink/5 hover:border-ink/20 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start justify-between relative z-10">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold font-mono opacity-50 ${isSelected ? 'text-accent' : ''}`}>#{String(idx + 1).padStart(2, '0')}</span>
                                  {isDone && (
                                    <div className="bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                      <Check size={8} strokeWidth={4} />
                                    </div>
                                  )}
                                </div>
                                <h3 className="font-black uppercase italic tracking-tight truncate text-lg leading-none">{team.name}</h3>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 truncate ${isSelected ? 'text-white/40' : 'text-muted'}`}>
                                  {team.productName || 'No Product'}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-xl font-black font-mono leading-none ${isSelected ? 'text-accent' : 'text-ink'}`}>
                                  {team.finalScore.toFixed(2)}
                                </div>
                                <div className={`text-[9px] font-bold uppercase tracking-tighter mt-1 ${isSelected ? 'text-white/30' : 'text-muted'}`}>Total</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                            
                            {isSelected && (
                              <motion.div 
                                layoutId="active-team-bg"
                                className="absolute inset-0 bg-ink z-0"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Scoring Console */}
                  <div className="flex-1 bg-white rounded-[32px] border border-ink/5 shadow-sm flex flex-col overflow-hidden relative">
                      {selectedTeamId ? (
                        (() => {
                          const team = state.teams.find(t => t.id === selectedTeamId);
                          if (!team) return (
                            <div className="flex-1 flex items-center justify-center text-muted italic p-12 text-center">
                              Team not found.
                            </div>
                          );
                          
                          const relevantPhases = activeTab === 'mentor-scoring' ? state.phases.filter(p => p.type === 'mentor') : state.phases;
                          const activePhase = relevantPhases.find(p => p.id === activeScoringPhaseId) || relevantPhases[0];
                          
                          if (!activePhase) return (
                            <div className="flex-1 flex items-center justify-center text-muted italic p-12 text-center">
                              {activeTab === 'mentor-scoring' 
                                ? 'No System/Mentor phases defined. Please add a phase with type "System/Mentor" in the Scoring Structure tab.'
                                : 'No phases defined. Please add a phase in the Scoring Structure tab.'}
                            </div>
                          );
                          
                          return (
                            <>
                              {/* Console Header: Phase Tabs */}
                              <div className="px-8 pt-8 border-b border-ink/5 sticky top-0 bg-white z-20">
                                <div className="flex items-center justify-between mb-6">
                                  <div>
                                    <div className="flex items-center gap-3">
                                      <h2 className="text-2xl font-black uppercase italic tracking-tighter">{team.name}</h2>
                                      <Badge variant="default">{team.productName}</Badge>
                                    </div>
                                    <p className="text-muted font-bold text-[10px] uppercase tracking-widest mt-1">
                                      {activeTab === 'mentor-scoring' ? 'Mentor Scoring Console' : 'Scoring Console'}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Overall Progress</div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-32 h-1.5 bg-bg rounded-full overflow-hidden border border-ink/5">
                                          <div 
                                            className="h-full bg-emerald-500 transition-all duration-500" 
                                            style={{ width: `${((state.scores || []).filter(s => s.teamId === team.id && relevantPhases.some(p => p.id === s.phaseId)).length / relevantPhases.reduce((acc, p) => acc + (p.type === 'judge' ? (p.criteria?.length || 0) * (state.judges?.length || 0) : (p.criteria?.length || 0)), 0)) * 100}%` }} 
                                          />
                                        </div>
                                        <span className="text-[10px] font-bold font-mono text-ink/60">
                                          {Math.round(((state.scores || []).filter(s => s.teamId === team.id && relevantPhases.some(p => p.id === s.phaseId)).length / relevantPhases.reduce((acc, p) => acc + (p.type === 'judge' ? (p.criteria?.length || 0) * (state.judges?.length || 0) : (p.criteria?.length || 0)), 0)) * 100)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1">
                                    {relevantPhases.map(phase => {
                                      const isActive = activeScoringPhaseId === phase.id;
                                      const phaseScoresCount = (state.scores || []).filter(s => s.teamId === team.id && s.phaseId === phase.id).length;
                                      const totalPossible = phase.type === 'judge' ? (phase.criteria?.length || 0) * (state.judges?.length || 0) : (phase.criteria?.length || 0);
                                      const isDone = phaseScoresCount >= totalPossible;

                                    return (
                                      <button
                                        key={phase.id}
                                        onClick={() => setActiveScoringPhaseId(phase.id)}
                                        className={`px-6 py-3 rounded-t-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 relative ${
                                          isActive 
                                            ? 'bg-bg text-ink' 
                                            : 'text-muted hover:text-ink hover:bg-bg/50'
                                        }`}
                                      >
                                        {phase.name}
                                        {isDone && (
                                          <div className="bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                            <Check size={8} strokeWidth={4} />
                                          </div>
                                        )}
                                        {isActive && <motion.div layoutId="active-phase-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Console Body */}
                              <div className="flex-1 overflow-y-auto bg-bg p-8 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={`${selectedTeamId}-${activeScoringPhaseId}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-8"
                                  >
                                    {activePhase ? (
                                      <>
                                        {/* Phase Info & Judge Selector (if judge type) */}
                                        <div className="flex flex-col gap-6">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <div className="flex items-center gap-2 mb-2">
                                                <Badge variant={activePhase.type === 'judge' ? 'accent' : activePhase.type === 'mentor' ? 'warning' : 'success'}>
                                                  {activePhase.type === 'judge' ? 'Judge-Based' : activePhase.type === 'mentor' ? 'Mentor-Based' : 'System-Based'}
                                                </Badge>
                                                <Badge variant="default">Weight: {activePhase.weight}%</Badge>
                                              </div>
                                              <p className="text-muted text-sm max-w-2xl">
                                                {activePhase.type === 'judge' 
                                                  ? 'Scores are averaged across all judges. Each judge evaluates based on the criteria below.' 
                                                  : activePhase.type === 'mentor'
                                                    ? 'Scores are averaged across all mentors assigned to this team.'
                                                    : 'Scores are entered once for the entire team by the system or lead mentor.'}
                                              </p>
                                            </div>
                                          </div>

                                          {(activePhase.type === 'judge' || activePhase.type === 'mentor') && (
                                            <div className="space-y-3">
                                              <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-1">Select {activePhase.type === 'judge' ? 'Judge' : 'Mentor'}</div>
                                              <div className="flex flex-wrap gap-2">
                                                {(activePhase.type === 'judge' ? state.judges : (state.mentors || []).filter(m => !m.assignedTeamIds || m.assignedTeamIds.length === 0 || m.assignedTeamIds.includes(team.id))).map(person => {
                                                  const isActive = activeScoringJudgeId === person.id;
                                                  const scoresCount = state.scores.filter(s => s.teamId === team.id && s.phaseId === activePhase.id && s.judgeId === person.id).length;
                                                  const isDone = scoresCount >= activePhase.criteria.length;

                                                  return (
                                                    <button
                                                      key={person.id}
                                                      onClick={() => setActiveScoringJudgeId(person.id)}
                                                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                                                        isActive 
                                                          ? 'bg-ink text-white border-ink shadow-lg shadow-ink/10' 
                                                          : isDone
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                            : 'bg-white border-ink/5 text-muted hover:border-ink/20 hover:text-ink'
                                                      }`}
                                                    >
                                                      {activePhase.type === 'judge' ? <Gavel size={14} /> : <Users2 size={14} />}
                                                      {person.name}
                                                      {isDone && (
                                                        <div className={`rounded-full p-0.5 shadow-sm ${isActive ? 'bg-accent text-ink' : 'bg-emerald-500 text-white'}`}>
                                                          <Check size={8} strokeWidth={4} />
                                                        </div>
                                                      )}
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}

                                          {(activePhase.type === 'judge' || activePhase.type === 'mentor') && activeScoringJudgeId && (
                                            <div className="space-y-3">
                                              <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-1">{activePhase.type === 'judge' ? 'Verdict' : 'Potential'}</div>
                                              <div className="flex gap-2">
                                                {(activePhase.type === 'judge' ? [
                                                  { id: 'pass', label: 'Pass', icon: <Check size={14} />, color: 'bg-emerald-500 border-emerald-500' },
                                                  { id: 'fail', label: 'Fail', icon: <X size={14} />, color: 'bg-rose-500 border-rose-500' },
                                                  { id: 'not_sure', label: 'Not Sure', icon: <HelpCircle size={14} />, color: 'bg-amber-500 border-amber-500 text-white' }
                                                ] : [
                                                  { id: 'high', label: 'High', icon: <Check size={14} />, color: 'bg-emerald-500 border-emerald-500' },
                                                  { id: 'medium', label: 'Medium', icon: <HelpCircle size={14} />, color: 'bg-amber-500 border-amber-500 text-white' },
                                                  { id: 'low', label: 'Low', icon: <HelpCircle size={14} />, color: 'bg-slate-400 border-slate-400 text-white' },
                                                  { id: 'critical', label: 'Critical', icon: <X size={14} />, color: 'bg-rose-500 border-rose-500' }
                                                ]).map(d => {
                                                  const active = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === activeScoringJudgeId && dec.phaseId === activePhase.id)?.decision === d.id;
                                                  return (
                                                    <button 
                                                      key={d.id}
                                                      onClick={() => {
                                                        const currentDecision = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === activeScoringJudgeId && dec.phaseId === activePhase.id)?.decision;
                                                        updateDecision(team.id, activeScoringJudgeId, activePhase.id, currentDecision === d.id ? null : d.id as any);
                                                      }}
                                                      className={`px-6 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-sm border flex items-center gap-2 ${
                                                        active 
                                                          ? `${d.color} text-white`
                                                          : 'bg-white border-ink/5 text-muted hover:border-ink/20 hover:text-ink'
                                                      }`}
                                                    >
                                                      {d.icon}
                                                      {d.label}
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Criteria List */}
                                        <div className="grid grid-cols-1 gap-6">
                                          {activePhase.criteria.filter(c => {
                                            if (activePhase.type !== 'mentor' || !activeScoringJudgeId) return true;
                                            const mentor = (state.mentors || []).find(m => m.id === activeScoringJudgeId);
                                            return !mentor?.assignedCriteriaIds || mentor.assignedCriteriaIds.length === 0 || mentor.assignedCriteriaIds.includes(c.id);
                                          }).map(criterion => {
                                            const judgeId = activeScoringJudgeId;
                                            if (!judgeId) return null;

                                            const scoreObj = state.scores.find(s => 
                                              s.teamId === team.id && 
                                              s.phaseId === activePhase.id && 
                                              s.judgeId === judgeId && 
                                              s.criterionId === criterion.id
                                            );
                                            const scoreValue = scoreObj?.score ?? null;
                                            const isScored = scoreValue !== null || (scoreObj?.selectedSubCriteriaIds && scoreObj.selectedSubCriteriaIds.length > 0);

                                            return (
                                              <div key={criterion.id} className={`bg-white p-6 rounded-2xl border transition-all group relative ${isScored ? 'border-emerald-100 shadow-sm' : 'border-ink/5 shadow-sm hover:shadow-md'}`}>
                                                <div className="flex items-start justify-between mb-6">
                                                  <div className="flex-1 pr-8">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <h4 className="font-bold uppercase tracking-tight text-lg">{criterion.name}</h4>
                                                      <Badge variant="default">Max: {criterion.maxScore}</Badge>
                                                    </div>
                                                    <p className="text-muted text-xs leading-relaxed">{criterion.description || 'No description provided.'}</p>
                                                  </div>
                                                  <div className="text-right flex items-start gap-4">
                                                    {isScored && (
                                                      <div className="bg-emerald-500 text-white rounded-full p-1 shadow-sm mt-1">
                                                        <Check size={10} strokeWidth={4} />
                                                      </div>
                                                    )}
                                                    <div>
                                                      <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Weight</div>
                                                      <div className="text-lg font-black font-mono">{criterion.weight}%</div>
                                                    </div>
                                                  </div>
                                                </div>

                                                {criterion.subCriteria && criterion.subCriteria.length > 0 ? (
                                                  <div className="space-y-3 bg-bg/30 p-4 rounded-xl border border-ink/5">
                                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Select Sub-Criteria</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                      {criterion.subCriteria.map(sub => (
                                                        <div 
                                                          key={sub.id} 
                                                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                                            sub.type === 'numeric'
                                                              ? 'bg-white border-ink/5'
                                                              : scoreObj?.selectedSubCriteriaIds?.includes(sub.id)
                                                                ? 'bg-white border-ink/20 shadow-sm'
                                                                : 'bg-transparent border-transparent hover:bg-white/50'
                                                          }`}
                                                        >
                                                          {sub.type === 'numeric' ? (
                                                            <div className="flex items-center gap-3 flex-1">
                                                              <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-bold truncate">{sub.name}</div>
                                                                {sub.description && <div className="text-[9px] text-muted leading-tight mt-0.5">{sub.description}</div>}
                                                                <div className="text-[10px] text-muted font-mono mt-1">Max: {sub.score} pts</div>
                                                              </div>
                                                              <input 
                                                                type="number"
                                                                value={scoreObj?.subCriteriaValues?.[sub.id] ?? ''}
                                                                onChange={(e) => {
                                                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                                                  const finalVal = val !== null ? clampScore(val, scorableMax(sub.score)) : null;
                                                                  const nextValues = { ...(scoreObj?.subCriteriaValues || {}) };
                                                                  if (finalVal === null) delete nextValues[sub.id];
                                                                  else nextValues[sub.id] = finalVal;
                                                                  
                                                                  const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                  const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                  const newScore = getEffectiveScore(tempEntry, criterion);
                                                                  updateScore(team.id, judgeId, criterion.id, newScore, activePhase.id, currentIds, nextValues);
                                                                }}
                                                                className="w-16 bg-white border border-ink/10 rounded-lg px-2 py-1 text-sm font-mono text-center focus:border-ink/20 outline-none"
                                                                placeholder="0"
                                                              />
                                                            </div>
                                                          ) : (
                                                            <div className="flex flex-col gap-2 flex-1">
                                                              <div className="flex items-center justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                  <div className="text-xs font-bold truncate">{sub.name}</div>
                                                                  {sub.description && <div className="text-[9px] text-muted leading-tight mt-0.5">{sub.description}</div>}
                                                                  <div className="text-[10px] text-muted font-mono mt-1">+{sub.score} pts</div>
                                                                </div>
                                                              </div>
                                                              <div className="flex flex-wrap gap-1.5">
                                                                {Array.from({ length: sub.score || 1 }).map((_, i) => {
                                                                  const isChecked = (sub.score || 0) > 1 
                                                                    ? (scoreObj?.subCriteriaValues?.[sub.id] || 0) > i
                                                                    : scoreObj?.selectedSubCriteriaIds?.includes(sub.id);
                                                                  
                                                                  return (
                                                                    <button 
                                                                      key={i}
                                                                      onClick={() => {
                                                                        if ((sub.score || 0) > 1) {
                                                                          const currentCount = scoreObj?.subCriteriaValues?.[sub.id] || 0;
                                                                          const newCount = isChecked && currentCount === i + 1 ? i : i + 1;
                                                                          
                                                                          const nextValues = { ...(scoreObj?.subCriteriaValues || {}), [sub.id]: newCount };
                                                                          const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                          const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                          const newScore = getEffectiveScore(tempEntry, criterion);
                                                                          updateScore(team.id, judgeId, criterion.id, newScore, activePhase.id, currentIds, nextValues);
                                                                        } else {
                                                                          const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                          const newIds = isChecked 
                                                                            ? currentIds.filter(id => id !== sub.id)
                                                                            : [...currentIds, sub.id];
                                                                          const nextValues = scoreObj?.subCriteriaValues || {};
                                                                          const tempEntry = { ...scoreObj, selectedSubCriteriaIds: newIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                          const newScore = getEffectiveScore(tempEntry, criterion);
                                                                          updateScore(team.id, judgeId, criterion.id, newScore, activePhase.id, newIds, nextValues);
                                                                        }
                                                                      }}
                                                                      className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${
                                                                        isChecked 
                                                                          ? 'bg-ink border-ink text-accent shadow-lg shadow-ink/20 scale-105 z-10' 
                                                                          : 'bg-white border-ink/10 hover:border-ink/30 hover:bg-slate-50'
                                                                      }`}
                                                                    >
                                                                      {isChecked && <Check size={18} strokeWidth={4} />}
                                                                    </button>
                                                                  );
                                                                })}
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                    <div className="pt-3 mt-3 border-t border-ink/5 flex justify-between items-center">
                                                      <span className="text-[10px] font-bold uppercase text-muted">Calculated Total</span>
                                                      <span className="text-xl font-black font-mono text-ink">{(getEffectiveScore(scoreObj, criterion) || 0).toFixed(2)}</span>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="space-y-4">
                                                    {/* Quick Score Buttons for small ranges */}
                                                    {criterion.maxScore && criterion.maxScore <= 10 && (
                                                      <div className="flex flex-wrap gap-1.5">
                                                        {Array.from({ length: criterion.maxScore + 1 }).map((_, i) => (
                                                          <button
                                                            key={i}
                                                            onClick={() => updateScore(team.id, judgeId, criterion.id, i, activePhase.id)}
                                                            className={`w-10 h-10 rounded-lg font-mono font-bold text-sm transition-all ${
                                                              scoreValue === i 
                                                                ? 'bg-ink text-accent shadow-lg shadow-ink/20 scale-110 z-10' 
                                                                : 'bg-white border border-ink/5 text-muted hover:border-ink/20 hover:text-ink'
                                                            }`}
                                                          >
                                                            {i}
                                                          </button>
                                                        ))}
                                                      </div>
                                                    )}

                                                    {/* Manual Input */}
                                                    <div className="relative max-w-[200px]">
                                                      <input 
                                                        type="number"
                                                        placeholder={scorableMax(criterion.maxScore) ? 'Score' : 'n/a'}
                                                        disabled={!scorableMax(criterion.maxScore)}
                                                        title={scorableMax(criterion.maxScore) ? undefined : `"${criterion.name}" has no Max Score, so it cannot be scored. Set one under Criteria.`}
                                                        value={scoreValue ?? ''}
                                                        onChange={(e) => {
                                                          const val = e.target.value === '' ? null : Number(e.target.value);
                                                          const finalVal = val !== null ? clampScore(val, scorableMax(criterion.maxScore)) : null;
                                                          updateScore(team.id, judgeId, criterion.id, finalVal, activePhase.id);
                                                        }}
                                                        className={`w-full bg-white border p-4 rounded-xl font-mono text-2xl font-black focus:border-ink/20 outline-none transition-all ${
                                                          scoreValue == null ? 'border-red-200 bg-red-50/30' : 'border-ink/5'
                                                        }`}
                                                      />
                                                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/30">
                                                        / {criterion.maxScore}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-64 text-muted">
                                        <ClipboardList size={48} className="opacity-10 mb-4" />
                                        <p className="font-bold uppercase tracking-widest text-xs">Select a phase to start scoring</p>
                                      </div>
                                    )}
                                  </motion.div>
                                </AnimatePresence>
                              </div>

                              {/* Console Footer */}
                              <div className="px-8 py-6 border-t border-ink/5 bg-white flex items-center justify-between sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => {
                                      const currentIndex = (teamScores || []).findIndex(t => t.id === selectedTeamId);
                                      if (currentIndex > 0) setSelectedTeamId(teamScores[currentIndex - 1].id);
                                    }}
                                    disabled={(teamScores || []).findIndex(t => t.id === selectedTeamId) === 0}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ink/10 text-[10px] font-bold uppercase tracking-widest hover:bg-bg disabled:opacity-30 transition-all"
                                  >
                                    <ChevronLeft size={14} /> Prev Team
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const currentIndex = (teamScores || []).findIndex(t => t.id === selectedTeamId);
                                      if (currentIndex < (teamScores || []).length - 1) setSelectedTeamId(teamScores[currentIndex + 1].id);
                                    }}
                                    disabled={(teamScores || []).findIndex(t => t.id === selectedTeamId) === (teamScores || []).length - 1}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-ink/80 disabled:opacity-30 transition-all shadow-md shadow-ink/10"
                                  >
                                    Next Team <ChevronRight size={14} />
                                  </button>
                                </div>
                                
                                <div className="flex items-center gap-8">
                                  <div className="text-right">
                                    <div className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">{activePhase.name} Score</div>
                                    <div className="text-lg font-black font-mono text-ink">
                                      {(() => {
                                        const teamScore = teamScores.find(t => t.id === team.id);
                                        const phaseScore = teamScore?.phaseScores[activePhase.id] || 0;
                                        return (phaseScore * ((activePhase.weight ?? 0) / 100)).toFixed(2);
                                      })()}
                                    </div>
                                  </div>
                                  <div className="w-px h-8 bg-ink/5" />
                                  <div className="text-right">
                                    <div className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Total Score</div>
                                    <div className="text-3xl font-black font-mono text-accent leading-none">{((team as any).finalScore || 0).toFixed(2)}</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted p-12 text-center">
                          <div className="w-24 h-24 bg-bg rounded-full flex items-center justify-center mb-6">
                            <Users size={40} className="opacity-20" />
                          </div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter text-ink mb-2">No Team Selected</h3>
                          <p className="text-sm max-w-xs mx-auto">Select a team from the list on the left to begin the scoring process.</p>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {activeTab === 'criteria' && (
                <div className="space-y-12">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight">Criteria & Weights</h2>
                      <p className="text-muted text-sm mt-1">Configure scoring weights and evaluation criteria</p>
                    </div>
                    <button
                      onClick={addPhase}
                      className="btn-primary"
                    >
                      <Plus size={18} /> Add New Phase
                    </button>
                  </div>

                  {/* Configuration that makes the scoring code quietly ignore things. Surfaced here
                      because the symptom otherwise shows up as a wrong total, far from the cause. */}
                  {(misconfiguredCriteria.length > 0 || phaseWeightIssues.length > 0 || (state.phases?.length > 0 && Math.round(totalPhaseWeight) !== 100)) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <HelpCircle size={18} className="text-amber-600 shrink-0" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-700">
                          Configuration affects the scores
                        </h3>
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-800/90 list-disc pl-5">
                        {state.phases?.length > 0 && Math.round(totalPhaseWeight) !== 100 && (
                          <li>
                            Phase weights add up to <span className="font-mono font-bold">{totalPhaseWeight}%</span>, not 100% —
                            a perfect team can only reach {totalPhaseWeight} of 100 on the final score.
                          </li>
                        )}
                        {phaseWeightIssues.map(p => (
                          <li key={p.name}>
                            <span className="font-bold">{p.name}</span>: criterion weights add up to{' '}
                            <span className="font-mono font-bold">{p.total}%</span>, not 100%.
                          </li>
                        ))}
                        {misconfiguredCriteria.map((issue, i) => (
                          <li key={`${issue.criterion}-${i}`}>
                            <span className="font-bold">{issue.phase} › {issue.criterion}</span>: {issue.problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Phase Weights */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Settings2 size={20} className="text-muted" />
                      <h3 className="text-xl font-bold uppercase tracking-tight">Phase Weights</h3>
                    </div>
                    <Reorder.Group 
                      axis="x" 
                      values={state.phases || []} 
                      onReorder={(newPhases) => setState(prev => ({ ...prev, phases: newPhases }))}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {(state.phases || []).map(phase => (
                        <Reorder.Item 
                          key={phase.id} 
                          value={phase}
                          className="card p-6 space-y-4 group relative cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <GripVertical size={16} className="text-muted cursor-grab" />
                              <label className="label-micro">Phase Name</label>
                            </div>
                            <button 
                              onClick={() => deletePhase(phase.id)}
                              className="p-1 text-red-400 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <input 
                              value={phase.name}
                              onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                              className="input-field font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="label-micro">Scoring Type</label>
                              <select 
                                value={phase.type}
                                onChange={(e) => updatePhase(phase.id, { type: e.target.value as 'judge' | 'mentor' })}
                                className="input-field text-xs"
                              >
                                <option value="mentor">Mentor-based (Score per assigned mentor)</option>
                                <option value="judge">Judge-based (Score per judge)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="label-micro">Weight (%)</label>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="number"
                                  value={phase.weight ?? ''}
                                  onChange={(e) => updatePhase(phase.id, { weight: e.target.value === '' ? null : Number(e.target.value) })}
                                  className={`input-field font-mono w-full ${phase.weight == null ? 'border-red-500 bg-red-50' : ''}`}
                                />
                              </div>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    <div className={`mt-4 text-[10px] font-mono uppercase font-bold ${(state.phases || []).reduce((sum, p) => sum + (p.weight || 0), 0) === 100 ? 'text-green-600' : 'text-accent'}`}>
                      Total: {(state.phases || []).reduce((sum, p) => sum + (p.weight || 0), 0)}% {(state.phases || []).reduce((sum, p) => sum + (p.weight || 0), 0) !== 100 && '(Must be 100%)'}
                    </div>
                  </div>

                  {/* Criteria for each phase */}
                  {(state.phases || []).map(phase => (
                    <div key={phase.id} className="space-y-6 pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Trophy size={20} className="text-muted" />
                          <button 
                            onClick={() => togglePhaseSectionCollapse(phase.id)}
                            className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                          >
                            <h3 className="text-xl font-bold uppercase tracking-tight">{phase.name} Criteria</h3>
                            {collapsedPhaseSections[phase.id] ? <ChevronDown size={18} className="text-muted" /> : <ChevronUp size={18} className="text-muted" />}
                          </button>
                        </div>
                        <button 
                          onClick={() => addCriterion(phase.id)}
                          className="btn-secondary py-2"
                        >
                          <Plus size={14} /> Add Criterion
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {!collapsedPhaseSections[phase.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-6"
                          >
                            <Reorder.Group 
                              axis="y" 
                              values={phase.criteria || []} 
                              onReorder={(newCriteria) => setState(prev => ({
                                ...prev,
                                phases: (prev.phases || []).map(p => p.id === phase.id ? { ...p, criteria: newCriteria } : p)
                              }))}
                              className="grid grid-cols-1 gap-4"
                            >
                              {(phase.criteria || []).map(c => (
                                <Reorder.Item 
                                  key={c.id} 
                                  value={c}
                                  className="card p-6 space-y-6 group cursor-grab active:cursor-grabbing"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-[40px_1fr_120px_120px_40px] gap-6 items-start">
                                    <div className="pt-8 flex justify-center items-center gap-2">
                                      <GripVertical size={20} className="text-muted cursor-grab" />
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleCriterionCollapse(c.id);
                                        }}
                                        className="p-1 hover:bg-slate-100 rounded transition-colors text-muted"
                                      >
                                        {collapsedCriteria[c.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                      </button>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="label-micro">Criterion Name</label>
                                      <input 
                                        value={c.name}
                                        onChange={(e) => updateCriterion(phase.id, c.id, { name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., Technical Implementation"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="label-micro">Max Score</label>
                                      <input 
                                        type="number"
                                        value={c.maxScore ?? ''}
                                        onChange={(e) => updateCriterion(phase.id, c.id, { maxScore: e.target.value === '' ? null : Number(e.target.value) })}
                                        readOnly={c.subCriteria && c.subCriteria.length > 0}
                                        className={`input-field font-mono ${c.subCriteria && c.subCriteria.length > 0 ? 'bg-slate-50 text-ink/50 cursor-not-allowed border-blue-200' : ''} ${c.maxScore == null ? 'border-red-500 bg-red-50' : ''}`}
                                      />
                                      {c.subCriteria && c.subCriteria.length > 0 && (
                                        <div className="text-[9px] text-blue-600 font-bold uppercase mt-1">Calculated from sub-criteria</div>
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <label className="label-micro">Weight (%)</label>
                                      <input 
                                        type="number"
                                        value={c.weight ?? ''}
                                        onChange={(e) => updateCriterion(phase.id, c.id, { weight: e.target.value === '' ? null : Number(e.target.value) })}
                                        className={`input-field font-mono ${c.weight == null ? 'border-red-500 bg-red-50' : ''}`}
                                      />
                                    </div>
                                    <div className="pt-8 text-right">
                                      <button 
                                        onClick={() => deleteCriterion(phase.id, c.id)}
                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </div>
                                  <AnimatePresence initial={false}>
                                    {!collapsedCriteria[c.id] && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-6"
                                      >
                                        <div className="space-y-2">
                                          <label className="label-micro">Description</label>
                                          <textarea 
                                            value={c.description || ''}
                                            onChange={(e) => updateCriterion(phase.id, c.id, { description: e.target.value })}
                                            className="input-field min-h-[60px] resize-none"
                                            placeholder="Describe what this criterion evaluates..."
                                          />
                                        </div>

                                        {/* Sub-Criteria Section */}
                                        <div className="pt-4 border-t border-slate-50 space-y-4">
                                          <div className="flex justify-between items-center">
                                            <label className="label-micro text-ink">Sub-Criteria (Checklist Scoring)</label>
                                            <button 
                                              onClick={() => addSubCriterion(phase.id, c.id)}
                                              className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                              <Plus size={12} /> Add Sub-Criterion
                                            </button>
                                          </div>
                                          <div className="grid grid-cols-1 gap-2">
                                            {c.subCriteria?.map(sub => (
                                              <div key={sub.id} className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 group/sub">
                                                <div className="flex-1 space-y-2">
                                                  <input 
                                                    value={sub.name}
                                                    onChange={(e) => updateSubCriterion(phase.id, c.id, sub.id, { name: e.target.value })}
                                                    className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full p-0"
                                                    placeholder="Sub-criterion name"
                                                  />
                                                  <input 
                                                    value={sub.description || ''}
                                                    onChange={(e) => updateSubCriterion(phase.id, c.id, sub.id, { description: e.target.value })}
                                                    className="bg-transparent border-none focus:ring-0 text-[10px] text-muted w-full p-0"
                                                    placeholder="Add description..."
                                                  />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <select 
                                                    value={sub.type || 'checkbox'}
                                                    onChange={(e) => updateSubCriterion(phase.id, c.id, sub.id, { type: e.target.value as any })}
                                                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold uppercase outline-none focus:border-ink/20"
                                                  >
                                                    <option value="checkbox">Checkbox</option>
                                                    <option value="numeric">Numeric</option>
                                                  </select>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <label className="text-[10px] font-bold uppercase text-muted">
                                                    {sub.type === 'numeric' ? 'Max' : 'Points'}
                                                  </label>
                                                  <input 
                                                    type="number"
                                                    value={sub.score ?? ''}
                                                    onChange={(e) => updateSubCriterion(phase.id, c.id, sub.id, { score: e.target.value === '' ? null : Number(e.target.value) })}
                                                    className={`w-16 bg-white border rounded-lg px-2 py-1 text-xs font-mono text-center ${sub.score == null ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                                  />
                                                </div>
                                                <button 
                                                  onClick={() => deleteSubCriterion(phase.id, c.id, sub.id)}
                                                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                                >
                                                  <Trash2 size={12} />
                                                </button>
                                              </div>
                                            ))}
                                            {(!c.subCriteria || c.subCriteria.length === 0) && (
                                              <div className="text-[10px] text-muted italic">No sub-criteria. Standard numerical scoring will be used.</div>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Reorder.Item>
                              ))}
                            </Reorder.Group>
                            {phase.criteria.length === 0 && (
                              <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-2xl text-muted text-xs uppercase font-bold">
                                No criteria defined for {phase.name} phase
                              </div>
                            )}
                            <div className={`text-[10px] font-mono uppercase font-bold ${phase.criteria.reduce((sum, c) => sum + (c.weight ?? 0), 0) === 100 ? 'text-green-600' : 'text-accent'}`}>
                              {phase.name} Weight Total: {phase.criteria.reduce((sum, c) => sum + (c.weight ?? 0), 0)}%
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'teams' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight">Team Management</h2>
                      <p className="text-muted text-sm mt-1">Add and manage competing teams</p>
                    </div>
                    <button 
                      onClick={addTeam}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                      Add New Team
                    </button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted w-24">Order</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Team Details</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Product / Idea</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Assigned Mentors</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                          </tr>
                        </thead>
                        <Reorder.Group 
                          as="tbody" 
                          axis="y" 
                          values={state.teams} 
                          onReorder={reorderTeams}
                          className="divide-y divide-slate-100"
                        >
                          {state.teams.map((team, idx) => (
                            <Reorder.Item 
                              key={team.id} 
                              value={team} 
                              as="tr"
                              className="hover:bg-slate-50/50 transition-colors group cursor-default"
                            >
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <div className="cursor-grab active:cursor-grabbing p-1 text-muted hover:text-ink transition-colors">
                                    <GripVertical size={16} />
                                  </div>
                                  <TeamOrderInput 
                                    id={team.id}
                                    initialValue={idx + 1}
                                    onMove={moveTeam}
                                  />
                                </div>
                              </td>
                              <td className="p-4 align-top max-w-[300px]">
                                <input 
                                  value={team.name}
                                  onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                                  className="w-full font-bold uppercase text-sm tracking-tight bg-transparent border-b border-transparent focus:border-ink/20 outline-none"
                                  placeholder="Team Name"
                                />
                                <input 
                                  value={team.tagline}
                                  onChange={(e) => updateTeam(team.id, { tagline: e.target.value })}
                                  className="w-full text-xs italic text-muted mt-1 bg-transparent border-b border-transparent focus:border-ink/20 outline-none"
                                  placeholder="Add a tagline..."
                                />
                              </td>
                              <td className="p-4 align-top">
                                <input 
                                  value={team.productName}
                                  onChange={(e) => updateTeam(team.id, { productName: e.target.value })}
                                  className="w-full font-mono text-xs bg-transparent border-b border-transparent focus:border-ink/20 outline-none mb-1"
                                  placeholder="Product Name"
                                />
                                <textarea 
                                  value={team.ideaDetail}
                                  onChange={(e) => updateTeam(team.id, { ideaDetail: e.target.value })}
                                  className="w-full text-xs text-muted bg-transparent border border-transparent focus:border-slate-200 focus:bg-white p-1 rounded outline-none min-h-[40px] resize-none"
                                  placeholder="Brief idea description..."
                                />
                              </td>
                              <td className="p-4 align-top">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {state.mentors.map(mentor => {
                                    const isAssigned = team.mentorIds?.includes(mentor.id);
                                    return (
                                      <button
                                        key={mentor.id}
                                        onClick={() => {
                                          const currentIds = team.mentorIds || [];
                                          const nextIds = isAssigned 
                                            ? currentIds.filter(id => id !== mentor.id)
                                            : [...currentIds, mentor.id];
                                          updateTeam(team.id, { mentorIds: nextIds });
                                        }}
                                        className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                                          isAssigned 
                                            ? 'bg-ink text-accent' 
                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                        }`}
                                      >
                                        {mentor.name}
                                      </button>
                                    );
                                  })}
                                  {state.mentors.length === 0 && (
                                    <span className="text-[10px] text-muted italic">No mentors defined</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 align-top text-right">
                                <button 
                                  onClick={() => deleteTeam(team.id)}
                                  className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                        {state.teams.length === 0 && (
                          <tbody>
                            <tr>
                              <td colSpan={5} className="p-12 text-center text-muted/40 uppercase font-bold text-sm">
                                <Users size={48} className="mx-auto mb-4 opacity-10" />
                                No teams added yet
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'judges' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight">Judge Management</h2>
                      <p className="text-muted text-sm mt-1">Add and manage hackathon judges</p>
                    </div>
                    <button 
                      onClick={addJudge}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                      Add New Judge
                    </button>
                  </div>

                  <div className="card overflow-hidden max-w-5xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Judge Name</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted w-32">Weight</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(state.judges || []).map((judge, idx) => (
                            <tr key={judge.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-muted">J{idx + 1}</div>
                                  <input 
                                    value={judge.name}
                                    onChange={(e) => updateJudge(judge.id, { name: e.target.value })}
                                    className="flex-1 font-bold uppercase text-sm tracking-tight bg-transparent border-b border-transparent focus:border-ink/20 outline-none"
                                    placeholder="Judge Name"
                                  />
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number"
                                    value={judge.weight || ''}
                                    onChange={(e) => updateJudge(judge.id, { weight: e.target.value === '' ? null : Number(e.target.value) })}
                                    className="w-full font-mono text-sm bg-slate-50 border border-transparent focus:border-ink/10 focus:bg-white rounded px-2 py-1 outline-none"
                                    placeholder="1"
                                  />
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(sharedScoringUrl(state.id, 'judge', judge.id));
                                      setCopiedId(judge.id);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className={`p-2 rounded-lg transition-all ${copiedId === judge.id ? 'bg-green-50 text-green-500' : 'hover:bg-blue-50 text-blue-400'}`}
                                    title="Copy Scoring Link"
                                  >
                                    {copiedId === judge.id ? <Check size={14} /> : <LinkIcon size={14} />}
                                  </button>
                                  <button 
                                    onClick={() => deleteJudge(judge.id)}
                                    className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                                    title="Delete Judge"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {(state.judges || []).length === 0 && (
                            <tr>
                              <td colSpan={3} className="p-12 text-center text-muted/40 uppercase font-bold text-sm">
                                <Users size={48} className="mx-auto mb-4 opacity-10" />
                                No judges added yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mentors' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight">Mentor Management</h2>
                      <p className="text-muted text-sm mt-1">Add and manage hackathon mentors</p>
                    </div>
                    <button 
                      onClick={addMentor}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                      Add New Mentor
                    </button>
                  </div>

                  <div className="card overflow-hidden max-w-5xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Mentor Name</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Assigned Criteria</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted">Assigned Teams</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(state.mentors || []).map((mentor, idx) => (
                            <tr key={mentor.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="p-4 align-top">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-muted shrink-0">M{idx + 1}</div>
                                  <input 
                                    value={mentor.name}
                                    onChange={(e) => updateMentor(mentor.id, { name: e.target.value })}
                                    className="flex-1 font-bold uppercase text-sm tracking-tight bg-transparent border-b border-transparent focus:border-ink/20 outline-none py-1"
                                    placeholder="Mentor Name"
                                  />
                                </div>
                              </td>
                              <td className="p-4 align-top">
                                <div className="space-y-3 max-w-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase text-muted/40 tracking-widest">Criteria Assignment</span>
                                    {state.phases.filter(p => p.type === 'mentor').flatMap(p => p.criteria).length > 0 && (
                                      <button 
                                        onClick={() => {
                                          const allIds = state.phases.filter(p => p.type === 'mentor').flatMap(p => p.criteria.map(c => c.id));
                                          const isAll = mentor.assignedCriteriaIds?.length === allIds.length;
                                          updateMentor(mentor.id, { assignedCriteriaIds: isAll ? [] : allIds });
                                        }}
                                        className="text-[8px] font-bold uppercase text-accent hover:opacity-70 transition-opacity"
                                      >
                                        {mentor.assignedCriteriaIds?.length === state.phases.filter(p => p.type === 'mentor').flatMap(p => p.criteria).length ? 'Clear All' : 'Select All'}
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {state.phases.filter(p => p.type === 'mentor').map(phase => (
                                      <div key={phase.id} className="space-y-1.5">
                                        <div className="text-[8px] font-bold uppercase text-muted/60 tracking-wider flex items-center gap-2">
                                          {phase.name}
                                          <div className="h-px bg-slate-100 flex-1"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {phase.criteria.map(c => {
                                            const isAssigned = mentor.assignedCriteriaIds?.includes(c.id);
                                            return (
                                              <button
                                                key={c.id}
                                                onClick={() => {
                                                  const currentIds = mentor.assignedCriteriaIds || [];
                                                  const nextIds = isAssigned 
                                                    ? currentIds.filter(id => id !== c.id)
                                                    : [...currentIds, c.id];
                                                  updateMentor(mentor.id, { assignedCriteriaIds: nextIds });
                                                }}
                                                className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                                  isAssigned 
                                                    ? 'bg-accent text-white border-accent shadow-sm' 
                                                    : 'bg-white text-muted border-slate-200 hover:border-accent/30'
                                                }`}
                                              >
                                                {c.name}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {state.phases.filter(p => p.type === 'mentor').length === 0 && (
                                    <span className="text-[9px] text-muted italic">No mentor criteria defined</span>
                                  )}
                                  {state.phases.filter(p => p.type === 'mentor').flatMap(p => p.criteria).length > 0 && 
                                   (!mentor.assignedCriteriaIds || mentor.assignedCriteriaIds.length === 0) && (
                                    <div className="pt-1">
                                      <span className="text-[9px] text-accent font-black uppercase tracking-[0.2em] bg-accent/5 px-2 py-1 rounded border border-accent/20">Default: All Criteria</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 align-top">
                                <div className="space-y-3 max-w-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase text-muted/40 tracking-widest">Team Assignment</span>
                                    {state.teams.length > 0 && (
                                      <button 
                                        onClick={() => {
                                          const allIds = state.teams.map(t => t.id);
                                          const isAll = mentor.assignedTeamIds?.length === allIds.length;
                                          updateMentor(mentor.id, { assignedTeamIds: isAll ? [] : allIds });
                                        }}
                                        className="text-[8px] font-bold uppercase text-ink hover:opacity-70 transition-opacity"
                                      >
                                        {mentor.assignedTeamIds?.length === state.teams.length ? 'Clear All' : 'Select All'}
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-8 gap-1">
                                    {state.teams.map((team, tIdx) => {
                                      const isAssigned = mentor.assignedTeamIds?.includes(team.id);
                                      return (
                                        <button
                                          key={team.id}
                                          onClick={() => {
                                            const currentIds = mentor.assignedTeamIds || [];
                                            const nextIds = isAssigned 
                                              ? currentIds.filter(id => id !== team.id)
                                              : [...currentIds, team.id];
                                            updateMentor(mentor.id, { assignedTeamIds: nextIds });
                                          }}
                                          className={`w-6 h-6 flex items-center justify-center rounded text-[9px] font-bold transition-all border ${
                                            isAssigned 
                                              ? 'bg-ink text-white border-ink shadow-sm' 
                                              : 'bg-white text-muted border-slate-200 hover:border-ink/30'
                                          }`}
                                          title={team.name}
                                        >
                                          {tIdx + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {(!mentor.assignedTeamIds || mentor.assignedTeamIds.length === 0) && (
                                    <div className="pt-1">
                                      <span className="text-[9px] text-ink font-black uppercase tracking-[0.2em] bg-ink/5 px-2 py-1 rounded border border-ink/20">Default: All Teams</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-right align-top">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(sharedScoringUrl(state.id, 'mentor', mentor.id));
                                      setCopiedId(mentor.id);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className={`p-2 rounded-lg transition-all ${copiedId === mentor.id ? 'bg-green-50 text-green-500' : 'hover:bg-blue-50 text-blue-400'}`}
                                    title="Copy Scoring Link"
                                  >
                                    {copiedId === mentor.id ? <Check size={14} /> : <LinkIcon size={14} />}
                                  </button>
                                  <button 
                                    onClick={() => deleteMentor(mentor.id)}
                                    className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                                    title="Delete Mentor"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {(state.mentors || []).length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-12 text-center text-muted/40 uppercase font-bold text-sm">
                                <Users2 size={48} className="mx-auto mb-4 opacity-10" />
                                No mentors added yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab.startsWith('mentor-') && (() => {
                const mentorId = activeTab.substring(7);
                const mentor = (state.mentors || []).find(m => m.id === mentorId);
                if (!mentor) return null;

                const mentorPhases = (state.phases || []).filter(p => p.type === 'mentor');
                const assignedTeams = (teamScores || []).filter(t => {
                  if (!mentor.assignedTeamIds || mentor.assignedTeamIds.length === 0) return true;
                  return mentor.assignedTeamIds.includes(t.id);
                });

                return (
                  <div className="space-y-12">
                    <div className="border-b border-ink/10 pb-4 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mentor Scoring: {mentor.name}</h2>
                        <p className="text-ink/40 font-mono text-[10px] uppercase mt-1">Enter scores for your assigned teams across all mentor phases.</p>
                      </div>

                      {/* Hand this to the mentor so they can score on their own device. It opens the
                          same sheet without the admin sidebar (the /s/… route). Hidden when the
                          mentor is already on that route — this block renders in both views. */}
                      {!isExternalView && (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted">
                          Scoring link for {mentor.name}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            readOnly
                            value={sharedScoringUrl(state.id, 'mentor', mentor.id)}
                            onFocus={e => e.currentTarget.select()}
                            className="w-[280px] bg-slate-50 border border-border rounded-xl px-3 py-2 text-[10px] font-mono text-muted truncate outline-none focus:border-ink/20 focus:text-ink"
                          />
                          <button
                            onClick={() => copyLink(
                              sharedScoringUrl(state.id, 'mentor', mentor.id),
                              `mentor-link-${mentor.id}`,
                              `Copy this scoring link for ${mentor.name}:`,
                            )}
                            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                              copiedId === `mentor-link-${mentor.id}`
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-ink text-white border-ink hover:bg-ink/90'
                            }`}
                          >
                            {copiedId === `mentor-link-${mentor.id}`
                              ? <><Check size={14} /> Copied</>
                              : <><LinkIcon size={14} /> Copy</>}
                          </button>
                        </div>
                      </div>
                      )}
                    </div>

                    {mentorPhases.length === 0 ? (
                      <div className="card p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-muted">
                          <Mic2 size={32} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold uppercase tracking-tight">No Mentor Phases Defined</h3>
                          <p className="text-muted text-sm">Go to Scoring Structure to create phases with type "Mentor-based".</p>
                        </div>
                      </div>
                    ) : assignedTeams.length === 0 ? (
                      <div className="card p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-muted">
                          <Users size={32} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold uppercase tracking-tight">No Teams Assigned</h3>
                          <p className="text-muted text-sm">Go to Team Management to assign teams to this mentor.</p>
                        </div>
                      </div>
                    ) : (
                      mentorPhases.map((phase, pIdx) => {
                        const visibleCriteria = phase.criteria?.filter(c => 
                          !mentor.assignedCriteriaIds || 
                          mentor.assignedCriteriaIds.length === 0 || 
                          mentor.assignedCriteriaIds.includes(c.id)
                        );

                        if (visibleCriteria.length === 0) return null;

                        return (
                          <div key={phase.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-ink text-white rounded-lg flex items-center justify-center font-bold">{pIdx + 1}</div>
                                <h3 className="text-xl font-bold uppercase tracking-tight">{phase.name} Phase</h3>
                                <Badge variant="accent">{phase.weight}% Weight</Badge>
                              </div>
                            </div>

                            <div className="card overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-border">
                                      <th className="p-4 w-12 text-center border-r border-b border-border sticky left-0 top-0 bg-slate-50 z-50">
                                        <GitCompare size={14} className="text-muted mx-auto" />
                                      </th>
                                      <th className="p-4 sticky left-12 bg-slate-50 z-20 w-64 border-r border-border">
                                        <span className="label-micro mb-0">Team</span>
                                      </th>
                                      {visibleCriteria.map(c => (
                                        <th key={c.id} className="p-4 text-center">
                                          <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-black uppercase leading-tight">{c.name}</span>
                                            <span className="text-[9px] text-muted font-mono">Max: {c.maxScore}</span>
                                          </div>
                                        </th>
                                      ))}
                                      {pIdx === 0 && (
                                        <th className="p-4 text-center w-48">
                                          <span className="label-micro mb-0">Potential</span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {assignedTeams.map((team) => (
                                      <tr key={team.id} className="border-b border-border hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 text-center border-r border-b border-border sticky left-0 bg-white z-20 group-hover:bg-slate-50 transition-colors">
                                          <input 
                                            type="checkbox"
                                            checked={selectedCompareTeamIds.includes(team.id)}
                                            onChange={() => toggleCompare(team.id)}
                                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent transition-all cursor-pointer"
                                          />
                                        </td>
                                        <td className="p-4 sticky left-12 bg-white z-10 border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50 transition-colors">
                                          <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-muted shrink-0">
                                              {team.originalIndex + 1}
                                            </div>
                                            <div>
                                              <div className="font-bold uppercase tracking-tight text-xs">{team.name}</div>
                                              <div className="text-[9px] text-muted font-mono">{team.productName}</div>
                                            </div>
                                          </div>
                                        </td>
                                        {visibleCriteria.map(criterion => {
                                          const scoreObj = (state.scores || []).find(s => s.teamId === team.id && s.judgeId === mentor.id && s.criterionId === criterion.id && s.phaseId === phase.id);
                                          const scoreValue = scoreObj?.score;
                                          const hasSub = criterion.subCriteria && criterion.subCriteria.length > 0;

                                          return (
                                            <td key={criterion.id} className="p-4 align-top">
                                              {hasSub ? (
                                                <div className="space-y-1.5 min-w-[180px]">
                                                  {criterion.subCriteria?.map(sub => (
                                                    <div key={sub.id} className="flex items-center gap-2 group">
                                                      {sub.type === 'numeric' ? (
                                                        <div className="flex items-center gap-2 flex-1">
                                                          <div className="flex-1 min-w-0">
                                                            <div className="text-[10px] font-bold truncate leading-tight">{sub.name}</div>
                                                            {sub.description && <div className="text-[8px] text-muted leading-tight mt-0.5">{sub.description}</div>}
                                                          </div>
                                                          <input 
                                                            type="number"
                                                            value={scoreObj?.subCriteriaValues?.[sub.id] ?? ''}
                                                            onChange={(e) => {
                                                              const val = e.target.value === '' ? null : Number(e.target.value);
                                                              const finalVal = val !== null ? clampScore(val, scorableMax(sub.score)) : null;
                                                              const nextValues = { ...(scoreObj?.subCriteriaValues || {}) };
                                                              if (finalVal === null) delete nextValues[sub.id];
                                                              else nextValues[sub.id] = finalVal;
                                                              
                                                              const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                              const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                              const newScore = getEffectiveScore(tempEntry, criterion);
                                                              updateScore(team.id, mentor.id, criterion.id, newScore, phase.id, currentIds, nextValues);
                                                            }}
                                                            className="w-12 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[10px] font-mono text-center outline-none focus:border-ink/20"
                                                            placeholder={`0-${sub.score}`}
                                                          />
                                                        </div>
                                                      ) : (
                                                        <div className="flex flex-col gap-1.5 flex-1">
                                                          <div className="flex items-center justify-between">
                                                          <div className="flex-1 min-w-0">
                                                            <div className="text-[10px] font-bold truncate leading-tight">{sub.name}</div>
                                                            {sub.description && <div className="text-[8px] text-muted leading-tight mt-0.5">{sub.description}</div>}
                                                          </div>
                                                            <span className="text-[9px] font-mono text-muted">+{sub.score}</span>
                                                          </div>
                                                          <div className="flex flex-wrap gap-1">
                                                            {Array.from({ length: sub.score || 1 }).map((_, i) => {
                                                              const isChecked = (sub.score || 0) > 1 
                                                                ? (scoreObj?.subCriteriaValues?.[sub.id] || 0) > i
                                                                : scoreObj?.selectedSubCriteriaIds?.includes(sub.id);
                                                              
                                                              return (
                                                                <button 
                                                                  key={i}
                                                                  onClick={() => {
                                                                    if ((sub.score || 0) > 1) {
                                                                      const currentCount = scoreObj?.subCriteriaValues?.[sub.id] || 0;
                                                                      const newCount = isChecked && currentCount === i + 1 ? i : i + 1;
                                                                      
                                                                      const nextValues = { ...(scoreObj?.subCriteriaValues || {}), [sub.id]: newCount };
                                                                      const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                      const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                      const newScore = getEffectiveScore(tempEntry, criterion);
                                                                      updateScore(team.id, mentor.id, criterion.id, newScore, phase.id, currentIds, nextValues);
                                                                    } else {
                                                                      const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                      const newIds = isChecked 
                                                                        ? currentIds.filter(id => id !== sub.id)
                                                                        : [...currentIds, sub.id];
                                                                      const nextValues = scoreObj?.subCriteriaValues || {};
                                                                      const tempEntry = { ...scoreObj, selectedSubCriteriaIds: newIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                      const newScore = getEffectiveScore(tempEntry, criterion);
                                                                      updateScore(team.id, mentor.id, criterion.id, newScore, phase.id, newIds, nextValues);
                                                                    }
                                                                  }}
                                                                  className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all ${
                                                                    isChecked 
                                                                      ? 'bg-ink border-ink text-accent shadow-md shadow-ink/20' 
                                                                      : 'bg-white border-ink/10 hover:border-ink/30 hover:bg-slate-50'
                                                                  }`}
                                                                >
                                                                  {isChecked && <Check size={14} strokeWidth={4} />}
                                                                </button>
                                                              );
                                                            })}
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  ))}
                                                  <div className="pt-1 mt-1 border-t border-slate-200 flex justify-between items-center">
                                                    <span className="text-[9px] font-bold uppercase text-muted">Total</span>
                                                    <span className="text-[10px] font-bold text-ink">{getEffectiveScore(scoreObj, criterion) || 0}</span>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="flex justify-center">
                                                  <input 
                                                    type="number"
                                                    placeholder={scorableMax(criterion.maxScore) ? '-' : 'n/a'}
                                                    disabled={!scorableMax(criterion.maxScore)}
                                                    title={scorableMax(criterion.maxScore) ? undefined : `"${criterion.name}" has no Max Score, so it cannot be scored. Set one under Criteria.`}
                                                    value={scoreValue ?? ''}
                                                    onChange={(e) => {
                                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                                      const finalVal = val !== null ? clampScore(val, scorableMax(criterion.maxScore)) : null;
                                                      updateScore(team.id, mentor.id, criterion.id, finalVal, phase.id);
                                                    }}
                                                    className={`w-16 bg-bg/30 border p-2 rounded-lg font-mono text-center text-sm focus:bg-white focus:border-ink/20 outline-none transition-all ${scoreValue == null ? 'border-red-200 bg-red-50/30' : 'border-ink/5'}`}
                                                  />
                                                </div>
                                              )}
                                            </td>
                                          );
                                        })}
                                        {pIdx === 0 && (
                                          <td className="p-4 text-center">
                                            <div className="flex flex-col gap-1 items-center">
                                              {['high', 'medium', 'low', 'critical'].map(d => {
                                                const active = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === mentor.id && dec.phaseId === phase.id)?.decision === d;
                                                return (
                                                  <button 
                                                    key={d}
                                                    onClick={() => {
                                                      const currentDecision = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === mentor.id && dec.phaseId === phase.id)?.decision;
                                                      updateDecision(team.id, mentor.id, phase.id, currentDecision === d ? null : d as any);
                                                    }}
                                                    className={`w-full px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                                                      active 
                                                        ? d === 'high' ? 'bg-emerald-500 text-white' : d === 'medium' ? 'bg-amber-500 text-white' : d === 'low' ? 'bg-slate-400 text-white' : 'bg-rose-500 text-white'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                    }`}
                                                  >
                                                    {d}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })()}

              {activeTab.startsWith('judge-') && (() => {
                const judgeId = activeTab.substring(6);
                const judge = state.judges.find(j => j.id === judgeId);
                if (!judge) return null;

                const judgePhases = state.phases.filter(p => p.type === 'judge');

                return (
                  <div className="space-y-12">
                    <div className="border-b border-ink/10 pb-4">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Scoring Sheet: {judge.name}</h2>
                      <p className="text-ink/40 font-mono text-[10px] uppercase mt-1">Enter scores for each team across all judging phases.</p>
                    </div>

                    {(judgePhases || []).map((phase, pIdx) => (
                      <div key={phase.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-ink text-white rounded-lg flex items-center justify-center font-bold">{pIdx + 1}</div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">{phase.name} Phase</h3>
                            <Badge variant="accent">{phase.weight}% Weight</Badge>
                          </div>
                        </div>

                        <div className="card overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                  <th className="p-4 sticky left-0 bg-slate-50 z-20 w-64 border-r border-border">
                                    <span className="label-micro mb-0">Team</span>
                                  </th>
                                  {phase.criteria?.map(c => (
                                    <th key={c.id} className="p-4 text-center">
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black uppercase leading-tight">{c.name}</span>
                                        <span className="text-[9px] text-muted font-mono">Max: {c.maxScore}</span>
                                      </div>
                                    </th>
                                  ))}
                                  {pIdx === 0 && (
                                    <th className="p-4 text-center w-48">
                                      <span className="label-micro mb-0">{phase.type === 'judge' ? 'Verdict' : 'Potential'}</span>
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {teamScores.map((team) => (
                                  <tr key={team.id} className="border-b border-border hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 sticky left-0 bg-white z-10 border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-muted shrink-0">
                                          {team.originalIndex + 1}
                                        </div>
                                        <div>
                                          <div className="font-bold uppercase tracking-tight text-xs">{team.name}</div>
                                          <div className="text-[9px] text-muted font-mono">{team.productName}</div>
                                        </div>
                                      </div>
                                    </td>
                                    {phase.criteria?.map(criterion => {
                                      const scoreObj = (state.scores || []).find(s => s.teamId === team.id && s.judgeId === judge.id && s.criterionId === criterion.id && s.phaseId === phase.id);
                                      const scoreValue = scoreObj?.score;
                                      const hasSub = criterion.subCriteria && (criterion.subCriteria?.length || 0) > 0;

                                      return (
                                        <td key={criterion.id} className="p-4 align-top">
                                          {hasSub ? (
                                            <div className="space-y-1.5 min-w-[180px]">
                                              {criterion.subCriteria?.map(sub => (
                                                <div key={sub.id} className="flex items-center gap-2 group">
                                                  {sub.type === 'numeric' ? (
                                                    <div className="flex items-center gap-2 flex-1">
                                                      <span className="text-[10px] flex-1 leading-tight">{sub.name}</span>
                                                      <input 
                                                        type="number"
                                                        value={scoreObj?.subCriteriaValues?.[sub.id] ?? ''}
                                                        onChange={(e) => {
                                                          const val = e.target.value === '' ? null : Number(e.target.value);
                                                          const finalVal = val !== null ? clampScore(val, scorableMax(sub.score)) : null;
                                                          const nextValues = { ...(scoreObj?.subCriteriaValues || {}) };
                                                          if (finalVal === null) delete nextValues[sub.id];
                                                          else nextValues[sub.id] = finalVal;
                                                          
                                                          // Recalculate total score
                                                          const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                          const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                          const newScore = getEffectiveScore(tempEntry, criterion);
                                                          updateScore(team.id, judge.id, criterion.id, newScore, phase.id, currentIds, nextValues);
                                                        }}
                                                        className="w-12 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[10px] font-mono text-center outline-none focus:border-ink/20"
                                                        placeholder={`0-${sub.score}`}
                                                      />
                                                    </div>
                                                  ) : (
                                                    <div className="flex flex-col gap-1.5 flex-1">
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-[10px] flex-1 leading-tight">{sub.name}</span>
                                                        <span className="text-[9px] font-mono text-muted">+{sub.score}</span>
                                                      </div>
                                                      <div className="flex flex-wrap gap-1">
                                                        {Array.from({ length: sub.score || 1 }).map((_, i) => {
                                                          const isChecked = (sub.score || 0) > 1 
                                                            ? (scoreObj?.subCriteriaValues?.[sub.id] || 0) > i
                                                            : scoreObj?.selectedSubCriteriaIds?.includes(sub.id);
                                                          
                                                          return (
                                                            <button 
                                                              key={i}
                                                              onClick={() => {
                                                                if ((sub.score || 0) > 1) {
                                                                  const currentCount = scoreObj?.subCriteriaValues?.[sub.id] || 0;
                                                                  const newCount = isChecked && currentCount === i + 1 ? i : i + 1;
                                                                  
                                                                  const nextValues = { ...(scoreObj?.subCriteriaValues || {}), [sub.id]: newCount };
                                                                  const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                  const tempEntry = { ...scoreObj, selectedSubCriteriaIds: currentIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                  const newScore = getEffectiveScore(tempEntry, criterion);
                                                                  updateScore(team.id, judge.id, criterion.id, newScore, phase.id, currentIds, nextValues);
                                                                } else {
                                                                  const currentIds = scoreObj?.selectedSubCriteriaIds || [];
                                                                  const newIds = isChecked 
                                                                    ? currentIds.filter(id => id !== sub.id)
                                                                    : [...currentIds, sub.id];
                                                                  const nextValues = scoreObj?.subCriteriaValues || {};
                                                                  const tempEntry = { ...scoreObj, selectedSubCriteriaIds: newIds, subCriteriaValues: nextValues } as ScoreEntry;
                                                                  const newScore = getEffectiveScore(tempEntry, criterion);
                                                                  updateScore(team.id, judge.id, criterion.id, newScore, phase.id, newIds, nextValues);
                                                                }
                                                              }}
                                                              className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all ${
                                                                isChecked 
                                                                  ? 'bg-ink border-ink text-accent shadow-md shadow-ink/20' 
                                                                  : 'bg-white border-ink/10 hover:border-ink/30 hover:bg-slate-50'
                                                              }`}
                                                            >
                                                              {isChecked && <Check size={14} strokeWidth={4} />}
                                                            </button>
                                                          );
                                                        })}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                              <div className="pt-1 mt-1 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-[9px] font-bold uppercase text-muted">Total</span>
                                                <span className="text-[10px] font-bold text-ink">{getEffectiveScore(scoreObj, criterion) || 0}</span>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex justify-center">
                                              <input 
                                                type="number"
                                                placeholder={scorableMax(criterion.maxScore) ? '-' : 'n/a'}
                                                disabled={!scorableMax(criterion.maxScore)}
                                                title={scorableMax(criterion.maxScore) ? undefined : `"${criterion.name}" has no Max Score, so it cannot be scored. Set one under Criteria.`}
                                                value={scoreValue ?? ''}
                                                onChange={(e) => {
                                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                                  const finalVal = val !== null ? clampScore(val, scorableMax(criterion.maxScore)) : null;
                                                  updateScore(team.id, judge.id, criterion.id, finalVal, phase.id);
                                                }}
                                                className={`w-16 bg-bg/30 border p-2 rounded-lg font-mono text-center text-sm focus:bg-white focus:border-ink/20 outline-none transition-all ${scoreValue == null ? 'border-red-200 bg-red-50/30' : 'border-ink/5'}`}
                                              />
                                            </div>
                                          )}
                                        </td>
                                      );
                                    })}
                                    {pIdx === 0 && (
                                      <td className="p-4 text-center">
                                        <div className="flex flex-col gap-1 items-center">
                                          {['pass', 'fail', 'not_sure'].map(d => {
                                            const active = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === judge.id && dec.phaseId === phase.id)?.decision === d;
                                            return (
                                              <button 
                                                key={d}
                                                onClick={() => {
                                                  const currentDecision = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === judge.id && dec.phaseId === phase.id)?.decision;
                                                  updateDecision(team.id, judge.id, phase.id, currentDecision === d ? null : d as any);
                                                }}
                                                className={`w-full px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                                                  active 
                                                    ? d === 'pass' ? 'bg-emerald-500 text-white' : d === 'fail' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                }`}
                                              >
                                                {d.replace('_', ' ')}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {activeTab === 'internal' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-ink/10 pb-4">
                    <div>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Internal Management</h2>
                      <p className="text-ink/40 font-mono text-xs uppercase mt-1">Adjust display order and final rankings</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={loadMockData}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg bg-accent text-white hover:bg-accent/80 shadow-accent/20"
                      >
                        <Database size={14} />
                        Load Mock Data
                      </button>
                    </div>
                  </div>

                  {/* Hackathon Info Editing */}
                  <div className="bg-white border border-ink/10 p-6 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                      <Edit2 size={18} className="text-accent" /> Hackathon Information
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Hackathon Name</label>
                        <input 
                          type="text" 
                          value={state.hackathonName}
                          onChange={(e) => setState(prev => ({ ...prev, hackathonName: e.target.value }))}
                          placeholder="Enter Hackathon Name"
                          className="w-full bg-bg/50 border border-ink/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Subtitle / Category</label>
                        <input 
                          type="text" 
                          value={state.hackathonSubtitle}
                          onChange={(e) => setState(prev => ({ ...prev, hackathonSubtitle: e.target.value }))}
                          placeholder="Enter Subtitle (e.g. Internal Hackathon)"
                          className="w-full bg-bg/50 border border-ink/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-ink/10 rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr] p-4 bg-ink text-bg font-bold uppercase text-[10px] tracking-widest italic">
                      <div className="text-center">Sort Up</div>
                      <div>Team Name</div>
                      <div className="text-center">Current Total</div>
                      <div className="text-center">Final Rank</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {teamScores.map(team => (
                      <div key={team.id} className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr] p-4 data-row items-center">
                        <div className="flex justify-center">
                          <input 
                            type="checkbox" 
                            checked={team.isSortedUp}
                            onChange={(e) => updateTeam(team.id, { isSortedUp: e.target.checked })}
                            className="w-5 h-5 accent-ink cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="font-bold uppercase tracking-tight">{team.name}</div>
                          <div className="text-[10px] opacity-50 font-mono">{team.productName}</div>
                        </div>
                        <div className="text-center font-mono font-bold">{(team.finalScore || 0).toFixed(2)}</div>
                        <div className="text-center">
                          <select 
                            value={team.finalRank || ''}
                            onChange={(e) => updateTeam(team.id, { finalRank: e.target.value })}
                            className="bg-bg/50 border border-ink/10 rounded px-2 py-1 text-xs font-mono"
                          >
                            <option value="">-</option>
                            <option value="Winner">Winner</option>
                            <option value="1st Runner Up">1st Runner Up</option>
                            <option value="2nd Runner Up">2nd Runner Up</option>
                            <option value="Honorable Mention">Honorable Mention</option>
                            <option value="Special Award">Special Award</option>
                          </select>
                        </div>
                        <div className="flex justify-end">
                          <button onClick={() => deleteTeam(team.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl">
                    <h4 className="font-bold uppercase text-xs mb-2 flex items-center gap-2">
                      <HelpCircle size={14} /> Scoring Logic Note
                    </h4>
                    <ul className="text-[10px] font-mono space-y-1 opacity-70 list-disc pl-4">
                      <li>Final Score = {(state.phases || []).map(p => `(${p.name} Score * ${p.weight}%)`).join(' + ')}</li>
                      {(state.phases || []).map(p => (
                        <li key={p.id}>
                          {p.name} Score = {p.type === 'mentor' 
                            ? `Sum of (Score / Max Score * Weight%) for all ${p.name} criteria.` 
                            : `Average of judge scores. For each judge, score is Sum of (Score / Max Score * Weight%) for all ${p.name} criteria.`}
                        </li>
                      ))}
                      <li>"n/a" values do not penalize the team; the weight of missing criteria is redistributed within that phase/judge's score.</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-ink/10 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="text-xl font-black uppercase italic">Data Portability</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={loadMockData}
                        className="bg-accent text-white p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-accent/80 shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Database size={18} /> Load Demo Data
                      </button>
                      <button 
                        onClick={exportData}
                        className="bg-ink text-bg p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-ink/80 transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={18} /> Export Data (JSON)
                      </button>
                      <button 
                        onClick={() => setShowClearConfirm(true)}
                        className="bg-red-500 text-white p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} /> Clean Data
                      </button>
                    </div>
                    {demoStatus && (
                      <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                        demoStatus.kind === 'ok'
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-rose-50 border-rose-200'
                      }`}>
                        {demoStatus.kind === 'ok'
                          ? <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          : <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />}
                        <div className="space-y-1 min-w-0">
                          <p className={`text-xs font-bold uppercase tracking-widest ${
                            demoStatus.kind === 'ok' ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {demoStatus.kind === 'ok' ? 'Demo data loaded' : 'Demo data failed'}
                          </p>
                          <p className={`text-xs leading-relaxed break-words ${
                            demoStatus.kind === 'ok' ? 'text-emerald-700/80' : 'text-rose-600/80'
                          }`}>
                            {demoStatus.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
        </motion.div>
        </main>
      )}

        {/* Clear Data Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-ink/10 space-y-6"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <Trash2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Clean All Data?</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    This will permanently delete ALL data including{' '}
                    <span className="font-black text-ink">Criteria (Phases), Teams, and Judges</span>.
                    You will need to create everything from scratch. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-ink rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={clearAllData}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Yes, Clean All
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Award Presentation Config Modal */}
        <AnimatePresence>
          {showAwardConfig && (
            <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-ink/10 space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Award Presentation Setup</h3>
                  <button onClick={() => setShowAwardConfig(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-muted text-sm">Select teams and their awards. They will be presented in the order below (usually reverse order for suspense).</p>
                  
                  <div className="space-y-2">
                    {awardSlides.map((slide, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-bg/50 p-3 rounded-xl border border-ink/5">
                        <div className="w-6 h-6 bg-ink text-bg rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                        <select 
                          value={slide.teamId}
                          onChange={(e) => {
                            const next = [...awardSlides];
                            next[idx].teamId = e.target.value;
                            setAwardSlides(next);
                          }}
                          className="flex-1 bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm font-bold"
                        >
                          <option value="">Select Team</option>
                          {state.teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <input 
                          type="text"
                          value={slide.awardName}
                          onChange={(e) => {
                            const next = [...awardSlides];
                            next[idx].awardName = e.target.value;
                            setAwardSlides(next);
                          }}
                          placeholder="Award Name (e.g. Winner)"
                          className="flex-1 bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm font-bold"
                        />
                        <div className="flex gap-1">
                          <button 
                            disabled={idx === 0}
                            onClick={() => {
                              const next = [...awardSlides];
                              [next[idx-1], next[idx]] = [next[idx], next[idx-1]];
                              setAwardSlides(next);
                            }}
                            className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-30"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button 
                            disabled={idx === awardSlides.length - 1}
                            onClick={() => {
                              const next = [...awardSlides];
                              [next[idx], next[idx+1]] = [next[idx+1], next[idx]];
                              setAwardSlides(next);
                            }}
                            className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-30"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button 
                            onClick={() => setAwardSlides(awardSlides.filter((_, i) => i !== idx))}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setAwardSlides([...awardSlides, { teamId: '', awardName: '' }])}
                    className="w-full py-3 border-2 border-dashed border-ink/10 rounded-xl text-muted font-bold uppercase text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Award Slide
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAwardConfig(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-ink rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setState(prev => ({ ...prev, awardSlides }));
                      setShowAwardConfig(false);
                    }}
                    className="flex-1 px-6 py-3 bg-ink text-bg rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-ink/90 transition-all shadow-lg shadow-ink/20"
                  >
                    Save
                  </button>
                  <button 
                    disabled={awardSlides.length === 0 || awardSlides.some(s => !s.teamId || !s.awardName)}
                    onClick={() => {
                      setState(prev => ({ ...prev, awardSlides }));
                      setAwardPresentationStep(0);
                      setShowAwardConfig(false);
                      setShowAwardPresentation(true);
                    }}
                    className="flex-1 px-6 py-3 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-accent/80 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                  >
                    Start Presentation
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Award Presentation Overlay */}
        <AnimatePresence>
          {showAwardPresentation && (() => {
            const currentSlide = awardSlides[awardPresentationStep];
            const team = state.teams.find(t => t.id === currentSlide?.teamId);

            /**
             * A projector link to a hackathon with no award slides used to render an empty
             * overlay — no team, no slides, and (because the exit controls are hidden in public
             * view) nothing to click. Say so, and always offer a way out of this state.
             */
            if (awardSlides.length === 0) {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-[#0f0f0f] text-white flex flex-col items-center justify-center gap-6 p-8 text-center"
                >
                  <Trophy size={48} className="text-white/15" />
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">No awards set up yet</h2>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {isPublicView
                        ? 'The organiser has not configured the award slides for this event yet.'
                        : 'Open “Award Slides” on the leaderboard to choose the teams and award names first.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Clearing only the overlay would leave publicView set, which hides the app
                      // shell and renders nothing — a public viewer has to go all the way home.
                      if (isPublicView) navigate(HOME_ROUTE);
                      else setShowAwardPresentation(false);
                    }}
                    className="px-8 py-3 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-white/90 transition-all"
                  >
                    {isPublicView ? 'Back to home' : 'Close'}
                  </button>
                </motion.div>
              );
            }

            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-[#0f0f0f] text-white flex flex-col items-center justify-center overflow-hidden"
              >
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
                  <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[80px]" />
                  <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-8">
                  <motion.div
                    key={`award-${awardPresentationStep}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent font-black uppercase tracking-[0.3em] text-sm"
                      >
                        <Trophy size={18} />
                        Award Announcement
                      </motion.div>
                      <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-white drop-shadow-2xl">
                        {currentSlide?.awardName}
                      </h2>
                    </div>

                    <AnimatePresence mode="wait">
                      {team && (
                        <motion.div 
                          key={team.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                          className="space-y-8"
                        >
                          <div className="relative inline-block">
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 shadow-2xl flex items-center justify-center">
                               <img 
                                 src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${team.id}`} 
                                 alt="Team Avatar" 
                                 className="w-full h-full object-contain"
                               />
                            </div>
                            <motion.div 
                              initial={{ rotate: -20, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ delay: 1.5, type: 'spring' }}
                              className="absolute -top-6 -right-6 w-20 h-20 bg-gold rounded-2xl flex items-center justify-center shadow-2xl"
                            >
                              <Crown className="w-12 h-12 text-white fill-white" />
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-accent">
                              {team.name}
                            </h3>
                            <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-white/40">
                              {team.productName}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
                  <button 
                    onClick={() => setAwardPresentationStep(prev => Math.max(0, prev - 1))}
                    disabled={awardPresentationStep === 0}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all disabled:opacity-20"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  
                  <div className="flex gap-2">
                    {awardSlides.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full transition-all ${i === awardPresentationStep ? 'bg-accent w-8' : 'bg-white/20'}`} 
                      />
                    ))}
                  </div>

                  {awardPresentationStep < awardSlides.length - 1 ? (
                    <button
                      onClick={() => setAwardPresentationStep(prev => prev + 1)}
                      className="p-4 bg-accent hover:bg-accent/80 rounded-full shadow-lg shadow-accent/20 transition-all"
                    >
                      <ChevronRight size={32} />
                    </button>
                  ) : !isPublicView ? (
                    <button
                      onClick={() => setShowAwardPresentation(false)}
                      className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                    >
                      Finish
                    </button>
                  ) : null}
                </div>

                {!isPublicView && (
                  <button
                    onClick={() => setShowAwardPresentation(false)}
                    className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"
                  >
                    <X size={24} />
                  </button>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Hackathon Presentation Overlay */}
        <AnimatePresence>
          {showHackathonPresentation && (() => {
            const hackathonPhase = state.phases.find(p => p.id === hackathonPhaseId);
            const visibleCriteria = hackathonPhase?.criteria.filter(c => !state.hiddenCriteriaIds?.includes(c.id)) || [];
            const activeCriterion = visibleCriteria[activeHackathonCriterionIdx % (visibleCriteria.length || 1)];
            

            const getTeamCriterionScore = (teamId: string, criterionId: string) => {
              const entries = state.scores.filter(s => s.teamId === teamId && s.phaseId === hackathonPhaseId && s.criterionId === criterionId);
              if (entries.length === 0) return 0;
              const total = entries.reduce((acc, curr) => acc + (curr.score || 0), 0);
              return total / entries.length;
            };

            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ '--color-accent': state.hackathonColor } as React.CSSProperties}
                className={`fixed inset-0 z-[100] overflow-hidden flex flex-col font-sans transition-colors duration-500 ${
                  presentationTheme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5f5] text-[#0f0f0f]'
                }`}
              >
                {/* Header */}
                <div className={`flex justify-between items-center px-8 py-1 backdrop-blur-md border-b transition-colors duration-500 ${
                  presentationTheme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white/40 border-black/5'
                }`}>
                  {/* Clock only. The flanking spacer and the Powered By block are both gone —
                      flex-1 on this one child is what keeps the clock centred. */}
                  <div className="flex-1 flex justify-center">
                    <div className={`relative px-6 py-1 rounded-xl border shadow-[0_0_20px_rgba(225,29,72,0.15)] transition-colors ${
                      presentationTheme === 'dark' ? 'bg-black/40 border-accent/30' : 'bg-white/60 border-accent/30'
                    }`}>
                      <div className="text-xl font-mono font-black text-accent tracking-widest">
                        <LiveClock />
                      </div>
                      <div className="absolute inset-0 bg-accent/5 blur-xl rounded-2xl -z-10" />
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 pt-4 px-8 pb-0 flex gap-4 items-stretch overflow-hidden">
                  {/* Left Side: Podium & Title */}
                  <div className="w-[40%] flex flex-col gap-2">
                    <div className={`rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden transition-colors duration-500 ${
                      presentationTheme === 'dark' ? 'bg-gradient-to-br from-accent to-accent/60 shadow-accent/20' : 'bg-white shadow-black/5 border border-black/5'
                    }`}>
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                      <div className="flex gap-6 items-center relative z-10">
                        <div className={`w-24 h-24 backdrop-blur-md rounded-3xl border flex items-center justify-center shrink-0 transition-colors overflow-hidden ${
                          presentationTheme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/20'
                        }`}>
                          {state.hackathonLogo ? (
                            <img src={state.hackathonLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                            <div className={`text-[10px] font-bold uppercase text-center px-2 leading-tight ${
                              presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                            }`}>Project Img Not Found</div>
                          )}
                        </div>
                        <div>
                          <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 transition-colors ${
                            presentationTheme === 'dark' ? 'text-white/60' : 'text-black/60'
                          }`}>{state.hackathonSubtitle}</div>
                          <h1 className={`text-2xl font-black uppercase leading-[0.9] tracking-tighter transition-colors ${
                            presentationTheme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            {state.hackathonName}
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-end justify-center gap-4 pb-0 relative">
                      {/* 2nd Place */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '60%' }}
                        className="w-1/3 bg-gradient-to-t from-accent/80 to-accent/40 rounded-t-[2rem] relative flex flex-col items-center pt-8 shadow-2xl"
                      >
                        <div className="absolute -top-16 flex flex-col items-center w-full">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="flex flex-col items-center"
                          >
                            <div className="relative">
                              <div className={`w-20 h-20 rounded-full border-4 overflow-hidden shadow-xl transition-colors ${
                                presentationTheme === 'dark' ? 'bg-slate-200 border-white/20' : 'bg-slate-100 border-black/10'
                              }`}>
                                <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${hackathonSortedTeams[1]?.id || 'Felix'}`} alt="avatar" className="w-full h-full object-cover" />
                              </div>
                              <div className={`absolute -top-4 -left-4 transition-colors ${
                                presentationTheme === 'dark' ? 'text-white/40' : 'text-black/20'
                              }`}>
                                <Crown className="w-8 h-8 rotate-[-20deg]" />
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <div className={`text-2xl font-black italic transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>2<sup>nd</sup></div>
                              <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${presentationTheme === 'dark' ? 'text-white/60' : 'text-black/40'}`}>Group</div>
                              <div className={`backdrop-blur-md px-4 py-1 rounded-lg border mt-1 transition-colors ${
                                presentationTheme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'
                              }`}>
                                <div className={`text-[10px] font-black uppercase leading-tight line-clamp-2 transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>{hackathonSortedTeams[1]?.name || 'Team 2'}</div>
                              </div>
                              <div className="mt-2">
                                <div className={`text-[8px] font-bold uppercase transition-colors ${presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>Score</div>
                                <div className={`text-xl font-black transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>{((hackathonSortedTeams[1] as any)?.phaseScores?.[hackathonPhaseId] || 0).toFixed(0)}</div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* 1st Place */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '85%' }}
                        className="w-1/3 bg-gradient-to-t from-accent to-accent/60 rounded-t-[2rem] relative flex flex-col items-center pt-8 shadow-2xl z-10"
                      >
                        <div className="absolute -top-20 flex flex-col items-center w-full">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="flex flex-col items-center"
                          >
                            <div className="relative">
                              <div className={`w-24 h-24 rounded-full border-4 overflow-hidden shadow-2xl transition-colors ${
                                presentationTheme === 'dark' ? 'bg-slate-100 border-accent' : 'bg-white border-accent'
                              }`}>
                                <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${hackathonSortedTeams[0]?.id || 'Oliver'}`} alt="avatar" className="w-full h-full object-cover" />
                              </div>
                              <div className="absolute -top-8 -right-4 text-gold drop-shadow-lg">
                                <Crown className="w-12 h-12 rotate-[15deg] fill-gold" />
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <div className={`text-3xl font-black italic transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>1<sup>st</sup></div>
                              <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${presentationTheme === 'dark' ? 'text-white/60' : 'text-black/40'}`}>Group</div>
                              <div className={`backdrop-blur-md px-6 py-2 rounded-xl border mt-1 transition-colors ${
                                presentationTheme === 'dark' ? 'bg-black/20 border-white/20' : 'bg-white/60 border-black/10'
                              }`}>
                                <div className={`text-sm font-black uppercase leading-tight line-clamp-2 transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>{hackathonSortedTeams[0]?.name || 'Team 1'}</div>
                              </div>
                              <div className="mt-2">
                                <div className={`text-[8px] font-bold uppercase transition-colors ${presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>Score</div>
                                <div className={`text-3xl font-black transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>{((hackathonSortedTeams[0] as any)?.phaseScores?.[hackathonPhaseId] || 0).toFixed(0)}</div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* 3rd Place */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '45%' }}
                        className="w-1/3 bg-gradient-to-t from-accent/60 to-accent/20 rounded-t-[2rem] relative flex flex-col items-center pt-8 shadow-2xl"
                      >
                        <div className="absolute -top-16 flex flex-col items-center w-full">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="flex flex-col items-center"
                          >
                            <div className="relative">
                              <div className={`w-20 h-20 rounded-full border-4 overflow-hidden shadow-xl transition-colors ${
                                presentationTheme === 'dark' ? 'bg-slate-300 border-white/10' : 'bg-slate-200 border-black/10'
                              }`}>
                                <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${hackathonSortedTeams[2]?.id || 'Jack'}`} alt="avatar" className="w-full h-full object-cover" />
                              </div>
                              <div className={`absolute -top-4 -right-4 transition-colors ${
                                presentationTheme === 'dark' ? 'text-white/20' : 'text-black/10'
                              }`}>
                                <Crown className="w-8 h-8 rotate-[20deg]" />
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <div className={`text-2xl font-black italic transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>3<sup>rd</sup></div>
                              <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${presentationTheme === 'dark' ? 'text-white/60' : 'text-black/40'}`}>Group</div>
                              <div className={`backdrop-blur-md px-4 py-1 rounded-lg border mt-1 transition-colors ${
                                presentationTheme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'
                              }`}>
                                <div className={`text-[10px] font-black uppercase leading-tight line-clamp-2 transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>{hackathonSortedTeams[2]?.name || 'Team 3'}</div>
                              </div>
                              <div className="mt-2">
                                <div className={`text-[8px] font-bold uppercase transition-colors ${presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>Score</div>
                                <div className={`text-xl font-black transition-colors ${presentationTheme === 'dark' ? 'text-white' : 'text-black'}`}>{((hackathonSortedTeams[2] as any)?.phaseScores?.[hackathonPhaseId] || 0).toFixed(0)}</div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Side: Rankings Table */}
                  <div className={`flex-[2] mb-8 backdrop-blur-md rounded-[2.5rem] border overflow-hidden flex flex-col shadow-2xl transition-colors duration-500 ${
                    presentationTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <div 
                      ref={scrollRef} 
                      onScroll={handleManualScroll}
                      className="flex-1 overflow-y-auto custom-scrollbar"
                    >
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        {/* Fully opaque: at 80% the rows scrolling underneath showed through. */}
                        <thead className={`sticky top-0 z-20 transition-colors ${
                          presentationTheme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'
                        }`}>
                          <tr className={`border-b transition-colors ${
                            presentationTheme === 'dark' ? 'border-white/10' : 'border-black/10'
                          }`}>
                            <th className={`p-3 text-[9px] font-black uppercase tracking-widest text-center w-14 transition-colors ${
                              presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                            }`}>Rank</th>
                            <th className={`p-3 text-[9px] font-black uppercase tracking-widest text-center w-14 transition-colors ${
                              presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                            }`}>No.</th>
                            <th className={`p-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
                              presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                            }`}>Team Name</th>
                            {visibleCriteria.map((c, cIdx) => (
                              <th 
                                key={c.id} 
                                onClick={() => {
                                  setActiveHackathonCriterionIdx(cIdx);
                                  setIsAutoCycling(false);
                                }}
                                className={`p-3 text-[9px] font-black uppercase tracking-widest text-center transition-all cursor-pointer hover:bg-accent/10 ${
                                  activeHackathonCriterionIdx === cIdx ? 'text-accent bg-accent/5' : (presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40')
                                }`}
                              >
                                {c.name}
                              </th>
                            ))}
                            <th className="p-3 text-[9px] font-black text-accent uppercase tracking-widest text-right w-20">Total</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y transition-colors ${
                          presentationTheme === 'dark' ? 'divide-white/5' : 'divide-black/5'
                        }`}>
                          {hackathonSortedTeams.map((team, idx) => {
                            const originalIndex = state.teams.findIndex(t => t.id === team.id) + 1;
                            return (
                              <motion.tr 
                                key={team.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className={`group transition-all relative ${idx < 3 ? 'bg-accent/5' : (presentationTheme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5')}`}
                              >
                                <td className="p-3 text-center">
                                  <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center font-black italic text-xs ${
                                    idx === 0 ? 'bg-accent text-white shadow-lg shadow-accent/40' :
                                    idx === 1 ? 'bg-slate-400 text-white' :
                                    idx === 2 ? 'bg-amber-600 text-white' :
                                    (presentationTheme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60')
                                  }`}>
                                    {idx + 1}
                                  </div>
                                </td>
                                <td className={`p-3 text-center text-[10px] font-mono transition-colors ${
                                  presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                                }`}>
                                  #{originalIndex.toString().padStart(2, '0')}
                                </td>
                                <td className="p-3">
                                  <div className="transition-all duration-500">
                                    <div className={`font-black uppercase truncate max-w-[180px] text-xs transition-colors ${
                                      presentationTheme === 'dark' ? 'text-white' : 'text-black'
                                    }`}>{team.name}</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-widest truncate max-w-[180px] transition-colors ${
                                      presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                                    }`}>{team.productName}</div>
                                  </div>
                                </td>
                                {visibleCriteria.map((c, cIdx) => {
                                  const score = getTeamCriterionScore(team.id, c.id);
                                  return (
                                    <td key={c.id} className={`p-3 text-center transition-all ${activeHackathonCriterionIdx === cIdx ? 'bg-accent/5' : ''}`}>
                                      <div className={`font-mono text-xs transition-all duration-500 ${
                                        activeHackathonCriterionIdx === cIdx ? 'text-accent font-bold scale-110' : (presentationTheme === 'dark' ? 'text-white' : 'text-black')
                                      }`}>
                                        {score.toFixed(1)}
                                      </div>
                                    </td>
                                  );
                                })}
                                <td className="p-3 text-right">
                                  <div className="font-black italic text-lg text-accent">
                                    {(team.phaseScores[hackathonPhaseId] || 0).toFixed(1)}
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`px-12 py-4 flex justify-between items-center backdrop-blur-md border-t transition-colors duration-500 ${
                  presentationTheme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white/40 border-black/5'
                }`}>
                  <div className="flex-1 flex items-center gap-4">
                    <div className={`flex gap-2 p-1 rounded-full transition-colors ${
                      presentationTheme === 'dark' ? 'bg-white/10' : 'bg-black/10'
                    }`}>
                      <button 
                        onClick={toggleMusic}
                        disabled={isLoadingMusic || !isPlayerReady}
                        title={!isPlayerReady ? "Loading music..." : isPlayingMusic ? "Pause" : "Play"}
                        className={`w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-all ${
                          isPlayingMusic ? 'bg-accent text-white animate-pulse' : 'bg-white text-accent hover:scale-105 disabled:opacity-50 disabled:scale-100'
                        }`}
                      >
                        {(isLoadingMusic || !isPlayerReady) ? <Loader2 size={12} className="animate-spin" /> : isPlayingMusic ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                      </button>
                      <div className="relative" ref={volumeControlRef}>
                        <button
                          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                          title={isMuted ? 'Muted' : `Volume ${volume}%`}
                          aria-label={isMuted ? 'Muted' : `Volume ${volume} percent`}
                          className={`w-8 h-8 flex items-center justify-center transition-colors ${
                            isMuted || volume === 0
                              ? 'text-rose-500'
                              : showVolumeSlider
                                ? 'text-accent'
                                : (presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
                          }`}
                        >
                          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>

                        {showVolumeSlider && (
                          <div
                            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col items-center gap-2.5 px-2.5 py-3 rounded-xl border shadow-xl ${
                              presentationTheme === 'dark'
                                ? 'bg-[#1a1a1a] border-white/10'
                                : 'bg-white border-black/10'
                            }`}
                          >
                            {/* Fixed width + tabular figures: the readout is the widest child, so
                                without this the card resized as the number changed. */}
                            <span
                              className={`w-9 shrink-0 text-center text-[10px] font-mono font-bold tabular-nums leading-none ${
                                presentationTheme === 'dark' ? 'text-white/70' : 'text-black/70'
                              }`}
                            >
                              {isMuted ? '—' : `${volume}%`}
                            </span>
                            {/*
                              Vertical via writing-mode rather than a rotate() transform, so the
                              track keeps its real hit area and drag direction. direction:rtl puts
                              loud at the top.
                            */}
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={1}
                              value={volume}
                              onChange={e => {
                                setVolume(Number(e.target.value));
                                // Dragging the slider is an intent to hear something.
                                if (isMuted) setIsMuted(false);
                              }}
                              className={`h-28 w-1 rounded-full appearance-none cursor-pointer accent-accent [writing-mode:vertical-lr] [direction:rtl] ${
                                presentationTheme === 'dark' ? 'bg-white/20' : 'bg-black/20'
                              }`}
                            />
                            {/* Mute stays reachable — the speaker button now opens this panel. */}
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              title={isMuted ? 'Unmute' : 'Mute'}
                              className={`shrink-0 transition-colors ${
                                isMuted
                                  ? 'text-rose-500'
                                  : (presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
                              }`}
                            >
                              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`w-8 h-8 flex items-center justify-center transition-colors ${
                          notificationsEnabled ? 'text-accent' : (presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
                        }`}
                      >
                        {notificationsEnabled ? <Bell size={16} fill="currentColor" /> : <BellOff size={16} />}
                      </button>
                    </div>
                    {musicError && (
                      <div className="text-[8px] text-rose-500 font-bold uppercase truncate max-w-[150px]">
                        {musicError}
                      </div>
                    )}
                  </div>

                  {/* Center: Controls */}
                  <div className="flex-1 flex justify-center">
                    <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 border transition-colors ${
                      presentationTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                    }`}>
                      <button 
                        onClick={() => setIsAutoCycling(!isAutoCycling)}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                          isAutoCycling ? 'text-accent' : (presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${isAutoCycling ? 'bg-accent animate-pulse' : 'bg-current opacity-30'}`} />
                        {isAutoCycling ? 'Auto Cycling ON' : 'Auto Cycle Criteria'}
                      </button>
                      <div className={`w-px h-3 ${presentationTheme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />
                      <button 
                        onClick={() => setPresentationTheme(presentationTheme === 'dark' ? 'light' : 'dark')}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                          presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                        }`}
                      >
                        {presentationTheme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                        {presentationTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                      {!isPublicView && (
                        <>
                          <div className={`w-px h-3 ${presentationTheme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />
                          <button
                            onClick={() => setShowPresentationSettings(true)}
                            className={`text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                              presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                            }`}
                          >
                            <Settings2 className="w-3 h-3" />
                            Settings
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-end gap-8">
                    <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      presentationTheme === 'dark' ? 'text-white/20' : 'text-black/20'
                    }`}>
                      Copyright © BASE Playhouse, All Rights Reserved.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowHackathonPresentation(false)}
                  className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 items-center justify-center hover:bg-white/20 transition-colors z-[110] border border-white/10 ${isPublicView ? 'hidden' : 'flex'}`}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Presentation Settings Modal */}
                <AnimatePresence>
                  {showPresentationSettings && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border transition-colors ${
                          presentationTheme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-black/10 text-black'
                        }`}
                      >
                        <div className="px-6 py-4 flex justify-between items-center border-b border-white/10">
                          <h3 className="text-lg font-black uppercase italic tracking-tighter">Presentation Settings</h3>
                          <button onClick={() => setShowPresentationSettings(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                          </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                          {/* Logo Upload */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Hackathon Logo</label>
                            <div className="flex items-center gap-4">
                              <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
                                presentationTheme === 'dark' ? 'bg-white/5 border-white/20' : 'bg-black/5 border-black/20'
                              }`}>
                                {state.hackathonLogo ? (
                                  <img src={state.hackathonLogo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                  <Plus size={24} className="opacity-20" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  className="hidden"
                                  id="logo-upload"
                                  disabled={isUploadingLogo}
                                />
                                <label
                                  htmlFor="logo-upload"
                                  className={`block w-full px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest text-center transition-all flex items-center justify-center gap-2 ${isUploadingLogo ? 'bg-slate-100 text-muted cursor-not-allowed' : 'bg-accent text-white cursor-pointer hover:opacity-90'}`}
                                >
                                  {isUploadingLogo ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                </label>
                                {state.hackathonLogo && (
                                  <button
                                    onClick={() => setState(prev => ({ ...prev, hackathonLogo: '' }))}
                                    className="block w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-bold uppercase text-[10px] tracking-widest text-center hover:bg-red-500/20 transition-all"
                                  >
                                    Remove Logo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Music Settings */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Background Music (Upload or URL)</label>
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  <div className={`flex-1 px-4 py-2 rounded-xl text-xs font-mono border truncate ${
                                    presentationTheme === 'dark' ? 'bg-white/5 border-white/10 text-white/50' : 'bg-black/5 border-black/10 text-black/50'
                                  }`}>
                                    <span className="flex items-center gap-2">
                                      <Music size={12} className="text-accent" />
                                      {musicAudioUrl === defaultBackgroundMusic
                                        ? 'Default track'
                                        : (state.musicUrl ?? '').includes('youtube.com') || (state.musicUrl ?? '').includes('youtu.be')
                                          ? 'YouTube Link'
                                          : (state.musicUrl ?? '').split('/').pop()?.split('?')[0] || 'Music File Uploaded'}
                                    </span>
                                  </div>
                                  {musicAudioUrl !== defaultBackgroundMusic && (
                                    <button
                                      onClick={() => setState(prev => ({ ...prev, musicUrl: '' }))}
                                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title="Revert to the default track"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="relative">
                                    <input 
                                      type="file" 
                                      id="music-upload"
                                      accept="audio/*"
                                      onChange={handleMusicUpload}
                                      className="hidden"
                                      disabled={isUploadingMusic}
                                    />
                                    <label 
                                      htmlFor="music-upload"
                                      className={`block w-full px-4 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                                        isUploadingMusic 
                                          ? 'bg-slate-100 text-muted cursor-not-allowed' 
                                          : 'bg-accent/10 text-accent hover:bg-accent/20'
                                      }`}
                                    >
                                      {isUploadingMusic ? (
                                        <Loader2 size={12} className="animate-spin" />
                                      ) : (
                                        <Upload size={12} />
                                      )}
                                      Upload
                                    </label>
                                  </div>
                                  <div className="relative">
                                    <input 
                                      type="text" 
                                      placeholder="Paste URL..."
                                      value={state.musicUrl?.includes('http') ? state.musicUrl : ''}
                                      onChange={(e) => setState(prev => ({ ...prev, musicUrl: e.target.value }))}
                                      className={`w-full px-4 py-2.5 rounded-xl font-mono text-[10px] border focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${
                                        presentationTheme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                              <p className="text-[8px] opacity-40 italic">Supports MP3, WAV, YouTube, SoundCloud, and Google Drive. Clearing it restores the default track.</p>
                              {musicError && (
                                <p className="text-[9px] text-red-400 font-medium">{musicError}</p>
                              )}
                            </div>
                          </div>

                          {/* CI Color Picker */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">CI Color (Accent)</label>
                            <div className="flex items-center gap-4">
                              <input 
                                type="color" 
                                value={state.hackathonColor}
                                onChange={(e) => setState(prev => ({ ...prev, hackathonColor: e.target.value }))}
                                className="w-12 h-12 rounded-xl border-none bg-transparent cursor-pointer"
                              />
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  value={state.hackathonColor}
                                  onChange={(e) => setState(prev => ({ ...prev, hackathonColor: e.target.value }))}
                                  className={`w-full px-4 py-2 rounded-xl font-mono text-sm border transition-colors ${
                                    presentationTheme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {['#E11D48', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#DB2777', '#4F46E5', '#0891B2', '#0D9488', '#65A30D', '#EA580C', '#475569'].map(color => (
                                <button 
                                  key={color}
                                  onClick={() => setState(prev => ({ ...prev, hackathonColor: color }))}
                                  className="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Visible Criteria Selection */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Visible Criteria</label>
                            <div className={`rounded-2xl border p-4 space-y-2 ${
                              presentationTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                            }`}>
                              {state.phases.find(p => p.id === hackathonPhaseId)?.criteria.map(criterion => {
                                const isHidden = state.hiddenCriteriaIds?.includes(criterion.id);
                                return (
                                  <button
                                    key={criterion.id}
                                    onClick={() => {
                                      const currentHidden = state.hiddenCriteriaIds || [];
                                      const newHidden = isHidden
                                        ? currentHidden.filter(id => id !== criterion.id)
                                        : [...currentHidden, criterion.id];
                                      setState(prev => ({ ...prev, hiddenCriteriaIds: newHidden }));
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                      !isHidden 
                                        ? (presentationTheme === 'dark' ? 'bg-accent/20 text-white' : 'bg-accent/10 text-accent')
                                        : (presentationTheme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/40')
                                    }`}
                                  >
                                    <span className="text-xs font-bold uppercase tracking-tight">{criterion.name}</span>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                      !isHidden ? 'bg-accent text-white' : (presentationTheme === 'dark' ? 'bg-white/10' : 'bg-black/10')
                                    }`}>
                                      {!isHidden ? <Check size={12} /> : null}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[9px] font-medium opacity-40 italic">Select which criteria to display in the presentation table.</p>
                          </div>
                        </div>

                        <div className="p-6 border-t border-white/10">
                          <button 
                            onClick={() => setShowPresentationSettings(false)}
                            className="w-full py-3 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                          >
                            Done
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Compare View Overlay */}
        <AnimatePresence>
          {showCompareView && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/95 z-[9999] overflow-auto backdrop-blur-xl p-4 md:p-8"
            >
              <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                      <GitCompare size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Team Comparison</h2>
                      <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                        {comparison
                          ? `${comparison.teams.length} teams · ${comparison.criterionCount} criteria · ${comparison.tiedCount} effectively level`
                          : 'Select at least two teams'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {comparison && (
                      <button
                        onClick={() => setCompareOnlyDifferences(!compareOnlyDifferences)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          compareOnlyDifferences
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          compareOnlyDifferences ? 'bg-white border-white' : 'border-white/30'
                        }`}>
                          {compareOnlyDifferences && <Check size={10} strokeWidth={4} className="text-accent" />}
                        </span>
                        Only differences
                      </button>
                    )}
                    <button
                      onClick={() => setShowCompareView(false)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all group border border-white/10"
                    >
                      <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {!comparison ? (
                  <div className="py-24 text-center space-y-3">
                    <GitCompare size={40} className="mx-auto text-white/10" />
                    <p className="text-white/40 text-sm">Pick two or more teams to compare them.</p>
                  </div>
                ) : (() => {
                  const { teams, rows, biggestGaps } = comparison;
                  const visibleRows = compareOnlyDifferences
                    ? rows.filter(r => r.kind !== 'criterion' || !r.tied)
                    : rows;

                  const fmt = (v: number | null, row: typeof rows[number]) =>
                    v === null ? '—' : `${v.toFixed(row.kind === 'criterion' ? 2 : 1)}${row.suffix}`;

                  return (
                    <div className="space-y-6">
                      {/* What actually separates them */}
                      {biggestGaps.length > 0 && (
                        <div className="grid gap-3 md:grid-cols-3">
                          {biggestGaps.map((row, idx) => {
                            const bestTeam = teams[row.values.findIndex(v => v !== null && v === row.best)];
                            const worstTeam = teams[row.values.findIndex(v => v !== null && v === row.worst)];
                            return (
                              <div key={row.key} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                                    {idx === 0 ? 'Biggest difference' : `#${idx + 1} difference`}
                                  </span>
                                  <span className="text-[10px] font-mono font-black text-white">
                                    {row.spread.toFixed(2)} gap
                                  </span>
                                </div>
                                <div className="text-sm font-black uppercase tracking-tight text-white leading-tight">{row.label}</div>
                                <div className="space-y-1 text-[10px] font-mono">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-emerald-300 truncate">{bestTeam?.name}</span>
                                    <span className="text-emerald-300 font-bold shrink-0">{fmt(row.best, row)}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-rose-300/80 truncate">{worstTeam?.name}</span>
                                    <span className="text-rose-300/80 font-bold shrink-0">{fmt(row.worst, row)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Same measure on the same row — the point of the redesign */}
                      <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full border-collapse min-w-max">
                          <thead>
                            <tr className="bg-[#141c2e]">
                              <th className="sticky left-0 z-20 bg-[#141c2e] text-left p-4 min-w-[200px] border-b border-r border-white/10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Metric</span>
                              </th>
                              {teams.map(team => (
                                <th key={team.id} className="p-4 min-w-[140px] border-b border-white/10 align-bottom">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="text-left min-w-0">
                                      <div className="text-xs font-black uppercase tracking-tight text-white truncate" title={team.name}>{team.name}</div>
                                      <div className="text-[9px] font-mono text-white/30 truncate">{team.productName}</div>
                                    </div>
                                    <button
                                      onClick={() => toggleCompare(team.id)}
                                      className="text-white/20 hover:text-rose-400 transition-colors shrink-0"
                                      title="Remove from comparison"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                </th>
                              ))}
                              <th className="p-4 min-w-[90px] border-b border-l border-white/10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Gap</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleRows.map(row => {
                              const isHeadline = row.kind === 'final';
                              const isPhase = row.kind === 'phase';
                              const rowBg = isHeadline ? 'bg-accent/10' : isPhase ? 'bg-white/[0.04]' : '';

                              return (
                                <tr key={row.key} className={`border-b border-white/5 ${rowBg}`}>
                                  <th className={`sticky left-0 z-10 text-left p-4 border-r border-white/10 ${
                                    isHeadline ? 'bg-[#1d1a2e]' : isPhase ? 'bg-[#171e30]' : 'bg-[#141c2e]'
                                  }`}>
                                    <div className={`${
                                      isHeadline ? 'text-sm font-black uppercase italic text-accent'
                                        : isPhase ? 'text-xs font-black uppercase text-white'
                                        : 'text-xs font-medium text-white/70 pl-3'
                                    } truncate max-w-[220px]`} title={row.label}>
                                      {row.label}
                                    </div>
                                    {row.note && (
                                      <div className={`text-[9px] font-mono text-white/25 ${row.kind === 'criterion' ? 'pl-3' : ''}`}>{row.note}</div>
                                    )}
                                  </th>

                                  {row.values.map((value, i) => {
                                    const isBest = value !== null && !row.tied && value === row.best;
                                    const isWorst = value !== null && !row.tied && value === row.worst && row.spread > 0;
                                    const deltaFromBest = value !== null && row.best !== null ? value - row.best : null;
                                    const pct = value !== null && row.scaleMax > 0 ? (value / row.scaleMax) * 100 : 0;

                                    return (
                                      <td
                                        key={teams[i].id}
                                        className={`p-4 align-middle ${
                                          isBest ? 'bg-emerald-500/10' : isWorst ? 'bg-rose-500/[0.07]' : ''
                                        }`}
                                      >
                                        <div className="space-y-1.5">
                                          <div className="flex items-baseline gap-2">
                                            <span className={`font-mono font-black tabular-nums ${
                                              isHeadline ? 'text-xl' : 'text-sm'
                                            } ${
                                              isBest ? 'text-emerald-300' : isWorst ? 'text-rose-300' : 'text-white/80'
                                            }`}>
                                              {fmt(value, row)}
                                            </span>
                                            {isBest && (
                                              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400/80">Best</span>
                                            )}
                                            {!isBest && deltaFromBest !== null && deltaFromBest < 0 && (
                                              <span className="text-[9px] font-mono text-white/30 tabular-nums">
                                                {deltaFromBest.toFixed(row.kind === 'criterion' ? 2 : 1)}
                                              </span>
                                            )}
                                          </div>
                                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                              className={`h-full rounded-full ${
                                                isBest ? 'bg-emerald-400' : isWorst ? 'bg-rose-400/70' : 'bg-white/25'
                                              }`}
                                              style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    );
                                  })}

                                  <td className="p-4 border-l border-white/10">
                                    {row.tied ? (
                                      <span className="text-[9px] font-black uppercase tracking-widest text-white/25">Level</span>
                                    ) : (
                                      <span className={`text-xs font-mono font-black tabular-nums ${
                                        row.spreadPct >= 20 ? 'text-accent' : 'text-white/50'
                                      }`}>
                                        {row.spread.toFixed(row.kind === 'criterion' ? 2 : 1)}{row.suffix}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Verdicts, also row-per-scorer so disagreement is visible */}
                      {[
                        { title: 'Judge Verdicts', people: state.judges || [], pick: (t: typeof teams[number], id: string) => t.judgeDecisions?.[id] },
                        { title: 'Mentor Potential', people: state.mentors || [], pick: (t: typeof teams[number], id: string) => t.mentorDecisions?.[id] },
                      ].filter(section => section.people.length > 0).map(section => (
                        <div key={section.title} className="space-y-3">
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{section.title}</div>
                          <div className="overflow-x-auto rounded-2xl border border-white/10">
                            <table className="w-full border-collapse min-w-max">
                              <tbody>
                                {section.people.map(person => {
                                  const verdicts = teams.map(t => section.pick(t, person.id) || null);
                                  const distinct = new Set(verdicts.map(v => v ?? 'none'));
                                  const differs = distinct.size > 1;

                                  return (
                                    <tr key={person.id} className={`border-b border-white/5 ${differs ? 'bg-amber-400/[0.06]' : ''}`}>
                                      <th className="sticky left-0 z-10 bg-[#141c2e] text-left p-3 min-w-[200px] border-r border-white/10">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-white/70 truncate max-w-[150px]">{person.name}</span>
                                          {differs && (
                                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-400/80 shrink-0">Split</span>
                                          )}
                                        </div>
                                      </th>
                                      {verdicts.map((verdict, i) => {
                                        const tone = verdict === 'pass' || verdict === 'high'
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                          : verdict === 'fail' || verdict === 'critical'
                                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                            : verdict === 'not_sure' || verdict === 'medium'
                                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                              : verdict === 'low'
                                                ? 'bg-slate-400/20 text-slate-300 border-slate-400/30'
                                                : 'bg-white/5 text-white/25 border-white/10';
                                        return (
                                          <td key={teams[i].id} className="p-3 min-w-[140px]">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${tone}`}>
                                              {verdict ? String(verdict).replace('_', ' ') : 'Waiting'}
                                            </span>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating compare bar. Centring uses Tailwind's `translate` property, which is separate
            from the `transform` motion writes, so the two do not fight over the same declaration. */}
        <AnimatePresence>
          {selectedCompareTeamIds.length >= 2 && !showCompareView && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-[999]"
            >
              <button
                onClick={() => setShowCompareView(true)}
                className="bg-accent text-ink px-8 py-4 rounded-full font-black uppercase italic tracking-tighter shadow-2xl shadow-accent/40 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all border-2 border-white/20"
              >
                <GitCompare size={20} strokeWidth={3} />
                Compare {selectedCompareTeamIds.length} Teams
              </button>
              <button
                onClick={() => setSelectedCompareTeamIds([])}
                title="Clear the selected teams"
                className="bg-ink text-white px-6 py-4 rounded-full font-black uppercase italic tracking-tighter shadow-2xl shadow-ink/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border-2 border-white/10"
              >
                <X size={18} strokeWidth={3} />
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )}

      {/* Save failures. Rendered outside the app shell so it is visible on every route, including
          the shared scoring links where a rejected write is easiest to miss. */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] max-w-2xl w-[calc(100%-2rem)]"
          >
            <div className="flex items-start gap-3 bg-rose-600 text-white rounded-2xl px-5 py-4 shadow-2xl shadow-rose-900/30 border border-rose-400/40">
              <XCircle size={20} className="shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Not saved</p>
                <p className="text-xs leading-relaxed break-words">{saveError}</p>
              </div>
              <button
                onClick={() => setSaveError(null)}
                className="shrink-0 p-1 rounded-lg hover:bg-white/15 transition-colors"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Music Player Elements */}
      <div 
        className="fixed bottom-0 left-0 z-[-1] pointer-events-none overflow-hidden" 
        style={{ 
          width: '64px', 
          height: '64px', 
          opacity: 0.01
        }}
      >
        <ReactPlayerAny
          key={musicAudioUrl}
          /**
           * react-player v3 renamed `url` to `src` and dropped the v2 `config.youtube.playerVars`
           * / `config.file.attributes` shapes in favour of plain media attributes. Passing the
           * old names silently set no source at all, which is why playback never started.
           */
          ref={mediaRef}
          src={musicAudioUrl || undefined}
          playing={isPlayingMusic && isPlayerReady && !!musicAudioUrl}
          muted={isMuted}
          volume={volume / 100}
          loop
          playsInline
          preload="auto"
          onEnded={() => {
            // Only reached when the source did not honour `loop` on its own.
            const media = mediaRef.current;
            if (!media || !isPlayingMusic) return;
            media.currentTime = 0;
            void media.play?.().catch(() => {});
          }}
          onReady={() => {
            // Ignore a ready event from a source we have already moved off of. Committing it
            // would point readyUrl at the wrong URL and leave the safety timeout armed.
            if (!musicAudioUrl || musicAudioUrl !== latestMusicUrl.current) return;
            // Committed synchronously: the old 200ms delay could not be cancelled, so a
            // pending one from a previous track landed after the switch and clobbered readyUrl.
            setReadyUrl(musicAudioUrl);
            setIsLoadingMusic(false);
            setMusicError(null);
          }}
          onStart={() => {
            console.log("Music Playback Started Successfully");
            setIsLoadingMusic(false);
          }}
          onPlay={() => console.log("Music: Playback started")}
          onPause={() => console.log("Music: Playback paused")}
          onError={(e: any) => {
            if (musicAudioUrl) {
              console.error("Music playback error", e);
              setMusicError(
                musicAudioUrl === defaultBackgroundMusic
                  ? "Could not play the built-in track."
                  : "Playback failed. Check the link, or upload an audio file instead."
              );
              setIsPlayingMusic(false);
              setIsLoadingMusic(false);
            }
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

function NavItem({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: string | number, key?: any }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
        active 
          ? 'bg-ink text-white shadow-md shadow-ink/10' 
          : 'text-muted hover:bg-slate-100 hover:text-ink'
      }`}
    >
      <span className={`${active ? 'text-accent' : 'text-muted group-hover:text-ink'} transition-colors`}>{icon}</span>
      <span className="tracking-tight truncate">{label}</span>
      {badge !== undefined && (
        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-muted'}`}>
          {badge}
        </span>
      )}
      {active && <div className="w-1 h-4 bg-accent rounded-full ml-1" />}
    </button>
  );
}

function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'danger' | 'warning' | 'accent' | 'outline', className?: string }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100',
    accent: 'bg-rose-50 text-accent border border-rose-100',
    outline: 'bg-transparent border border-slate-200 text-slate-500'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
