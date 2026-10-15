// Renders public/images/og-default.png, the link-preview image used by every
// page (LinkedIn, Slack, messengers). Rerun after changing the logo, the
// company positioning or the tagline:  npm run og-image
import sharp from "sharp";
import { readFileSync } from "node:fs";

const logo = readFileSync("public/images/novage-logo.svg").toString("base64");
const font = "Helvetica Neue, Helvetica, Arial, sans-serif";

const headline = "Software engineering &amp; R&amp;D";
const tagline = "Engineering software built to last.";
const focus =
  "Full-cycle product development · P2P video delivery · Open source";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf8f5"/>
  <rect x="0" y="0" width="1200" height="10" fill="#972e2d"/>
  <image href="data:image/svg+xml;base64,${logo}" x="80" y="80" width="325" height="90"/>
  <text x="80" y="300" font-family="${font}" font-size="64" font-weight="700" fill="#1f1f1f">${headline}</text>
  <text x="80" y="380" font-family="${font}" font-size="54" font-weight="700" fill="#972e2d">${tagline}</text>
  <rect x="80" y="420" width="96" height="7" fill="#972e2d"/>
  <text x="80" y="495" font-family="${font}" font-size="30" fill="#555555">${focus}</text>
  <text x="80" y="565" font-family="${font}" font-size="28" fill="#777777">novage.com.ua</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile("public/images/og-default.png");
console.log("Wrote public/images/og-default.png");
