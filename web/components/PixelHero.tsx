"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Component as BackgroundSnippets } from "@/components/ui/background-snippets";
import { BUSINESS, CONTACT } from "@/lib/site";

/* -----------------------------------------------------------------------------
 * Pixel-canvas hero — ported from the 21st.dev "pixel-perfect-hero" component
 * to this project's plain-CSS setup (no Tailwind / lucide / theme tokens).
 * The staggered outward-ripple pixel engine is kept as-is; colours are passed
 * in explicitly so it reads well on the dark hero background.
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number;
  y: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  draw: () => void;
  appear: () => void;
  disappear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const p: Pixel = {
    x,
    y,
    color,
    ctx,
    speed: rand(0.08, 0.4) * baseSpeed,
    size: 0,
    sizeStep: rand(0.12, 0.28),
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
        return;
      }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

function PixelCanvas({ colors, gap = 6, speed = 30 }: { colors: string[]; gap?: number; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || colors.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.65;
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);

      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();

    // ResizeObserver is missing on Safari ≤12 / old Android — feature-detect so
    // the hero effect never throws there (the canvas just won't re-fit on resize).
    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        init();
        animate("appear");
      });
      if (wrapRef.current) resizeObserver.observe(wrapRef.current);
    }

    animate("appear");

    return () => {
      resizeObserver?.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="pixel-hero-canvas">
      <canvas ref={canvasRef} />
    </div>
  );
}

// Appliance brands we service — shown in the hero's double marquee. Kept in
// sync with the brands listed on the service cards (see SERVICES in lib/site.ts);
// premium and mainstream names are interleaved so the marquee reads evenly.
const BRANDS = [
  "Samsung",
  "Café",
  "LG",
  "Thermador",
  "Whirlpool",
  "JennAir",
  "GE",
  "Miele",
  "Frigidaire",
  "Viking",
  "KitchenAid",
  "Monogram",
  "Bosch",
  "Sub-Zero",
  "Maytag",
  "Dacor",
  "Kenmore",
  "Thor",
  "Speed Queen",
  "Magic Chef",
  "Electrolux",
];

// Pixel palette tuned for the light (white) hero background — mostly soft grey
// with an occasional slate accent so the field reads as subtle texture.
const HERO_COLORS = ["#c4cbd1", "#b2bbc2", "#9aa3ab", "#16294a", "#1d5c9e"];

// One seamless marquee row. `direction` sets the scroll way: "right" drifts the
// brands rightward, "left" leftward. Each row holds the brand set twice so the
// loop is seamless.
function BrandRow({ brands, direction }: { brands: string[]; direction: "left" | "right" }) {
  return (
    <div className="pixel-hero-marquee-mask">
      <div className={`pixel-hero-marquee-track pixel-hero-marquee-${direction}`}>
        <div className="pixel-hero-marquee-row">
          {brands.map((b) => (
            <span className="pixel-hero-brand" key={b}>{b}</span>
          ))}
        </div>
        <div className="pixel-hero-marquee-row" aria-hidden="true">
          {brands.map((b) => (
            <span className="pixel-hero-brand" key={`c-${b}`}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  // Double marquee: the top row drifts right, the bottom row drifts left. The
  // bottom row uses the reversed order so the two rows don't read as identical.
  return (
    <div className="pixel-hero-marquee">
      <span className="pixel-hero-marquee-label">Brands we service</span>
      <BrandRow brands={BRANDS} direction="right" />
      <BrandRow brands={[...BRANDS].reverse()} direction="left" />
    </div>
  );
}

export default function PixelHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="pixel-hero" id="top-hero">
      {/* 21st.dev background snippet */}
      <div className="pixel-hero-bg" aria-hidden="true">
        <BackgroundSnippets />
      </div>

      <div className="pixel-hero-inner">
        <div className="pixel-hero-eyebrow">On-site appliance repair · Chicago &amp; Suburb areas</div>

        <h1 className="pixel-hero-title">
          <span className="pixel-hero-word1">Repair You Can</span>
          <span className="pixel-hero-word2">Trust</span>
          {/* Keyword-rich H1 text for search engines; visually hidden so the
              stylised headline above is what users see. */}
          <span className="sr-only"> — On-Site Appliance Repair in Chicago &amp; Suburbs</span>
        </h1>

        <p className="pixel-hero-desc">
          {BUSINESS.name} comes to you — we diagnose and fix every major appliance right in your home.
          Fast, professional service across {CONTACT.city}{" "}&amp; the greater Chicago area.
        </p>

        <div className={`pixel-hero-actions${isLoaded ? " is-loaded" : ""}`}>
          <a href="#request" className="pixel-hero-cta-primary">
            <span>Request a repair</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
          <a href={CONTACT.phoneHref} className="pixel-hero-cta-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Call {CONTACT.phoneDisplay}</span>
          </a>
        </div>
      </div>

      <div className={`pixel-hero-marquee-wrap${isLoaded ? " is-loaded" : ""}`}>
        <Marquee />
      </div>
    </section>
  );
}
