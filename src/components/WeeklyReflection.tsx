import type { JournalReflection } from "../types/dashboard";
import {
  REFLECTION_INTRO,
  REFLECTION_PLACEHOLDER,
  REFLECTION_PROMPTS,
  formatWeekRange,
  mondayOfWeek,
  todayISO,
} from "../types/journal";
import { AeiouGuide } from "./AeiouGuide";

interface WeeklyReflectionProps {
  reflections: JournalReflection[];
  onChange: (weekStart: string, notes: string) => void;
}

export function WeeklyReflection({ reflections, onChange }: WeeklyReflectionProps) {
  const thisWeekStart = mondayOfWeek(todayISO());
  const thisWeek = reflections.find(
    (reflection) => reflection.weekStart === thisWeekStart,
  );
  const past = reflections.filter(
    (reflection) =>
      reflection.weekStart !== thisWeekStart && reflection.notes.trim(),
  );

  return (
    <section className="compass-section" aria-labelledby="weekly-reflection-heading">
      <header className="compass-section-header">
        <h2 id="weekly-reflection-heading">Weekly reflection</h2>
        <p className="compass-intro">{REFLECTION_INTRO}</p>
      </header>

      <p className="week-range-label">This week · {formatWeekRange(thisWeekStart)}</p>

      <details className="prompt-questions">
        <summary>Prompt questions</summary>
        <ul>
          {REFLECTION_PROMPTS.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </details>

      <AeiouGuide />

      <label className="reflection-label" htmlFor="weekly-reflection">
        <span className="sr-only">This week&apos;s reflection</span>
        <textarea
          id="weekly-reflection"
          className="reflection-field"
          value={thisWeek?.notes ?? ""}
          onChange={(event) => onChange(thisWeekStart, event.target.value)}
          placeholder={REFLECTION_PLACEHOLDER}
          rows={8}
        />
      </label>

      {past.length > 0 && (
        <div className="past-reflections">
          <h3 className="past-reflections-heading">Earlier weeks</h3>
          {past.map((reflection) => (
            <details key={reflection.id} className="past-reflection">
              <summary>Week of {formatWeekRange(reflection.weekStart)}</summary>
              <label className="reflection-label" htmlFor={`past-${reflection.id}`}>
                <span className="sr-only">
                  Reflection for {formatWeekRange(reflection.weekStart)}
                </span>
                <textarea
                  id={`past-${reflection.id}`}
                  className="reflection-field"
                  value={reflection.notes}
                  onChange={(event) =>
                    onChange(reflection.weekStart, event.target.value)
                  }
                  rows={6}
                />
              </label>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
