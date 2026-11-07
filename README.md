# Jayanth & Monica — Wedding Invitation

A mobile-first, six-page wedding invitation designed for GitHub Pages.

## Included in this package
- The supplied M&J monogram, cleaned into a transparent antique-gold mark for the cover watermark and wax seal.
- An original, locally stored ambient instrumental loop at `assets/music/wedding-ambience.wav` (no external audio service or database required).
- Seal-triggered music playback, floral and sparkle burst, and page-entry effects.
- Smooth reversible scroll reveals and a touch-friendly scratch-to-reveal message.
- One shared venue card and one Google Maps link for both reception and wedding.

## Run locally
Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Customize
Edit `js/config.js` to change names, dates, hidden message, shared venue address and Maps URL. To use your own music, replace `assets/music/wedding-ambience.wav` with your audio file and update `musicFile` in `js/config.js` to its relative path. Music starts only after the guest taps the seal, because mobile browsers block automatic audio before a user gesture.

## Publish on GitHub Pages
Upload the contents of this folder (including the `assets/music` directory) to the repository's Pages branch/root. Keep the folder structure intact. The audio file must be committed along with the HTML, CSS, JavaScript and images.


## Mobile layout and animation notes
- Each invitation page adapts to the live mobile viewport height (`dvh`/`svh`) and respects device safe areas.
- Text uses responsive font sizing and balanced line wrapping; pages expand vertically if a short screen needs more room.
- Decorative petal and sparkle effects are enabled with capped particle counts for mobile performance.
- Page-entry text reveals reverse as the guest scrolls back up. The cover can be opened again after returning to it.
- Reduced-motion accessibility settings automatically disable decorative motion.
