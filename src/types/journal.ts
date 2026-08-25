import type { EnergyLevel, GaugeLevel } from "./dashboard";
import { LEVEL_LABELS } from "./dashboard";

export const JOURNAL_INTRO =
  "Catch yourself in the act of having a good time. Log the primary activities of your day and how engaged and energized you were—daily if you can, at least twice a week so you don’t miss too much. After a few weeks of variety, reflect weekly on trends, insights, and surprises. That is how you learn what actually works for you.";

export const JOURNAL_PROMPT =
  "A day is made of many moments. Drill into the particulars—not just “that was great” or “that sucked.”";

export const TRY_STUFF_TITLE = "Try Stuff";

export const TRY_STUFF_STEPS: string[] = [
  "Complete a log of your daily activities. Note when you are engaged and/or energized and what you are doing during those times. Try to do this daily, or at the very least every few days.",
  "Continue this daily logging for three weeks.",
  "At the end of each week, jot down your reflections—notice which activities are engaging and energizing, and which ones are not.",
  "Are there any surprises in your reflections?",
  "Zoom in and try to get even more specific about what does or does not engage and energize you.",
  "Use the AEIOU method as needed to help you in your reflections.",
];

export const AEIOU_INTRO =
  "When a log entry is too vague—“meeting, low energy”—zoom in. AEIOU is a way to name the particulars so you can tell what actually engaged or drained you.";

export const AEIOU_ITEMS: { letter: string; name: string; prompt: string }[] = [
  {
    letter: "A",
    name: "Activities",
    prompt:
      "What were you actually doing? What role were you playing—leader, supporter, observer, catalyst?",
  },
  {
    letter: "E",
    name: "Environments",
    prompt:
      "Where were you? Indoors or out? Loud or quiet? Familiar or new? Crowded or sparse? Dark or light?",
  },
  {
    letter: "I",
    name: "Interactions",
    prompt:
      "Who or what were you interacting with—people or machines? New or familiar? Formal or informal?",
  },
  {
    letter: "O",
    name: "Objects",
    prompt:
      "What tools, objects, or devices were part of the experience? Did any of them help—or get in the way?",
  },
  {
    letter: "U",
    name: "Users",
    prompt:
      "Who else was there? What were they like, and what role did you play in relation to them?",
  },
];

export const ACTIVITY_NAME_PLACEHOLDER = "What were you doing? Be specific…";

export const ACTIVITY_NOTES_PLACEHOLDER =
  "Zoom in: what were you doing, where, with whom, and with what? What made this engaging or draining?";

export const ENGAGEMENT_LABEL = "Engaged";
export const ENERGY_LABEL = "Energized";

export const ENGAGEMENT_LEVEL_LABELS: Record<GaugeLevel, string> = LEVEL_LABELS;

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  [-1]: "Very draining",
  [-0.5]: "Draining",
  [0]: "Neutral",
  [0.5]: "Energizing",
  [1]: "Very energizing",
};

export const ENERGY_SHORT_LABELS: Record<EnergyLevel, string> = {
  [-1]: "−−",
  [-0.5]: "−",
  [0]: "0",
  [0.5]: "+",
  [1]: "++",
};

export const REFLECTION_INTRO =
  "Look over your Activity Log and notice trends, insights, surprises—anything that is a clue to what does and doesn’t work for you. Weekly reflections work best when they rest on more than a single experience of each activity.";

export const REFLECTION_PLACEHOLDER =
  "What are you learning? What would you double up on, surround with better energy, or redesign?";

export const REFLECTION_PROMPTS: string[] = [
  "What trends do you notice across the week?",
  "Which activities created flow, or returned more energy than they consumed?",
  "What surprised you?",
  "Which activities drained you—and was it the work itself, the environment, or how you did it?",
  "What would you double up on?",
  "How might you surround energy-negative tasks with rest, rewards, or more engaging work?",
];

export function todayISO(): string {
  return formatDateISO(new Date());
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateISO(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, amount: number): string {
  const date = parseDateISO(iso);
  date.setDate(date.getDate() + amount);
  return formatDateISO(date);
}

export function daysBetween(from: string, to: string): number {
  const start = parseDateISO(from).getTime();
  const end = parseDateISO(to).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function mondayOfWeek(iso: string): string {
  const date = parseDateISO(iso);
  const weekday = date.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + offset);
  return formatDateISO(date);
}

export function formatDisplayDate(iso: string): string {
  return parseDateISO(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatWeekRange(weekStart: string): string {
  const start = parseDateISO(weekStart);
  const end = parseDateISO(addDays(weekStart, 6));
  const startText = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endText = end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startText} – ${endText}`;
}

export function latestLogDate(dates: string[]): string | undefined {
  if (dates.length === 0) return undefined;
  return [...dates].sort()[dates.length - 1];
}
