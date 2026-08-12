import { Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Tool } from './router';
import { BrandLogo } from './BrandMark';

/**
 * The page at the domain root: pick which tool to open.
 *
 * Styled with the BASE Playhouse corporate identity from the official brand kit — Deep Pro Black,
 * Uplifting Red, Poppins/IBM Plex Sans Thai, minimal radii — so the platform layer reads as the
 * company. Hackathon Hub keeps its own lighter product styling, which makes crossing from here
 * into a tool feel deliberate.
 *
 * Each entry maps to a `Tool` in the router, which owns a URL namespace of its own — so adding the
 * next tool means adding it to `Tool`/`TOOL_SEGMENT` and to this list, with no risk of its routes
 * colliding with Hackathon Hub's.
 */
interface ToolEntry {
  tool: Tool | null;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const TOOLS: ToolEntry[] = [
  {
    tool: 'hackathon-hub',
    name: 'Hackathon Hub',
    tagline: 'Pitching & scoring',
    description:
      'Run a hackathon end to end — criteria and weights, judge and mentor scoring, live leaderboards, and the award presentation.',
    icon: <Trophy className="w-7 h-7" />,
    available: true,
  },
];

export default function ToolLauncher({
  onOpen,
  user,
  onLogout,
}: {
  onOpen: (tool: Tool) => void;
  user: { email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-ink font-brand relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-25%] right-[-5%] w-[45%] h-[55%] bg-brand/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[45%] h-[50%] bg-brand-red-900/25 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-10">
        {/* Pill nav bar, echoing the rounded header on baseplayhouse.co */}
        <header className="flex items-center justify-between gap-4 bg-white/[0.05] border border-white/10 rounded-full pl-6 pr-3 py-3 backdrop-blur-sm">
          <BrandLogo variant="white" className="h-7 w-auto" />

          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-[11px] font-semibold text-white/70 truncate max-w-[220px]">
                  {user.displayName || user.email}
                </p>
                <button
                  onClick={onLogout}
                  className="text-[9px] font-bold text-brand uppercase tracking-[0.18em] hover:brightness-125 transition-all"
                >
                  Sign out
                </button>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border border-white/20" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.email?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </header>

        <div className="mt-16 md:mt-24 mb-12 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand mb-4">Internal tools</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.03]">
            Pick a tool<br />
            <span className="text-white/30">to get to work.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((entry, i) => {
            const openable = entry.available && entry.tool !== null;
            return (
              <motion.button
                key={entry.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                disabled={!openable}
                onClick={() => openable && onOpen(entry.tool as Tool)}
                className={`group text-left rounded-xl p-7 space-y-6 relative overflow-hidden border transition-all duration-300 ${
                  openable
                    ? 'bg-white/[0.05] border-white/10 hover:border-brand/50 hover:bg-white/[0.08] cursor-pointer'
                    : 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-lg bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/25">
                    {entry.icon}
                  </div>
                  {!entry.available && (
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/40 text-[9px] font-bold uppercase tracking-[0.16em] whitespace-nowrap">
                      Coming soon
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-red-300">{entry.tagline}</p>
                  <h2 className="text-xl font-extrabold tracking-tight text-white">{entry.name}</h2>
                  <p className="text-white/40 text-[13px] font-normal leading-relaxed">{entry.description}</p>
                </div>

                {openable && (
                  <div className="pt-5 border-t border-white/10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white group-hover:gap-3 transition-all">
                    Open <ArrowRight size={14} className="text-brand" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
