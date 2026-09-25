// Renders the LinkedIn images into brand/linkedin/:
//   novage-linkedin-banner.png  1128×191 company page cover (plus a 2× version)
//   novage-linkedin-logo.png    400×400 company page logo (the diamond mark)
//   andriy-linkedin-banner.png  1584×396 founder's profile cover (plus a 2× version)
// Rerun after changing the logo or the positioning:  npm run linkedin-images
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";

const OUT = "brand/linkedin";
mkdirSync(OUT, { recursive: true });

const logo = readFileSync("public/images/novage-logo.svg", "utf8");
// The red diamond mark is the first shape of the logo; its bounding box in
// the logo's 2600×720 coordinates is x 60–693, y 49–660.
const mark = logo.match(/<path class="fil1" d="([^"]+)"/)[1];
const markBox = { x: 60, y: 49, w: 633, h: 611 };

const font = "Helvetica Neue, Helvetica, Arial, sans-serif";
const headline = "Software engineering &amp; R&amp;D";
const tagline = "Engineering software built to last.";
const focus =
  "Full-cycle product development · P2P video delivery · Open source";

// LinkedIn overlays the company logo on the lower-left of the banner and crops
// its sides on mobile, so the text stays centered.
const banner = (scale) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${1128 * scale}" height="${191 * scale}" viewBox="0 0 1128 191">
  <rect width="1128" height="191" fill="#faf8f5"/>
  <rect width="1128" height="5" fill="#972e2d"/>
  <text x="564" y="76" text-anchor="middle" font-family="${font}" font-size="38" font-weight="700" fill="#1f1f1f">${headline}</text>
  <text x="564" y="118" text-anchor="middle" font-family="${font}" font-size="28" font-weight="700" fill="#972e2d">${tagline}</text>
  <rect x="532" y="134" width="64" height="4" fill="#972e2d"/>
  <text x="564" y="166" text-anchor="middle" font-family="${font}" font-size="17" fill="#555555">${focus}</text>
</svg>`;

// Founder's profile banner. The profile photo covers the lower left, so the
// text block sits right of center, clear of the photo and the mobile crop.
const role =
  "Founder &amp; Director, Novage · software engineering &amp; R&amp;D";
const profileBanner = (scale) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${1584 * scale}" height="${396 * scale}" viewBox="0 0 1584 396">
  <rect width="1584" height="396" fill="#faf8f5"/>
  <rect width="1584" height="6" fill="#972e2d"/>
  <path fill="#972e2d" opacity="0.07" transform="translate(-40 -20) scale(0.7)" d="${mark}"/>
  <g transform="translate(590 0)">
    <text x="0" y="150" font-family="${font}" font-size="54" font-weight="700" fill="#1f1f1f">${tagline}</text>
    <rect x="0" y="178" width="84" height="6" fill="#972e2d"/>
    <text x="0" y="236" font-family="${font}" font-size="30" fill="#972e2d">${role}</text>
    <text x="0" y="286" font-family="${font}" font-size="24" fill="#555555">${focus}</text>
    <text x="0" y="334" font-family="${font}" font-size="22" fill="#777777">novage.com.ua</text>
  </g>
</svg>`;

// The mark fills about 70% of the square, centered on white.
const size = 400;
const markSize = size * 0.7;
const k = markSize / Math.max(markBox.w, markBox.h);
const tx = (size - markBox.w * k) / 2 - markBox.x * k;
const ty = (size - markBox.h * k) / 2 - markBox.y * k;
const square = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  <path fill="#972e2d" transform="translate(${tx} ${ty}) scale(${k})" d="${mark}"/>
</svg>`;

const render = (svg, file) =>
  sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${OUT}/${file}`);

await render(banner(1), "novage-linkedin-banner.png");
await render(banner(2), "novage-linkedin-banner@2x.png");
await render(square, "novage-linkedin-logo.png");
await render(profileBanner(1), "andriy-linkedin-banner.png");
await render(profileBanner(2), "andriy-linkedin-banner@2x.png");
console.log(`Wrote the company banner, logo and founder banner to ${OUT}/`);
