# Soar Appliance Repair — Brand assets

Clean vector logo set, rebuilt from the generated render
(`source/original-render.png`). The dark textured wall was removed and the
artwork was vectorised, so every file is transparent and scales to any size
without quality loss. `source/logo-nobg.png` is the background-removed full
logo; `../web/public/soar-logo-full.png` is the tightly-cropped copy used live
on the site (header & footer).

## Files

### SVG (preferred — infinitely scalable)

| File | What it is |
|------|------------|
| `soar-logo.svg`        | Full horizontal lockup (emblem + wordmark) |
| `soar-emblem.svg`      | Round "SAR" emblem only — use for avatars, favicons, app icons |
| `soar-wordmark.svg`    | Text only — "SOAR APPLIANCE REPAIR / MOBILE SERVICE" |

Each of the above ships in colour variants:

| Suffix | Colour | Use on |
|--------|--------|--------|
| *(none)* | `currentColor` | **recommended** — inherits the CSS `color` of its container |
| `-dark`  | `#1e252b` | light backgrounds (the site's text colour) |
| `-light` | `#ffffff` | dark backgrounds (footer, hero on dark) |
| `-slate` | `#3a444d` | the site's accent grey |

> The plain (`currentColor`) file is the one to reach for in code — set the
> colour from CSS and a single file covers every theme:
> ```html
> <img src="/soar-logo.svg" ... >            <!-- inline SVG only -->
> <span style="color:#1e252b"><!-- inline soar-logo.svg here --></span>
> ```
> For `<img>` tags (which can't inherit `currentColor`) use the explicit
> `-dark` / `-light` files.

### PNG (`png/` — when a raster is required)

| File | Notes |
|------|-------|
| `soar-logo-metallic.png`   | **The original 3-D metallic look, background removed** (transparent). Best on dark surfaces. |
| `soar-emblem-metallic.png` | Same, emblem only |
| `soar-logo-dark-1600.png`  | Flat `#1e252b`, transparent — for light backgrounds |
| `soar-logo-light-1600.png` | Flat white, transparent — for dark backgrounds |
| `soar-emblem-dark-1024.png` / `-512.png` | Emblem, flat dark (512 is favicon-ready) |
| `soar-emblem-light-1024.png` | Emblem, flat white |

`preview.png` — contact sheet showing every variant on different backgrounds.

## Palette (matches the website)

- Text / dark logo — `#1e252b`
- Accent slate — `#3a444d`
- Light background — `#f4f6f7`
- Dark surface (footer) — `#1b2127`

## Notes

- The SVGs are a faithful vector trace of the rendered artwork, flattened to a
  single colour — this matches the site's flat design and prints cleanly.
- The `*-metallic.png` files keep the shiny 3-D treatment from the render in
  case you want that look (e.g. social cards on a dark background).
</content>
