import { useState, type FormEvent } from "react";
import type { JournalDayLog } from "../types/dashboard";
import type {
  JournalActivityInput,
  JournalActivityPatch,
} from "../hooks/useDashboardState";
import {
  ACTIVITY_NAME_PLACEHOLDER,
  ENERGY_LABEL,
  ENGAGEMENT_LABEL,
  addDays,
  formatDisplayDate,
  todayISO,
} from "../types/journal";
import { ActivityRow } from "./ActivityRow";
import { EngagementMeter } from "./EngagementMeter";
import { EnergyMeter } from "./EnergyMeter";

interface ActivityLogProps {
  logs: JournalDayLog[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onAdd: (date: string, activity: JournalActivityInput) => void;
  onUpdate: (date: string, id: string, patch: JournalActivityPatch) => void;
  onRemove: (date: string, id: string) => void;
}

const EMPTY_DRAFT: JournalActivityInput = {
  name: "",
  engaged: 0.5,
  energized: 0,
  notes: "",
};

export function ActivityLog({
  logs,
  selectedDate,
  onSelectDate,
  onAdd,
  onUpdate,
  onRemove,
}: ActivityLogProps) {
  const [draft, setDraft] = useState<JournalActivityInput>(EMPTY_DRAFT);
  const today = todayISO();
  const isToday = selectedDate === today;
  const dayLog = logs.find((log) => log.date === selectedDate);
  const activities = dayLog?.activities ?? [];

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    onAdd(selectedDate, { ...draft, name });
    setDraft(EMPTY_DRAFT);
  }

  return (
    <section className="compass-section" aria-labelledby="activity-log-heading">
      <header className="compass-section-header">
        <h2 id="activity-log-heading">Activity Log</h2>
        <p className="compass-intro">
          List the primary activities of this day and how engaged and energized
          you were. Specifics beat summaries.
        </p>
      </header>

      <div className="date-nav">
        <button
          type="button"
          className="date-nav-button"
          onClick={() => onSelectDate(addDays(selectedDate, -1))}
          aria-label="Previous day"
        >
          Previous
        </button>
        <p className="date-nav-label">
          <span>{formatDisplayDate(selectedDate)}</span>
          {isToday && <span className="date-today-badge">Today</span>}
        </p>
        <button
          type="button"
          className="date-nav-button"
          onClick={() => onSelectDate(addDays(selectedDate, 1))}
          aria-label="Next day"
        >
          Next
        </button>
        {!isToday && (
          <button
            type="button"
            className="date-nav-button date-nav-button--today"
            onClick={() => onSelectDate(today)}
          >
            Jump to today
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <p className="journal-empty">
          {isToday
            ? "No activities yet today. Add one below—start with whatever took real time or attention."
            : "No activities logged for this day."}
        </p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              onChange={(patch) => onUpdate(selectedDate, activity.id, patch)}
              onRemove={() => onRemove(selectedDate, activity.id)}
            />
          ))}
        </div>
      )}

      <form className="activity-form" onSubmit={handleAdd}>
        <h3 className="activity-form-heading">Add an activity</h3>
        <label className="activity-name-label">
          <span className="sr-only">New activity name</span>
          <input
            type="text"
            className="activity-name-input"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder={ACTIVITY_NAME_PLACEHOLDER}
          />
        </label>

        <div className="activity-meters">
          <div className="meter-block">
            <p id="draft-engaged" className="meter-heading">
              {ENGAGEMENT_LABEL}
            </p>
            <EngagementMeter
              value={draft.engaged}
              onChange={(engaged) => setDraft({ ...draft, engaged })}
              labelledBy="draft-engaged"
            />
          </div>
          <div className="meter-block">
            <p id="draft-energy" className="meter-heading">
              {ENERGY_LABEL}
            </p>
            <EnergyMeter
              value={draft.energized}
              onChange={(energized) => setDraft({ ...draft, energized })}
              labelledBy="draft-energy"
            />
          </div>
        </div>

        <button type="submit" className="activity-add" disabled={!draft.name.trim()}>
          Add to this day
        </button>
      </form>
    </section>
  );
}
