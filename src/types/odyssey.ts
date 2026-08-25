import type {
  GaugeLevel,
  OdysseyGaugeKey,
  OdysseyKind,
  OdysseyPlan,
  OdysseyYear,
} from "./dashboard";

export const ODYSSEY_INTRO =
  "Odysseys are powerful tools for prototyping your future. By ideating three unique five-year journeys, you create more possibility. Visualize three wildly different paths—the milestones and accomplishments you’d like to experience. Then use the gauges and questions to assess how you feel about each.";

export const ODYSSEY_PROMPT =
  "The goal is to make each Odyssey wildly different. Give each a six-word title that sums up the key point of the journey, and choose an easy action toward an experience you’re excited about.";

export const ODYSSEY_STEPS: string[] = [
  "Create three alternative five-year plans.",
  "Give each alternative a descriptive six-word title, and write down three questions that arise out of each version of you.",
  "Complete each gauge on the dashboard—ranking each alternative for resources, likability, confidence, and coherence.",
  "Present your plan to another person, a group, or your Life Design Team. Note how each alternative energizes you.",
];

export const HEADLINE_TARGET_WORDS = 6;

export interface OdysseyKindConfig {
  kind: OdysseyKind;
  number: number;
  title: string;
  intro: string;
  headlinePlaceholder: string;
}

export const ODYSSEY_KIND_CONFIGS: OdysseyKindConfig[] = [
  {
    kind: "current",
    number: 1,
    title: "The story you tell today",
    intro:
      "The trajectory you’re on now. What will happen if you continue down this path?",
    headlinePlaceholder: "Six words for the life you’re already living…",
  },
  {
    kind: "pivot",
    number: 2,
    title: "An alternative path",
    intro:
      "What if what you do in life #1 is no longer an option? What will you do if you can no longer live the life you are living today?",
    headlinePlaceholder: "Six words for the life you’d pivot to…",
  },
  {
    kind: "wildcard",
    number: 3,
    title: "Wildcard",
    intro:
      "You have all the money you need, so what kind of life would you like to have? Make this one wildly different.",
    headlinePlaceholder: "Six words for the wild-card life…",
  },
];

export interface OdysseyGaugeConfig {
  key: OdysseyGaugeKey;
  title: string;
  question: string;
  low: string;
  high: string;
}

export const ODYSSEY_GAUGE_CONFIGS: OdysseyGaugeConfig[] = [
  {
    key: "resources",
    title: "Resources",
    question:
      "Do you have the objective resources—time, money, skill, contacts—you need to pull off your plan?",
    low: "0",
    high: "100",
  },
  {
    key: "likability",
    title: "I like it",
    question: "Are you hot or cold or warm about your plan?",
    low: "Cold",
    high: "Hot",
  },
  {
    key: "confidence",
    title: "Confidence",
    question: "Are you feeling full of confidence, or pretty uncertain about pulling this off?",
    low: "Empty",
    high: "Full",
  },
  {
    key: "coherence",
    title: "Coherence",
    question:
      "Does the plan make sense within itself? And is it consistent with you, your Workview, and your Lifeview?",
    low: "0",
    high: "100",
  },
];

export const ODYSSEY_GAUGE_LEVEL_LABELS: Record<
  OdysseyGaugeKey,
  Record<GaugeLevel, string>
> = {
  resources: {
    0.25: "Low",
    0.5: "Some",
    0.75: "Enough",
    1: "Full",
  },
  likability: {
    0.25: "Cold",
    0.5: "Cool",
    0.75: "Warm",
    1: "Hot",
  },
  confidence: {
    0.25: "Empty",
    0.5: "Low",
    0.75: "Steady",
    1: "Full",
  },
  coherence: {
    0.25: "Off",
    0.5: "Partial",
    0.75: "Strong",
    1: "Aligned",
  },
};

export const CONSIDERATION_FIELDS: {
  field: keyof Pick<
    OdysseyPlan,
    "geography" | "learning" | "impact" | "lifeLook" | "otherNotes"
  >;
  label: string;
  placeholder: string;
}[] = [
  {
    field: "geography",
    label: "Geography—where will you live?",
    placeholder: "City, country, climate, how rooted or mobile…",
  },
  {
    field: "learning",
    label: "What experience/learning will you gain?",
    placeholder: "Skills, relationships, credentials, adventures…",
  },
  {
    field: "impact",
    label: "What are the impacts/results of choosing this alternative?",
    placeholder: "On you, the people you love, and the world…",
  },
  {
    field: "lifeLook",
    label: "What will life look like?",
    placeholder: "Role, industry, company—and the rest of a day in this life…",
  },
  {
    field: "otherNotes",
    label: "Other ideas (beyond career and money)",
    placeholder:
      "Love, play, health, contribution. Those things are important, and so are the other critical elements of the next few years.",
  },
];

export const QUESTION_PLACEHOLDERS = [
  "What assumption does this life test?",
  "What would you need to learn or try?",
  "What might this version reveal about you?",
];

export const EVENT_PLACEHOLDER = "A work or life milestone…";

export const ACTION_PLACEHOLDER =
  "An easy action toward an experience you’re excited about…";

export function yearLabel(year: OdysseyYear): string {
  return year === 0 ? "Now" : `Year ${year}`;
}

export function calendarYear(startYear: number, year: OdysseyYear): number {
  return startYear + year;
}

export function headlineWordClass(count: number): string {
  if (count === 0) return "word-count";
  if (count === HEADLINE_TARGET_WORDS) return "word-count word-count--good";
  return "word-count word-count--hint";
}

export function planHasContent(plan: OdysseyPlan): boolean {
  return (
    plan.headline.trim().length > 0 ||
    plan.timeline.some((event) => event.text.trim()) ||
    plan.questions.some((question) => question.trim()) ||
    plan.geography.trim().length > 0 ||
    plan.learning.trim().length > 0 ||
    plan.impact.trim().length > 0 ||
    plan.lifeLook.trim().length > 0 ||
    plan.easyAction.trim().length > 0
  );
}
