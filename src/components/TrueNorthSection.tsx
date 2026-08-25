import {
  TRUE_NORTH_REFRAME,
  TRUE_NORTH_SUMMARY,
} from "../types/compass";

interface TrueNorthSectionProps {
  calibrationNotes: string;
  onChange: (value: string) => void;
}

export function TrueNorthSection({ calibrationNotes, onChange }: TrueNorthSectionProps) {
  return (
    <section className="compass-section compass-section--true-north" aria-labelledby="true-north-heading">
      <header className="compass-section-header">
        <h2 id="true-north-heading">True North</h2>
        <p className="compass-intro">{TRUE_NORTH_SUMMARY}</p>
        <blockquote className="compass-reframe">{TRUE_NORTH_REFRAME}</blockquote>
      </header>

      <label className="reflection-label" htmlFor="calibration-notes">
        <span className="integration-label">Compass calibration notes</span>
        <textarea
          id="calibration-notes"
          className="reflection-field"
          value={calibrationNotes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Notes from your latest compass check—transitions, recalibrations, edits to your views…"
          rows={5}
        />
      </label>
    </section>
  );
}
