import { countWords, type ReflectionConfig } from "../types/compass";

interface ReflectionSectionProps {
  config: ReflectionConfig;
  value: string;
  onChange: (value: string) => void;
}

function wordCountClass(count: number, target: number): string {
  if (count === 0) return "word-count";
  const ratio = count / target;
  if (ratio < 0.5 || ratio > 1.5) return "word-count word-count--hint";
  return "word-count word-count--good";
}

export function ReflectionSection({ config, value, onChange }: ReflectionSectionProps) {
  const wordCount = countWords(value);

  return (
    <section className="compass-section" aria-labelledby={`${config.id}-heading`}>
      <header className="compass-section-header">
        <h2 id={`${config.id}-heading`}>{config.title}</h2>
        <p className="compass-intro">{config.intro}</p>
      </header>

      <details className="prompt-questions">
        <summary>Prompt questions</summary>
        <ul>
          {config.promptQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </details>

      <label className="reflection-label" htmlFor={`${config.id}-reflection`}>
        <span className="sr-only">{config.title}</span>
        <textarea
          id={`${config.id}-reflection`}
          className="reflection-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          rows={10}
        />
      </label>

      <p className={wordCountClass(wordCount, config.targetWords)} aria-live="polite">
        {wordCount} / ~{config.targetWords} words
      </p>
    </section>
  );
}
