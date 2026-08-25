import { ENERGY_LEVELS, type EnergyLevel } from "../types/dashboard";
import { ENERGY_LABELS, ENERGY_SHORT_LABELS } from "../types/journal";

interface EnergyMeterProps {
  value: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
  labelledBy: string;
}

export function EnergyMeter({ value, onChange, labelledBy }: EnergyMeterProps) {
  const negativeWidth = value < 0 ? Math.abs(value) * 50 : 0;
  const positiveWidth = value > 0 ? value * 50 : 0;

  return (
    <div className="energy-meter">
      <div
        className="energy-track"
        role="meter"
        aria-labelledby={labelledBy}
        aria-valuemin={-100}
        aria-valuemax={100}
        aria-valuenow={value * 100}
        aria-valuetext={ENERGY_LABELS[value]}
      >
        <div
          className="energy-fill energy-fill--neg"
          style={{ width: `${negativeWidth}%` }}
        />
        <div
          className="energy-fill energy-fill--pos"
          style={{ width: `${positiveWidth}%` }}
        />
        <div className="energy-center" />
      </div>
      <div className="compact-ticks" role="group" aria-labelledby={labelledBy}>
        {ENERGY_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            className={`compact-tick energy-tick${value === level ? " active" : ""}`}
            aria-pressed={value === level}
            aria-label={ENERGY_LABELS[level]}
            title={ENERGY_LABELS[level]}
            onClick={() => onChange(level)}
          >
            {ENERGY_SHORT_LABELS[level]}
          </button>
        ))}
      </div>
      <p className="energy-current">{ENERGY_LABELS[value]}</p>
    </div>
  );
}
