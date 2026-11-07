# Jayanth & Monica — Wedding Invitation

A six-page, responsive wedding invitation website designed for GitHub Pages.

## Pages
1. Existing burgundy-and-gold envelope cover with interactive wax seal.
2. Divine blessings, parents and couple introduction.
3. Reception invitation.
4. Wedding ceremony and Muhurtham.
5. Live countdown to 20 November 2026, 9:20 AM IST, plus a scratch-to-reveal message.
6. Reception and wedding venue cards with Google Maps links.

## Quick edits
Open `js/config.js` and edit:
- `hiddenMessage`: the note guests discover by scratching.
- `reception.address` and `reception.mapsUrl`.
- `wedding.venue`, `wedding.address` and `wedding.mapsUrl`.
- `musicFile` if you add a locally hosted MP3 at `assets/audio/music.mp3`.

For Maps links, open the exact place in Google Maps, choose **Share**, copy the link, and paste it into the matching `mapsUrl` field. Keep the quotes around the URL.

## Run locally
Open `index.html` in a browser, or run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages
Upload the contents of this folder to the root of your GitHub Pages repository (so `index.html` is at the repository root), commit, and enable Pages in repository Settings.

## Notes
- The countdown uses the wedding's local India Standard Time offset (`+05:30`).
- The cover's visual design and envelope-opening sequence are retained from the earlier project.
- The site uses Google Fonts when online and elegant system fallbacks if offline.
- No venue map URLs have been invented; add the exact share links in `js/config.js`.
