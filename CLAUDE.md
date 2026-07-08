# balasree.com

Eleventy (v3) portfolio site.

## Project rules (non-negotiable)

1. **Never generate content text.** This is a portfolio whose real copy is supplied
   by the site owner. Anywhere text is needed, insert **lorem ipsum** placeholder
   only — never write, invent, or paraphrase real content.

2. **All content is data-driven and owner-editable.** Every piece of text and every
   photo must be injectable from a JSON or Markdown data file (`src/_data/*` or
   front matter / content `.md` files). The owner must be able to edit all text and
   swap all images without opening any template, config, or code file.
   - No hardcoded copy or image paths inside `.njk`/templates — read them from data.
   - Images referenced by path/key in data; files live under `src/assets/`.

## Structure

- `eleventy.config.js` — input `src/`, output `_site/`, Nunjucks default.
  Registers `.md` as a global data extension (front matter only, parsed with
  `gray-matter`), so `src/_data/**/*.md` works like `.json` but is easier to edit.
- `src/_data/` — global data. Flat/shell content is one `.md` per file
  (`site.md`, `now.md`, `journey.md`); `portfolio/` namespaces per-section
  data (`portfolio/hero.md` → `portfolio.hero`, etc.).
- `src/journey-entries/`, `src/work-items/` — one Markdown file per repeating
  item (a timeline entry, a work project). Collected via `addCollection` in
  `eleventy.config.js` (tag-filtered, sorted by `date`/`order` front matter)
  and rendered on `journey.njk`/`index.njk`. Add a file to add an item —
  no template or config changes needed.
- `src/_includes/` — layouts/partials.
- `src/assets/` — static assets (CSS, images) passed through to `/assets`.

## Commands

- `npm start` — dev server with live reload
- `npm run build` — build to `_site/`
- `npm run clean` — remove `_site/`
