import type { OdysseyState, Prototype, PrototypingState } from "../types/dashboard";
import { ODYSSEY_KIND_CONFIGS, planHasContent } from "../types/odyssey";
import {
  BRAINSTORM_PLACEHOLDER,
  PROTOTYPE_INTRO,
  PROTOTYPE_PROMPT,
  PROTOTYPE_STEPS,
  filledQuestionCount,
  planPrototypeStatus,
  prototypeCounts,
  questionPrototypeStatus,
  storyConversationCount,
  type PrototypeDraft,
  type PrototypePatch,
} from "../types/prototyping";
import { PrototypeList } from "./PrototypeList";

interface PrototypingProps {
  odyssey: OdysseyState;
  prototyping: PrototypingState;
  addPrototype: (kind: Prototype["kind"], draft: PrototypeDraft) => void;
  updatePrototype: (id: string, patch: PrototypePatch) => void;
  removePrototype: (id: string) => void;
  updateBrainstormNotes: (notes: string) => void;
  onGoToOdyssey: () => void;
  onGoToMindMap: () => void;
}

export function Prototyping({
  odyssey,
  prototyping,
  addPrototype,
  updatePrototype,
  removePrototype,
  updateBrainstormNotes,
  onGoToOdyssey,
  onGoToMindMap,
}: PrototypingProps) {
  const questionCount = filledQuestionCount(odyssey.plans);
  const startedPlans = odyssey.plans.filter(planHasContent).length;
  const counts = prototypeCounts(prototyping.prototypes);
  const storyCount = storyConversationCount(prototyping.prototypes);
  const conversations = prototyping.prototypes.filter((item) => item.kind === "conversation");
  const experiences = prototyping.prototypes.filter((item) => item.kind === "experience");

  return (
    <div className="prototype">
      <header className="dashboard-header">
        <h1>Prototyping</h1>
        <p className="dashboard-intro">{PROTOTYPE_INTRO}</p>
        <p className="dashboard-prompt">{PROTOTYPE_PROMPT}</p>

        <details className="prompt-questions try-stuff">
          <summary>Try Stuff</summary>
          <ol>
            {PROTOTYPE_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </details>
      </header>

      {startedPlans === 0 ? (
        <section className="summary-strip summary-strip--alert" aria-live="polite">
          <strong>Start with Odyssey Plans</strong>
          <span>
            {" "}
            — Review your three alternative lives and the questions each one raises before
            you prototype.
          </span>
          <button
            type="button"
            className="date-nav-button date-nav-button--today"
            onClick={onGoToOdyssey}
          >
            Open Odyssey
          </button>
        </section>
      ) : (
        <section className="summary-strip" aria-live="polite">
          {counts.total === 0 ? (
            <span>
              {questionCount === 0
                ? "Your Odyssey Plans have a start. Write the questions each life raises, then list conversations and experiences that could answer them."
                : `${questionCount} Odyssey question${questionCount === 1 ? "" : "s"} ready to prototype. List conversations and experiences that could answer them.`}
            </span>
          ) : counts.done === 0 ? (
            <span>
              {counts.conversations} conversation{counts.conversations === 1 ? "" : "s"},{" "}
              {counts.experiences} experience{counts.experiences === 1 ? "" : "s"}.
              {counts.seeking > 0
                ? " Keep seeking people out and trying something small."
                : " Seek people out and try something small."}
            </span>
          ) : (
            <span>
              {counts.done} prototype{counts.done === 1 ? "" : "s"} done. Capture what you
              learned, then keep going.
            </span>
          )}
        </section>
      )}

      {counts.conversations > 0 && (
        <section className="summary-strip prototype-story-strip" aria-live="polite">
          <strong>
            {storyCount} story conversation{storyCount === 1 ? "" : "s"}
          </strong>
          <span>
            {" "}
            — Hidden-market work comes from volume of authentic conversations, not
            applications. Get the story first; exploring belonging comes after.
          </span>
        </section>
      )}

      <div className="compass-sections">
        <section className="compass-section" aria-labelledby="prototype-review-heading">
          <header className="compass-section-header">
            <h2 id="prototype-review-heading">Review your Odyssey Plans</h2>
            <p className="compass-intro">
              These are the three lives and the questions they raised. Prototypes exist to
              answer them—not to pick a winner in advance.
            </p>
          </header>

          <div className="prototype-review-grid">
            {odyssey.plans.map((plan) => {
              const config = ODYSSEY_KIND_CONFIGS.find((item) => item.kind === plan.kind)!;
              const planStatus = planPrototypeStatus(prototyping.prototypes, plan.kind);
              return (
                <article
                  key={plan.kind}
                  className={`prototype-plan-card${planStatus === "done" ? " prototype-plan-card--done" : ""}`}
                >
                  <p className="prototype-plan-kicker">
                    Alternative #{config.number}
                    {planStatus === "done" && (
                      <span className="prototype-badge prototype-badge--done">Tested</span>
                    )}
                    {planStatus === "planned" && (
                      <span className="prototype-badge">Prototyping</span>
                    )}
                  </p>
                  <h3 className="prototype-plan-headline">
                    {plan.headline.trim() || config.title}
                  </h3>
                  <p className="prototype-plan-intro">{config.intro}</p>
                  <ol className="prototype-plan-questions">
                    {plan.questions.map((question, index) => {
                      const status = questionPrototypeStatus(
                        prototyping.prototypes,
                        plan.kind,
                        index,
                      );
                      return (
                        <li
                          key={`${plan.kind}-q-${index}`}
                          className={`prototype-question${status !== "none" ? ` prototype-question--${status}` : ""}`}
                        >
                          {question.trim() || (
                            <span className="prototype-question-empty">
                              Question {index + 1} is still empty.
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </article>
              );
            })}
          </div>

          <div className="prototype-brainstorm-actions">
            <button type="button" className="date-nav-button" onClick={onGoToOdyssey}>
              Edit Odyssey Plans
            </button>
          </div>
        </section>

        <PrototypeList
          kind="conversation"
          items={conversations}
          plans={odyssey.plans}
          onAdd={addPrototype}
          onUpdate={updatePrototype}
          onRemove={removePrototype}
        />

        <PrototypeList
          kind="experience"
          items={experiences}
          plans={odyssey.plans}
          onAdd={addPrototype}
          onUpdate={updatePrototype}
          onRemove={removePrototype}
        />

        <section className="compass-section" aria-labelledby="prototype-brainstorm-heading">
          <header className="compass-section-header">
            <h2 id="prototype-brainstorm-heading">If you are stuck</h2>
            <p className="compass-intro">
              Gather a good group and brainstorm possibilities. Don’t have a team? Try mind
              mapping—branch from a question that still feels unanswered.
            </p>
          </header>
          <label className="reflection-label" htmlFor="prototype-brainstorm">
            <span className="sr-only">Brainstorm notes</span>
            <textarea
              id="prototype-brainstorm"
              className="reflection-field"
              rows={6}
              value={prototyping.brainstormNotes}
              onChange={(e) => updateBrainstormNotes(e.target.value)}
              placeholder={BRAINSTORM_PLACEHOLDER}
            />
          </label>
          <div className="prototype-brainstorm-actions">
            <button type="button" className="date-nav-button" onClick={onGoToMindMap}>
              Open Mind Map
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
