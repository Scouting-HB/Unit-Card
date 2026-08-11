# Scout Business Card Templates

Customizable business card templates for BSA Scouting units. Edit fields directly on the card, then download print-ready PNG images at ~600 DPI.

## Templates

- **Pack** (`pack.html`) — Cub Scout Pack card with two layout previews (standard and alternate). Rank badges from Lion through Arrow of Light.
- **Troop** (`troop.html`) — Scouts BSA Troop card with customizable back featuring three layout options (banner, frame, collage), a stock photo gallery, custom photo upload, and pan/zoom/rotate controls.

## Features

- **Inline editing** — Click any text field on the card to edit it directly.
- **QR code** — Auto-generated from the website field.
- **High-res export** — Downloads front and back as separate PNGs at 6x scale (~600 DPI for a 3.5x2" card). Triggered by the Download button or Ctrl/Cmd+P.
- **Shareable links** — Copy Link encodes all field values into URL parameters.
- **Persistent state** — All edits, layout choices, and photo selections are saved to localStorage.
- **Photo management** (troop) — Select from stock photos or upload your own. Pan, zoom (scroll wheel), and rotate (shift+scroll) photos within their slots. Double-click to reset.

## Project Structure

```
index.html          Landing page
pack.html           Cub Scout Pack card editor
troop.html          Scouts BSA Troop card editor
common.css          Shared card layout and typography
pack.css            Pack color theme
troop.css           Troop color theme and back card layouts
js/
  card-fields.js    Field persistence (localStorage + URL params)
  card-export.js    High-res image export via html2canvas
  qr.js             QR code generation
  back-image.js     Simple back image toggle (pack)
  back-layout.js    Back layout toggle + graphic upload (troop)
  photo-manager.js  Photo gallery, slot assignment, pan/zoom/rotate
images/
  pack/             Pack rank badge images
  back/             Pack back card images
  troop/
    badges/         Troop rank badge images
    scouting/       Troop back card graphics and logos
    scouting/activities/  Stock activity photos
```

## Usage

Open `index.html` in a browser (or serve with any static file server). No build step required.

All images and the QR code library (`qrcode.min.js`) are included locally. The only external dependency is html2canvas, loaded from CDN for image export.

## Examples

```
troop.html?troop=SCOUT+TROOP+242&title=1st+Girl+Troop+in+Virginia&communities=Bridgewater+%E2%80%A2+Broadway+%E2%80%A2+Dayton+%E2%80%A2+Elkton+%E2%80%A2+Grottoes+%E2%80%A2+Keezletown+%E2%80%A2+Massanutten+%E2%80%A2+McGaheysville+%E2%80%A2+Mount+Crawford+%E2%80%A2+Penn%0A++++++++++++++++++++++++Laird+%E2%80%A2+Port+Republic+%E2%80%A2+Singers+Glen&school=FOR+CURRENT+SCHOOL+YEAR&grade=Welcoming+6th+through+12th+Grade&meeting-details=MEETINGS&meeting-datetime=Mondays+7-8%3A30+PM&location=Harrisonburg+Baptist+Church%0A++++++++++++++++++++++++++++501+S.+Main+St.%2C+Harrisonburg%2C+VA&website=troop242.us&socials=Troop242&email=scoutmaster%40troop242.us
```

```
troop.html?troop=SCOUT+TROOP+242&title=1st+Girl+Troop+in+Virginia&communities=Bridgewater+%E2%80%A2+Broadway+%E2%80%A2+Dayton+%E2%80%A2+Elkton+%E2%80%A2+Grottoes+%E2%80%A2+Keezletown+%E2%80%A2+Massanutten+%E2%80%A2+McGaheysville+%E2%80%A2+Mount+Crawford+%E2%80%A2+Penn%0A++++++++++++++++++++++++Laird+%E2%80%A2+Port+Republic+%E2%80%A2+Singers+Glen&school=FOR+CURRENT+SCHOOL+YEAR&grade=Welcoming+6th+through+12th+Grade&meeting-details=MEETINGS&meeting-datetime=Mondays+7%3A00+PM&location=Harrisonburg+Baptist+Church%0A++++++++++++++++++++++++++++501+S.+Main+St.%2C+Harrisonburg%2C+VA&website=+troop242.us&socials=+Pack120Rockingham&email=+scoutmaster%40troop242.us
```

```
troop.html?troop=SCOUT+TROOP+242&title=1st+Girl+Troop+in+Virginia&communities=Bridgewater+%E2%80%A2+Broadway+%E2%80%A2+Dayton+%E2%80%A2+Elkton+%E2%80%A2+Grottoes+%E2%80%A2+Keezletown+%E2%80%A2+Massanutten+%E2%80%A2+McGaheysville+%E2%80%A2+Mount+Crawford+%E2%80%A2+Penn%0A++++++++++++++++++++++++Laird+%E2%80%A2+Port+Republic+%E2%80%A2+Singers+Glen&school=FOR+CURRENT+SCHOOL+YEAR&grade=Welcoming+6th+through+12th+Grade&meeting-details=MEETINGS&meeting-datetime=Mondays+7-8%3A30+PM&location=Harrisonburg+Baptist+Church%0A++++++++++++++++++++++++++++501+S.+Main+St.%2C+Harrisonburg%2C+VA&website=troop242.us&socials=Troop242&email=scoutmaster%40troop242.us
```