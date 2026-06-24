import PixelHero from "@/components/PixelHero";
import Reveal from "@/components/Reveal";
import RequestForm from "@/components/RequestForm";
import ServicesCarousel from "@/components/ServicesCarousel";
import Testimonials from "@/components/Testimonials";
import WhyChoose from "@/components/WhyChoose";
import { BUSINESS, CONTACT, FAQ } from "@/lib/site";

// Render at request time so metadata/JSON-LD pick up the runtime SITE_URL.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Reveal />

      {/* Liquid-glass refraction filter, referenced by the header pill's
          backdrop-filter. Hidden; only its filter definition is used. */}
      <svg className="liquid-defs" aria-hidden="true" focusable="false">
        <filter id="liquid-glass" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="2" seed="11" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.6" result="softNoise" />
          <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <header className="header">
        <div className="header-inner">
          <a href="#top" className="brand" aria-label="Soar Appliance Repair — home">
            <img
              src="/soar-logo-full.png"
              alt="Soar Appliance Repair"
              className="brand-logo"
              width={1209}
              height={288}
            />
          </a>
          <a href={CONTACT.phoneHref} className="nav-cta" aria-label={`Call ${CONTACT.phoneDisplay}`}>
            <svg className="nav-cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="nav-cta-text">{CONTACT.phoneDisplay}</span>
          </a>
          <nav className="nav">
            <a href="#about" className="nav-link">About</a>
            <span className="nav-sep" aria-hidden="true" />
            <a href="#services" className="nav-link">Services</a>
            <span className="nav-sep" aria-hidden="true" />
            <a href="#reviews" className="nav-link">Reviews</a>
            <span className="nav-sep" aria-hidden="true" />
            <a href="#request" className="nav-link">Request</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <PixelHero />

        {/* ABOUT + SERVICES */}
        <section id="about" className="about">
          <div className="about-inner">
            <div className="about-grid" data-reveal>
              <div className="about-head">
                <div className="eyebrow">About Us</div>
                <h2>A repair company you can actually rely on.</h2>
              </div>
              <div className="about-body">
                <p>
                  Soar Appliance Repair is a mobile repair company serving Chicago &amp; Suburb areas,
                  built on a simple idea: honest, dependable repairs done right. When a fridge stops cooling or a washer
                  won&apos;t drain, you need someone who shows up, diagnoses the real problem, and fixes
                  it.
                </p>
                <p>
                  We come to you — servicing every major appliance right in your home. Tell us what&apos;s
                  wrong using the form below and we&apos;ll get back to you to schedule a visit that fits
                  your day.
                </p>
              </div>
            </div>

            {/* WHY HOMEOWNERS CHOOSE SOAR — value-prop card grid */}
            <WhyChoose />

            <div id="services" className="services">
              <div className="services-head" data-reveal>
                <h3>Every major appliance in your home.</h3>
                <span className="label">What we repair</span>
              </div>
              <ServicesCarousel />
            </div>

            {/* AREAS WE SERVE — visible local-SEO content */}
            <div className="areas" data-reveal>
              <div className="areas-head">
                <span className="eyebrow">Service area</span>
                <h3>On-site appliance repair across the greater Chicago area.</h3>
                <p>
                  We come to you for in-home appliance repair across Chicago &amp; Suburb areas —
                  these nearby communities and many more:
                </p>
              </div>
              <ul className="area-chips">
                {BUSINESS.areaServed.map((city) => (
                  <li key={city}>{city}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq">
          <div className="faq-inner">
            <div className="faq-head" data-reveal>
              <span className="eyebrow">FAQ</span>
              <h2>Common questions about our appliance repair.</h2>
            </div>
            <div className="faq-list" data-reveal>
              {FAQ.map((item, i) => (
                <details className="faq-item" key={i} name="faq">
                  <summary>
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="faq-answer">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* REQUEST FORM */}
        <section id="request" className="request">
          <div className="request-inner">
            <div className="request-card" data-reveal>
              <RequestForm />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img
                src="/soar-logo-white.png"
                alt="Soar Appliance Repair"
                className="footer-logo"
                width={1209}
                height={288}
              />
            </div>
            <p>On-site appliance repair across Chicago &amp; Suburb areas.</p>
          </div>

          <div className="footer-col-contact">
            <h4>Contact</h4>
            <div className="footer-contact">
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <span className="addr">
                {CONTACT.addressLine1}
                <br />
                {CONTACT.addressLine2}
              </span>
            </div>
          </div>

          <div className="footer-col-services">
            <h4>Services</h4>
            <div className="footer-services">
              <a href="#services">Refrigerator &amp; Freezer</a>
              <a href="#services">Washer</a>
              <a href="#services">Dryer</a>
              <a href="#services">Dishwasher</a>
              <a href="#services">Range / Stove</a>
              <a href="#services">Cooktop &amp; Oven</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Soar Appliance Repair. All rights reserved.</span>
          <span>Chicago &amp; Suburb areas</span>
        </div>
      </footer>
    </>
  );
}
