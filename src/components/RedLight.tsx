export function RedLight() {
  return (
    <div className="red-light" role="status" aria-live="polite">
      <span className="red-light-dot" aria-hidden="true" />
      <span>Needs attention</span>
    </div>
  );
}
