import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDefaultState,
  type DashboardState,
  type GaugeArea,
  type GaugeLevel,
} from "../types/dashboard";

const STORAGE_KEY = "lifedashboard-state";

function isValidGaugeData(value: unknown): value is { level: GaugeLevel; notes: string } {
  if (!value || typeof value !== "object") return false;
  const gauge = value as { level?: unknown; notes?: unknown };
  return (
    typeof gauge.notes === "string" &&
    (gauge.level === 0.25 ||
      gauge.level === 0.5 ||
      gauge.level === 0.75 ||
      gauge.level === 1)
  );
}

function isValidState(value: unknown): value is DashboardState {
  if (!value || typeof value !== "object") return false;
  const state = value as DashboardState;
  return (
    isValidGaugeData(state.health) &&
    isValidGaugeData(state.work) &&
    isValidGaugeData(state.play) &&
    isValidGaugeData(state.love)
  );
}

function loadState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();

    const parsed: unknown = JSON.parse(raw);
    if (isValidState(parsed)) return parsed;
  } catch {
    // fall through to default
  }
  return createDefaultState();
}

export function useDashboardState() {
  const [state, setState] = useState<DashboardState>(loadState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const updateLevel = useCallback((area: GaugeArea, level: GaugeLevel) => {
    setState((prev) => ({
      ...prev,
      [area]: { ...prev[area], level },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateNotes = useCallback((area: GaugeArea, notes: string) => {
    setState((prev) => ({
      ...prev,
      [area]: { ...prev[area], notes },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  return { state, updateLevel, updateNotes };
}
