---
name: site-changes
description: Checklist for any change to the Novage corporate site (novage.com.ua) — content, pages, blog posts, case studies, products, demo, analytics, logo, styles. Lists what else must be updated together (privacy policy, link-preview image, structured data, repeated facts, links, sitemap) and runs the automated checks. Use before finishing or committing any site change.
---

# Checklist for site changes

Many things on this site depend on each other. A successful build does not
catch them. Work through the sections that apply, then run the checks at the
end.

## 1. What changed → what else to update

| If you change… | Also update |
|---|---|
| **Third-party services**: analytics provider, embeds, fonts, forms, a new demo, demo streams, trackers or STUN servers, anything loaded from another domain | `src/pages/privacy.astro`: the service, what data it receives, and the **"Last updated"** date |
| **Analytics** (currently Umami in `src/layouts/Layout.astro`) | Privacy page; keep `data-domains="novage.com.ua"`; keep the `data-umami-event` names on buttons (see §5) |
| **The P2P Media Loader demo** (new players, streams, trackers) | Privacy page "The P2P Media Loader demo" section; the `p2p-media-loader-demo` version in `package.json` |
| **Logo** (`public/images/novage-logo.svg`) | Run `npm run og-image` to regenerate `public/images/og-default.png`, and `npm run linkedin-images` to regenerate the LinkedIn banner and square logo in `brand/linkedin/` (then upload them to the company page); check the header and the `logo` in `src/data/organization.ts` |
| **Company positioning / "vector of work"**, currently "software engineering & R&D" | All of these together: hero intro (`src/pages/index.astro`), home `<title>` and description, footer tagline (`Footer.astro`), default description (`Layout.astro`), `description` in `src/data/organization.ts`, the text in `scripts/generate-og-image.mjs` and `scripts/generate-linkedin-images.mjs` (then `npm run og-image` and `npm run linkedin-images`), and the LinkedIn company page tagline and overview |
| **Contact email** (`contact@novage.com.ua`) | `ContactBanner.astro`, `privacy.astro`, `src/data/organization.ts` |
| **Company details** (founder, social profiles, LinkedIn) | `src/data/organization.ts` (`founder`, `sameAs`); the founder link in `ContactBanner.astro` (LinkedIn `https://www.linkedin.com/in/lysnevych/`); footer. Company page `https://www.linkedin.com/company/novage/` is in `organization.sameAs` and the footer |
| **A page URL** | Don't change existing URLs, since they carry search ranking. If you must, keep the old page too and point its canonical at the new URL, update every internal link, and the GitHub READMEs of P2P Media Loader and wt-tracker, which link to the site |
| **Header height** (menu items, logo size) | `--header-height` in `src/styles/main.css`; measure at 375px and 320px |

## 2. Repeated facts: change them everywhere at once

Find every occurrence with `grep -rn "<fact>" src` before changing one.

| Fact | Current wording | Where |
|---|---|---|
| Years in business | 15+ / "Fifteen years" | Home hero, stats strip, home page description (`index.astro`) |
| GitHub stars | 2,000+ (all repos), 1,700+ (P2P Media Loader) | Stats strip; product card; P2P case study |
| jsDelivr usage | "nearly 200 million times a month" | Products intro; P2P case study |
| P2P share | 10 viewers → 90%, 100 → 99%, 1,000 → 99.9% (live, ideal conditions); VOD depends on concurrent viewers | Product card, overview, technical overview table, P2P case study |
| wt-tracker capacity | 20,000 peers, 1 vCPU, 2 GiB | Product card, wt-tracker case study (text, key facts, **diagram label**), 100k blog post, GitHub README |
| Default trackers | `wss://tracker.webtorrent.dev`, `wss://tracker.openwebtorrent.com` | Overview, technical overview, privacy page |
| Engines / players | HLS.js, Shaka Player, dash.js, Video.js 8 (VHS); Video.js 10 via HLS.js/dash.js | Overview, technical overview, P2P case study |
| Location / time zone | Ukraine, UTC+2 (UTC+3 in summer); full working day with Europe, overlap with US mornings | "How we work" note on the home page |
| Delivery rhythm | weekly demos, written status, one point of contact | "Delivery & process management" offer card, "How we work" step 3 and note |
| Engagement models | full ownership, dedicated team, consulting | "How we work" cards, "For established companies" card |
| Confidentiality, IP and security | NDA first; client owns code and IP; code in client repos; 2FA; least-privilege access; client data stays in client systems; access revoked at the end; code review; CI; no secrets in code; dependency scanning. **Not claimed:** full-disk encryption (unconfirmed) | "How we work" → security block (`HowWeWork.astro`). Add a practice only once the team really follows it; buyers check these in procurement |
| Yembo | growth-stage startup; moving and insurance; 7 years; 10+ person team; 40+ countries; millions of videos; 10+ granted AI patents | Yembo case study, home case-studies card, Why Novage |

Refresh live numbers occasionally:

```bash
gh api repos/Novage/p2p-media-loader --jq .stargazers_count
curl -s "https://data.jsdelivr.com/v1/stats/packages/npm/p2p-media-loader-core?period=month" | python3 -c "import json,sys; print(json.load(sys.stdin)['hits']['total'])"
```

## 3. Wording rules

- American English.
- "Clients", not "customers".
- Client retention is "many years", not "a decade" or "10+ years".
- Prefer "10+", "40+", "millions" to exact counts that go stale.
- Company label: "software engineering & R&D".
- Numbers that depend on conditions say so: "in ideal conditions", "on a live stream".
- Clients: publish only facts the client makes public or has approved. Never publish their funding, headcount or revenue. **Yembo must approve** the case study.
- Scanning and the AI 3D pipeline are Yembo's. Novage built the 3D editor on top of them. Keep that boundary clear.

`scripts/check-site.mjs` enforces the banned phrases. Update its `BANNED` list when a decision changes.

## 4. New content

**Any new page**
- Title of 60 characters or less, and a unique description of 160 or less. Both go to `<Layout>`, together with `canonical`.
- Structured data (`schema` prop) where it fits: `SoftwareSourceCode` for products, `BlogPosting` (automatic for posts), `Organization` on home.
- Link it from somewhere real: header, footer, home section, product cards or the P2P link row (`P2PSubNav.astro`). The sitemap picks it up automatically, except under `/2019/`, `/blog/blog` or `/404`, which `astro.config.mjs` filters out.
- New third parties → privacy page (§1).

**Blog post** (`src/content/blog/`)
- Frontmatter: `title`, `date`, `description` (shown on the blog index), `author`, and `seoDescription` (160 characters or less; the build fails if longer).

**Case study** (`src/pages/case-studies/<name>.astro`)
- Add a card in `src/components/index-page-components/CaseStudies.astro`.
- Link from the related product card if there is one.
- One diagram that explains the key idea, in `src/components/case-studies/`.
- At about 5 case studies, add a `/case-studies/` index page and point the footer link there.

**Product**
- Add a card in `Products.astro`, footer "Products", structured data (`SoftwareSourceCode`) and a case study.

## 5. Components and styles

- **Diagrams** (`src/components/p2p/`, `src/components/case-studies/`) are inline SVG. Their text is content too, so update labels when facts change.
  - Colors: P2P = brand red, HTTP = grey `#6b7780`, signaling = amber `#b8862f`; segments 1/2/3 = red/teal/blue.
  - Every animation must stop under `prefers-reduced-motion`.
  - Don't fade elements to suggest "more", because it reads as failure. Use a label ("…and thousands more").
- **Scroll animations** (`src/styles/home.css`) use CSS scroll-driven animations: longhand properties, timelines via CSS variables (the minifier breaks the shorthand), and `animation-duration: 1ms` for Firefox 159+. Firefox 156 shows the static page, and that's fine.
- **Analytics events** on buttons: `hero-discuss`, `hero-open-source`, `nav-contact`, `lead-block`, `email-brief`, `email-link`, `wt-tracker-discuss`, `yembo-discuss`, `how-we-work-brief`, `founder-linkedin`. New calls to action get a `data-umami-event`.
- **Line breaks next to links:** Astro's HTML compression drops a line break between text and a following link or bold tag, gluing the words ("Try the⟨live demo⟩"). Put `{" "}` at the end of the line. `npm run check` catches this.
- **Colors:** use the tokens in `:root` of `main.css` (`--brand`, `--heading`, `--muted`, `--warm`…), not new hex values.

## 6. Before you finish

```bash
npx prettier --write <changed files>
npm run build
npm run check
```

`npm run check` validates the built `dist/`:
- title and description lengths
- link-preview tags on every page
- structured data is valid JSON
- sitemap = canonical pages
- internal links resolve
- no words glued to links
- banned phrases
- no unused CSS classes

Then look at the changed pages in a browser at **desktop, 375px and 320px** widths, with no horizontal scrolling. Check animations by pausing them: `svg.pauseAnimations(); svg.setCurrentTime(t)` for SVG diagrams, and `el.getAnimations()` for CSS.

After deploying, request indexing in Google Search Console for new or changed pages.
