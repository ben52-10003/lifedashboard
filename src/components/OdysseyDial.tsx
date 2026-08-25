import { GAUGE_LEVELS, type GaugeLevel } from "../types/dashboard";
import {
  ODYSSEY_GAUGE_LEVEL_LABELS,
  type OdysseyGaugeConfig,
} from "../types/odyssey";

interface OdysseyDialProps {
  config: OdysseyGaugeConfig;
  level: GaugeLevel;
  onChange: (level: GaugeLevel) => void;
}

const CX = 90;
const CY = 94;
const R = 68;

function fillColor(level: GaugeLevel): string {
  if (level <= 0.25) return "#dc2626";
  if (level <= 0.5) return "#d97706";
  if (level <= 0.75) return "#65a30d";
  return "#16a34a";
}

function angleFor(level: number): number {
  return Math.PI * (1 - level);
}

function pointOnArc(level: number, radius = R) {
  const angle = angleFor(level);
  return {
    x: CX + Math.cos(angle) * radius,
    y: CY - Math.sin(angle) * radius,
  };
}

function describeArc(from: number, to: number, radius = R): string {
  const start = pointOnArc(from, radius);
  const end = pointOnArc(to, radius);
  const large = 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

export function OdysseyDial({ config, level, onChange }: OdysseyDialProps) {
  const color = fillColor(level);
  const needle = pointOnArc(level, R - 6);
  const percent = Math.round(level * 100);
  const valueLabel = ODYSSEY_GAUGE_LEVEL_LABELS[config.key][level];

  return (
    <div className="odyssey-dial">
      <p className="odyssey-dial-title">{config.title}</p>
      <svg
        className="odyssey-dial-svg"
        viewBox="0 0 180 118"
        role="img"
        aria-hidden="true"
      >
        <path
          className="odyssey-dial-track"
          d={describeArc(0, 1)}
          fill="none"
        />
        <path
          className="odyssey-dial-fill"
          d={describeArc(0, level)}
          fill="none"
          stroke={color}
        />
        {GAUGE_LEVELS.map((tick) => {
          const outer = pointOnArc(tick, R + 2);
          const inner = pointOnArc(tick, R - 8);
          return (
            <line
              key={tick}
              className="odyssey-dial-tick"
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
            />
          );
        })}
        <line
          className="odyssey-dial-needle"
          x1={CX}
          y1={CY}
          x2={needle.x}
          y2={needle.y}
          stroke={color}
        />
        <circle className="odyssey-dial-hub" cx={CX} cy={CY} r="5" />
        <text className="odyssey-dial-end" x="14" y="110">
          {config.low}
        </text>
        <text className="odyssey-dial-end odyssey-dial-end--right" x="166" y="110">
          {config.high}
        </text>
      </svg>
      <div
        className="odyssey-dial-levels"
        role="radiogroup"
        aria-label={`${config.title}: ${config.question}`}
      >
        {GAUGE_LEVELS.map((tick) => {
          const selected = tick === level;
          return (
            <button
              key={tick}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`odyssey-dial-level${selected ? " active" : ""}`}
              onClick={() => onChange(tick)}
            >
              {ODYSSEY_GAUGE_LEVEL_LABELS[config.key][tick]}
            </button>
          );
        })}
      </div>
      <p className="odyssey-dial-value">
        {valueLabel}
        {config.key === "resources" || config.key === "coherence"
          ? ` · ${percent}`
          : ""}
      </p>
      <p className="odyssey-dial-question">{config.question}</p>
    </div>
  );
}
