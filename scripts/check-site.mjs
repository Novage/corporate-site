// Checks the built site (dist/) for problems a successful build doesn't catch.
// Run after `npm run build`:  npm run check
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const STYLES = "src/styles";

// Wording decided for the site; update this list when a decision changes.
const BANNED = [
  {
    re: /up to 80%/i,
    why: "P2P share grows with the audience (90% / 99% / 99.9%)",
  },
  { re: /\b30,000\b|\b30k\b/i, why: "wt-tracker handles 20,000 peers" },
  { re: /\bcustomers?\b/i, why: 'say "clients"' },
  { re: /\bdecade\b|10\+ years/i, why: 'client retention is "many years"' },
  { re: /videos a year/i, why: 'say "millions of videos"' },
  {
    re: /\b(?:optimis|prioritis|organis|customis)\w*|\banalys(?:e|ed|es|ing)\b/i,
    why: "use American spelling",
  },
  { re: /tracker\.novage\.com\.ua/i, why: "not a default tracker" },
  { re: /contact \[at\]/i, why: "email is a plain mailto link" },
];

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

if (!existsSync(DIST)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}

const pages = files(DIST).filter((f) => f.endsWith(".html"));
const problems = [];
const report = (page, message) =>
  problems.push(`${page.replace(`${DIST}/`, "")}: ${message}`);
const strip = (html) =>
  html.replace(/<(script|style|svg|pre)\b[\s\S]*?<\/\1>/g, "");
const text = (html) =>
  strip(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

const canonicals = new Set();
const usedClasses = new Set();

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const isLegacy = page.includes("/2019/") || page.endsWith("404.html");

  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    m[1].split(/\s+/).forEach((c) => usedClasses.add(c));
  }

  // Titles and descriptions
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const description =
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  if (decode(title).length > 65)
    report(page, `title is ${decode(title).length} chars (max ~60)`);
  if (decode(description).length > 160)
    report(
      page,
      `description is ${decode(description).length} chars (max 160)`,
    );

  // Link previews
  for (const tag of ["title", "description", "url", "image", "type"]) {
    if (!html.includes(`property="og:${tag}"`))
      report(page, `missing og:${tag}`);
  }

  // Structured data must be valid JSON
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(m[1]);
    } catch {
      report(page, "invalid JSON-LD");
    }
  }

  const canonical = html.match(/rel="canonical" href="([^"]*)"/)?.[1];
  if (canonical && !isLegacy) canonicals.add(canonical);

  // Words glued to links/bold/code when Astro compresses a line break away
  const body = strip(html);
  for (const m of body.matchAll(
    /.{0,20}(?:[A-Za-z0-9,;:.)]<(?:strong|a|code|em)\b[^>]*>|<\/(?:strong|a|code|em)>[A-Za-z0-9(]).{0,15}/g,
  )) {
    report(page, `glued words: …${m[0].replace(/<[^>]+>/g, "⟨⟩")}…`);
  }

  // Internal links must resolve to a built page
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (/^\/(_astro|images|fonts)\//.test(href) || href === "/") continue;
    const path = href.replace(/\/$/, "");
    const candidates = [
      `${DIST}${path}.html`,
      `${DIST}${path}/index.html`,
      `${DIST}${href}`,
    ];
    if (!candidates.some((c) => existsSync(c) && statSync(c).isFile()))
      report(page, `broken link ${href}`);
  }

  // Wording decisions
  const words = text(html);
  for (const { re, why } of BANNED) {
    const hit = words.match(re);
    if (hit && !isLegacy) report(page, `"${hit[0]}" — ${why}`);
  }
}

// Sitemap must list exactly the canonical pages
const sitemap = files(DIST)
  .filter((f) => /sitemap-\d+\.xml$/.test(f))
  .flatMap((f) =>
    [...readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1],
    ),
  );
for (const url of canonicals)
  if (!sitemap.includes(url)) problems.push(`sitemap: missing ${url}`);
for (const url of sitemap)
  if (!canonicals.has(url)) problems.push(`sitemap: not canonical ${url}`);

// CSS classes nobody uses (show/switch-style runtime classes would need listing here)
for (const file of readdirSync(STYLES).filter((f) => f.endsWith(".css"))) {
  const css = readFileSync(join(STYLES, file), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{[^}]*\}/g, "{}");
  const classes = new Set(
    [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]),
  );
  for (const c of classes)
    if (!usedClasses.has(c))
      problems.push(`${STYLES}/${file}: unused class .${c}`);
}

if (problems.length) {
  console.log(problems.map((p) => `✗ ${p}`).join("\n"));
  console.log(`\n${problems.length} problem(s) in ${pages.length} pages.`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages checked, no problems found.`);
