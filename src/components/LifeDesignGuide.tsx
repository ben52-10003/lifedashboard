import {
  DREAM_JOB_BELIEF,
  DREAM_JOB_INTRO,
  DREAM_JOB_POINTS,
  DREAM_JOB_REFRAME,
  LDI_FLIP,
  LDI_INTRO,
  LDI_POINTS,
} from "../types/prototyping";

export function LifeDesignGuide() {
  return (
    <>
      <details className="prompt-questions">
        <summary>Life Design Interview</summary>
        <p className="aeiou-intro">{LDI_INTRO}</p>
        <p className="ldi-flip">{LDI_FLIP}</p>
        <dl className="aeiou-list">
          {LDI_POINTS.map((item) => (
            <div key={item.name} className="aeiou-item">
              <dt>{item.name}</dt>
              <dd>{item.prompt}</dd>
            </div>
          ))}
        </dl>
      </details>

      <details className="prompt-questions">
        <summary>Designing the job you love</summary>
        <p className="aeiou-intro">{DREAM_JOB_INTRO}</p>
        <p className="ldi-belief">{DREAM_JOB_BELIEF}</p>
        <p className="ldi-reframe">{DREAM_JOB_REFRAME}</p>
        <dl className="aeiou-list">
          {DREAM_JOB_POINTS.map((item) => (
            <div key={item.name} className="aeiou-item">
              <dt>{item.name}</dt>
              <dd>{item.prompt}</dd>
            </div>
          ))}
        </dl>
      </details>
    </>
  );
}
