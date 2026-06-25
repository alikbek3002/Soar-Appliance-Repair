import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/soar-logo.svg"
          alt="Soar Appliance Repair"
          className="notfound-logo"
          width={1592}
          height={328}
        />
        <p className="notfound-code">404</p>
        <h1 className="notfound-title">We couldn&apos;t find that page.</h1>
        <p className="notfound-lead">
          The page you were looking for doesn&apos;t exist or has moved — but your
          appliance repair is one click (or call) away.
        </p>
        <div className="notfound-actions">
          <Link href="/" className="notfound-btn notfound-btn-primary">
            Back to home
          </Link>
          <Link href="/#request" className="notfound-btn notfound-btn-ghost">
            Request a repair
          </Link>
          <a href={CONTACT.phoneHref} className="notfound-btn notfound-btn-ghost">
            Call {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
    </main>
  );
}
