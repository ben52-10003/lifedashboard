import { useState, type FormEvent } from "react";
import {
  ODYSSEY_YEARS,
  type OdysseyKind,
  type OdysseyTimelineEvent,
  type OdysseyYear,
} from "../types/dashboard";
import {
  EVENT_PLACEHOLDER,
  calendarYear,
  yearLabel,
} from "../types/odyssey";

interface OdysseyTimelineProps {
  kind: OdysseyKind;
  startYear: number;
  events: OdysseyTimelineEvent[];
  onStartYearChange: (year: number) => void;
  onAdd: (kind: OdysseyKind, year: OdysseyYear, text: string) => void;
  onUpdate: (kind: OdysseyKind, eventId: string, text: string) => void;
  onRemove: (kind: OdysseyKind, eventId: string) => void;
}

export function OdysseyTimeline({
  kind,
  startYear,
  events,
  onStartYearChange,
  onAdd,
  onUpdate,
  onRemove,
}: OdysseyTimelineProps) {
  const [drafts, setDrafts] = useState<Record<OdysseyYear, string>>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  function handleAdd(year: OdysseyYear, formEvent: FormEvent) {
    formEvent.preventDefault();
    const text = drafts[year].trim();
    if (!text) return;
    onAdd(kind, year, text);
    setDrafts((prev) => ({ ...prev, [year]: "" }));
  }

  return (
    <section className="odyssey-timeline" aria-labelledby="odyssey-timeline-heading">
      <header className="odyssey-timeline-header">
        <div>
          <h3 id="odyssey-timeline-heading">Five-year timeline</h3>
          <p className="compass-intro">
            Mark work and personal milestones from now through year five.
            Include the rest of life, not just career—marriage, a move, CrossFit,
            learning to bend spoons.
          </p>
        </div>
        <label className="odyssey-start-year">
          Starting year
          <input
            type="number"
            inputMode="numeric"
            value={startYear}
            min={1900}
            max={2200}
            onChange={(e) => onStartYearChange(Number(e.target.value))}
          />
        </label>
      </header>

      <div className="odyssey-timeline-body">
        <div className="odyssey-timeline-track" aria-hidden="true">
          <span className="odyssey-timeline-line" />
          {ODYSSEY_YEARS.map((year) => (
            <span key={year} className="odyssey-timeline-dot" />
          ))}
        </div>

        <div className="odyssey-year-grid">
        {ODYSSEY_YEARS.map((year) => {
          const yearEvents = events.filter((event) => event.year === year);
          return (
            <div key={year} className="odyssey-year">
              <p className="odyssey-year-label">
                <span>{yearLabel(year)}</span>
                <span className="odyssey-year-calendar">
                  {calendarYear(startYear, year)}
                </span>
              </p>
              <ul className="odyssey-event-list">
                {yearEvents.map((event) => (
                  <li key={event.id} className="odyssey-event">
                    <label className="sr-only" htmlFor={`event-${event.id}`}>
                      Milestone in {yearLabel(year)}
                    </label>
                    <textarea
                      id={`event-${event.id}`}
                      className="odyssey-event-text"
                      rows={3}
                      value={event.text}
                      onChange={(e) => onUpdate(kind, event.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="activity-remove"
                      onClick={() => onRemove(kind, event.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <form
                className="odyssey-event-form"
                onSubmit={(formEvent) => handleAdd(year, formEvent)}
              >
                <label className="sr-only" htmlFor={`${kind}-add-${year}`}>
                  Add a milestone for {yearLabel(year)}
                </label>
                <textarea
                  id={`${kind}-add-${year}`}
                  className="odyssey-event-text"
                  rows={2}
                  value={drafts[year]}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [year]: e.target.value }))
                  }
                  placeholder={EVENT_PLACEHOLDER}
                />
                <button type="submit" className="date-nav-button">
                  Add
                </button>
              </form>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
