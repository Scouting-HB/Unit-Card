# Agent Instructions

## Project Overview

This is a static HTML/CSS/JS project — no build tools, no framework, no npm. Files are served directly from the filesystem or a simple static server.

## Architecture

- **No build step.** All JS is vanilla ES5-compatible, loaded via `<script>` tags.
- **Shared JS modules** in `js/` use the revealing module pattern (IIFE returning a public API). They are NOT ES modules — no import/export.
- **CSS** is split into `common.css` (shared layout), `pack.css` (pack colors/theme), and `troop.css` (troop colors/theme + back card layouts).
- **html2canvas** is the only external dependency (CDN). `qrcode.min.js` is vendored locally.

## Key Patterns

- **Field persistence:** `CardFields.init()` handles localStorage save/load and URL parameter deserialization. Each page passes its own `storageKey` and `urlTriggerFields`.
- **Back card images:** Pack uses simple image swapping (`BackImage`). Troop uses layout switching (`BackLayout`) with photo gallery and pan/zoom/rotate (`PhotoManager`).
- **Photo slot sizing:** Images in troop back card slots are sized via `sizeImageToCover()` in JS (explicit pixel width/height/left/top), NOT via CSS `object-fit`. This is required for CSS `transform: scale()` to work correctly — `object-fit: cover` only renders the visible portion, so zooming out reveals background instead of more image.
- **common.css `.card-back > img`** uses the child combinator (`>`) intentionally. Troop back cards have nested images in `.back-photo-slot` that must NOT inherit `width: 100%; height: 100%; object-fit: cover`.

## File Conventions

- Image paths use the structure `images/{unit-type}/...` (e.g., `images/pack/`, `images/troop/badges/`).
- localStorage keys are prefixed by page type (e.g., `pack-card-fields`, `troop-card-back-layout`).
- CSS color values come from the BSA brand palette defined as CSS custom properties in `:root`.

## Things to Watch Out For

- The pack page (`pack.html`) shows two layout previews (standard + alternate) that share the same field data. Edits to the standard layout are mirrored to the alt via `data-mirror` attributes and a `syncMirrors()` function.
- The `pack-alt.html` and `pack-alt.css` files are deprecated — both layouts are now in `pack.html`.
- Photo pan/zoom uses CSS `transform` for translate/scale/rotate, but the base image dimensions are set in JS pixels. Do not add `object-fit` to `.back-photo-slot img`.
