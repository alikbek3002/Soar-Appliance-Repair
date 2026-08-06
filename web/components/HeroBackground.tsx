/**
 * Backdrop for the light hero. Pure CSS, no canvas — three stacked layers:
 *
 *  1. `.hero-bg`      vertical wash: white under the header, easing down to the
 *                     site's #f4f6f7 body colour so the hero meets the About
 *                     section without a visible seam.
 *  2. `.hero-bg-dots` fine dot grid, radially masked so the texture only reads
 *                     behind the headline and dissolves before the edges
 *                     (replaces the old full-bleed 6rem grid lines).
 *  3. `.hero-bg-halo` soft brand-blue light: one ellipse lifting the headline,
 *                     two low glows at the bottom corners, and a faint column
 *                     rising through the middle.
 */
export default function HeroBackground() {
  return (
    <div className="hero-bg">
      <div className="hero-bg-dots" />
      <div className="hero-bg-halo" />
    </div>
  );
}
