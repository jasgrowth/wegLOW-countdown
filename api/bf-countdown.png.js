const path = require('path');
const fs = require('fs');
const { DateTime } = require('luxon');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');

function registerFonts() {
  const fontDir = path.join(process.cwd(), 'public', 'fonts');
  let any = false;
  const candidates = [
    'Montserrat-ExtraBold.ttf',
    'Montserrat-Bold.ttf',
    'Montserrat-SemiBold.ttf',
    'Montserrat-VariableFont_wght.ttf',
    'Montserrat-Italic-VariableFont_wght.ttf',
  ];
  for (const file of candidates) {
    const p = path.join(fontDir, file);
    if (fs.existsSync(p)) {
      try {
        GlobalFonts.registerFromPath(p, 'Montserrat');
        any = true;
      } catch (_) {}
    }
  }
  return any;
}

function pad2(n) {
  const v = Math.max(0, Math.floor(Number(n) || 0));
  return String(v).padStart(2, '0');
}

module.exports = async (req, res) => {
  try {
    const hasMontserrat = registerFonts();

    const endISO = req.query.end || '2025-11-23T09:00:00';
    const tz = req.query.tz || 'Europe/London';
    const width = Math.max(300, Math.min(1600, parseInt(req.query.w || '600', 10)));
    const height = Math.max(80, Math.min(400, parseInt(req.query.h || '110', 10)));
    const color = req.query.color || '#da4828';
    const bg = req.query.bg || 'transparent';

    const now = DateTime.now().setZone(tz);
    const end = DateTime.fromISO(endISO, { zone: tz });
    let d = end.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
    if (!end.isValid || end <= now) d = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const dd = pad2(d.days);
    const hh = pad2(d.hours);
    const mm = pad2(d.minutes);
    const ss = pad2(d.seconds);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    if (bg && bg.toLowerCase() !== 'transparent') {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const centers = [0.2, 0.4, 0.6, 0.8].map(f => Math.round(width * f));
    const colonX = [Math.round(width * 0.3), Math.round(width * 0.5), Math.round(width * 0.7)];

    const numSize = Math.round(height * 0.38);
    const colonSize = Math.round(height * 0.32);
    const labelSize = Math.max(10, Math.round(height * 0.12));

    ctx.textAlign = 'center';
    ctx.fillStyle = color;

    const fontBase = hasMontserrat ? 'Montserrat' : 'Arial, Helvetica, sans-serif';

    // numbers
    ctx.font = `800 ${numSize}px ${fontBase}`;
    const vals = [dd, hh, mm, ss];
    const labels = ['DAYS', 'HOURS', 'MINUTES', 'SECONDS'];
    centers.forEach((cx, i) => ctx.fillText(vals[i], cx, Math.round(height * 0.48)));

    // colons
    ctx.font = `800 ${colonSize}px ${fontBase}`;
    colonX.forEach((cx) => ctx.fillText(':', cx, Math.round(height * 0.45)));

    // labels
    ctx.font = `600 ${labelSize}px ${fontBase}`;
    centers.forEach((cx, i) => ctx.fillText(labels[i], cx, Math.round(height * 0.82)));

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.status(200).end(canvas.toBuffer('image/png'));
  } catch (err) {
    res.status(500).send('Error generating image');
  }
};

