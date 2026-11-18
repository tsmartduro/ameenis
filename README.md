# ameenis-solution Scout

Rotating outreach manager. Plain HTML, CSS and JavaScript, no build step and no backend.

## Run it
Open `index.html` in a browser (the tabs link to the other pages), or serve the folder (needed for "Install app"):

    npx serve .        # or: python3 -m http.server 8080

## Files
- index.html (Messages), accounts.html, batches.html, recipients.html, rotation.html, activity.html: one page per section, all sharing the same header and tab bar
- styles.css: all styling, light and dark mode
- app.js: all logic (messages, accounts, batches, recipients, rotation, activity)
- manifest.webmanifest, sw.js, logo-mark.png, icon-192.png, icon-512.png: installable app and offline support

## Data
Everything is stored in the browser and shared by all pages (localStorage, key `saba2`). Clearing site data erases it.

## Sending
There is no server. "Open mail" opens Gmail (app, Gmail Go or browser) with the message filled in, and you press send yourself, then tap "Mark sent".

## Auto send
On the Messages page, tap **Auto send** under "Next dispatch". It opens Gmail for the next person, waits until you come back to the app, marks that one as sent, then opens the next. A bar at the bottom shows progress and a **Stop** button. If your browser blocks the automatic re-open, the bar shows **Open next**: one tap continues. It ends by itself when nothing is left or the send limits are reached.

## Colours
Brand colour is `--brand` at the top of `styles.css` (light and dark). `recolor_logo.py [degrees]` hue-shifts the four logo/icon PNGs (run it on the originals).

## Passcode
`gate.js` (loaded first on every page) hides the app until the passcode is entered. The device stays unlocked until the passcode is changed or "Lock" is tapped.
Current passcode: `OLABSTECH` (case-sensitive).

To change it, put the SHA-256 of the new passcode in `HASH` at the top of `gate.js`:

    printf '%s' 'NewPasscode' | sha256sum        # Linux/macOS (shasum -a 256 on Mac)

Changing the hash locks everyone out again until they enter the new passcode.
