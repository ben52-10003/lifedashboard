export type GaugeLevel = 0.25 | 0.5 | 0.75 | 1;

export type GaugeArea = "health" | "work" | "play" | "love";

export interface GaugeData {
  level: GaugeLevel;
  notes: string;
}

export interface IntegrationReflection {
  complement: string;
  clash: string;
  drives: string;
  general: string;
}

export interface CompassState {
  workview: string;
  lifeview: string;
  integration: IntegrationReflection;
  calibrationNotes: string;
}

export type EnergyLevel = -1 | -0.5 | 0 | 0.5 | 1;

export interface JournalActivity {
  id: string;
  name: string;
  engaged: GaugeLevel;
  energized: EnergyLevel;
  notes: string;
}

export interface JournalDayLog {
  date: string;
  activities: JournalActivity[];
}

export interface JournalReflection {
  id: string;
  weekStart: string;
  notes: string;
}

export interface JournalState {
  logs: JournalDayLog[];
  reflections: JournalReflection[];
}

export type MindMapKind = "engagement" | "energy" | "flow";

export interface MindMapNode {
  id: string;
  label: string;
  children: MindMapNode[];
}

export interface LifeAlternative {
  pickedIds: string[];
  jobDescription: string;
  roleName: string;
  napkinSketch: string;
}

export interface MindMap {
  kind: MindMapKind;
  sourceActivityId: string;
  sourceActivityDate: string;
  root: MindMapNode;
  alternative: LifeAlternative;
}

export interface MindMapsState {
  maps: MindMap[];
}

export type OdysseyKind = "current" | "pivot" | "wildcard";

export type OdysseyYear = 0 | 1 | 2 | 3 | 4 | 5;

export type OdysseyGaugeKey = "resources" | "likability" | "confidence" | "coherence";

export interface OdysseyTimelineEvent {
  id: string;
  year: OdysseyYear;
  text: string;
}

export interface OdysseyGauges {
  resources: GaugeLevel;
  likability: GaugeLevel;
  confidence: GaugeLevel;
  coherence: GaugeLevel;
}

export interface OdysseyPlan {
  kind: OdysseyKind;
  headline: string;
  questions: [string, string, string];
  timeline: OdysseyTimelineEvent[];
  gauges: OdysseyGauges;
  geography: string;
  learning: string;
  impact: string;
  lifeLook: string;
  otherNotes: string;
  energyNotes: string;
  easyAction: string;
}

export interface OdysseyState {
  startYear: number;
  plans: OdysseyPlan[];
}

export interface DashboardState {
  health: GaugeData;
  work: GaugeData;
  play: GaugeData;
  love: GaugeData;
  compass: CompassState;
  journal: JournalState;
  mindMaps: MindMapsState;
  odyssey: OdysseyState;
  updatedAt: string;
}

export const GAUGE_LEVELS: GaugeLevel[] = [0.25, 0.5, 0.75, 1];

export const ENERGY_LEVELS: EnergyLevel[] = [-1, -0.5, 0, 0.5, 1];

export const LEVEL_LABELS: Record<GaugeLevel, string> = {
  0.25: "Quarter",
  0.5: "Half",
  0.75: "Three-quarters",
  1: "Full",
};

export interface GaugeConfig {
  area: GaugeArea;
  title: string;
  subtitle: string;
  placeholder: string;
}

export const GAUGE_CONFIGS: GaugeConfig[] = [
  {
    area: "health",
    title: "Health",
    subtitle: "Body, mind, and spirit",
    placeholder:
      "How is your physical health, mental well-being, and spiritual life?",
  },
  {
    area: "work",
    title: "Work",
    subtitle: "Paid and unpaid labor",
    placeholder:
      "List all the ways you work—your job, consulting, volunteering, homemaking, caregiving…",
  },
  {
    area: "play",
    title: "Play",
    subtitle: "Joy for its own sake",
    placeholder:
      "What activities bring you joy just for the pure sake of doing them?",
  },
  {
    area: "love",
    title: "Love",
    subtitle: "Giving and receiving affection",
    placeholder:
      "Where is love flowing in your life—from you and from others?",
  },
];

export function createDefaultGauge(): GaugeData {
  return { level: 0.5, notes: "" };
}

export function createDefaultIntegration(): IntegrationReflection {
  return {
    complement: "",
    clash: "",
    drives: "",
    general: "",
  };
}

export function createDefaultCompass(): CompassState {
  return {
    workview: "",
    lifeview: "",
    integration: createDefaultIntegration(),
    calibrationNotes: "",
  };
}

export function createDefaultJournal(): JournalState {
  return {
    logs: [],
    reflections: [],
  };
}

export const MIND_MAP_KINDS: MindMapKind[] = ["engagement", "energy", "flow"];

export function createDefaultLifeAlternative(): LifeAlternative {
  return {
    pickedIds: [],
    jobDescription: "",
    roleName: "",
    napkinSketch: "",
  };
}

export function createDefaultMindMap(kind: MindMapKind): MindMap {
  return {
    kind,
    sourceActivityId: "",
    sourceActivityDate: "",
    root: { id: `${kind}-root`, label: "", children: [] },
    alternative: createDefaultLifeAlternative(),
  };
}

export function createDefaultMindMaps(): MindMapsState {
  return {
    maps: MIND_MAP_KINDS.map(createDefaultMindMap),
  };
}

export const ODYSSEY_KINDS: OdysseyKind[] = ["current", "pivot", "wildcard"];

export const ODYSSEY_YEARS: OdysseyYear[] = [0, 1, 2, 3, 4, 5];

export function createDefaultOdysseyGauges(): OdysseyGauges {
  return {
    resources: 0.5,
    likability: 0.5,
    confidence: 0.5,
    coherence: 0.5,
  };
}

export function createDefaultOdysseyPlan(kind: OdysseyKind): OdysseyPlan {
  return {
    kind,
    headline: "",
    questions: ["", "", ""],
    timeline: [],
    gauges: createDefaultOdysseyGauges(),
    geography: "",
    learning: "",
    impact: "",
    lifeLook: "",
    otherNotes: "",
    energyNotes: "",
    easyAction: "",
  };
}

export function createDefaultOdyssey(): OdysseyState {
  return {
    startYear: new Date().getFullYear(),
    plans: ODYSSEY_KINDS.map(createDefaultOdysseyPlan),
  };
}

export function createDefaultState(): DashboardState {
  return {
    health: createDefaultGauge(),
    work: createDefaultGauge(),
    play: createDefaultGauge(),
    love: createDefaultGauge(),
    compass: createDefaultCompass(),
    journal: createDefaultJournal(),
    mindMaps: createDefaultMindMaps(),
    odyssey: createDefaultOdyssey(),
    updatedAt: new Date().toISOString(),
  };
}

export function needsAttention(level: GaugeLevel): boolean {
  return level <= 0.5;
}
