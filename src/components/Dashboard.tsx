import {
  GAUGE_CONFIGS,
  needsAttention,
  type DashboardState,
} from "../types/dashboard";
import { useDashboardState } from "../hooks/useDashboardState";
import { GaugeCard } from "./GaugeCard";

interface DashboardProps {
  state: DashboardState;
  updateLevel: ReturnType<typeof useDashboardState>["updateLevel"];
  updateNotes: ReturnType<typeof useDashboardState>["updateNotes"];
}

export function Dashboard({ state, updateLevel, updateNotes }: DashboardProps) {
  const redLightCount = GAUGE_CONFIGS.filter((config) =>
    needsAttention(state[config.area].level),
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Life Dashboard</h1>
        <p className="dashboard-intro">
          Healthy means being well in more than just your body—consider your mind
          and spirit too. Work includes everything you do, paid or unpaid.
          Play is activity that brings joy for its own sake. Love flows in many
          forms, and it must go both ways.
        </p>
        <p className="dashboard-prompt">
          Make a quick assessment of each area, fill in your gauges, and note
          what&apos;s working and what might need redesigning.
        </p>
      </header>

      <section
        className={`summary-strip${redLightCount > 0 ? " summary-strip--alert" : ""}`}
        aria-live="polite"
      >
        {redLightCount > 0 ? (
          <>
            <strong>
              {redLightCount} red light{redLightCount !== 1 ? "s" : ""}
            </strong>
            <span> — What might you redesign going forward?</span>
          </>
        ) : (
          <span>All gauges above half — looking balanced. Keep it up.</span>
        )}
      </section>

      <section className="gauge-grid" aria-label="Life gauges">
        {GAUGE_CONFIGS.map((config) => (
          <GaugeCard
            key={config.area}
            config={config}
            data={state[config.area]}
            onLevelChange={(level) => updateLevel(config.area, level)}
            onNotesChange={(notes) => updateNotes(config.area, notes)}
          />
        ))}
      </section>
    </div>
  );
}
