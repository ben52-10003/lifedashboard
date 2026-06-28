import { GAUGE_LEVELS, LEVEL_LABELS, type GaugeLevel } from "../types/dashboard";

interface LevelSelectorProps {
  level: GaugeLevel;
  onChange: (level: GaugeLevel) => void;
  areaLabel: string;
}

export function LevelSelector({ level, onChange, areaLabel }: LevelSelectorProps) {
  return (
    <div
      className="level-selector"
      role="group"
      aria-label={`${areaLabel} gauge level`}
    >
      {GAUGE_LEVELS.map((option) => (
        <button
          key={option}
          type="button"
          className={`level-button${level === option ? " active" : ""}`}
          aria-pressed={level === option}
          onClick={() => onChange(option)}
        >
          {LEVEL_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
