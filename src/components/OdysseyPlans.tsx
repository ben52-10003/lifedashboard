import { useState } from "react";
import type {
  GaugeLevel,
  OdysseyGaugeKey,
  OdysseyKind,
  OdysseyPlan,
  OdysseyState,
  OdysseyYear,
} from "../types/dashboard";
import { countWords } from "../types/compass";
import {
  ACTION_PLACEHOLDER,
  CONSIDERATION_FIELDS,
  HEADLINE_TARGET_WORDS,
  ODYSSEY_GAUGE_CONFIGS,
  ODYSSEY_INTRO,
  ODYSSEY_KIND_CONFIGS,
  ODYSSEY_PROMPT,
  ODYSSEY_STEPS,
  QUESTION_PLACEHOLDERS,
  headlineWordClass,
  planHasContent,
} from "../types/odyssey";
import { OdysseyDial } from "./OdysseyDial";
import { OdysseyTimeline } from "./OdysseyTimeline";

interface OdysseyPlansProps {
  odyssey: OdysseyState;
  updatePlan: (
    kind: OdysseyKind,
    patch: Partial<Omit<OdysseyPlan, "kind" | "timeline" | "gauges" | "questions">>,
  ) => void;
  updateQuestion: (kind: OdysseyKind, index: number, text: string) => void;
  addTimelineEvent: (kind: OdysseyKind, year: OdysseyYear, text: string) => void;
  updateTimelineEvent: (kind: OdysseyKind, eventId: string, text: string) => void;
  removeTimelineEvent: (kind: OdysseyKind, eventId: string) => void;
  updateGauge: (kind: OdysseyKind, key: OdysseyGaugeKey, level: GaugeLevel) => void;
  setStartYear: (year: number) => void;
}

export function OdysseyPlans({
  odyssey,
  updatePlan,
  updateQuestion,
  addTimelineEvent,
  updateTimelineEvent,
  removeTimelineEvent,
  updateGauge,
  setStartYear,
}: OdysseyPlansProps) {
  const [kind, setKind] = useState<OdysseyKind>("current");
  const plan = odyssey.plans.find((item) => item.kind === kind) ?? odyssey.plans[0];
  const config = ODYSSEY_KIND_CONFIGS.find((item) => item.kind === kind)!;
  const headlineCount = countWords(plan.headline);
  const filledPlans = odyssey.plans.filter(planHasContent).length;

  return (
    <div className="odyssey">
      <header className="dashboard-header">
        <h1>Odyssey Plan</h1>
        <p className="dashboard-intro">{ODYSSEY_INTRO}</p>
        <p className="dashboard-prompt">{ODYSSEY_PROMPT}</p>

        <details className="prompt-questions try-stuff">
          <summary>Try Stuff</summary>
          <ol>
            {ODYSSEY_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </details>
      </header>

      <section className="summary-strip" aria-live="polite">
        {filledPlans === 0 ? (
          <span>
            Sketch three wildly different five-year lives. Don’t skip Alternative 2.
          </span>
        ) : filledPlans < 3 ? (
          <span>
            {filledPlans} of 3 alternatives started. Keep them different from one another.
          </span>
        ) : (
          <span>
            All three alternatives have content. Present them and notice which one energizes you.
          </span>
        )}
      </section>

      <div className="map-switcher" role="tablist" aria-label="Odyssey alternatives">
        {ODYSSEY_KIND_CONFIGS.map((item) => (
          <button
            key={item.kind}
            type="button"
            role="tab"
            aria-selected={kind === item.kind}
            className={`map-switcher-button${kind === item.kind ? " active" : ""}`}
            onClick={() => setKind(item.kind)}
          >
            Life #{item.number} · {item.title}
          </button>
        ))}
      </div>

      <div className="compass-sections">
        <section className="compass-section" aria-labelledby="odyssey-plan-heading">
          <header className="compass-section-header">
            <p className="odyssey-plan-kicker">Alternative plan #{config.number}</p>
            <h2 id="odyssey-plan-heading">{config.title}</h2>
            <p className="compass-intro">{config.intro}</p>
          </header>

          <label className="reflection-label" htmlFor={`${kind}-headline`}>
            <span className="integration-label">6-word title</span>
            <input
              id={`${kind}-headline`}
              className="odyssey-headline"
              type="text"
              value={plan.headline}
              onChange={(e) => updatePlan(kind, { headline: e.target.value })}
              placeholder={config.headlinePlaceholder}
            />
            <p className={headlineWordClass(headlineCount)}>
              {headlineCount} / {HEADLINE_TARGET_WORDS} words
            </p>
          </label>
        </section>

        <OdysseyTimeline
          kind={kind}
          startYear={odyssey.startYear}
          events={plan.timeline}
          onStartYearChange={setStartYear}
          onAdd={addTimelineEvent}
          onUpdate={updateTimelineEvent}
          onRemove={removeTimelineEvent}
        />

        <section className="compass-section" aria-labelledby="odyssey-questions-heading">
          <header className="compass-section-header">
            <h2 id="odyssey-questions-heading">Questions this plan raises</h2>
            <p className="compass-intro">
              Two or three questions that test assumptions and might reveal something useful.
            </p>
          </header>
          <ol className="odyssey-questions">
            {plan.questions.map((question, index) => (
              <li key={`${kind}-q-${index}`}>
                <label className="reflection-label" htmlFor={`${kind}-question-${index}`}>
                  <span className="sr-only">Question {index + 1}</span>
                  <textarea
                    id={`${kind}-question-${index}`}
                    className="reflection-field"
                    rows={2}
                    value={question}
                    onChange={(e) => updateQuestion(kind, index, e.target.value)}
                    placeholder={QUESTION_PLACEHOLDERS[index]}
                  />
                </label>
              </li>
            ))}
          </ol>
        </section>

        <section className="compass-section" aria-labelledby="odyssey-gauges-heading">
          <header className="compass-section-header">
            <h2 id="odyssey-gauges-heading">Dashboard gauges</h2>
            <p className="compass-intro">
              Rank this alternative for resources, likability, confidence, and coherence.
            </p>
          </header>
          <div className="odyssey-dials">
            {ODYSSEY_GAUGE_CONFIGS.map((gauge) => (
              <OdysseyDial
                key={gauge.key}
                config={gauge}
                level={plan.gauges[gauge.key]}
                onChange={(level) => updateGauge(kind, gauge.key, level)}
              />
            ))}
          </div>
        </section>

        <section className="compass-section" aria-labelledby="odyssey-action-heading">
          <header className="compass-section-header">
            <h2 id="odyssey-action-heading">Easy action</h2>
            <p className="compass-intro">
              Choose an easy action toward an experience you’re excited about.
            </p>
          </header>
          <label className="reflection-label" htmlFor={`${kind}-action`}>
            <span className="sr-only">Easy action</span>
            <textarea
              id={`${kind}-action`}
              className="reflection-field"
              rows={3}
              value={plan.easyAction}
              onChange={(e) => updatePlan(kind, { easyAction: e.target.value })}
              placeholder={ACTION_PLACEHOLDER}
            />
          </label>
        </section>

        <details className="compass-section odyssey-considerations">
          <summary id="odyssey-considerations-heading">Possible considerations</summary>
          <p className="compass-intro">
            Geography, learning, impact, and what a day in this life looks like—plus ideas
            beyond career and money.
          </p>
          <div className="integration-fields">
            {CONSIDERATION_FIELDS.map((field) => (
              <label
                key={field.field}
                className="reflection-label"
                htmlFor={`${kind}-${field.field}`}
              >
                <span className="integration-label">{field.label}</span>
                <textarea
                  id={`${kind}-${field.field}`}
                  className="reflection-field"
                  rows={3}
                  value={plan[field.field]}
                  onChange={(e) => updatePlan(kind, { [field.field]: e.target.value })}
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </div>
        </details>

        <section className="compass-section" aria-labelledby="odyssey-energy-heading">
          <header className="compass-section-header">
            <h2 id="odyssey-energy-heading">How this alternative energizes you</h2>
            <p className="compass-intro">
              After you present this plan, note what energy it gives you—or doesn’t.
            </p>
          </header>
          <label className="reflection-label" htmlFor={`${kind}-energy`}>
            <span className="sr-only">Energy notes</span>
            <textarea
              id={`${kind}-energy`}
              className="reflection-field"
              rows={4}
              value={plan.energyNotes}
              onChange={(e) => updatePlan(kind, { energyNotes: e.target.value })}
              placeholder="What happened in you as you told this version of the next five years?"
            />
          </label>
        </section>
      </div>
    </div>
  );
}
