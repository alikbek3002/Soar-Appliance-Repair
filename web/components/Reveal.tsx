"use client";

import { useEffect } from "react";

/** Reveals [data-reveal] elements on scroll, mirroring the prototype's IntersectionObserver. */
export default function Reveal() {
  useEffect(() => {
    // Signal that JS is alive. The CSS keeps all content visible by default and
    // only applies the hidden "pre-animation" state under html.reveal-ready, so
    // if this bundle never runs (old browser, parse error) nothing stays hidden.
    document.documentElement.classList.add("reveal-ready");

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reveal = (el: HTMLElement) => el.classList.add("is-visible");

    let fallback: ReturnType<typeof setTimeout>;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              reveal(en.target as HTMLElement);
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      els.forEach((el) => io.observe(el));
      fallback = setTimeout(() => els.forEach(reveal), 2500);
      return () => {
        clearTimeout(fallback);
        io.disconnect();
      };
    }

    els.forEach(reveal);
  }, []);

  return null;
}
