import type { IntegrationReflection } from "./dashboard";

export const WORKVIEW_TARGET_WORDS = 250;
export const LIFEVIEW_TARGET_WORDS = 250;

export interface ReflectionConfig {
  id: "workview" | "lifeview";
  title: string;
  intro: string;
  placeholder: string;
  targetWords: number;
  promptQuestions: string[];
}

export interface IntegrationFieldConfig {
  field: keyof IntegrationReflection;
  label: string;
  placeholder: string;
}

export const WORKVIEW_CONFIG: ReflectionConfig = {
  id: "workview",
  title: "Workview Reflection",
  intro:
    "Write a short reflection about your Workview—your philosophy of work, not a job description. Aim for about 250 words. Address what work is and what it means to you: why you work, what good work deserves to be, and how work relates to growth, money, and others.",
  placeholder:
    "Write your work manifesto here. Focus on why you work, not what job you want…",
  targetWords: WORKVIEW_TARGET_WORDS,
  promptQuestions: [
    "Why work?",
    "What's work for?",
    "What does work mean?",
    "How does it relate to the individual, others, society?",
    "What defines good or worthwhile work?",
    "What does money have to do with it?",
    "What do experience, growth, and fulfillment have to do with it?",
  ],
};

export const LIFEVIEW_CONFIG: ReflectionConfig = {
  id: "lifeview",
  title: "Lifeview Reflection",
  intro:
    "Write a reflection on your Lifeview—what matters most to you and provides your definition of \"matters of ultimate concern.\" Aim for about 250 words. Be curious, ask your own questions, and write down whatever critical values and perspectives define your understanding of life.",
  placeholder:
    "Write your Lifeview here. What is the meaning or purpose of life for you?",
  targetWords: LIFEVIEW_TARGET_WORDS,
  promptQuestions: [
    "Why are we here?",
    "What is the meaning or purpose of life?",
    "What is the relationship between the individual and others?",
    "Where do family, country, and the rest of the world fit in?",
    "What is good, and what is evil?",
    "Is there a higher power, God, or something transcendent, and if so, what impact does this have on your life?",
    "What is the role of joy, sorrow, justice, injustice, love, peace, and strife in life?",
  ],
};

export const INTEGRATION_INTRO =
  "Read over your Workview and Lifeview, then write your thoughts on how they fit together. This is often where the biggest \"aha\" moments happen—and may lead to editing one or both views. When your Workview and Lifeview are in harmony, who you are, what you believe, and what you do can align.";

export const INTEGRATION_FIELDS: IntegrationFieldConfig[] = [
  {
    field: "complement",
    label: "Where do your views on work and life complement one another?",
    placeholder: "Describe where your Workview and Lifeview reinforce each other…",
  },
  {
    field: "clash",
    label: "Where do they clash?",
    placeholder: "Describe any tensions or contradictions between your views…",
  },
  {
    field: "drives",
    label: "Does one drive the other? How?",
    placeholder: "Does your Lifeview shape your Workview, or vice versa?",
  },
  {
    field: "general",
    label: "Overall integration thoughts",
    placeholder:
      "Summarize your integration reflections. What might you edit in either view?",
  },
];

export const TRUE_NORTH_SUMMARY =
  "Your integrated Workview and Lifeview give you True North—a compass to know if you're on course. You won't always sail straight; you'll tack with the winds. When life isn't working, you're in transition, or you're pursuing something new, calibrate your compass. Rotate your tires. Change the smoke-detector battery. Re-read your views and make sure they still align.";

export const TRUE_NORTH_REFRAME =
  "Dysfunctional belief: I should know where I'm going! Reframe: I won't always know where I'm going—but I can always know whether I'm going in the right direction.";

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
