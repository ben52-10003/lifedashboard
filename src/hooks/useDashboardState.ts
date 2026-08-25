import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDefaultCompass,
  createDefaultJournal,
  createDefaultMindMaps,
  createDefaultOdyssey,
  createDefaultState,
  ENERGY_LEVELS,
  GAUGE_LEVELS,
  MIND_MAP_KINDS,
  ODYSSEY_KINDS,
  ODYSSEY_YEARS,
  type DashboardState,
  type EnergyLevel,
  type GaugeArea,
  type GaugeLevel,
  type IntegrationReflection,
  type JournalActivity,
  type JournalDayLog,
  type JournalReflection,
  type JournalState,
  type LifeAlternative,
  type MindMap,
  type MindMapKind,
  type MindMapNode,
  type MindMapsState,
  type OdysseyGaugeKey,
  type OdysseyKind,
  type OdysseyPlan,
  type OdysseyState,
  type OdysseyTimelineEvent,
  type OdysseyYear,
} from "../types/dashboard";
import {
  addChildNode,
  prunePickedIds,
  removeNode,
  renameNode,
} from "../types/mindmap";

const STORAGE_KEY = "lifedashboard-state";

export type JournalActivityInput = Omit<JournalActivity, "id">;
export type JournalActivityPatch = Partial<JournalActivityInput>;

function isValidGaugeLevel(value: unknown): value is GaugeLevel {
  return (GAUGE_LEVELS as unknown[]).includes(value);
}

function isValidEnergyLevel(value: unknown): value is EnergyLevel {
  return (ENERGY_LEVELS as unknown[]).includes(value);
}

function isValidGaugeData(value: unknown): value is { level: GaugeLevel; notes: string } {
  if (!value || typeof value !== "object") return false;
  const gauge = value as { level?: unknown; notes?: unknown };
  return typeof gauge.notes === "string" && isValidGaugeLevel(gauge.level);
}

function isValidIntegration(value: unknown): value is IntegrationReflection {
  if (!value || typeof value !== "object") return false;
  const integration = value as IntegrationReflection;
  return (
    typeof integration.complement === "string" &&
    typeof integration.clash === "string" &&
    typeof integration.drives === "string" &&
    typeof integration.general === "string"
  );
}

function isValidCompass(value: unknown): value is DashboardState["compass"] {
  if (!value || typeof value !== "object") return false;
  const compass = value as DashboardState["compass"];
  return (
    typeof compass.workview === "string" &&
    typeof compass.lifeview === "string" &&
    typeof compass.calibrationNotes === "string" &&
    isValidIntegration(compass.integration)
  );
}

function isValidActivity(value: unknown): value is JournalActivity {
  if (!value || typeof value !== "object") return false;
  const activity = value as JournalActivity;
  return (
    typeof activity.id === "string" &&
    typeof activity.name === "string" &&
    isValidGaugeLevel(activity.engaged) &&
    isValidEnergyLevel(activity.energized) &&
    typeof activity.notes === "string"
  );
}

function isValidDayLog(value: unknown): value is JournalDayLog {
  if (!value || typeof value !== "object") return false;
  const log = value as JournalDayLog;
  return (
    typeof log.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(log.date) &&
    Array.isArray(log.activities) &&
    log.activities.every(isValidActivity)
  );
}

function isValidReflection(value: unknown): value is JournalReflection {
  if (!value || typeof value !== "object") return false;
  const reflection = value as JournalReflection;
  return (
    typeof reflection.id === "string" &&
    typeof reflection.weekStart === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(reflection.weekStart) &&
    typeof reflection.notes === "string"
  );
}

function isValidJournal(value: unknown): value is JournalState {
  if (!value || typeof value !== "object") return false;
  const journal = value as JournalState;
  return (
    Array.isArray(journal.logs) &&
    journal.logs.every(isValidDayLog) &&
    Array.isArray(journal.reflections) &&
    journal.reflections.every(isValidReflection)
  );
}

function isValidNode(value: unknown): value is MindMapNode {
  if (!value || typeof value !== "object") return false;
  const node = value as MindMapNode;
  return (
    typeof node.id === "string" &&
    typeof node.label === "string" &&
    Array.isArray(node.children) &&
    node.children.every(isValidNode)
  );
}

function isValidAlternative(value: unknown): value is LifeAlternative {
  if (!value || typeof value !== "object") return false;
  const alternative = value as LifeAlternative;
  return (
    Array.isArray(alternative.pickedIds) &&
    alternative.pickedIds.every((id) => typeof id === "string") &&
    typeof alternative.jobDescription === "string" &&
    typeof alternative.roleName === "string" &&
    typeof alternative.napkinSketch === "string"
  );
}

function isValidMindMap(value: unknown): value is MindMap {
  if (!value || typeof value !== "object") return false;
  const map = value as MindMap;
  return (
    (MIND_MAP_KINDS as string[]).includes(map.kind) &&
    typeof map.sourceActivityId === "string" &&
    typeof map.sourceActivityDate === "string" &&
    isValidNode(map.root) &&
    isValidAlternative(map.alternative)
  );
}

function isValidMindMaps(value: unknown): value is MindMapsState {
  if (!value || typeof value !== "object") return false;
  const mindMaps = value as MindMapsState;
  if (!Array.isArray(mindMaps.maps) || mindMaps.maps.length !== 3) return false;
  if (!mindMaps.maps.every(isValidMindMap)) return false;
  const kinds = mindMaps.maps.map((map) => map.kind);
  return MIND_MAP_KINDS.every((kind) => kinds.includes(kind));
}

function isValidOdysseyYear(value: unknown): value is OdysseyYear {
  return (ODYSSEY_YEARS as unknown[]).includes(value);
}

function isValidTimelineEvent(value: unknown): value is OdysseyTimelineEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as OdysseyTimelineEvent;
  return (
    typeof event.id === "string" &&
    isValidOdysseyYear(event.year) &&
    typeof event.text === "string"
  );
}

function isValidOdysseyGauges(value: unknown): value is OdysseyPlan["gauges"] {
  if (!value || typeof value !== "object") return false;
  const gauges = value as OdysseyPlan["gauges"];
  return (
    isValidGaugeLevel(gauges.resources) &&
    isValidGaugeLevel(gauges.likability) &&
    isValidGaugeLevel(gauges.confidence) &&
    isValidGaugeLevel(gauges.coherence)
  );
}

function isValidOdysseyPlan(value: unknown): value is OdysseyPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as OdysseyPlan;
  return (
    (ODYSSEY_KINDS as string[]).includes(plan.kind) &&
    typeof plan.headline === "string" &&
    Array.isArray(plan.questions) &&
    plan.questions.length === 3 &&
    plan.questions.every((question) => typeof question === "string") &&
    Array.isArray(plan.timeline) &&
    plan.timeline.every(isValidTimelineEvent) &&
    isValidOdysseyGauges(plan.gauges) &&
    typeof plan.geography === "string" &&
    typeof plan.learning === "string" &&
    typeof plan.impact === "string" &&
    typeof plan.lifeLook === "string" &&
    typeof plan.otherNotes === "string" &&
    typeof plan.energyNotes === "string" &&
    typeof plan.easyAction === "string"
  );
}

function isValidOdyssey(value: unknown): value is OdysseyState {
  if (!value || typeof value !== "object") return false;
  const odyssey = value as OdysseyState;
  if (typeof odyssey.startYear !== "number" || !Number.isFinite(odyssey.startYear)) {
    return false;
  }
  if (!Array.isArray(odyssey.plans) || odyssey.plans.length !== 3) return false;
  if (!odyssey.plans.every(isValidOdysseyPlan)) return false;
  const kinds = odyssey.plans.map((plan) => plan.kind);
  return ODYSSEY_KINDS.every((kind) => kinds.includes(kind));
}

interface LegacyDashboardState {
  health: DashboardState["health"];
  work: DashboardState["work"];
  play: DashboardState["play"];
  love: DashboardState["love"];
  updatedAt?: string;
  compass?: DashboardState["compass"];
  journal?: JournalState;
  mindMaps?: MindMapsState;
  odyssey?: OdysseyState;
}

function isValidLegacyState(value: unknown): value is LegacyDashboardState {
  if (!value || typeof value !== "object") return false;
  const state = value as LegacyDashboardState;
  return (
    isValidGaugeData(state.health) &&
    isValidGaugeData(state.work) &&
    isValidGaugeData(state.play) &&
    isValidGaugeData(state.love)
  );
}

function migrateState(state: LegacyDashboardState): DashboardState {
  return {
    health: state.health,
    work: state.work,
    play: state.play,
    love: state.love,
    compass: isValidCompass(state.compass) ? state.compass : createDefaultCompass(),
    journal: isValidJournal(state.journal) ? state.journal : createDefaultJournal(),
    mindMaps: isValidMindMaps(state.mindMaps) ? state.mindMaps : createDefaultMindMaps(),
    odyssey: isValidOdyssey(state.odyssey) ? state.odyssey : createDefaultOdyssey(),
    updatedAt: state.updatedAt ?? new Date().toISOString(),
  };
}

function loadState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();

    const parsed: unknown = JSON.parse(raw);
    if (isValidLegacyState(parsed)) return migrateState(parsed);
  } catch {
    // fall through to default
  }
  return createDefaultState();
}

function sortLogs(logs: JournalDayLog[]): JournalDayLog[] {
  return [...logs].sort((a, b) => a.date.localeCompare(b.date));
}

function sortReflections(reflections: JournalReflection[]): JournalReflection[] {
  return [...reflections].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

export function useDashboardState() {
  const [state, setState] = useState<DashboardState>(loadState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const persist = useCallback((value: DashboardState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, []);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      persist(stateRef.current);
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, persist]);

  useEffect(() => {
    const flush = () => persist(stateRef.current);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [persist]);

  const touch = useCallback(
    (updater: (prev: DashboardState) => DashboardState) => {
      setState((prev) => ({
        ...updater(prev),
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const updateLevel = useCallback((area: GaugeArea, level: GaugeLevel) => {
    touch((prev) => ({
      ...prev,
      [area]: { ...prev[area], level },
    }));
  }, [touch]);

  const updateNotes = useCallback((area: GaugeArea, notes: string) => {
    touch((prev) => ({
      ...prev,
      [area]: { ...prev[area], notes },
    }));
  }, [touch]);

  const updateWorkview = useCallback((workview: string) => {
    touch((prev) => ({
      ...prev,
      compass: { ...prev.compass, workview },
    }));
  }, [touch]);

  const updateLifeview = useCallback((lifeview: string) => {
    touch((prev) => ({
      ...prev,
      compass: { ...prev.compass, lifeview },
    }));
  }, [touch]);

  const updateIntegration = useCallback(
    (field: keyof IntegrationReflection, value: string) => {
      touch((prev) => ({
        ...prev,
        compass: {
          ...prev.compass,
          integration: { ...prev.compass.integration, [field]: value },
        },
      }));
    },
    [touch],
  );

  const updateCalibrationNotes = useCallback((calibrationNotes: string) => {
    touch((prev) => ({
      ...prev,
      compass: { ...prev.compass, calibrationNotes },
    }));
  }, [touch]);

  const addActivity = useCallback((date: string, input: JournalActivityInput) => {
    touch((prev) => {
      const activity: JournalActivity = {
        ...input,
        id: crypto.randomUUID(),
      };
      const logs = [...prev.journal.logs];
      const existingIndex = logs.findIndex((log) => log.date === date);

      if (existingIndex >= 0) {
        const existing = logs[existingIndex];
        logs[existingIndex] = {
          ...existing,
          activities: [...existing.activities, activity],
        };
      } else {
        logs.push({ date, activities: [activity] });
      }

      return {
        ...prev,
        journal: { ...prev.journal, logs: sortLogs(logs) },
      };
    });
  }, [touch]);

  const updateActivity = useCallback(
    (date: string, id: string, patch: JournalActivityPatch) => {
      touch((prev) => ({
        ...prev,
        journal: {
          ...prev.journal,
          logs: prev.journal.logs.map((log) =>
            log.date !== date
              ? log
              : {
                  ...log,
                  activities: log.activities.map((activity) =>
                    activity.id === id ? { ...activity, ...patch } : activity,
                  ),
                },
          ),
        },
      }));
    },
    [touch],
  );

  const removeActivity = useCallback((date: string, id: string) => {
    touch((prev) => ({
      ...prev,
      journal: {
        ...prev.journal,
        logs: prev.journal.logs
          .map((log) =>
            log.date !== date
              ? log
              : {
                  ...log,
                  activities: log.activities.filter((activity) => activity.id !== id),
                },
          )
          .filter((log) => log.activities.length > 0),
      },
    }));
  }, [touch]);

  const upsertReflection = useCallback((weekStart: string, notes: string) => {
    touch((prev) => {
      const reflections = [...prev.journal.reflections];
      const existingIndex = reflections.findIndex(
        (reflection) => reflection.weekStart === weekStart,
      );
      const trimmed = notes.trim();

      if (existingIndex >= 0) {
        if (!trimmed) {
          reflections.splice(existingIndex, 1);
        } else {
          reflections[existingIndex] = {
            ...reflections[existingIndex],
            notes,
          };
        }
      } else if (trimmed) {
        reflections.push({
          id: crypto.randomUUID(),
          weekStart,
          notes,
        });
      }

      return {
        ...prev,
        journal: { ...prev.journal, reflections: sortReflections(reflections) },
      };
    });
  }, [touch]);

  const patchMap = useCallback(
    (kind: MindMapKind, updater: (map: MindMap) => MindMap) => {
      touch((prev) => ({
        ...prev,
        mindMaps: {
          maps: prev.mindMaps.maps.map((map) => (map.kind === kind ? updater(map) : map)),
        },
      }));
    },
    [touch],
  );

  const setMindMapCenter = useCallback(
    (
      kind: MindMapKind,
      label: string,
      source?: { activityId: string; date: string },
    ) => {
      patchMap(kind, (map) => ({
        ...map,
        sourceActivityId: source?.activityId ?? map.sourceActivityId,
        sourceActivityDate: source?.date ?? map.sourceActivityDate,
        root: { ...map.root, label },
      }));
    },
    [patchMap],
  );

  const addMindMapNode = useCallback(
    (kind: MindMapKind, parentId: string, label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      patchMap(kind, (map) => ({
        ...map,
        root: addChildNode(map.root, parentId, trimmed),
      }));
    },
    [patchMap],
  );

  const renameMindMapNode = useCallback(
    (kind: MindMapKind, nodeId: string, label: string) => {
      patchMap(kind, (map) => {
        const root = renameNode(map.root, nodeId, label);
        return {
          ...map,
          root,
          alternative: {
            ...map.alternative,
            pickedIds: prunePickedIds(root, map.alternative.pickedIds),
          },
        };
      });
    },
    [patchMap],
  );

  const removeMindMapNode = useCallback(
    (kind: MindMapKind, nodeId: string) => {
      patchMap(kind, (map) => {
        const root = removeNode(map.root, nodeId);
        return {
          ...map,
          root,
          alternative: {
            ...map.alternative,
            pickedIds: prunePickedIds(root, map.alternative.pickedIds),
          },
        };
      });
    },
    [patchMap],
  );

  const toggleMindMapPick = useCallback(
    (kind: MindMapKind, nodeId: string) => {
      patchMap(kind, (map) => {
        const allowed = prunePickedIds(map.root, [...map.alternative.pickedIds, nodeId]);
        const already = map.alternative.pickedIds.includes(nodeId);
        let pickedIds = map.alternative.pickedIds.filter((id) => allowed.includes(id));
        if (already) {
          pickedIds = pickedIds.filter((id) => id !== nodeId);
        } else if (pickedIds.length < 3 && allowed.includes(nodeId)) {
          pickedIds = [...pickedIds.filter((id) => id !== nodeId), nodeId];
        } else if (pickedIds.length < 3) {
          const outerAllowed = prunePickedIds(map.root, [nodeId]);
          if (outerAllowed.length === 1) pickedIds = [...pickedIds, nodeId];
        }
        return {
          ...map,
          alternative: { ...map.alternative, pickedIds },
        };
      });
    },
    [patchMap],
  );

  const updateMindMapAlternative = useCallback(
    (kind: MindMapKind, patch: Partial<LifeAlternative>) => {
      patchMap(kind, (map) => ({
        ...map,
        alternative: { ...map.alternative, ...patch },
      }));
    },
    [patchMap],
  );

  const patchOdysseyPlan = useCallback(
    (kind: OdysseyKind, updater: (plan: OdysseyPlan) => OdysseyPlan) => {
      touch((prev) => ({
        ...prev,
        odyssey: {
          ...prev.odyssey,
          plans: prev.odyssey.plans.map((plan) =>
            plan.kind === kind ? updater(plan) : plan,
          ),
        },
      }));
    },
    [touch],
  );

  const updateOdysseyPlan = useCallback(
    (kind: OdysseyKind, patch: Partial<Omit<OdysseyPlan, "kind" | "timeline" | "gauges" | "questions">>) => {
      patchOdysseyPlan(kind, (plan) => ({ ...plan, ...patch }));
    },
    [patchOdysseyPlan],
  );

  const updateOdysseyQuestion = useCallback(
    (kind: OdysseyKind, index: number, text: string) => {
      if (index < 0 || index > 2) return;
      patchOdysseyPlan(kind, (plan) => {
        const questions: [string, string, string] = [...plan.questions];
        questions[index] = text;
        return { ...plan, questions };
      });
    },
    [patchOdysseyPlan],
  );

  const addTimelineEvent = useCallback(
    (kind: OdysseyKind, year: OdysseyYear, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      patchOdysseyPlan(kind, (plan) => ({
        ...plan,
        timeline: [
          ...plan.timeline,
          { id: crypto.randomUUID(), year, text: trimmed },
        ],
      }));
    },
    [patchOdysseyPlan],
  );

  const updateTimelineEvent = useCallback(
    (kind: OdysseyKind, eventId: string, text: string) => {
      patchOdysseyPlan(kind, (plan) => ({
        ...plan,
        timeline: plan.timeline.map((event) =>
          event.id === eventId ? { ...event, text } : event,
        ),
      }));
    },
    [patchOdysseyPlan],
  );

  const removeTimelineEvent = useCallback(
    (kind: OdysseyKind, eventId: string) => {
      patchOdysseyPlan(kind, (plan) => ({
        ...plan,
        timeline: plan.timeline.filter((event) => event.id !== eventId),
      }));
    },
    [patchOdysseyPlan],
  );

  const updateOdysseyGauge = useCallback(
    (kind: OdysseyKind, key: OdysseyGaugeKey, level: GaugeLevel) => {
      patchOdysseyPlan(kind, (plan) => ({
        ...plan,
        gauges: { ...plan.gauges, [key]: level },
      }));
    },
    [patchOdysseyPlan],
  );

  const setOdysseyStartYear = useCallback(
    (year: number) => {
      if (!Number.isFinite(year)) return;
      touch((prev) => ({
        ...prev,
        odyssey: { ...prev.odyssey, startYear: Math.round(year) },
      }));
    },
    [touch],
  );

  return {
    state,
    updateLevel,
    updateNotes,
    updateWorkview,
    updateLifeview,
    updateIntegration,
    updateCalibrationNotes,
    addActivity,
    updateActivity,
    removeActivity,
    upsertReflection,
    setMindMapCenter,
    addMindMapNode,
    renameMindMapNode,
    removeMindMapNode,
    toggleMindMapPick,
    updateMindMapAlternative,
    updateOdysseyPlan,
    updateOdysseyQuestion,
    addTimelineEvent,
    updateTimelineEvent,
    removeTimelineEvent,
    updateOdysseyGauge,
    setOdysseyStartYear,
  };
}
