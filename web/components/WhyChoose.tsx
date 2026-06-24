import { WHY_SOAR } from "@/lib/site";

// "Why homeowners choose Soar" — an icon card grid in the About section. Each
// item's `icon` key (from WHY_SOAR) maps to one of these stroke SVGs, drawn in
// the same Feather style as the rest of the site's icons.
function Icon({ name }: { name: string }) {
  const common: React.SVGProps<SVGSVGElement> = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <path d="M7 7h.01" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 12.5 17 22l-5-3-5 3 1.5-9.5" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function WhyChoose() {
  return (
    <div className="why" data-reveal>
      <div className="why-head">
        <span className="eyebrow">Why Soar</span>
        <h3>Why homeowners choose Soar.</h3>
      </div>
      <ul className="why-grid">
        {WHY_SOAR.map((item) => (
          <li className="why-card" key={item.title}>
            <span className="why-icon">
              <Icon name={item.icon} />
            </span>
            <div className="why-card-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
