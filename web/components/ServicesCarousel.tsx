"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/site";

type Service = (typeof SERVICES)[number];

export default function ServicesCarousel() {
  const [angles, setAngles] = useState<number[]>(() => SERVICES.map((_, i) => i * (360 / SERVICES.length)));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<Service | null>(null);
  const pausedRef = useRef(false);

  // Keep a ref in sync so the rotation interval can read the latest value
  // without resubscribing every frame. The orbit only pauses while a single
  // tile is hovered (so it can be clicked) or while the modal is open.
  useEffect(() => {
    pausedRef.current = hovered !== null || active !== null;
  }, [hovered, active]);

  // Continuous gentle orbit.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setAngles((prev) => prev.map((a) => (a + 0.28) % 360));
    }, 30);
    return () => clearInterval(id);
  }, []);

  // Lock page scroll + close on Escape while the modal is open. Lock both the
  // <html> and <body> elements since either can be the scroll container.
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 14,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 14,
    });
  };

  return (
    <>
      <div
        className="svc-carousel"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div
          className="svc-stage"
          style={{ transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)` }}
        >
          <div className="svc-center" aria-hidden="true">
            <span>Tap a photo</span>
            <small>to see what we fix &amp; the brands we service</small>
          </div>

          {SERVICES.map((s, i) => {
            const rad = (angles[i] ?? 0) * (Math.PI / 180);
            // Position lives in CSS: JS only supplies the unitless cos/sin and
            // the radius (--r) is responsive in globals.css, so the orbit
            // resizes cleanly on mobile without rescaling hacks.
            // Round to a fixed precision so the server- and client-rendered
            // values match exactly (Math.cos/sin can differ in the last digit
            // between the Node and browser engines → hydration mismatch).
            const style = {
              "--cos": Math.cos(rad).toFixed(5),
              "--sin": Math.sin(rad).toFixed(5),
            } as React.CSSProperties;
            return (
              <button
                key={s.num}
                type="button"
                className="svc-orb"
                onClick={() => setActive(s)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                aria-label={`${s.name} — see what we fix`}
                style={style}
              >
                <span className="svc-orb-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} loading="lazy" />
                </span>
                <span className="svc-orb-label">{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {active && (
        <div className="svc-modal" role="dialog" aria-modal="true" aria-label={active.name} onClick={() => setActive(null)}>
          <div className="svc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="svc-modal-close" onClick={() => setActive(null)} aria-label="Close">
              ×
            </button>
            <div className="svc-modal-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.img} alt={active.name} />
            </div>
            <div className="svc-modal-body">
              <div className="svc-modal-num">{active.num}</div>
              <h3>{active.name}</h3>
              <p>{active.desc}</p>

              <div className="svc-modal-sub">What we fix</div>
              <ul className="svc-modal-list">
                {active.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>

              <div className="svc-modal-sub">Brands &amp; models we service</div>
              <ul className="svc-brand-chips">
                {active.brands.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="svc-modal-note">…and most other major brands. Don&apos;t see yours? Just ask.</p>

              <a href="#request" className="btn-primary svc-modal-cta" onClick={() => setActive(null)}>
                Request this repair
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
