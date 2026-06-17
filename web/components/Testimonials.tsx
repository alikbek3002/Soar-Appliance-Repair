import { TESTIMONIALS } from "@/lib/site";

/**
 * A single vertically auto-scrolling column. The items are rendered twice and
 * the track animates to translateY(-50%), so the loop is seamless (each card
 * carries its own bottom margin, making the two halves tile exactly).
 * Pure CSS — no client JS — so this stays a server component.
 */
function Column({
  items,
  duration,
  className = "",
}: {
  items: typeof TESTIMONIALS;
  duration: number;
  className?: string;
}) {
  return (
    <div className={`reviews-col ${className}`}>
      <div
        className="reviews-track"
        style={{ "--review-dur": `${duration}s` } as React.CSSProperties}
      >
        {[...items, ...items].map((t, i) => (
          <figure className="review-card" key={i} aria-hidden={i >= items.length}>
            <blockquote className="review-text">{t.text}</blockquote>
            <figcaption className="review-meta">
              <span className="review-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.6" />
                  <path d="M5 19.5c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
                </svg>
              </span>
              <span className="review-meta-text">
                <span className="review-name">{t.name}</span>
                <span className="review-role">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const col1 = TESTIMONIALS.slice(0, 3);
  const col2 = TESTIMONIALS.slice(3, 6);
  const col3 = TESTIMONIALS.slice(6, 9);

  return (
    <section id="reviews" className="reviews">
      <div className="reviews-inner">
        <div className="reviews-head" data-reveal>
          <span className="eyebrow">Testimonials</span>
          <h2>What our customers say</h2>
          <p>Real feedback from homeowners across Streamwood and the greater Chicago area.</p>
        </div>

        <div className="reviews-cols" data-reveal>
          <Column items={col1} duration={32} />
          <Column items={col2} duration={40} className="reviews-col--md" />
          <Column items={col3} duration={36} className="reviews-col--lg" />
        </div>
      </div>
    </section>
  );
}
