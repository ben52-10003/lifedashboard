import type { GaugeConfig, GaugeData } from "../types/dashboard";
import { needsAttention } from "../types/dashboard";
import { GaugeVisual } from "./GaugeVisual";
import { LevelSelector } from "./LevelSelector";
import { RedLight } from "./RedLight";

interface GaugeCardProps {
  config: GaugeConfig;
  data: GaugeData;
  onLevelChange: (level: GaugeData["level"]) => void;
  onNotesChange: (notes: string) => void;
}

export function GaugeCard({
  config,
  data,
  onLevelChange,
  onNotesChange,
}: GaugeCardProps) {
  const showRedLight = needsAttention(data.level);

  return (
    <article className={`gauge-card${showRedLight ? " gauge-card--alert" : ""}`}>
      <header className="gauge-card-header">
        <div>
          <h2>{config.title}</h2>
          <p className="gauge-subtitle">{config.subtitle}</p>
        </div>
        {showRedLight && <RedLight />}
      </header>

      <div className="gauge-card-body">
        <GaugeVisual level={data.level} label={config.title} />
        <div className="gauge-controls">
          <LevelSelector
            level={data.level}
            onChange={onLevelChange}
            areaLabel={config.title}
          />
          <label className="notes-label">
            <span className="sr-only">{config.title} notes</span>
            <textarea
              className="notes-field"
              value={data.notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={config.placeholder}
              rows={5}
            />
          </label>
        </div>
      </div>
    </article>
  );
}
