import type { CompassState } from "../types/dashboard";
import {
  LIFEVIEW_CONFIG,
  WORKVIEW_CONFIG,
} from "../types/compass";
import { useDashboardState } from "../hooks/useDashboardState";
import { IntegrationSection } from "./IntegrationSection";
import { ReflectionSection } from "./ReflectionSection";
import { TrueNorthSection } from "./TrueNorthSection";

interface CompassProps {
  compass: CompassState;
  updateWorkview: ReturnType<typeof useDashboardState>["updateWorkview"];
  updateLifeview: ReturnType<typeof useDashboardState>["updateLifeview"];
  updateIntegration: ReturnType<typeof useDashboardState>["updateIntegration"];
  updateCalibrationNotes: ReturnType<typeof useDashboardState>["updateCalibrationNotes"];
}

export function Compass({
  compass,
  updateWorkview,
  updateLifeview,
  updateIntegration,
  updateCalibrationNotes,
}: CompassProps) {
  return (
    <div className="compass">
      <header className="dashboard-header">
        <h1>Your Compass</h1>
        <p className="dashboard-intro">
          Your Workview and Lifeview create True North—a compass for knowing whether
          you&apos;re heading in the right direction. Write your reflections, integrate
          them, and revisit when life changes.
        </p>
      </header>

      <div className="compass-sections">
        <ReflectionSection
          config={WORKVIEW_CONFIG}
          value={compass.workview}
          onChange={updateWorkview}
        />
        <ReflectionSection
          config={LIFEVIEW_CONFIG}
          value={compass.lifeview}
          onChange={updateLifeview}
        />
        <IntegrationSection
          integration={compass.integration}
          onChange={updateIntegration}
        />
        <TrueNorthSection
          calibrationNotes={compass.calibrationNotes}
          onChange={updateCalibrationNotes}
        />
      </div>
    </div>
  );
}
