"use client";

import { useEffect, useId, useRef, useState } from "react";

type Suggestion = {
  id: string;
  name: string;
  place_formatted: string;
  full_address: string;
};

export type AddressSelection = {
  full_address: string;
  city: string;
  state: string;
  postcode: string;
  coordinates: { longitude: number; latitude: number } | null;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (sel: AddressSelection) => void;
  placeholder?: string;
  error?: string;
};

// Address input with a Yandex-style suggestion dropdown. Talks to /api/address,
// which proxies Mapbox Search Box (token stays server-side, results pinned to the
// Chicago service area). Falls back to a plain text input if the API is down.
export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  const sessionRef = useRef<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSelectedRef = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // One session token per search; regenerated after each pick (Mapbox billing).
  const newSession = () =>
    (sessionRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.round(performance.now())}`);

  useEffect(() => {
    newSession();
  }, []);

  // Close the dropdown when clicking outside the field.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const fetchSuggestions = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/address?action=suggest&q=${encodeURIComponent(q)}&session=${sessionRef.current}`
        );
        const data = await res.json();
        const list: Suggestion[] = data.suggestions || [];
        setSuggestions(list);
        setActive(-1);
        setOpen(list.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    justSelectedRef.current = false;
    fetchSuggestions(v);
  };

  const choose = async (s: Suggestion) => {
    justSelectedRef.current = true;
    setOpen(false);
    setSuggestions([]);
    // Show the candidate immediately; refine with the retrieved canonical form.
    onChange(s.full_address || `${s.name}${s.place_formatted ? ", " + s.place_formatted : ""}`);
    try {
      const res = await fetch(
        `/api/address?action=retrieve&id=${encodeURIComponent(s.id)}&session=${sessionRef.current}`
      );
      const data = await res.json();
      if (data.feature) {
        if (data.feature.full_address) onChange(data.feature.full_address);
        onSelect?.(data.feature as AddressSelection);
      }
    } catch {
      /* keep the suggestion text we already set */
    } finally {
      newSession(); // next search = new billing session
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (active >= 0) {
        e.preventDefault();
        choose(suggestions[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="address-field" ref={boxRef}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => {
          if (!justSelectedRef.current && suggestions.length) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
      />
      {error && <div className="field-error">{error}</div>}
      {open && suggestions.length > 0 && (
        <ul className="address-suggest" id={listId} role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={`address-suggest-item${i === active ? " is-active" : ""}`}
              onMouseDown={(e) => {
                // mousedown (not click) so we beat the input's blur.
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="address-suggest-name">{s.name}</span>
              {s.place_formatted && (
                <span className="address-suggest-sub">{s.place_formatted}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {loading && open && suggestions.length === 0 && (
        <ul className="address-suggest" role="listbox" aria-hidden>
          <li className="address-suggest-item address-suggest-empty">Searching…</li>
        </ul>
      )}
    </div>
  );
}
