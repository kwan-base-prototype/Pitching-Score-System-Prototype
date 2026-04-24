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
  RefreshCw,
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
  auth, 
  db, 
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  handleFirestoreError, 
  OperationType, 
  testConnection,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from './firebase';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc,
  Timestamp,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

const ReactPlayerAny = ReactPlayer as any;

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
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white border border-border rounded-[2.5rem] p-10 shadow-2xl shadow-ink/5 space-y-8">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-ink rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-ink/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Trophy className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-ink uppercase italic">Hackathon Hub</h1>
            <p className="text-muted font-bold tracking-widest uppercase text-[10px]">The Ultimate Pitching & Scoring System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-bg border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-ink focus:ring-4 focus:ring-ink/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-ink focus:ring-4 focus:ring-ink/5 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2"
              >
                <XCircle size={16} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white rounded-2xl py-4 font-black uppercase italic tracking-tighter text-lg shadow-xl shadow-ink/20 hover:bg-ink/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
                  {isLogin ? 'Sign In' : 'Create Account'}
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
              className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
          Built with precision for innovators
        </p>
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
  musicUrl: 'https://www.youtube.com/watch?v=RIu4vp_PuXU&t=5s',
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
  musicUrl: '',
};

const INITIAL_APP_STATE: AppState = {
  hackathons: [INITIAL_HACKATHON_DATA],
  selectedHackathonId: null,
};

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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isExternalView, setIsExternalView] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHackathonPresentation, setShowHackathonPresentation] = useState(false);
  const [showPresentationSettings, setShowPresentationSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [appState, setAppState] = useState<AppState>(INITIAL_APP_STATE);

  const state = useMemo(() => {
    return appState.hackathons.find(h => h.id === appState.selectedHackathonId) || EMPTY_HACKATHON_DATA;
  }, [appState.hackathons, appState.selectedHackathonId]);

  const setState = (updates: HackathonData | ((prev: HackathonData) => HackathonData)) => {
    const currentHackathon = appState.hackathons.find(h => h.id === appState.selectedHackathonId);
    if (!currentHackathon) return;

    const nextHackathon = typeof updates === 'function' ? updates(currentHackathon) : updates;

    setAppState(prev => ({
      ...prev,
      hackathons: prev.hackathons.map(h => h.id === nextHackathon.id ? nextHackathon : h)
    }));

    // Firestore update
    if (isAdmin && nextHackathon.id) {
      const hackathonDoc = doc(db, 'hackathons', nextHackathon.id);
      const { scores, decisions, ...metadata } = nextHackathon;
      setDoc(hackathonDoc, {
        ...metadata,
        updatedAt: Timestamp.now()
      }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `hackathons/${nextHackathon.id}`));
    }
  };

  const isAdmin = useMemo(() => {
    const currentHackathon = appState.hackathons.find(h => h.id === appState.selectedHackathonId);
    return user?.email === 'kwanthananon.ar@baseplayhouse.co' || (user && currentHackathon?.ownerId === user.uid);
  }, [user, appState.hackathons, appState.selectedHackathonId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const id = params.get('id');
    const hackathonId = params.get('hackathonId');

    if (role && id) {
      setIsExternalView(true);
      setActiveTab(`${role}-${id}`);
      
      if (hackathonId) {
        setAppState(prev => ({ ...prev, selectedHackathonId: hackathonId }));
      }
    }
  }, []);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedCompareTeamIds, setSelectedCompareTeamIds] = useState<string[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);
  const [showAwardPresentation, setShowAwardPresentation] = useState(false);
  const [showAwardConfig, setShowAwardConfig] = useState(false);
  const [awardPresentationStep, setAwardPresentationStep] = useState(0);
  const [awardSlides, setAwardSlides] = useState<{ teamId: string, awardName: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allScoresSort, setAllScoresSort] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'finalScore', direction: 'desc' });
  const [activeTablePhaseId, setActiveTablePhaseId] = useState<string | null>(null);
  const [activeTableJudgeId, setActiveTableJudgeId] = useState<string | null>('all');
  const [activeHackathonCriterionIdx, setActiveHackathonCriterionIdx] = useState(0);
  const [isEditingHackathonInfo, setIsEditingHackathonInfo] = useState(false);
  const [revealedRanks, setRevealedRanks] = useState<number[]>([]);
  const [presentationTheme, setPresentationTheme] = useState<'dark' | 'light'>('dark');
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  
  // Music & Notification States
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [previousRankings, setPreviousRankings] = useState<string[]>([]);
  const [readyUrl, setReadyUrl] = useState<string>('');

  const musicAudioUrl = useMemo(() => {
    if (!state.musicUrl) return '';
    
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

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    testConnection();
    return () => unsubscribe();
  }, []);

  // Firestore Sync - Hackathons
  useEffect(() => {
    if (!isAuthReady) return;

    const q = query(collection(db, 'hackathons'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hackathons: HackathonData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as HackathonData;
        hackathons.push({
          ...EMPTY_HACKATHON_DATA,
          ...data,
          // We'll merge scores/decisions separately if this is the selected one
          scores: data.scores || [],
          decisions: data.decisions || []
        });
      });
      
      setAppState(prev => ({
        ...prev,
        hackathons: hackathons.length > 0 ? hackathons : prev.hackathons
      }));

      // Bootstrap if absolutely empty and user is admin
      if (hackathons.length === 0 && user?.email === 'kwanthananon.ar@baseplayhouse.co') {
        const initialId = generateId();
        const initialDoc = doc(db, 'hackathons', initialId);
        setDoc(initialDoc, {
          ...INITIAL_HACKATHON_DATA,
          id: initialId,
          ownerId: user.uid,
          updatedAt: Timestamp.now()
        }).catch(err => handleFirestoreError(err, OperationType.CREATE, 'hackathons'));
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'hackathons');
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  // Firestore Sync - Scores & Decisions for selected hackathon
  useEffect(() => {
    if (!appState.selectedHackathonId || !isAuthReady) return;

    const scoresRef = collection(db, 'hackathons', appState.selectedHackathonId, 'scores');
    const unsubscribeScores = onSnapshot(scoresRef, (snapshot) => {
      const scores: ScoreEntry[] = [];
      snapshot.forEach(doc => scores.push(doc.data() as ScoreEntry));
      
      setAppState(prev => ({
        ...prev,
        hackathons: prev.hackathons.map(h => 
          h.id === appState.selectedHackathonId ? { ...h, scores } : h
        )
      }));
    });

    const decisionsRef = collection(db, 'hackathons', appState.selectedHackathonId, 'decisions');
    const unsubscribeDecisions = onSnapshot(decisionsRef, (snapshot) => {
      const decisions: JudgeDecision[] = [];
      snapshot.forEach(doc => decisions.push(doc.data() as JudgeDecision));
      
      setAppState(prev => ({
        ...prev,
        hackathons: prev.hackathons.map(h => 
          h.id === appState.selectedHackathonId ? { ...h, decisions } : h
        )
      }));
    });

    return () => {
      unsubscribeScores();
      unsubscribeDecisions();
    };
  }, [appState.selectedHackathonId, isAuthReady]);

  const login = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      // Create/Update user doc
      const userDoc = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userDoc);
      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          uid: result.user.uid,
          email: result.user.email,
          role: result.user.email === 'kwanthananon.ar@baseplayhouse.co' ? 'admin' : 'user'
        });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signup = async (email: string, pass: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const userDoc = doc(db, 'users', result.user.uid);
      await setDoc(userDoc, {
        uid: result.user.uid,
        email: result.user.email,
        role: result.user.email === 'kwanthananon.ar@baseplayhouse.co' ? 'admin' : 'user'
      });
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => signOut(auth);

  // Removed localStorage persistence

  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});
  const [collapsedCriteria, setCollapsedCriteria] = useState<Record<string, boolean>>({});
  const [collapsedPhaseSections, setCollapsedPhaseSections] = useState<Record<string, boolean>>({});
  const [activeScoringPhaseId, setActiveScoringPhaseId] = useState<string | null>(null);
  const [activeScoringJudgeId, setActiveScoringJudgeId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const storageRef = ref(storage, `logos/${state.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setState(prev => ({ ...prev, hackathonLogo: downloadURL }));
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

  const togglePhaseCollapse = (id: string) => {
    setCollapsedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCriterionCollapse = (id: string) => {
    setCollapsedCriteria(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePhaseSectionCollapse = (id: string) => {
    setCollapsedPhaseSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Removed localStorage persistence

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
              const judgeWeight = judge?.weight || 1; // Default to 1 if not set

              const judgeScores = phaseEntries.filter(s => s.judgeId === judgeId);
              if (judgeScores.length > 0) {
                let judgeWeightedScore = 0;
                let totalWeightUsed = 0;
                phase.criteria.forEach(c => {
                  const entry = judgeScores.find(e => e.criterionId === c.id);
                  const score = getEffectiveScore(entry, c) || 0; // Treat null as 0
                  if (c.maxScore && c.weight) {
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
                    const score = getEffectiveScore(entry, c) || 0;
                    if (c.maxScore && c.weight) {
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
      const lastPhaseId = state.phases && state.phases.length > 0 ? state.phases[state.phases.length - 1].id : null;
      
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
                const weight = judge?.weight || 1;
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
      const storageRef = ref(storage, `music/${state.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update state and Firestore
      const updatedHackathon = { ...state, musicUrl: downloadURL };
      const hackathonDoc = doc(db, 'hackathons', state.id);
      await setDoc(hackathonDoc, {
        musicUrl: downloadURL,
        updatedAt: Timestamp.now()
      }, { merge: true });
      
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

  // Reset player ready state when URL changes
  useEffect(() => {
    if (musicAudioUrl) {
      if (readyUrl !== musicAudioUrl) {
        setIsLoadingMusic(true);
        setMusicError(null);
      }

      // Safety timeout: if it takes more than 10 seconds, allow user to try playing
      const timeout = setTimeout(() => {
        if (readyUrl !== musicAudioUrl) {
          console.warn("Music player taking too long to load, enabling controls anyway.");
          setIsLoadingMusic(false);
          setReadyUrl(musicAudioUrl); // Force ready so user can try to play
        }
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      setReadyUrl('');
      setIsLoadingMusic(false);
      setIsPlayingMusic(false);
    }
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

  const deleteTeam = (id: string) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== id),
      scores: prev.scores.filter(s => s.teamId !== id),
      decisions: prev.decisions.filter(d => d.teamId !== id)
    }));
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
    const teams = [...state.teams];
    const oldIndex = teams.findIndex(t => t.id === id);
    if (oldIndex === -1) return;
    
    const [movedTeam] = teams.splice(oldIndex, 1);
    const targetIndex = Math.max(0, Math.min(newIndex, teams.length));
    teams.splice(targetIndex, 0, movedTeam);
    
    setState(prev => ({ ...prev, teams }));
  };

  const loadMockData = async () => {
    if (!appState.selectedHackathonId) return;
    setIsDemoLoading(true);

    // Use current state or default structure if empty
    const baseState = state.teams.length > 0 ? state : { ...INITIAL_HACKATHON_DATA, id: appState.selectedHackathonId };
    
    // Ensure the base structure is saved to Firestore first
    setState(baseState);

    const mockScores: ScoreEntry[] = [];
    const mockDecisions: JudgeDecision[] = [];

    baseState.teams.forEach((team, tIdx) => {
      const isSimpleTeam = tIdx < 5;
      const simpleScore = 10 - (tIdx * 2); // 10, 8, 6, 4, 2

      // Hackathon (Mentor)
      baseState.mentors.forEach(mentor => {
        baseState.phases.find(p => p.id === 'hack')?.criteria.forEach(c => {
          mockScores.push({
            teamId: team.id,
            judgeId: mentor.id,
            criterionId: c.id,
            phaseId: 'hack',
            score: isSimpleTeam ? simpleScore : Math.floor(Math.random() * 4) + 7
          });
        });

        // Potential for Hackathon
        const potentials: ('high' | 'medium' | 'low' | 'critical')[] = ['high', 'high', 'medium', 'low'];
        mockDecisions.push({
          teamId: team.id,
          judgeId: mentor.id,
          phaseId: 'hack',
          decision: isSimpleTeam ? (tIdx < 3 ? 'high' : 'medium') : potentials[Math.floor(Math.random() * potentials.length)]
        });
      });

      // Mentoring (Mentors)
      baseState.mentors.forEach(mentor => {
        baseState.phases.find(p => p.id === 'mentoring')?.criteria.forEach(c => {
          mockScores.push({
            teamId: team.id,
            judgeId: mentor.id,
            criterionId: c.id,
            phaseId: 'mentoring',
            score: isSimpleTeam ? simpleScore : Math.floor(Math.random() * 5) + 6
          });
        });

        // Potential for Mentoring
        const potentials: ('high' | 'medium' | 'low' | 'critical')[] = ['high', 'medium', 'medium', 'low'];
        mockDecisions.push({
          teamId: team.id,
          judgeId: mentor.id,
          phaseId: 'mentoring',
          decision: isSimpleTeam ? (tIdx < 3 ? 'high' : 'medium') : potentials[Math.floor(Math.random() * potentials.length)]
        });
      });

      // Pitching (Judges)
      baseState.judges.forEach(judge => {
        baseState.phases.find(p => p.id === 'pitching')?.criteria.forEach(c => {
          mockScores.push({
            teamId: team.id,
            judgeId: judge.id,
            criterionId: c.id,
            phaseId: 'pitching',
            score: isSimpleTeam ? simpleScore : Math.floor(Math.random() * 5) + 6
          });
        });

        // Verdict
        const decisions: ('pass' | 'fail' | 'not_sure')[] = ['pass', 'pass', 'fail', 'not_sure'];
        mockDecisions.push({
          teamId: team.id,
          judgeId: judge.id,
          phaseId: 'pitching',
          decision: isSimpleTeam ? (tIdx < 2 ? 'pass' : (tIdx < 4 ? 'not_sure' : 'fail')) : decisions[Math.floor(Math.random() * decisions.length)]
        });
      });
    });

    // Write scores and decisions to Firestore sub-collections
    try {
      const scorePromises = mockScores.map(score => {
        const scoreId = `${score.teamId}_${score.judgeId}_${score.criterionId}_${score.phaseId}`;
        const scoreDoc = doc(db, 'hackathons', appState.selectedHackathonId!, 'scores', scoreId);
        return setDoc(scoreDoc, score).catch(err => handleFirestoreError(err, OperationType.WRITE, `hackathons/${appState.selectedHackathonId}/scores/${scoreId}`));
      });

      const decisionPromises = mockDecisions.map(decision => {
        const decisionId = `${decision.teamId}_${decision.judgeId}_${decision.phaseId}`;
        const decisionDoc = doc(db, 'hackathons', appState.selectedHackathonId!, 'decisions', decisionId);
        return setDoc(decisionDoc, decision).catch(err => handleFirestoreError(err, OperationType.WRITE, `hackathons/${appState.selectedHackathonId}/decisions/${decisionId}`));
      });

      await Promise.all([...scorePromises, ...decisionPromises]);
    } catch (err) {
      console.error("Mock data generation error:", err);
      // Re-throw to be caught by ErrorBoundary or displayed in UI
      throw err;
    }

    setIsDemoLoading(false);
  };

  const clearAllData = () => {
    setState(prev => ({ ...EMPTY_HACKATHON_DATA, id: prev.id }));
    setShowClearConfirm(false);
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
    setState(prev => ({
      ...prev,
      judges: prev.judges.filter(j => j.id !== id),
      scores: prev.scores.filter(s => s.judgeId !== id),
      decisions: prev.decisions.filter(d => d.judgeId !== id)
    }));
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
    setState(prev => ({
      ...prev,
      mentors: prev.mentors.filter(m => m.id !== id),
      teams: prev.teams.map(t => ({
        ...t,
        mentorIds: t.mentorIds?.filter(mid => mid !== id)
      }))
    }));
  };

  const updateScore = (teamId: string, judgeId: string, criterionId: string, score: number | null, phaseId: string, selectedSubCriteriaIds?: string[], subCriteriaValues?: Record<string, number>) => {
    if (!appState.selectedHackathonId) return;

    const scoreData: ScoreEntry = { teamId, judgeId, criterionId, score, phaseId };
    if (selectedSubCriteriaIds !== undefined) scoreData.selectedSubCriteriaIds = selectedSubCriteriaIds;
    if (subCriteriaValues !== undefined) scoreData.subCriteriaValues = subCriteriaValues;
    
    const scoreId = `${teamId}_${judgeId}_${criterionId}_${phaseId}`;
    
    // Optimistic local update
    setAppState(prev => ({
      ...prev,
      hackathons: prev.hackathons.map(h => {
        if (h.id !== appState.selectedHackathonId) return h;
        const otherScores = h.scores.filter(s => !(s.teamId === teamId && s.judgeId === judgeId && s.criterionId === criterionId && s.phaseId === phaseId));
        return { ...h, scores: [...otherScores, scoreData] };
      })
    }));

    // Firestore update
    const scoreDoc = doc(db, 'hackathons', appState.selectedHackathonId, 'scores', scoreId);
    setDoc(scoreDoc, scoreData).catch(err => handleFirestoreError(err, OperationType.UPDATE, `scores/${scoreId}`));
  };

  const updateDecision = (teamId: string, judgeId: string, phaseId: string, decision: JudgeDecision['decision']) => {
    if (!appState.selectedHackathonId) return;

    const decisionData: JudgeDecision = { teamId, judgeId, phaseId, decision };
    const decisionId = `${teamId}_${judgeId}_${phaseId}`;

    // Optimistic local update
    setAppState(prev => ({
      ...prev,
      hackathons: prev.hackathons.map(h => {
        if (h.id !== appState.selectedHackathonId) return h;
        const otherDecisions = h.decisions.filter(d => !(d.teamId === teamId && d.judgeId === judgeId && d.phaseId === phaseId));
        return { ...h, decisions: [...otherDecisions, decisionData] };
      })
    }));

    // Firestore update
    const decisionDoc = doc(db, 'hackathons', appState.selectedHackathonId, 'decisions', decisionId);
    setDoc(decisionDoc, decisionData).catch(err => handleFirestoreError(err, OperationType.UPDATE, `decisions/${decisionId}`));
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
    setState(prev => ({
      ...prev,
      phases: prev.phases.filter(p => p.id !== id),
      scores: prev.scores.filter(s => s.phaseId !== id),
      decisions: prev.decisions.filter(d => d.phaseId !== id)
    }));
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
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === phaseId ? {
        ...p,
        criteria: p.criteria.filter(c => c.id !== criterionId)
      } : p),
      scores: prev.scores.filter(s => s.criterionId !== criterionId)
    }));
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
      hackathons: [...prev.hackathons, newHackathon],
      selectedHackathonId: newId
    }));

    // Firestore update
    const hackathonDoc = doc(db, 'hackathons', newId);
    setDoc(hackathonDoc, {
      ...newHackathon,
      updatedAt: Timestamp.now()
    }).catch(err => handleFirestoreError(err, OperationType.CREATE, `hackathons/${newId}`));
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
        hackathons: prev.hackathons.filter(h => h.id !== hackathonToDelete),
        selectedHackathonId: prev.selectedHackathonId === hackathonToDelete ? null : prev.selectedHackathonId
      }));

      // Firestore update
      const hackathonDoc = doc(db, 'hackathons', hackathonToDelete);
      deleteDoc(hackathonDoc).catch(err => handleFirestoreError(err, OperationType.DELETE, `hackathons/${hackathonToDelete}`));
      
      setHackathonToDelete(null);
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pitching_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-ink" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={login} onSignup={signup} />;
  }

  return (
    <ErrorBoundary>
      {!appState.selectedHackathonId ? (
        <div className="min-h-screen bg-bg p-12">
          <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-ink uppercase italic">Hackathon Hub</h1>
                <p className="text-muted font-bold tracking-widest uppercase text-xs mt-2">Select a hackathon to manage or score</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-ink uppercase tracking-wider">{user.displayName || user.email}</p>
                    <button onClick={logout} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline">Logout</button>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-ink text-accent flex items-center justify-center font-black text-xs border-2 border-white shadow-sm">
                      {user.email?.[0].toUpperCase()}
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
                onClick={() => setAppState(prev => ({ ...prev, selectedHackathonId: hackathon.id }))}
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
                      This will permanently delete **{appState.hackathons.find(h => h.id === hackathonToDelete)?.hackathonName}** and all its data. 
                      This action cannot be undone.
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
      {!isExternalView && (
        <nav className="w-64 bg-white border-r border-border flex flex-col p-6 gap-8 overflow-y-auto sticky top-0 h-screen shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center shadow-lg shadow-ink/10 shrink-0">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none">PITCHING SYSTEM</h1>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">Event Scoring</p>
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
            <NavItem active={false} onClick={() => setAppState(prev => ({ ...prev, selectedHackathonId: null }))} icon={<ArrowLeft size={18}/>} label="Back to Home" />
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto p-8">
        {isExternalView && (
          <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center shadow-lg shadow-ink/10 shrink-0">
                <Trophy className="w-6 h-6 text-accent" />
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
                onClick={() => {
                  window.location.href = window.location.origin + window.location.pathname;
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-muted"
                title="Exit External View"
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                          {[...teamScores]
                            .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.productName.toLowerCase().includes(searchQuery.toLowerCase()))
                            .sort((a, b) => {
                              let valA: any = 0;
                              let valB: any = 0;
                              
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
                                valA = (a as any).criteriaScores[allScoresSort.key] || 0;
                                valB = (b as any).criteriaScores[allScoresSort.key] || 0;
                              }

                              if (valA < valB) return allScoresSort.direction === 'desc' ? 1 : -1;
                              if (valA > valB) return allScoresSort.direction === 'desc' ? -1 : 1;
                              return 0;
                            })
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
                                {state.phases.map(phase => (
                                  <React.Fragment key={phase.id}>
                                    {phase.criteria.map(c => (
                                      <td key={c.id} className="p-4 text-center font-mono text-xs">
                                        {((team as any).criteriaScores[c.id] !== null) ? (team as any).criteriaScores[c.id].toFixed(2) : '-'}
                                      </td>
                                    ))}
                                    <td className="p-4 text-center font-mono text-xs font-bold bg-slate-50/50">
                                      {(team.phaseScores[phase.id] || 0).toFixed(2)}
                                    </td>
                                  </React.Fragment>
                                ))}
                                <td className="p-4 text-center bg-accent/5">
                                  <span className="font-mono font-black text-sm text-accent">
                                    {(team.finalScore || 0).toFixed(2)}
                                  </span>
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
                            <h2 className="text-4xl font-extrabold tracking-tight">{state.hackathonName}</h2>
                            <button 
                              onClick={() => setIsEditingHackathonInfo(true)}
                              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-full transition-all text-accent"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 uppercase tracking-widest text-[10px] px-3 py-1">
                              {state.hackathonSubtitle}
                            </Badge>
                            <p className="text-muted text-sm italic">Live rankings based on {state.hackathonName} phase scores only</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => {
                          setRevealedRanks([]);
                          setShowHackathonPresentation(true);
                        }}
                        className="btn-secondary flex items-center gap-2 bg-accent text-white border-none hover:bg-accent/90 shadow-lg shadow-accent/20"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Present Mode</span>
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
                            .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.productName.toLowerCase().includes(searchQuery.toLowerCase()))
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
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter italic uppercase">Finalist Leaderboard</h2>
                    <p className="text-muted text-sm mt-2 font-medium">The ultimate ranking of innovation and execution</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <input 
                        type="text"
                        placeholder="Search finalists..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10 bg-white shadow-sm border-ink/5"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                    </div>
                    <button 
                      onClick={openAwardConfig}
                      className="btn-secondary shrink-0 shadow-sm bg-accent text-white border-none hover:bg-accent/90"
                    >
                      <Play className="w-4 h-4" /> Award Slides
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
                {sortedTeams.length >= 3 && searchQuery === '' && (
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
                        {sortedTeams
                          .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.productName.toLowerCase().includes(searchQuery.toLowerCase()))
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
                                {((team.phaseScores?.[phase.id] || 0) * (phase.weight / 100)).toFixed(2)}
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
                                    <th rowSpan={2} className="p-4 text-center bg-accent/10 w-24 border-b border-border sticky right-0 top-0 z-50">
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
                                  <th className="p-4 text-center bg-slate-100/50 w-24 border-b border-border sticky right-0 top-0 z-50">
                                    <span className="label-micro mb-0">Total</span>
                                  </th>
                                  <th className="p-4 text-center bg-slate-100/50 w-32 border-b border-border sticky right-0 top-0 z-50">
                                    <span className="label-micro mb-0">{phase.type === 'judge' ? 'Verdict' : 'Potential'}</span>
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
                                                                    const finalVal = val !== null ? Math.max(0, Math.min(val, sub.score || Infinity)) : null;
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
                                                      placeholder="-"
                                                      value={scoreValue ?? ''}
                                                      onChange={(e) => {
                                                        const val = e.target.value === '' ? null : Number(e.target.value);
                                                        const finalVal = val !== null ? Math.max(0, Math.min(val, criterion.maxScore || Infinity)) : null;
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
                                    <td className="p-4 text-center bg-accent/5 sticky right-0 z-10 font-black font-mono text-sm text-accent group-hover:bg-accent/10 transition-colors border-b border-border">
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

                                          {false && (
                                            <div className="space-y-3">
                                              <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-1">Potential</div>
                                              <div className="flex gap-2">
                                                {[
                                                  { id: 'high', label: 'High', icon: <Check size={14} />, color: 'bg-emerald-500 border-emerald-500' },
                                                  { id: 'medium', label: 'Medium', icon: <HelpCircle size={14} />, color: 'bg-amber-500 border-amber-500 text-white' },
                                                  { id: 'low', label: 'Low', icon: <HelpCircle size={14} />, color: 'bg-slate-400 border-slate-400 text-white' },
                                                  { id: 'critical', label: 'Critical', icon: <X size={14} />, color: 'bg-rose-500 border-rose-500' }
                                                ].map(d => {
                                                  const active = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === 'system' && dec.phaseId === activePhase.id)?.decision === d.id;
                                                  return (
                                                    <button 
                                                      key={d.id}
                                                      onClick={() => {
                                                        const currentDecision = state.decisions.find(dec => dec.teamId === team.id && dec.judgeId === 'system' && dec.phaseId === activePhase.id)?.decision;
                                                        updateDecision(team.id, 'system', activePhase.id, currentDecision === d.id ? null : d.id as any);
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
                                                                  const finalVal = val !== null ? Math.max(0, Math.min(val, sub.score || Infinity)) : null;
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
                                                        placeholder="Score"
                                                        value={scoreValue ?? ''}
                                                        onChange={(e) => {
                                                          const val = e.target.value === '' ? null : Number(e.target.value);
                                                          const finalVal = val !== null ? Math.max(0, Math.min(val, criterion.maxScore || Infinity)) : null;
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
                                        return (phaseScore * (activePhase.weight / 100)).toFixed(2);
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
                            <div className={`text-[10px] font-mono uppercase font-bold ${phase.criteria.reduce((sum, c) => sum + c.weight, 0) === 100 ? 'text-green-600' : 'text-accent'}`}>
                              {phase.name} Weight Total: {phase.criteria.reduce((sum, c) => sum + c.weight, 0)}%
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
                                      const url = `${window.location.origin}${window.location.pathname}?role=judge&id=${judge.id}&hackathonId=${state.id}`;
                                      navigator.clipboard.writeText(url);
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
                                      const url = `${window.location.origin}${window.location.pathname}?role=mentor&id=${mentor.id}&hackathonId=${state.id}`;
                                      navigator.clipboard.writeText(url);
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
                    <div className="border-b border-ink/10 pb-4">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mentor Scoring: {mentor.name}</h2>
                      <p className="text-ink/40 font-mono text-[10px] uppercase mt-1">Enter scores for your assigned teams across all mentor phases.</p>
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
                                                              const finalVal = val !== null ? Math.max(0, Math.min(val, sub.score || Infinity)) : null;
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
                                                    placeholder="-"
                                                    value={scoreValue ?? ''}
                                                    onChange={(e) => {
                                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                                      const finalVal = val !== null ? Math.max(0, Math.min(val, criterion.maxScore || Infinity)) : null;
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
                                                          const finalVal = val !== null ? Math.max(0, Math.min(val, sub.score || Infinity)) : null;
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
                                                placeholder="-"
                                                value={scoreValue ?? ''}
                                                onChange={(e) => {
                                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                                  const finalVal = val !== null ? Math.max(0, Math.min(val, criterion.maxScore || Infinity)) : null;
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
                        disabled={isDemoLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg ${
                          isDemoLoading 
                            ? 'bg-accent/50 text-white cursor-wait' 
                            : 'bg-accent text-white hover:bg-accent/80 shadow-accent/20'
                        }`}
                      >
                        {isDemoLoading ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Database size={14} />
                        )}
                        {isDemoLoading ? 'Loading...' : 'Load Mock Data'}
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
                        disabled={isDemoLoading}
                        className={`p-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          isDemoLoading 
                            ? 'bg-accent/50 text-white cursor-wait' 
                            : 'bg-accent text-white hover:bg-accent/80 shadow-lg shadow-accent/20'
                        }`}
                      >
                        {isDemoLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Database size={18} /> Load Demo Data
                          </>
                        )}
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
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

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
                    This will permanently delete ALL data including **Criteria (Phases), Teams, and Judges**. 
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
                  ) : (
                    <button 
                      onClick={() => setShowAwardPresentation(false)}
                      className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                    >
                      Finish
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => setShowAwardPresentation(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"
                >
                  <X size={24} />
                </button>
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
            
            const formatTime = (date: Date) => {
              return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase();
            };

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
                  {/* Left: Empty space to keep clock centered */}
                  <div className="flex-1" />

                  {/* Center: Clock */}
                  <div className="flex-1 flex justify-center">
                    <div className={`relative px-6 py-1 rounded-xl border shadow-[0_0_20px_rgba(225,29,72,0.15)] transition-colors ${
                      presentationTheme === 'dark' ? 'bg-black/40 border-accent/30' : 'bg-white/60 border-accent/30'
                    }`}>
                      <div className="text-xl font-mono font-black text-accent tracking-widest">
                        {formatTime(currentTime)}
                      </div>
                      <div className="absolute inset-0 bg-accent/5 blur-xl rounded-2xl -z-10" />
                    </div>
                  </div>

                  {/* Right: Powered By */}
                  <div className="flex-1 flex items-center justify-end gap-6">
                    <div className="text-right">
                      <div className={`text-[8px] font-bold uppercase tracking-widest mb-0.5 transition-colors ${
                        presentationTheme === 'dark' ? 'text-white/40' : 'text-black/40'
                      }`}>Powered By</div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-xs font-black uppercase tracking-tighter">Base Playhouse</div>
                      </div>
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
                        <thead className={`sticky top-0 z-10 transition-colors ${
                          presentationTheme === 'dark' ? 'bg-[#0a0a0a]/80' : 'bg-white/80'
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
                      <button 
                        onClick={() => {
                          setReadyUrl('');
                          setIsLoadingMusic(true);
                          setMusicError(null);
                        }}
                        title="Reload Music"
                        className={`w-8 h-8 flex items-center justify-center transition-colors ${
                          presentationTheme === 'dark' ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'
                        }`}
                      >
                        <RefreshCw size={14} className={isLoadingMusic ? 'animate-spin' : ''} />
                      </button>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-8 h-8 flex items-center justify-center transition-colors ${
                          isMuted ? 'text-rose-500' : (presentationTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
                        }`}
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
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
                  className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-[110] border border-white/10"
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
                                    {state.musicUrl ? (
                                      <span className="flex items-center gap-2">
                                        <Music size={12} className="text-accent" />
                                        {state.musicUrl.includes('youtube.com') || state.musicUrl.includes('youtu.be') 
                                          ? 'YouTube Link' 
                                          : state.musicUrl.split('/').pop()?.split('?')[0] || 'Music File Uploaded'}
                                      </span>
                                    ) : 'No music set'}
                                  </div>
                                  {state.musicUrl && (
                                    <button 
                                      onClick={() => setState(prev => ({ ...prev, musicUrl: '' }))}
                                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title="Remove Music"
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
                              <p className="text-[8px] opacity-40 italic">Supports MP3, WAV, YouTube, SoundCloud, and Google Drive.</p>
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
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-ink shadow-lg shadow-accent/20">
                      <GitCompare size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Team Comparison</h2>
                      <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Comparing {selectedCompareTeamIds.length} selected teams</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCompareView(false)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all group border border-white/10"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedCompareTeamIds.map(teamId => {
                    const team = state.teams.find(t => t.id === teamId);
                    if (!team) return null;
                    
                    // Use the pre-calculated scores for accuracy
                    const teamData = teamScores.find(ts => ts.id === teamId);
                    if (!teamData) return null;

                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={teamId} 
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 hover:bg-white/10 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                        
                        <div className="space-y-2 relative z-10">
                          <div className="flex items-center justify-between">
                            <Badge variant="accent" className="bg-accent/20 text-accent border-accent/30">Team {(team as any).originalIndex + 1}</Badge>
                            <button 
                              onClick={() => toggleCompare(teamId)}
                              className="text-white/20 hover:text-red-400 transition-colors p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-accent transition-colors truncate" title={team.name}>{team.name}</h3>
                          <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest truncate">{team.productName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Final Score</div>
                            <div className="text-2xl font-black text-white">{(teamData.finalScore || 0).toFixed(2)}</div>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Percentage</div>
                            <div className="text-2xl font-black text-accent">{(teamData.finalScore || 0).toFixed(1)}%</div>
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest border-b border-white/10 pb-2">Phase & Criteria Breakdown</div>
                          <div className="space-y-6">
                            {state.phases.map(phase => {
                              const phaseScore = teamData.phaseScores[phase.id] || 0;

                              return (
                                <div key={phase.id} className="space-y-3">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="text-white/80 font-black uppercase truncate max-w-[150px]">{phase.name}</span>
                                      <span className="text-accent font-black italic">{phaseScore.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${phaseScore}%` }}
                                        className="h-full bg-accent shadow-[0_0_8px_rgba(255,100,100,0.4)]"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Criteria Details */}
                                  <div className="grid grid-cols-1 gap-2 pl-2 border-l border-white/5">
                                    {phase.criteria.map(criterion => {
                                      const criterionScore = teamData.criteriaScores[criterion.id];
                                      const displayScore = criterionScore !== null ? criterionScore.toFixed(1) : '-';
                                      const percent = criterionScore !== null ? (criterionScore / criterion.maxScore) * 100 : 0;

                                      return (
                                        <div key={criterion.id} className="flex flex-col gap-1">
                                          <div className="flex justify-between items-center text-[9px]">
                                            <span className="text-white/40 font-medium truncate max-w-[140px]">{criterion.name}</span>
                                            <span className="text-white/60 font-mono">{displayScore} / {criterion.maxScore}</span>
                                          </div>
                                          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden w-full">
                                            <div 
                                              className="h-full bg-white/20"
                                              style={{ width: `${percent}%` }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Judge Decisions */}
                        <div className="space-y-3 relative z-10 pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Judge Decisions</div>
                            <div className="text-[8px] text-white/30 font-mono uppercase">Final Verdict</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {state.judges.map(judge => {
                              const decision = teamData.judgeDecisions?.[judge.id];
                              const hasScored = teamData.scoredByJudgeIds?.includes(judge.id);
                              
                              let statusLabel = 'WAITING';
                              let statusColor = 'bg-white/5 text-white/20 border-white/5';
                              
                              if (decision === 'pass') {
                                statusLabel = 'PASS';
                                statusColor = 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20';
                              } else if (decision === 'fail') {
                                statusLabel = 'FAIL';
                                statusColor = 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20';
                              } else if (decision === 'not_sure') {
                                statusLabel = 'NOT SURE';
                                statusColor = 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20';
                              } else if (hasScored) {
                                statusLabel = 'SCORING';
                                statusColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                              }

                              return (
                                <div 
                                  key={judge.id}
                                  className={`flex flex-col gap-1 p-2.5 rounded-xl border transition-all duration-300 ${statusColor}`}
                                >
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[8px] font-black uppercase truncate max-w-[70px] opacity-80">{judge.name}</span>
                                    {decision === 'pass' && <Check size={10} className="text-white" />}
                                    {decision === 'fail' && <X size={10} className="text-white" />}
                                    {decision === 'not_sure' && <HelpCircle size={10} className="text-white" />}
                                    {!decision && hasScored && <Edit2 size={10} className="text-blue-400" />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-tighter">{statusLabel}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Mentor Potentials */}
                        {((state.mentors && state.mentors.length > 0)) && (
                          <div className="space-y-3 relative z-10 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Mentor Potentials</div>
                              <div className="text-[8px] text-white/30 font-mono uppercase">Potential Rating</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {/* Individual Mentor Decisions */}
                              {state.mentors.map(mentor => {
                                const decision = teamData.mentorDecisions?.[mentor.id];
                                if (!decision) return null;
                                
                                let statusColor = 'bg-white/5 text-white/20 border-white/5';
                                if (decision === 'high') statusColor = 'bg-emerald-500 text-white border-emerald-400';
                                else if (decision === 'medium') statusColor = 'bg-amber-500 text-white border-amber-400';
                                else if (decision === 'low') statusColor = 'bg-slate-400 text-white border-slate-300';
                                else if (decision === 'critical') statusColor = 'bg-rose-500 text-white border-rose-400';

                                return (
                                  <div 
                                    key={mentor.id}
                                    className={`flex flex-col gap-1 p-2.5 rounded-xl border transition-all duration-300 ${statusColor}`}
                                  >
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-[8px] font-black uppercase truncate max-w-[70px] opacity-80">{mentor.name}</span>
                                      {decision === 'high' && <Check size={10} />}
                                      {decision === 'critical' && <X size={10} />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{decision}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Compare Button */}
        <AnimatePresence>
          {selectedCompareTeamIds.length >= 2 && !showCompareView && (
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={() => setShowCompareView(true)}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-accent text-ink px-8 py-4 rounded-full font-black uppercase italic tracking-tighter shadow-2xl shadow-accent/40 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-[999] border-2 border-white/20"
            >
              <GitCompare size={20} strokeWidth={3} />
              Compare {selectedCompareTeamIds.length} Teams
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    )}

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
          url={musicAudioUrl || null}
          playing={isPlayingMusic && isPlayerReady && !!musicAudioUrl}
          muted={isMuted}
          volume={1}
          loop={true}
          playsinline
          config={{
            youtube: {
              playerVars: { 
                autoplay: 0,
                controls: 0,
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
                origin: window.location.origin,
                enablejsapi: 1
              }
            },
            file: {
              attributes: {
                preload: "auto"
              }
            }
          }}
          onReady={() => {
            if (musicAudioUrl) {
              console.log("Music Player Ready:", musicAudioUrl);
              // Small delay to ensure player is fully initialized before allowing play
              setTimeout(() => {
                setReadyUrl(musicAudioUrl);
                setIsLoadingMusic(false);
                setMusicError(null);
              }, 200);
            }
          }}
          onStart={() => {
            console.log("Music Playback Started Successfully");
            setIsLoadingMusic(false);
          }}
          onPlay={() => console.log("YouTube: Playback started")}
          onPause={() => console.log("YouTube: Playback paused")}
          onError={(e: any) => {
            if (musicAudioUrl) {
              console.error("Music playback error", e);
              setMusicError("Playback failed. This video might have embedding restrictions.");
              setIsPlayingMusic(false);
              setIsLoadingMusic(false);
              setReadyUrl('');
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
