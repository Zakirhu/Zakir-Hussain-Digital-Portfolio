# Zakir Hussain — Portfolio

A cinematic, one-page professional portfolio for **Zakir Hussain — PGT Computer Science / IT educator, technology enthusiast, and web developer**.

The site is hand-built with HTML, CSS, and vanilla JavaScript. It has no framework, no build step, no third-party scripts, and no external font request at runtime.

---

## Preview locally

Use a static server so the local fonts and manifest load with the correct origin:

```bash
npm start
```

Then open **http://127.0.0.1:4173**.

You can also run:

```bash
node tools/serve.js
```

The preview server has no dependencies. On first load, the site shows a short introductory animation. It can be skipped, appears once per browser session, and is automatically skipped when the visitor prefers reduced motion.

Alternatively, serve the whole folder with any static hosting tool or editor live-preview server.

---

## What is included

- **Cinematic hero** — kinetic type, particle field, interactive 3D learning core, animated entrance, scroll cue.
- **Editorial about section** — an integrated portrait, qualifications, approach, floating skill tags, and an interactive education-to-classroom journey.
- **Teaching philosophy** — `Learn → Practice → Create → Test → Improve` as a connected, scroll-revealed system.
- **Experience timeline** — the verified PGT Computer Science / IT role from the supplied résumé, plus the ongoing Learn with Zakir project.
- **Filterable capability grid** — evidence-led skills from the résumé and supplied brief, with no arbitrary percentages.
- **Featured live project** — Learn with Zakir, using the supplied product screenshot, a framed live preview, a direct link to the public platform, and its Supabase database / Render deployment stack.
- **Project slots** — explicit, editable placeholders for future web, EdTech, and digital-classroom work.
- **Resource library** — an animated, keyboard-accessible accordion.
- **Credentials** — verified degrees and distinction, recognition from the résumé, plus a gallery of the supplied C/C++ training certificate, Web Development certificate, C Programming quiz certificate, and DIPS letter of appreciation.
- **Contact** — a large, memorable closing section with the supplied email, phone number, and live GitHub profile.
- **Theme system** — carefully tuned dark and light palettes with a remembered preference.
- **Motion system** — custom cursor on fine pointers, magnetic buttons, card tilt, scroll reveals, text masks, parallax, timeline beam, and a progress bar.
- **Accessibility** — semantic landmarks, skip link, visible focus styles, keyboard-accessible navigation/filters/accordion, reduced-motion support, adequate contrast, and a focus-managed mobile menu.
- **Metadata** — title, description, Open Graph, Twitter card, JSON-LD, favicon, app icons, web manifest, and an original 1200 × 630 social cover.

No testimonials, fake metrics, invented awards, or made-up contact links were added. The supplied résumé was used as the source for the education, role, recognition, email, and phone details; the résumé PDF itself is not published by the site.

---

## Project structure

```text
.
├── index.html                  All page content and structure
├── README.md                   This guide
├── robots.txt                  Search-engine crawl permission
├── site.webmanifest            Installable-site metadata
├── package.json                Local preview command only
├── screenshots/                Reference captures (not loaded by the site)
├── assets/
│   ├── css/main.css            Complete design system and responsive layout
│   ├── js/main.js              All interactions and canvas motion
│   ├── favicon.svg             Scalable logo / favicon
│   ├── fonts/                   Self-hosted, preloaded WOFF2 typefaces
│   │   └── LICENSE.md          SIL Open Font License notices
│   └── img/
│       ├── zakir-hussain-portrait.webp  Optimised portrait used in About
│       ├── zakir-hussain-portrait.jpg   JPEG fallback for older browsers
│       ├── learn-with-zakir-platform.webp  Supplied project screenshot
│       ├── learn-with-zakir-platform.jpg   JPEG fallback
│       ├── certificates/        C/C++, web development, and DIPS letter images
│       ├── og-cover.png         Social sharing image (1200 × 630)
│       ├── apple-touch-icon.png
│       ├── icon-192.png
│       └── icon-512.png
└── tools/
    ├── serve.js                Tiny zero-dependency preview server
    └── og-template.html        Source artwork for the social cover
```

The `screenshots/` folder is for reference only. It is not referenced by `index.html` and adds nothing to the live page weight.

---

## Editing the site

All copy lives in **`index.html`**. Look for the `QUICK EDIT MAP` at the top of the file, and the `EDIT …` comments above the experience, projects, credentials, and contact sections.

### 1. Identity and hero

Change the name, overline, tagline, description, and calls to action in the hero section. The main heading is:

```html
<h1 class="hero__name" id="heroName" aria-label="Zakir Hussain">
  <span class="hero__name-line"><span class="hero__name-inner">Zakir</span></span>
  <span class="hero__name-line hero__name-line--accent"><span class="hero__name-inner">Hussain<span class="hero__name-dot" aria-hidden="true">.</span></span></span>
</h1>
```

Keep the `aria-label` in sync with the visible name.

The top navigation lives in the `<header class="site-header">` block. If you rename a section ID, update both the desktop and mobile navigation links.

The portrait appears inside the About profile card. It is loaded responsively from WebP with a JPEG fallback:

```html
<picture>
  <source srcset="assets/img/zakir-hussain-portrait.webp" type="image/webp">
  <img src="assets/img/zakir-hussain-portrait.jpg"
       alt="Portrait of Zakir Hussain" width="405" height="405"
       loading="lazy" decoding="async">
</picture>
```

Replace both files if you update the photo, keep the square-ish crop, and update the alt text if needed. The current portrait was supplied by Zakir and cropped for the profile card; no synthetic portrait is used.

### 2. Experience

The teaching role and the independent digital-learning work are now populated from the supplied résumé and brief. To add an earlier role, duplicate one complete `<article class="timeline-item">…</article>` and update:

- the date and tag
- role title and organisation
- responsibility list
- technology tags
- `data-reveal` delay, if you want a new stagger

Keep dates and responsibilities accurate, and remove the `is-current` class from a role that is no longer ongoing. Do not claim an employer or date that is not documented.

### 3. Contact details

The email and phone number came from the supplied résumé and are already live in `index.html`. If either changes, update the corresponding link and visible text together:

- email: the `mailto:` link and the visible `#contactEmail` span;
- phone: the `tel:+919541167365` link and the visible `+91 95411 67365` text.

The copy-email button reads the visible email span automatically.

The GitHub profile is now a real contact link to **https://github.com/Zakirhu**, opening in a new tab with `rel="noopener noreferrer"`. There are no social placeholders left:

```html
<a class="contact-link" href="https://github.com/Zakirhu"
   target="_blank" rel="noopener noreferrer"
   aria-label="Visit Zakir Hussain's GitHub profile (opens in a new tab)">
  <span class="contact-link__icon" aria-hidden="true"> … </span>
  <span class="contact-link__body">
    <span class="contact-link__label">GitHub</span>
    <span class="contact-link__value">github.com/Zakirhu</span>
  </span>
</a>
```

If the GitHub username changes, update the `href`, visible value text, and aria-label together.

### 4. Projects and project slots

**Learn with Zakir** is now presented as a live project:

- Live URL: **https://learnwithzakir.onrender.com/**
- Database: **Supabase**
- Deployment: **Render**
- Supplied screenshot: `assets/img/learn-with-zakir-platform.webp` (JPEG fallback included)
- Both the screenshot and the “Visit live platform” footer link open the site in a new tab with `rel="noopener noreferrer"`.
- The browser-frame preview adds a live badge and a hover/focus label over the genuine screenshot.
- The database and deployment roles are shown as explicit technology chips in the project card.

If the live URL or screenshot changes, update all three places: the screenshot/footer links, the address shown in `.browser__url`, and the image assets plus their alt text. The public Render instance may briefly show a cold-start screen when it has been idle; that is a hosting behaviour, not a missing link.

Each “Next chapters” card remains a deliberate placeholder. To turn a slot into a project:

```html
<div class="project-slot-wrap" data-reveal data-category-slot="web">
  <article class="project-slot" data-tilt data-tilt-max="3">
    <div class="project-slot__art">
      <img src="assets/img/your-project.jpg" alt="Description of the project interface" loading="lazy">
    </div>
    <div class="project-slot__body">
      <div class="project-slot__meta">
        <span class="mono-label">02 / Web</span>
        <span class="mono-label">Live project</span>
      </div>
      <h3>Your project title</h3>
      <p>Your short, honest project description.</p>
      <a class="text-link" href="https://your-live-project.example" target="_blank" rel="noopener noreferrer">View project ↗</a>
    </div>
  </article>
</div>
```

The decorative CSS artwork can stay, or you can replace it with an image inside `.project-slot__art`. Use a reasonably compressed image (roughly 1200–1600 px wide as a guide) and meaningful alt text. Remove `aria-hidden="true"` from the art wrapper when you add meaningful imagery.

### 5. Credentials and achievements

The credential ledger is populated from the supplied résumé:

- Bachelor of Computer Science, University of Kashmir, Srinagar (2016–2020), graduated with distinction
- Master of Computer Science, I.K. Gujral Punjab Technical University, Jalandhar (2021–2023)
- Best Teacher of the Month, three times during the 2020/21 academic year
- Student project mentorship and support for school digital processes

The **Certificates & appreciation** gallery below the ledger uses the supplied credential documents:

- C & C++ Training Programme, WExcellence Technology, Chandigarh — completed 15 September 2025
- Web Development (HTML, CSS, JavaScript), Learn with Zakir — completed 15 August 2024 — ID `LWZ-WD-2024-001`
- C Programming Quiz, Guru Nanak Dev Engineering College — Department of Information Science and Engineering — completed 4 June 2020 — ID `WEYSVI-CE000191`
- Letter of Appreciation from Chain of DIPS Institutions / DIPS School, Gilzian — recognition for excellent CBSE Board results and student distinctions

Each card opens its full-size document image in a new tab. The optimised assets live in `assets/img/certificates/`.

To add a future credential, duplicate one `<article class="certificate-card">…</article>`, update the visible details, aria-label and image alt text, add matching WebP/JPEG files, and update the 07.1 section copy if needed. Do not add a badge or certificate without a real source document.

If the résumé's earlier teaching period is later documented, add it to the Experience timeline rather than inferring details from the award date.

### 6. Skills and filters

Skill cards use `data-category="teaching"`, `"development"`, or `"digital"`. If you add or remove cards, update the filter labels and counts in the toolbar.

The design deliberately avoids percentages and star ratings. Keep descriptions evidence-led and honest.

### 7. Resources

Resource accordions use paired ARIA attributes:

```html
<button class="resource__trigger"
        aria-expanded="false"
        aria-controls="resourcePanel5"
        id="resourceButton5"> … </button>
<div class="resource__panel"
     id="resourcePanel5"
     role="region"
     aria-labelledby="resourceButton5"> … </div>
```

If you duplicate a resource, give the button and panel unique matching IDs.

### 8. Social metadata and social cover

Before publishing:

- Set the Open Graph/Twitter image URL to an **absolute** URL (`https://your-domain.com/assets/img/og-cover.png`).
- Add an `og:url` pointing to the live site.
- Add a canonical URL if the site has a single permanent home.
- Update the `<title>` and description if the positioning changes.
- Replace `assets/img/og-cover.png` if you want a different cover. The artwork source is in `tools/og-template.html`; screenshot it at **1200 × 630**.
- Update `site.webmanifest` and the icons if the brand changes.

The social cover includes the supplied portrait and keeps the site's abstract learning-core motif. If the portrait changes, regenerate the cover from `tools/og-template.html` at **1200 × 630** and replace `assets/img/og-cover.png`.

---

## Design system

Edit the design tokens at the top of `assets/css/main.css`.

| Token | Purpose |
| --- | --- |
| `--bg`, `--bg-soft`, `--bg-elev` | Background layers |
| `--text`, `--text-soft`, `--text-muted` | Type hierarchy |
| `--cyan`, `--blue`, `--violet` | Accent palette |
| `--accent-gradient`, `--name-gradient` | Signatures and accent text |
| `--font-display`, `--font-body`, `--font-serif`, `--font-mono` | Typography |
| `--container`, `--gutter` | Page width and breathing room |
| `--section-space` | Vertical rhythm |
| `--radius-*`, `--ease-*` | Shape and motion language |

The light theme is defined under `[data-theme="light"]`. Both palettes were selected for contrast and a consistent sense of depth.

Typefaces:

- **Space Grotesk** — display / structural headings
- **Manrope** — reading text and interface labels
- **Instrument Serif** — editorial italic accents
- **JetBrains Mono** — technical microtype

All are self-hosted WOFF2 files. License notices are in `assets/fonts/LICENSE.md`.

---

## Motion and accessibility notes

- The opening loader appears once per session (`sessionStorage`) and can be skipped with the button or **Escape**.
- If the visitor has `prefers-reduced-motion: reduce`, the loader, custom cursor, canvas animation, and optional entrance animations are skipped or reduced. Text and content remain fully visible.
- The custom cursor only activates on devices with a fine pointer. Touch devices keep their normal cursor.
- The mobile menu moves focus to the first link, traps keyboard focus inside the open header/menu, restores focus to the menu button, closes on **Escape**, and makes the rest of the page inert while open.
- All internal links point to existing section IDs.
- The accordion, filters, mobile menu, theme toggle, copy-email button, and back-to-top controls are functional without additional libraries.
- The canvas systems pause when off-screen or when the page is hidden to avoid unnecessary work.
- Fonts are preloaded; the site makes no runtime third-party requests.

If you add content, keep the heading hierarchy, alt text, focus states, and contrast intact. If you add video, do not autoplay sound and respect reduced motion.

---

## Before-publish checklist

- [ ] Verify the email (`zakhu1099@gmail.com`), phone (`+91 95411 67365`), and GitHub (`github.com/Zakirhu`) links still work.
- [ ] Add an earlier teaching role if it is documented and should be public.
- [ ] Confirm the certificate and appreciation images match the final public documents.
- [ ] Add future certifications using the existing certificate-card structure.
- [ ] Replace or clearly keep the open project slots.
- [ ] Confirm the live Learn with Zakir URL still resolves and the project screenshot is current.
- [ ] Update the page title, description, canonical URL, and absolute Open Graph image URL.
- [ ] Replace the portrait files only with a newer approved photo.
- [ ] Test on a phone, tablet, and desktop; test with keyboard only.
- [ ] Check that every claim, date, and credential is accurate.
- [ ] Re-run an accessibility/contrast check after any content edit.

---

## Credits

Design and front-end implementation were created specifically for this portfolio. The portrait was supplied by Zakir Hussain; no stock photography or synthetic portrait is used. The particle field, orbital core, dashboard preview, icons, and decorative artwork are generated with CSS, SVG, and Canvas.

Fonts are distributed under the **SIL Open Font License 1.1**. Full notices and license texts are included in `assets/fonts/LICENSE.md`.
