import { useState } from "react";
import type { JournalState } from "../types/dashboard";
import type {
  JournalActivityInput,
  JournalActivityPatch,
} from "../hooks/useDashboardState";
import {
  JOURNAL_INTRO,
  JOURNAL_PROMPT,
  TRY_STUFF_STEPS,
  TRY_STUFF_TITLE,
  daysBetween,
  latestLogDate,
  mondayOfWeek,
  todayISO,
} from "../types/journal";
import { ActivityLog } from "./ActivityLog";
import { AeiouGuide } from "./AeiouGuide";
import { WeeklyReflection } from "./WeeklyReflection";

interface JournalProps {
  journal: JournalState;
  addActivity: (date: string, activity: JournalActivityInput) => void;
  updateActivity: (date: string, id: string, patch: JournalActivityPatch) => void;
  removeActivity: (date: string, id: string) => void;
  upsertReflection: (weekStart: string, notes: string) => void;
}

function cadenceCopy(journal: JournalState, today: string): {
  alert: boolean;
  message: string;
} {
  const latest = latestLogDate(journal.logs.map((log) => log.date));
  const thisWeekStart = mondayOfWeek(today);
  const hasThisWeekReflection = journal.reflections.some(
    (reflection) =>
      reflection.weekStart === thisWeekStart && reflection.notes.trim(),
  );

  if (!latest) {
    return {
      alert: false,
      message:
        "Log activities at least twice a week so you catch what engages and energizes you.",
    };
  }

  const gap = daysBetween(latest, today);
  if (gap > 4) {
    return {
      alert: true,
      message: `It's been ${gap} days since your last log. Log at least twice a week or you'll miss too much.`,
    };
  }

  if (!hasThisWeekReflection) {
    return {
      alert: false,
      message:
        "When you have a few days of logs, write this week's reflection—trends, insights, surprises.",
    };
  }

  return {
    alert: false,
    message:
      "Keep logging. Weekly reflections work best after more than a single experience of each activity.",
  };
}

export function Journal({
  journal,
  addActivity,
  updateActivity,
  removeActivity,
  upsertReflection,
}: JournalProps) {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const cadence = cadenceCopy(journal, todayISO());

  return (
    <div className="journal">
      <header className="dashboard-header">
        <h1>Good Time Journal</h1>
        <p className="dashboard-intro">{JOURNAL_INTRO}</p>
        <p className="dashboard-prompt">{JOURNAL_PROMPT}</p>

        <details className="prompt-questions try-stuff">
          <summary>{TRY_STUFF_TITLE}</summary>
          <ol>
            {TRY_STUFF_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <AeiouGuide />
        </details>
      </header>

      <section
        className={`summary-strip${cadence.alert ? " summary-strip--alert" : ""}`}
        aria-live="polite"
      >
        {cadence.alert ? (
          <>
            <strong>Time to log</strong>
            <span> — {cadence.message}</span>
          </>
        ) : (
          <span>{cadence.message}</span>
        )}
      </section>

      <div className="compass-sections">
        <ActivityLog
          logs={journal.logs}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onAdd={addActivity}
          onUpdate={updateActivity}
          onRemove={removeActivity}
        />
        <WeeklyReflection
          reflections={journal.reflections}
          onChange={upsertReflection}
        />
      </div>
    </div>
  );
}
