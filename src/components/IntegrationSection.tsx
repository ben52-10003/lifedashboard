import {
  INTEGRATION_FIELDS,
  INTEGRATION_INTRO,
} from "../types/compass";
import type { IntegrationReflection } from "../types/dashboard";

interface IntegrationSectionProps {
  integration: IntegrationReflection;
  onChange: (field: keyof IntegrationReflection, value: string) => void;
}

export function IntegrationSection({ integration, onChange }: IntegrationSectionProps) {
  return (
    <section className="compass-section" aria-labelledby="integration-heading">
      <header className="compass-section-header">
        <h2 id="integration-heading">Coherency and Workview–Lifeview Integration</h2>
        <p className="compass-intro">{INTEGRATION_INTRO}</p>
      </header>

      <div className="integration-fields">
        {INTEGRATION_FIELDS.map((fieldConfig) => (
          <label
            key={fieldConfig.field}
            className="integration-field"
            htmlFor={`integration-${fieldConfig.field}`}
          >
            <span className="integration-label">{fieldConfig.label}</span>
            <textarea
              id={`integration-${fieldConfig.field}`}
              className="reflection-field"
              value={integration[fieldConfig.field]}
              onChange={(e) => onChange(fieldConfig.field, e.target.value)}
              placeholder={fieldConfig.placeholder}
              rows={5}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
