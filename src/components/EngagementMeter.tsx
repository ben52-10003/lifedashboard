import { GAUGE_LEVELS, type GaugeLevel } from "../types/dashboard";
import { ENGAGEMENT_LEVEL_LABELS } from "../types/journal";

interface EngagementMeterProps {
  value: GaugeLevel;
  onChange: (value: GaugeLevel) => void;
  labelledBy: string;
}

function fillColor(level: GaugeLevel): string {
  if (level <= 0.25) return "#dc2626";
  if (level <= 0.5) return "#d97706";
  if (level <= 0.75) return "#65a30d";
  return "#16a34a";
}

export function EngagementMeter({ value, onChange, labelledBy }: EngagementMeterProps) {
  const fillPercent = value * 100;
  const color = fillColor(value);

  return (
    <div className="engagement-meter">
      <div
        className="compact-track"
        role="meter"
        aria-labelledby={labelledBy}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fillPercent}
      >
        <div
          className="compact-fill"
          style={{ width: `${fillPercent}%`, backgroundColor: color }}
        />
      </div>
      <div className="compact-ticks" role="group" aria-labelledby={labelledBy}>
        {GAUGE_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            className={`compact-tick${value === level ? " active" : ""}`}
            aria-pressed={value === level}
            onClick={() => onChange(level)}
          >
            {ENGAGEMENT_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  );
}
