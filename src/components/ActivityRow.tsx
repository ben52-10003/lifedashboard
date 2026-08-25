import type { JournalActivity } from "../types/dashboard";
import type { JournalActivityPatch } from "../hooks/useDashboardState";
import {
  ACTIVITY_NAME_PLACEHOLDER,
  ACTIVITY_NOTES_PLACEHOLDER,
  ENERGY_LABEL,
  ENGAGEMENT_LABEL,
} from "../types/journal";
import { EngagementMeter } from "./EngagementMeter";
import { EnergyMeter } from "./EnergyMeter";

interface ActivityRowProps {
  activity: JournalActivity;
  onChange: (patch: JournalActivityPatch) => void;
  onRemove: () => void;
}

export function ActivityRow({ activity, onChange, onRemove }: ActivityRowProps) {
  const engagedId = `engaged-${activity.id}`;
  const energyId = `energy-${activity.id}`;

  return (
    <article className="activity-row">
      <div className="activity-row-top">
        <label className="activity-name-label">
          <span className="sr-only">Activity name</span>
          <input
            type="text"
            className="activity-name-input"
            value={activity.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder={ACTIVITY_NAME_PLACEHOLDER}
          />
        </label>
        <button
          type="button"
          className="activity-remove"
          onClick={onRemove}
          aria-label={`Remove ${activity.name || "activity"}`}
        >
          Remove
        </button>
      </div>

      <div className="activity-meters">
        <div className="meter-block">
          <p id={engagedId} className="meter-heading">
            {ENGAGEMENT_LABEL}
          </p>
          <EngagementMeter
            value={activity.engaged}
            onChange={(engaged) => onChange({ engaged })}
            labelledBy={engagedId}
          />
        </div>
        <div className="meter-block">
          <p id={energyId} className="meter-heading">
            {ENERGY_LABEL}
          </p>
          <EnergyMeter
            value={activity.energized}
            onChange={(energized) => onChange({ energized })}
            labelledBy={energyId}
          />
        </div>
      </div>

      <label className="activity-notes-label">
        <span className="sr-only">Activity notes</span>
        <textarea
          className="activity-notes"
          value={activity.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
          placeholder={ACTIVITY_NOTES_PLACEHOLDER}
          rows={2}
        />
      </label>
    </article>
  );
}
