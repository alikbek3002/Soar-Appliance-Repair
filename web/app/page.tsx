import Gear from "@/components/Gear";
import Reveal from "@/components/Reveal";
import RequestForm from "@/components/RequestForm";
import { BUSINESS, CONTACT, FAQ, SERVICES } from "@/lib/site";

// Render at request time so metadata/JSON-LD pick up the runtime SITE_URL.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Reveal />

      <header className="header">
        <div className="header-inner">
          <a href="#top" className="brand">
            <Gear size={40} toothColor="#3a444d" voidColor="#f4f6f7" />
            <span className="brand-name">
              Soar <span className="accent">Appliance Repair</span>
            </span>
          </a>
          <a href={CONTACT.phoneHref} className="nav-cta">{CONTACT.phoneDisplay}</a>
          <nav className="nav">
            <a href="#about" className="nav-link">About</a>
            <span className="nav-sep" aria-hidden="true" />
            <a href="#services" className="nav-link">Services</a>
            <span className="nav-sep" aria-hidden="true" />
            <a href="#request" className="nav-link">Request</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">On-Site Appliance Repair · Streamwood, IL</div>
            <h1>Your appliances, repaired right the first time.</h1>
            <p>
              Soar Appliance Repair comes to you. We diagnose and fix every major appliance right in
              your home — fast, professional service from technicians who respect your space.
            </p>
            <div className="hero-actions">
              <a href="#request" className="btn-primary">Request a repair</a>
              <a href={CONTACT.phoneHref} className="btn-ghost">Call {CONTACT.phoneDisplay}</a>
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-frame">
              <img
                src="/image.png"
                alt="Soar Appliance Repair technician"
                className="hero-icon"
                width={200}
                height={200}
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

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
                  Soar Appliance Repair is a Streamwood-based mobile repair company built on a simple
                  idea: honest, dependable repairs done right. When a fridge stops cooling or a washer
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

            <div id="services" className="services">
              <div className="services-head" data-reveal>
                <h3>Every major appliance in your home.</h3>
                <span className="label">What we repair</span>
              </div>
              <div className="services-hint" aria-hidden="true">Swipe to see all 5 →</div>
              <div className="services-grid" data-reveal>
                {SERVICES.map((s) => (
                  <div className="service-card" key={s.num}>
                    <div className="bar" />
                    <div className="num">{s.num}</div>
                    <div className="title">{s.name}</div>
                    <div className="desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AREAS WE SERVE — visible local-SEO content */}
            <div className="areas" data-reveal>
              <div className="areas-head">
                <span className="eyebrow">Service area</span>
                <h3>On-site appliance repair across the greater Chicago area.</h3>
                <p>
                  Based in Streamwood, IL, we come to you for in-home appliance repair throughout
                  these nearby communities:
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
              <Gear size={34} toothColor="#b4bcc3" voidColor="#1b2127" />
              <span className="footer-brand-name">Soar Appliance Repair</span>
            </div>
            <p>On-site appliance repair across Streamwood and the greater Chicago area.</p>
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
              <a href="#services">Refrigerators &amp; Freezers</a>
              <a href="#services">Washers &amp; Dryers</a>
              <a href="#services">Dishwashers</a>
              <a href="#services">Ovens &amp; Cooktops</a>
              <a href="#services">Ice Makers</a>
            </div>
          </div>

          <div className="footer-col-map">
            <h4>Find us</h4>
            <iframe
              title="Service area map — Streamwood, IL"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-88.2450%2C41.9850%2C-88.1150%2C42.0650&layer=mapnik&marker=42.0256%2C-88.1784"
              className="footer-map"
            />
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Soar Appliance Repair. All rights reserved.</span>
          <span>Streamwood, IL</span>
        </div>
      </footer>
    </>
  );
}
