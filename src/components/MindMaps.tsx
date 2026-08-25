import { useMemo, useState, type FormEvent } from "react";
import type {
  JournalState,
  LifeAlternative,
  MindMap,
  MindMapKind,
} from "../types/dashboard";
import {
  ALTERNATIVE_INTRO,
  ALTERNATIVE_STEPS,
  BRANCH_PLACEHOLDER,
  JOB_PLACEHOLDER,
  MIND_MAP_INTRO,
  MIND_MAP_KIND_CONFIGS,
  MIND_MAP_PROMPT,
  MIND_MAP_STEPS,
  ROLE_PLACEHOLDER,
  alternativeProgress,
  findNode,
  flattenJournalActivities,
  mapStats,
  outerNodes,
  suggestedPicks,
} from "../types/mindmap";
import {
  ENERGY_LABELS,
  ENGAGEMENT_LEVEL_LABELS,
  formatDisplayDate,
} from "../types/journal";
import { MindMapCanvas } from "./MindMapCanvas";
import { NapkinSketch } from "./NapkinSketch";

interface MindMapsProps {
  journal: JournalState;
  maps: MindMap[];
  setCenter: (
    kind: MindMapKind,
    label: string,
    source?: { activityId: string; date: string },
  ) => void;
  addNode: (kind: MindMapKind, parentId: string, label: string) => void;
  renameNode: (kind: MindMapKind, nodeId: string, label: string) => void;
  removeNode: (kind: MindMapKind, nodeId: string) => void;
  togglePick: (kind: MindMapKind, nodeId: string) => void;
  updateAlternative: (kind: MindMapKind, patch: Partial<LifeAlternative>) => void;
  onGoToJournal: () => void;
}

export function MindMaps({
  journal,
  maps,
  setCenter,
  addNode,
  renameNode,
  removeNode,
  togglePick,
  updateAlternative,
  onGoToJournal,
}: MindMapsProps) {
  const [kind, setKind] = useState<MindMapKind>("engagement");
  const [branch, setBranch] = useState("");
  const map = maps.find((item) => item.kind === kind) ?? maps[0];
  const [selectedId, setSelectedId] = useState(map.root.id);
  const config = MIND_MAP_KIND_CONFIGS.find((item) => item.kind === kind)!;
  const activities = useMemo(() => flattenJournalActivities(journal), [journal]);
  const suggestions = suggestedPicks(kind, activities);
  const selected = findNode(map.root, selectedId) ?? map.root;
  const stats = mapStats(map);
  const outer = outerNodes(map.root);
  const progress = alternativeProgress(map.alternative);
  const pickedLabels = map.alternative.pickedIds
    .map((id) => findNode(map.root, id)?.label)
    .filter((label): label is string => Boolean(label && label.trim()));

  function handleKindChange(next: MindMapKind) {
    setKind(next);
    const nextMap = maps.find((item) => item.kind === next) ?? map;
    setSelectedId(nextMap.root.id);
    setBranch("");
  }

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!branch.trim() || !map.root.label.trim()) return;
    addNode(kind, selected.id, branch);
    setBranch("");
  }

  return (
    <div className="mindmaps">
      <header className="dashboard-header">
        <h1>Mind Mapping with Your Good Time Journal</h1>
        <p className="dashboard-intro">{MIND_MAP_INTRO}</p>
        <p className="dashboard-prompt">{MIND_MAP_PROMPT}</p>

        <details className="prompt-questions try-stuff">
          <summary>Try Stuff</summary>
          <ol>
            {MIND_MAP_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </details>
      </header>

      {activities.length === 0 && (
        <section className="summary-strip summary-strip--alert" aria-live="polite">
          <strong>Start with the journal</strong>
          <span>
            {" "}
            — If you didn’t keep a Good Time Journal, go back and do that first.
            You need real moments of engagement, energy, and flow to map from.
          </span>
          <button
            type="button"
            className="date-nav-button date-nav-button--today"
            onClick={onGoToJournal}
          >
            Open Journal
          </button>
        </section>
      )}

      <div className="map-switcher" role="tablist" aria-label="Mind maps">
        {MIND_MAP_KIND_CONFIGS.map((item) => (
          <button
            key={item.kind}
            type="button"
            role="tab"
            aria-selected={kind === item.kind}
            className={`map-switcher-button${kind === item.kind ? " active" : ""}`}
            onClick={() => handleKindChange(item.kind)}
          >
            Map {item.number} · {item.title}
          </button>
        ))}
      </div>

      <div className="compass-sections">
        <section className="compass-section" aria-labelledby="map-center-heading">
          <header className="compass-section-header">
            <h2 id="map-center-heading">
              Mind Map {config.number}—{config.title}
            </h2>
            <p className="compass-intro">{config.intro}</p>
          </header>

          <label className="activity-name-label" htmlFor="mindmap-center">
            Center
            <input
              id="mindmap-center"
              type="text"
              className="activity-name-input"
              value={map.root.label}
              onChange={(event) => setCenter(kind, event.target.value)}
              placeholder={config.centerPlaceholder}
            />
          </label>

          {activities.length > 0 && (
            <div className="journal-picks">
              <p className="meter-heading">From your Good Time Journal</p>
              <div className="journal-pick-list">
                {suggestions.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    className={`journal-pick${
                      map.sourceActivityId === activity.id ? " active" : ""
                    }`}
                    onClick={() =>
                      setCenter(kind, activity.name, {
                        activityId: activity.id,
                        date: activity.date,
                      })
                    }
                  >
                    <span>{activity.name}</span>
                    <small>
                      {formatDisplayDate(activity.date)} · Engaged{" "}
                      {ENGAGEMENT_LEVEL_LABELS[activity.engaged]} ·{" "}
                      {ENERGY_LABELS[activity.energized]}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="compass-section" aria-labelledby="map-canvas-heading">
          <header className="compass-section-header">
            <h2 id="map-canvas-heading">Map</h2>
            <p className="compass-intro">
              Select a node, then add a connected word. Aim for three or four
              layers and a dozen or more elements in the outer ring.
            </p>
          </header>

          <p className="week-range-label">
            Layers {stats.depth} / 3–4 · Outer ring {stats.outerCount} / 12+ ·{" "}
            {stats.branchCount} words mapped
          </p>

          <MindMapCanvas
            root={map.root}
            selectedId={selected.id}
            pickedIds={map.alternative.pickedIds}
            onSelect={setSelectedId}
            onTogglePick={(id) => togglePick(kind, id)}
          />

          {selected.id !== map.root.id && (
            <label className="activity-name-label" htmlFor="selected-node">
              Selected word
              <input
                id="selected-node"
                type="text"
                className="activity-name-input"
                value={selected.label}
                onChange={(event) =>
                  renameNode(kind, selected.id, event.target.value)
                }
              />
            </label>
          )}

          <form className="activity-form" onSubmit={handleAdd}>
            <h3 className="activity-form-heading">
              Add a branch from “{selected.label.trim() || "center"}”
            </h3>
            <label className="activity-name-label">
              <span className="sr-only">Connected word</span>
              <input
                type="text"
                className="activity-name-input"
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
                placeholder={BRANCH_PLACEHOLDER}
                disabled={!map.root.label.trim()}
              />
            </label>
            <div className="mindmap-actions">
              <button
                type="submit"
                className="activity-add"
                disabled={!branch.trim() || !map.root.label.trim()}
              >
                Add word
              </button>
              {selected.id !== map.root.id && (
                <button
                  type="button"
                  className="activity-remove"
                  onClick={() => {
                    removeNode(kind, selected.id);
                    setSelectedId(map.root.id);
                  }}
                >
                  Remove this node
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="compass-section" aria-labelledby="alternative-heading">
          <header className="compass-section-header">
            <h2 id="alternative-heading">Life alternative</h2>
            <p className="compass-intro">{ALTERNATIVE_INTRO}</p>
          </header>

          <details className="prompt-questions">
            <summary>How to invent an alternative</summary>
            <ol>
              {ALTERNATIVE_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </details>

          <p className="week-range-label">
            Picked {progress.picks} / 3
            {pickedLabels.length > 0 ? ` · ${pickedLabels.join(" · ")}` : ""}
          </p>

          {outer.length === 0 ? (
            <p className="journal-empty">
              Add a few layers first. The outer ring is where you pick three
              disparate items.
            </p>
          ) : (
            <div className="outer-picks">
              {outer.map((node) => {
                const picked = map.alternative.pickedIds.includes(node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`journal-pick${picked ? " active" : ""}`}
                    onClick={() => togglePick(kind, node.id)}
                    aria-pressed={picked}
                  >
                    {node.label || "Untitled"}
                  </button>
                );
              })}
            </div>
          )}

          <label className="activity-name-label" htmlFor="role-name">
            Role name
            <input
              id="role-name"
              type="text"
              className="activity-name-input"
              value={map.alternative.roleName}
              onChange={(event) =>
                updateAlternative(kind, { roleName: event.target.value })
              }
              placeholder={ROLE_PLACEHOLDER}
            />
          </label>

          <label className="reflection-label" htmlFor="job-description">
            <span className="integration-label">Possible job description</span>
            <textarea
              id="job-description"
              className="reflection-field"
              value={map.alternative.jobDescription}
              onChange={(event) =>
                updateAlternative(kind, { jobDescription: event.target.value })
              }
              placeholder={JOB_PLACEHOLDER}
              rows={5}
            />
          </label>

          <p className="meter-heading">Napkin sketch</p>
          <p className="compass-intro">
            A quick drawing of the role—like Grant sketching himself leading a
            Pirate Surf Camp for children.
          </p>
          <NapkinSketch
            key={kind}
            value={map.alternative.napkinSketch}
            onChange={(napkinSketch) => updateAlternative(kind, { napkinSketch })}
          />
        </section>
      </div>
    </div>
  );
}
