WeGLOW Countdown Image (Vercel)

What this is
- A tiny service that returns a PNG countdown image you can embed in emails.
- No JavaScript in the email; image updates each time the email is opened.

Quick deploy (non‑developer steps)
1) Create a free GitHub account (if you don’t have one).
2) Create a new public repository named `wegLOW-countdown`.
3) Upload the contents of the `countdown-service` folder into that repo using GitHub’s web UI (Add file → Upload files).
   - Optional (recommended for brand fonts): Download Montserrat TTFs and upload to `public/fonts/` in the repo:
     - `Montserrat-ExtraBold.ttf` (for the numbers)
     - `Montserrat-SemiBold.ttf` (for the labels)
     You can get these from Google Fonts → Montserrat → download family, then pick the files.
4) Create a free Vercel account at vercel.com and click “New Project” → “Import Git Repository”, pick your repo, and Deploy.
5) After deploy, test:
   - Health: https://YOUR-PROJECT.vercel.app/api/health
   - Countdown image:
     https://YOUR-PROJECT.vercel.app/api/bf-countdown.png?end=2025-11-23T09:00:00&tz=Europe/London

Use in your email
<img src="https://YOUR-PROJECT.vercel.app/api/bf-countdown.png?end=2025-11-23T09:00:00&tz=Europe/London"
     width="520"
     alt="Countdown to November 23 at 9:00 AM UK"
     style="display:block;width:100%;max-width:520px;height:auto;border:0;outline:none;text-decoration:none;">

Options (query params)
- `end` ISO date/time (e.g., 2025-11-23T09:00:00)
- `tz` IANA timezone (e.g., Europe/London)
- `color` text color hex (default: #da4828)
- `bg` background hex or `transparent` (default: transparent)
- `w` width (px, default 600)
- `h` height (px, default 110)

Notes
- If the Montserrat TTF files aren’t present, the service will fall back to system fonts (Arial/Helvetica). Uploading the TTFs is best for brand fidelity.
- Images don’t tick every second while the email is open; they refresh when the email is re-opened or the image is reloaded by the client.

