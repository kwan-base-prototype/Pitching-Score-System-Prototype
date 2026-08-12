export interface SubCriterion {
  id: string;
  name: string;
  description?: string;
  score: number | null;
  type?: 'checkbox' | 'numeric';
}

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  maxScore: number | null;
  weight: number | null; // Percentage weight within its phase
  subCriteria?: SubCriterion[];
}

export interface Team {
  id: string;
  name: string;
  productName: string;
  ideaDetail: string;
  tagline: string;
  hackScore: number; // Legacy/Fallback single score
  finalRank?: string;
  isSortedUp: boolean;
  mentorIds?: string[]; // IDs of mentors assigned to this team
  award?: string; // New field for manual award assignment
  finalScore?: number;
  phaseScores?: Record<string, number>;
  originalIndex?: number;
}

export interface Judge {
  id: string;
  name: string;
  weight?: number | null;
}

export interface Mentor {
  id: string;
  name: string;
  assignedCriteriaIds?: string[]; // IDs of criteria this mentor is allowed to score
  assignedTeamIds?: string[]; // IDs of teams this mentor is allowed to score
}

export interface Phase {
  id: string;
  name: string;
  weight: number | null;
  criteria: Criterion[];
  type: 'judge' | 'mentor';
}

export interface ScoreEntry {
  teamId: string;
  judgeId: string; // For Hackathon, this could be a 'judge' or 'mentor' ID
  criterionId: string;
  score: number | null;
  phaseId: string;
  selectedSubCriteriaIds?: string[];
  subCriteriaValues?: Record<string, number>;
}

export interface JudgeDecision {
  teamId: string;
  judgeId: string;
  phaseId: string;
  decision: 'pass' | 'fail' | 'not_sure' | 'high' | 'medium' | 'low' | 'critical' | null;
}

export interface AwardSlide {
  teamId: string;
  awardName: string;
}

export interface HackathonData {
  id: string;
  ownerId?: string;
  hackathonName?: string;
  hackathonSubtitle?: string;
  hackathonLogo?: string; // Base64 or URL
  hackathonColor?: string; // Hex color
  phases: Phase[];
  teams: Team[];
  judges: Judge[];
  mentors: Mentor[];
  scores: ScoreEntry[];
  decisions: JudgeDecision[];
  hiddenCriteriaIds?: string[];
  awardSlides?: AwardSlide[];
  musicUrl?: string;
  /** ISO timestamp of the last save. Set by the database layer; the UI never reads it. */
  updatedAt?: string;
}

export interface AppState {
  hackathons: HackathonData[];
  selectedHackathonId: string | null;
}
