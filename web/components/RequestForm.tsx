"use client";

import { useEffect, useRef, useState } from "react";
import { APPLIANCE_OPTIONS, CONTACT } from "@/lib/site";
import AddressAutocomplete from "@/components/AddressAutocomplete";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  appliance: string;
  details: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  appliance: "",
  details: "",
};

export default function RequestForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("there");
  const confirmRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // After a successful submit the form (tall) is replaced by the short
  // confirmation; bring it into the center of the screen so it's not left
  // scrolled off near the footer (especially on phones).
  useEffect(() => {
    if (submitted) {
      confirmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitted]);

  const update = (field: keyof Form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const v = e.target.value;
    setForm((s) => ({ ...s, [field]: v }));
    setErrors((s) => ({ ...s, [field]: undefined }));
  };

  const validate = (f: Form): Errors => {
    const errs: Errors = {};
    if (!f.firstName.trim()) errs.firstName = "Please enter your first name.";
    if (!f.lastName.trim()) errs.lastName = "Please enter your last name.";
    if (!f.email.trim()) errs.email = "Please enter your email.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim()))
      errs.email = "Enter a valid email address.";
    if (!f.phone.trim()) errs.phone = "Please enter your phone number.";
    if (!f.address.trim()) errs.address = "Please enter your service address.";
    return errs;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: honeypotRef.current?.value || "" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setSubmittedName(form.firstName || "there");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="confirm" ref={confirmRef}>
        <svg width="76" height="76" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r="37" fill="#e3e7ea" />
          <circle cx="38" cy="38" r="28" fill="#16294a" />
          <path
            d="M27 38.5 L34.5 46 L49 31"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2>Thank you, {submittedName}!</h2>
        <p>
          Your repair request has been received. A member of the Soar Appliance Repair team will
          contact you shortly at the number you provided to confirm your appointment.
        </p>
        <button type="button" className="confirm-reset" onClick={reset}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="eyebrow">Get started</div>
      <h2>Tell us what needs fixing.</h2>
      <p className="lead">
        Fill out the form and we&apos;ll reach out to schedule your repair. It only takes a minute.
      </p>
      {/* Always-visible fallback: the form needs JS to submit, so an old device
          where JS can't run can still reach us by phone. */}
      <p className="form-call">
        Prefer to call? <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
      </p>

      <form onSubmit={onSubmit} noValidate>
        {/* Honeypot: hidden from real users, catches bots. Not announced to AT. */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        {submitError && <div className="form-error">{submitError}</div>}

        <div className="field-row">
          <div className="field half">
            <label>
              First name <span className="req">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={update("firstName")}
              placeholder="Jane"
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          <div className="field half">
            <label>
              Last name <span className="req">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={update("lastName")}
              placeholder="Doe"
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
        </div>

        <div className="field-row">
          <div className="field half">
            <label>
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="jane@email.com"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="field half">
            <label>
              Phone <span className="req">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder="(202) 555-0148"
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
        </div>

        <div className="field">
          <label>
            Service address <span className="req">*</span>
          </label>
          <AddressAutocomplete
            value={form.address}
            onChange={(v) => {
              setForm((s) => ({ ...s, address: v }));
              setErrors((s) => ({ ...s, address: undefined }));
            }}
            placeholder="123 Main St, Chicago, IL 60601"
            error={errors.address}
          />
        </div>

        <div className="field">
          <label>Which appliance?</label>
          <select value={form.appliance} onChange={update("appliance")}>
            <option value="">Select an appliance (optional)</option>
            {APPLIANCE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>
            What&apos;s going on? <span className="opt">(optional)</span>
          </label>
          <textarea
            value={form.details}
            onChange={update("details")}
            placeholder="Briefly describe the problem — e.g. the fridge isn't cooling, the dryer won't start..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={sending}>
          {sending ? "Sending…" : "Submit repair request"}
        </button>
        <p className="form-note">We&apos;ll only use your details to schedule your repair.</p>
      </form>
    </div>
  );
}
