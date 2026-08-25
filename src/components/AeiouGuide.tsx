import { AEIOU_INTRO, AEIOU_ITEMS } from "../types/journal";

interface AeiouGuideProps {
  defaultOpen?: boolean;
}

export function AeiouGuide({ defaultOpen = false }: AeiouGuideProps) {
  return (
    <details className="prompt-questions" open={defaultOpen || undefined}>
      <summary>AEIOU method</summary>
      <p className="aeiou-intro">{AEIOU_INTRO}</p>
      <dl className="aeiou-list">
        {AEIOU_ITEMS.map((item) => (
          <div key={item.letter} className="aeiou-item">
            <dt>
              <span className="aeiou-letter">{item.letter}</span>
              {item.name}
            </dt>
            <dd>{item.prompt}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
