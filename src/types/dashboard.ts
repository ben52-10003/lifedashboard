export type GaugeLevel = 0.25 | 0.5 | 0.75 | 1;

export type GaugeArea = "health" | "work" | "play" | "love";

export interface GaugeData {
  level: GaugeLevel;
  notes: string;
}

export interface DashboardState {
  health: GaugeData;
  work: GaugeData;
  play: GaugeData;
  love: GaugeData;
  updatedAt: string;
}

export const GAUGE_LEVELS: GaugeLevel[] = [0.25, 0.5, 0.75, 1];

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

export function createDefaultState(): DashboardState {
  return {
    health: createDefaultGauge(),
    work: createDefaultGauge(),
    play: createDefaultGauge(),
    love: createDefaultGauge(),
    updatedAt: new Date().toISOString(),
  };
}

export function needsAttention(level: GaugeLevel): boolean {
  return level <= 0.5;
}
