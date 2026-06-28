import type { GaugeLevel } from "../types/dashboard";

interface GaugeVisualProps {
  level: GaugeLevel;
  label: string;
}

function fillColor(level: GaugeLevel): string {
  if (level <= 0.25) return "#dc2626";
  if (level <= 0.5) return "#d97706";
  if (level <= 0.75) return "#65a30d";
  return "#16a34a";
}

export function GaugeVisual({ level, label }: GaugeVisualProps) {
  const fillPercent = level * 100;
  const color = fillColor(level);

  return (
    <div
      className="gauge-visual"
      role="meter"
      aria-label={`${label} gauge`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={fillPercent}
    >
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{
            height: `${fillPercent}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="gauge-label">{Math.round(fillPercent)}%</span>
    </div>
  );
}
