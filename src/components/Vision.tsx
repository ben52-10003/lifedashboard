import { GAUGE_CONFIGS, type GaugeArea } from "../types/dashboard";

const VISION_INTRO =
  "A vision is a picture of a life you want to live—Health, Work, Play, and Love made concrete. Collect images, moments, and scenes that show what “full” looks like in each area.";

const VISION_PROMPT =
  "Start with what you can already see. Add more images as your prototypes and Odyssey Plans sharpen the picture.";

const SECTION_HINTS: Record<GaugeArea, string> = {
  health: "What does thriving in body, mind, and spirit look like for you?",
  work: "What does meaningful work look like in a day you would love?",
  play: "Where is joy for its own sake—without needing to be productive?",
  love: "Where is love flowing—given and received?",
};

const VISION_IMAGES: Partial<
  Record<GaugeArea, { src: string; alt: string; caption: string; className?: string }>
> = {
  health: {
    src: "/vision/labor-day-2028.jpg",
    alt: "Family jumping into a pool together, hands linked, on a sunny Labor Day.",
    caption: "Labor Day 2028.",
  },
  work: {
    src: "/vision/harris-tcb.png",
    alt: "Harris Taking Care of Business logo with a lightning bolt.",
    caption: "Taking Care of Business.",
    className: "vision-image--logo",
  },
};

export function Vision() {
  return (
    <div className="vision">
      <header className="dashboard-header">
        <h1>Vision</h1>
        <p className="dashboard-intro">{VISION_INTRO}</p>
        <p className="dashboard-prompt">{VISION_PROMPT}</p>
      </header>

      <div className="compass-sections">
        {GAUGE_CONFIGS.map((config) => {
          const image = VISION_IMAGES[config.area];
          return (
            <section
              key={config.area}
              className="compass-section"
              aria-labelledby={`vision-${config.area}-heading`}
            >
              <header className="compass-section-header">
                <h2 id={`vision-${config.area}-heading`}>{config.title}</h2>
                <p className="compass-intro">{SECTION_HINTS[config.area]}</p>
              </header>

              {image ? (
                <figure className="vision-figure">
                  <img
                    className={`vision-image${image.className ? ` ${image.className}` : ""}`}
                    src={image.src}
                    alt={image.alt}
                  />
                  <figcaption className="vision-caption">{image.caption}</figcaption>
                </figure>
              ) : (
                <p className="journal-empty">
                  No vision images yet. Add scenes that show what {config.title.toLowerCase()}{" "}
                  looks like when it’s full.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
