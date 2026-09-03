import { useState, type FormEvent } from "react";
import {
  BELONGING_RAISED_BY,
  PROTOTYPE_STATUSES,
  type OdysseyKind,
  type OdysseyPlan,
  type Prototype,
  type PrototypeKind,
  type PrototypeStatus,
} from "../types/dashboard";
import { ODYSSEY_KIND_CONFIGS } from "../types/odyssey";
import {
  BELONGING_ASK_PLACEHOLDER,
  BELONGING_NOTES_PLACEHOLDER,
  BELONGING_RAISED_LABELS,
  IMAGINE_PLACEHOLDER,
  LEARNING_PLACEHOLDER,
  NEXT_PEOPLE_PLACEHOLDER,
  PROTOTYPE_KIND_CONFIGS,
  PROTOTYPE_STATUS_LABELS,
  REFERRAL_PLACEHOLDER,
  REQUEST_PLACEHOLDER,
  STORY_PLACEHOLDER,
  belongingAskSketch,
  canExploreBelonging,
  decodePrototypeLink,
  encodePrototypeLink,
  planLabel,
  questionPreview,
  requestSketch,
  type PrototypeDraft,
  type PrototypePatch,
} from "../types/prototyping";
import { LifeDesignGuide } from "./LifeDesignGuide";

interface PrototypeListProps {
  kind: PrototypeKind;
  items: Prototype[];
  plans: OdysseyPlan[];
  onAdd: (kind: PrototypeKind, draft: PrototypeDraft) => void;
  onUpdate: (id: string, patch: PrototypePatch) => void;
  onRemove: (id: string) => void;
}

const EMPTY_DRAFT: PrototypeDraft = {
  title: "",
  hope: "",
  planKind: null,
  questionIndex: null,
  referral: "",
  request: "",
};

export function PrototypeList({
  kind,
  items,
  plans,
  onAdd,
  onUpdate,
  onRemove,
}: PrototypeListProps) {
  const [draft, setDraft] = useState<PrototypeDraft>(EMPTY_DRAFT);
  const config = PROTOTYPE_KIND_CONFIGS.find((item) => item.kind === kind)!;
  const isInterview = kind === "conversation";

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    onAdd(kind, { ...draft, title });
    setDraft(EMPTY_DRAFT);
  }

  return (
    <section className="compass-section" aria-labelledby={`${kind}-heading`}>
      <header className="compass-section-header">
        <h2 id={`${kind}-heading`}>{config.title}</h2>
        <p className="compass-intro">{config.intro}</p>
      </header>

      {isInterview && <LifeDesignGuide />}

      {items.length === 0 ? (
        <p className="journal-empty">{config.empty}</p>
      ) : (
        <ul className="prototype-list">
          {items.map((item) => (
            <li key={item.id} className="prototype-card">
              <div className="prototype-card-top">
                <label className="activity-name-label" htmlFor={`${item.id}-title`}>
                  <span className="sr-only">{config.titleLabel}</span>
                  <input
                    id={`${item.id}-title`}
                    className="activity-name-input"
                    type="text"
                    value={item.title}
                    onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                    placeholder={config.titlePlaceholder}
                  />
                </label>
                <button
                  type="button"
                  className="activity-remove"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className="prototype-card-meta">
                <QuestionLinkSelect
                  id={`${item.id}-link`}
                  plans={plans}
                  planKind={item.planKind}
                  questionIndex={item.questionIndex}
                  onChange={(planKind, questionIndex) =>
                    onUpdate(item.id, { planKind, questionIndex })
                  }
                />
                <StatusPills
                  id={`${item.id}-status`}
                  value={item.status}
                  onChange={(status) => onUpdate(item.id, { status })}
                />
              </div>

              <label className="reflection-label" htmlFor={`${item.id}-hope`}>
                <span className="integration-label">{config.hopeLabel}</span>
                <textarea
                  id={`${item.id}-hope`}
                  className="reflection-field prototype-notes"
                  rows={2}
                  value={item.hope}
                  onChange={(e) => onUpdate(item.id, { hope: e.target.value })}
                  placeholder={config.hopePlaceholder}
                />
              </label>

              {isInterview && (
                <InterviewFields item={item} onUpdate={onUpdate} />
              )}

              <label className="reflection-label" htmlFor={`${item.id}-learning`}>
                <span className="integration-label">{config.learningLabel}</span>
                <textarea
                  id={`${item.id}-learning`}
                  className={`reflection-field prototype-notes${item.status === "done" ? " prototype-notes--done" : ""}`}
                  rows={3}
                  value={item.learning}
                  onChange={(e) => onUpdate(item.id, { learning: e.target.value })}
                  placeholder={isInterview ? STORY_PLACEHOLDER : LEARNING_PLACEHOLDER}
                />
              </label>

              {isInterview && (
                <label className="reflection-label" htmlFor={`${item.id}-imagine`}>
                  <span className="integration-label">
                    Could you imagine yourself in this life?
                  </span>
                  <textarea
                    id={`${item.id}-imagine`}
                    className={`reflection-field prototype-notes${item.status === "done" ? " prototype-notes--done" : ""}`}
                    rows={3}
                    value={item.imagine}
                    onChange={(e) => onUpdate(item.id, { imagine: e.target.value })}
                    placeholder={IMAGINE_PLACEHOLDER}
                  />
                </label>
              )}

              {isInterview && (
                <BelongingFields
                  item={item}
                  onUpdate={onUpdate}
                  onSpawnInterview={(title) =>
                    onAdd("conversation", {
                      title,
                      hope: "",
                      planKind: item.planKind,
                      questionIndex: item.questionIndex,
                      referral: item.title,
                      request: "",
                    })
                  }
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <form className="activity-form" onSubmit={handleAdd}>
        <h3 className="activity-form-heading">{config.heading}</h3>
        <label className="activity-name-label" htmlFor={`${kind}-add-title`}>
          <span className="integration-label">{config.titleLabel}</span>
          <input
            id={`${kind}-add-title`}
            type="text"
            className="activity-name-input"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder={config.titlePlaceholder}
          />
        </label>
        {isInterview && (
          <label className="activity-name-label" htmlFor={`${kind}-add-referral`}>
            <span className="integration-label">Who can introduce you</span>
            <input
              id={`${kind}-add-referral`}
              type="text"
              className="activity-name-input prototype-referral-input"
              value={draft.referral}
              onChange={(e) => setDraft({ ...draft, referral: e.target.value })}
              placeholder={REFERRAL_PLACEHOLDER}
            />
          </label>
        )}
        <QuestionLinkSelect
          id={`${kind}-add-link`}
          plans={plans}
          planKind={draft.planKind}
          questionIndex={draft.questionIndex}
          onChange={(planKind, questionIndex) =>
            setDraft({ ...draft, planKind, questionIndex })
          }
        />
        <label className="reflection-label" htmlFor={`${kind}-add-hope`}>
          <span className="integration-label">{config.hopeLabel}</span>
          <textarea
            id={`${kind}-add-hope`}
            className="reflection-field prototype-notes"
            rows={2}
            value={draft.hope}
            onChange={(e) => setDraft({ ...draft, hope: e.target.value })}
            placeholder={config.hopePlaceholder}
          />
        </label>
        <button type="submit" className="activity-add" disabled={!draft.title.trim()}>
          {config.addLabel}
        </button>
      </form>
    </section>
  );
}

interface InterviewFieldsProps {
  item: Prototype;
  onUpdate: (id: string, patch: PrototypePatch) => void;
}

function InterviewFields({ item, onUpdate }: InterviewFieldsProps) {
  const preparing = item.status !== "done";

  return (
    <details className="prototype-interview" open={preparing || undefined}>
      <summary>Prepare the conversation</summary>
      <label className="reflection-label" htmlFor={`${item.id}-referral`}>
        <span className="integration-label">Who can introduce you</span>
        <input
          id={`${item.id}-referral`}
          className="activity-name-input prototype-referral-input"
          type="text"
          value={item.referral}
          onChange={(e) => onUpdate(item.id, { referral: e.target.value })}
          placeholder={REFERRAL_PLACEHOLDER}
        />
      </label>
      <label className="reflection-label" htmlFor={`${item.id}-request`}>
        <span className="integration-label">Your request</span>
        <textarea
          id={`${item.id}-request`}
          className="reflection-field prototype-notes"
          rows={4}
          value={item.request}
          onChange={(e) => onUpdate(item.id, { request: e.target.value })}
          placeholder={REQUEST_PLACEHOLDER}
        />
      </label>
      <div className="prototype-request-actions">
        <button
          type="button"
          className="date-nav-button"
          onClick={() =>
            onUpdate(item.id, { request: requestSketch(item.title, item.referral) })
          }
        >
          {item.request.trim() ? "Replace with a request sketch" : "Insert a request sketch"}
        </button>
      </div>
    </details>
  );
}

interface BelongingFieldsProps {
  item: Prototype;
  onUpdate: (id: string, patch: PrototypePatch) => void;
  onSpawnInterview: (title: string) => void;
}

function BelongingFields({ item, onUpdate, onSpawnInterview }: BelongingFieldsProps) {
  const ready = canExploreBelonging(item);
  const nextName = item.nextPeople.trim();

  return (
    <details className="prototype-interview prototype-belonging" open={ready || undefined}>
      <summary>When the time is right</summary>
      {!ready ? (
        <p className="compass-intro">
          Capture their story first. Exploring belonging comes after—when you know you want
          this kind of work, and the conversation has earned a connection.
        </p>
      ) : (
        <>
          <p className="compass-intro">
            You got the story. More often than not they raise working there. If they don’t,
            ask an open-ended steps question—never “any openings?”
          </p>

          <div
            className="prototype-status"
            role="group"
            aria-labelledby={`${item.id}-raised-label`}
          >
            <p id={`${item.id}-raised-label`} className="integration-label">
              Who raised working there?
            </p>
            <div className="odyssey-dial-levels">
              {BELONGING_RAISED_BY.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`odyssey-dial-level${item.theyRaisedWork === value ? " active" : ""}`}
                  aria-pressed={item.theyRaisedWork === value}
                  onClick={() => onUpdate(item.id, { theyRaisedWork: value })}
                >
                  {BELONGING_RAISED_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <label className="reflection-label" htmlFor={`${item.id}-belonging-ask`}>
            <span className="integration-label">Your steps question</span>
            <textarea
              id={`${item.id}-belonging-ask`}
              className="reflection-field prototype-notes"
              rows={3}
              value={item.belongingAsk}
              onChange={(e) => onUpdate(item.id, { belongingAsk: e.target.value })}
              placeholder={BELONGING_ASK_PLACEHOLDER}
            />
          </label>
          <div className="prototype-request-actions">
            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                onUpdate(item.id, { belongingAsk: belongingAskSketch(item.title) })
              }
            >
              {item.belongingAsk.trim()
                ? "Replace with a steps sketch"
                : "Insert a steps sketch"}
            </button>
          </div>

          <label className="reflection-label" htmlFor={`${item.id}-belonging-notes`}>
            <span className="integration-label">What happened</span>
            <textarea
              id={`${item.id}-belonging-notes`}
              className="reflection-field prototype-notes"
              rows={3}
              value={item.belongingNotes}
              onChange={(e) => onUpdate(item.id, { belongingNotes: e.target.value })}
              placeholder={BELONGING_NOTES_PLACEHOLDER}
            />
          </label>

          <label className="reflection-label" htmlFor={`${item.id}-next-people`}>
            <span className="integration-label">Who they sent you to</span>
            <input
              id={`${item.id}-next-people`}
              className="activity-name-input prototype-referral-input"
              type="text"
              value={item.nextPeople}
              onChange={(e) => onUpdate(item.id, { nextPeople: e.target.value })}
              placeholder={NEXT_PEOPLE_PLACEHOLDER}
            />
          </label>
          {nextName && (
            <div className="prototype-request-actions">
              <button
                type="button"
                className="date-nav-button"
                onClick={() => onSpawnInterview(nextName)}
              >
                Add as a new interview
              </button>
            </div>
          )}
        </>
      )}
    </details>
  );
}

interface QuestionLinkSelectProps {
  id: string;
  plans: OdysseyPlan[];
  planKind: OdysseyKind | null;
  questionIndex: number | null;
  onChange: (planKind: OdysseyKind | null, questionIndex: number | null) => void;
}

function QuestionLinkSelect({
  id,
  plans,
  planKind,
  questionIndex,
  onChange,
}: QuestionLinkSelectProps) {
  return (
    <label className="prototype-link" htmlFor={id}>
      <span className="integration-label">Tied to</span>
      <select
        id={id}
        className="prototype-link-select"
        value={encodePrototypeLink(planKind, questionIndex)}
        onChange={(e) => {
          const next = decodePrototypeLink(e.target.value);
          onChange(next.planKind, next.questionIndex);
        }}
      >
        <option value="">A question this might answer…</option>
        {plans.map((plan) => {
          const config = ODYSSEY_KIND_CONFIGS.find((item) => item.kind === plan.kind);
          return (
            <optgroup key={plan.kind} label={planLabel(plan)}>
              <option value={plan.kind}>
                {config ? `Life #${config.number} (whole plan)` : "Whole plan"}
              </option>
              {plan.questions.map((question, index) => (
                <option key={`${plan.kind}-${index}`} value={`${plan.kind}:${index}`}>
                  {questionPreview(question, index)}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}

interface StatusPillsProps {
  id: string;
  value: PrototypeStatus;
  onChange: (status: PrototypeStatus) => void;
}

function StatusPills({ id, value, onChange }: StatusPillsProps) {
  return (
    <div className="prototype-status" role="group" aria-labelledby={`${id}-label`}>
      <p id={`${id}-label`} className="integration-label">
        Status
      </p>
      <div className="odyssey-dial-levels">
        {PROTOTYPE_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={`odyssey-dial-level${value === status ? " active" : ""}`}
            aria-pressed={value === status}
            onClick={() => onChange(status)}
          >
            {PROTOTYPE_STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
