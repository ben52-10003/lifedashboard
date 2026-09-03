import {
  ODYSSEY_KINDS,
  type BelongingRaisedBy,
  type OdysseyKind,
  type OdysseyPlan,
  type Prototype,
  type PrototypeKind,
  type PrototypeStatus,
} from "./dashboard";
import { ODYSSEY_KIND_CONFIGS } from "./odyssey";

export const PROTOTYPE_INTRO =
  "The questions your Odyssey Plans raised are not homework—they are prototypes waiting to happen. You answer them by talking to people who already live a version of that life, and by trying small experiences that let you feel it. Prototypes are cheap, quick, and built to produce data, not a finished plan.";

export const PROTOTYPE_PROMPT =
  "A Life Design Interview is a conversation, not a job hunt. Ask for someone’s story: how they got to do what they do. A prototype experience is a taste of the life—shadowing, volunteering, a weekend try—not a five-year commitment.";

export const PROTOTYPE_STEPS: string[] = [
  "Review your three Odyssey Plans and the questions you wrote down for each.",
  "Make a list of prototype conversations that might help you answer these questions.",
  "Make a list of prototype experiences that might help you answer these questions.",
  "If you are stuck, and if you have gathered a good group, have a brainstorming session to come up with possibilities. (Don’t have a team? Try mind mapping.)",
  "Build your prototypes by actively seeking out Life Design Interviews and experiences.",
];

export const PROTOTYPE_STATUS_LABELS: Record<PrototypeStatus, string> = {
  idea: "Idea",
  seeking: "Seeking",
  done: "Done",
};

export interface PrototypeKindConfig {
  kind: PrototypeKind;
  title: string;
  intro: string;
  heading: string;
  titleLabel: string;
  titlePlaceholder: string;
  hopeLabel: string;
  hopePlaceholder: string;
  learningLabel: string;
  empty: string;
  addLabel: string;
}

export const PROTOTYPE_KIND_CONFIGS: PrototypeKindConfig[] = [
  {
    kind: "conversation",
    title: "Prototype conversations—Life Design Interview",
    intro:
      "The simplest prototype is a conversation. A Life Design Interview means getting someone’s story—someone living the life you’re considering, or who has real experience in an area you have questions about.",
    heading: "Add a Life Design Interview",
    titleLabel: "Who you’ll talk to",
    titlePlaceholder: "Someone living a version of this life…",
    hopeLabel: "What you want their story to help you understand",
    hopePlaceholder: "What do you want to understand about how they got here, and what it’s really like?",
    learningLabel: "Their story",
    empty: "No interviews yet. Who is already doing the thing you’re contemplating?",
    addLabel: "Add interview",
  },
  {
    kind: "experience",
    title: "Prototype experiences",
    intro:
      "Small, low-cost tries—shadowing, volunteering, a class, a weekend experiment—so you can feel the life rather than just think about it.",
    heading: "Add an experience",
    titleLabel: "What you’ll try",
    titlePlaceholder: "A small try you could do this month…",
    hopeLabel: "What this might answer",
    hopePlaceholder: "What would this experience tell you that thinking cannot?",
    learningLabel: "What you learned",
    empty: "No experiences yet. What’s a cheap, quick way to taste one of these lives?",
    addLabel: "Add experience",
  },
];

export const LEARNING_PLACEHOLDER =
  "What did you hear or feel? What question did this answer—or raise?";

export const STORY_PLACEHOLDER =
  "How they got to doing this. What they love and hate. What a day actually looks like. Their path, not just the job.";

export const REFERRAL_PLACEHOLDER =
  "A trusted friend or colleague who can introduce you…";

export const IMAGINE_PLACEHOLDER =
  "Can you imagine yourself doing this—and loving it—for months and years?";

export const REQUEST_PLACEHOLDER =
  "A short note asking for thirty minutes to hear their story. Don’t call it an interview.";

export const LDI_INTRO =
  "You want the personal story of how this person came to do what they do, and what it’s really like. Most people fail not for lack of talent but for lack of imagination—this conversation is how you borrow some.";

export const LDI_FLIP =
  "If you find yourself answering questions or talking about yourself, stop and turn it back. You are there for their story.";

export const LDI_POINTS: { name: string; prompt: string }[] = [
  {
    name: "Who",
    prompt:
      "Someone doing and living what you’re contemplating, or who has real experience in an area you have questions about. Not just anyone, and not just any story.",
  },
  {
    name: "Their story",
    prompt:
      "How they got there. What they love and hate about the work. What their days look like. Then ask whether you can see yourself in that life.",
  },
  {
    name: "Not a job hunt",
    prompt:
      "If they think you want a job, they start from openings and fit—critique and judgment. That mind-set kills a story and a personal connection. This is a conversation, not an interview.",
  },
  {
    name: "How to ask",
    prompt:
      "Don’t use the word “interview.” You’re asking to hear their story, over coffee, at a time and place that’s convenient for them. A referral from someone they trust makes the yes much more likely.",
  },
];

export function requestSketch(name: string, referral: string): string {
  const who = name.trim() || "[Name]";
  const bridge = referral.trim()
    ? `${referral.trim()} suggested I reach out.`
    : "I’m reaching out because of the work you do.";
  return `Hello ${who} — ${bridge} I’d love to hear some of your story: how you got to doing what you do, and what it’s actually like. Would you have thirty minutes for coffee at a time and place that’s convenient for you?`;
}

export const DREAM_JOB_INTRO =
  "A dream job is not sitting on the doorstep waiting for you. There are no unicorns. What you can find are good jobs in worthwhile places with dedicated people—and among those, a couple you can make close enough to love by seeking and co-creating them.";

export const DREAM_JOB_BELIEF =
  "Dysfunctional belief: My dream job is out there waiting.";

export const DREAM_JOB_REFRAME =
  "Reframe: You design your dream job through a process of actively seeking and co-creating it.";

export const DREAM_JOB_POINTS: { name: string; prompt: string }[] = [
  {
    name: "The hidden market",
    prompt:
      "Most jobs are never posted. That unposted market is not a wall you break through as a job seeker. It is a web of professional relationships open to a sincerely interested inquirer—someone after the story, not the opening.",
  },
  {
    name: "Same tool, twice",
    prompt:
      "The best way to learn what work you might want—Life Design Interviews—is also the reliable way into that web once you know. Volume of authentic story conversations matters more than applications.",
  },
  {
    name: "During the talk",
    prompt:
      "You are still after the story. You are not hunting an opening. That mind-set is what gets you the meeting—and the connection.",
  },
  {
    name: "They often start it",
    prompt:
      "After a real conversation, the other person often notices the fit and raises working there. You do not have to.",
  },
  {
    name: "If they don’t",
    prompt:
      "Never ask “Do you have any openings?”—the answer is usually no. Ask an open-ended steps question about exploring how someone like you might become part of the organization. That is when judging you as a candidate is allowed.",
  },
  {
    name: "Side doors",
    prompt:
      "They may have nothing today and still send you to a partner. Those intros compound. People you already had coffee with show up later in hiring rooms.",
  },
];

export const BELONGING_ASK_PLACEHOLDER =
  "An open-ended question about exploring how someone like you might become part of this organization—not “any openings?”";

export const BELONGING_NOTES_PLACEHOLDER =
  "What happened? They raised it. You asked. An offer. A partner intro. Not yet…";

export const NEXT_PEOPLE_PLACEHOLDER =
  "Who did they suggest you talk to next?";

export const BELONGING_RAISED_LABELS: Record<BelongingRaisedBy, string> = {
  unasked: "Not yet",
  "they-asked": "They raised it",
  "you-asked": "You asked",
};

export function belongingAskSketch(orgHint?: string): string {
  const place = orgHint?.trim()
    ? `what ${orgHint.trim()} is doing`
    : "what you and your colleagues are doing";
  return `The more I learn about ${place}, the more fascinating it becomes. What steps would be involved in exploring how someone like me might become a part of this organization?`;
}

export function storyConversationCount(prototypes: Prototype[]): number {
  return prototypes.filter(
    (item) =>
      item.kind === "conversation" &&
      (item.status === "done" || item.learning.trim().length > 0),
  ).length;
}

export function canExploreBelonging(item: Prototype): boolean {
  return item.status === "done" || item.learning.trim().length > 0;
}

export const BRAINSTORM_PLACEHOLDER =
  "If you’re stuck, dump possibilities here with a group—or on your own. Wild ideas welcome. Don’t filter yet.";

export type PrototypeDraft = Omit<
  Prototype,
  | "id"
  | "kind"
  | "status"
  | "learning"
  | "imagine"
  | "theyRaisedWork"
  | "belongingAsk"
  | "belongingNotes"
  | "nextPeople"
>;

export type PrototypePatch = Partial<Omit<Prototype, "id" | "kind">>;

export function encodePrototypeLink(
  planKind: OdysseyKind | null,
  questionIndex: number | null,
): string {
  if (!planKind) return "";
  if (questionIndex === null) return planKind;
  return `${planKind}:${questionIndex}`;
}

export function decodePrototypeLink(value: string): {
  planKind: OdysseyKind | null;
  questionIndex: number | null;
} {
  if (!value) return { planKind: null, questionIndex: null };
  const [kind, index] = value.split(":");
  if (!(ODYSSEY_KINDS as string[]).includes(kind)) {
    return { planKind: null, questionIndex: null };
  }
  const planKind = kind as OdysseyKind;
  if (index === undefined || index === "") {
    return { planKind, questionIndex: null };
  }
  const n = Number(index);
  if (n !== 0 && n !== 1 && n !== 2) {
    return { planKind, questionIndex: null };
  }
  return { planKind, questionIndex: n };
}

export function planLabel(plan: OdysseyPlan): string {
  const config = ODYSSEY_KIND_CONFIGS.find((item) => item.kind === plan.kind);
  const number = config?.number ?? 0;
  const title = plan.headline.trim() || config?.title || "Untitled";
  return `Life #${number} · ${title}`;
}

export function questionPreview(question: string, index: number): string {
  const trimmed = question.trim();
  if (!trimmed) return `Question ${index + 1}`;
  return trimmed.length > 72 ? `${trimmed.slice(0, 71)}…` : trimmed;
}

export function filledQuestionCount(plans: OdysseyPlan[]): number {
  return plans.reduce(
    (count, plan) => count + plan.questions.filter((question) => question.trim()).length,
    0,
  );
}

export function prototypeCounts(prototypes: Prototype[]) {
  const conversations = prototypes.filter((item) => item.kind === "conversation");
  const experiences = prototypes.filter((item) => item.kind === "experience");
  const done = prototypes.filter((item) => item.status === "done").length;
  const seeking = prototypes.filter((item) => item.status === "seeking").length;
  return {
    conversations: conversations.length,
    experiences: experiences.length,
    done,
    seeking,
    total: prototypes.length,
  };
}

export function questionPrototypeStatus(
  prototypes: Prototype[],
  planKind: OdysseyKind,
  questionIndex: number,
): "none" | "planned" | "done" {
  const linked = prototypes.filter(
    (item) => item.planKind === planKind && item.questionIndex === questionIndex,
  );
  if (linked.some((item) => item.status === "done")) return "done";
  if (linked.length > 0) return "planned";
  return "none";
}

export function planPrototypeStatus(
  prototypes: Prototype[],
  planKind: OdysseyKind,
): "none" | "planned" | "done" {
  const linked = prototypes.filter((item) => item.planKind === planKind);
  if (linked.some((item) => item.status === "done")) return "done";
  if (linked.length > 0) return "planned";
  return "none";
}
