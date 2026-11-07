# Jayanth & Monika — Wedding Invitation

A mobile-first, six-section wedding invitation designed for GitHub Pages.

## Run locally

Open `index.html` through a local web server (recommended):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Personalise the invitation

Edit `js/config.js`:
- Couple names and countdown date/time.
- `sharedVenue.name` and `sharedVenue.address`.
- `sharedVenue.mapsUrl`: paste one Google Maps share URL. The same location is shown for both reception and wedding.
- `hiddenMessage`: the scratch-to-reveal note.

## Background music

Add an MP3 file named `wedding-music.mp3` inside `assets/music/`. The invitation attempts playback when the guest touches the wax seal (a user gesture, which is required by mobile browsers). The floating sound control can pause or resume it. No music track was supplied with this project, so add a track you have permission to use.

## Logo

The uploaded M&J monogram has been converted into a transparent antique-gold PNG and is used as the cover watermark and wax-seal emblem. Replace `assets/images/mj-monogram-gold.png` to use another logo.

## Publish with GitHub Pages

Upload the complete folder contents to the repository root (or configure Pages to use the folder containing `index.html`). Keep the `css`, `js`, and `assets` folders together with `index.html`.
