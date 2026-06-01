# On the List — series site

A fast, dependency-free static site for the **On the List** novel series. Plain
HTML/CSS/JS — drop it on any static host (Netlify, Cloudflare Pages, GitHub
Pages, S3, etc.). No build step.

## What's here

```
index.html                         Front page — the story + the lock in the centre
robots.txt
sitemap.xml                        Sitemap INDEX (points to the four below)
sitemap-pages.xml                  Evergreen pages + lyrics
sitemap-books.xml                  Books + chapter reader
sitemap-blog.xml                   Journal / blog posts
sitemap-news.xml                   Google News sitemap (news: namespace)
feed.xml                           Main RSS feed (Journal + News)
blog/feed.xml                      Journal RSS feed
news/feed.xml                      News RSS feed
assets/
  css/style.css
  js/site.js                       Mobile nav + the front-page lock animation
  js/flipbook.js                   The "flip through Chapter One" reader
books/
  index.html                       Books listing (BookSeries schema)
  on-the-list-book-one.html        Book detail (Book schema)
  chapter-1.html                   Flip-through reader (Chapter schema)
blog/
  index.html                       Journal listing (Blog schema)
  writing-the-door-scene.html      Post (BlogPosting schema)
news/
  index.html                       News listing
  book-one-release-date.html       Announcement (NewsArticle schema)
lyrics/
  index.html                       Lyrics listing
  no-handle-on-the-outside.html    Song page (MusicComposition + lyrics schema)
pages/
  about.html                       Author bio — canonical Person (author) schema
  contact.html                     Contact form (ContactPage schema)
```

## Structured data (schema.org)

All schema is JSON-LD in the page `<head>` and cross-linked by `@id`:

- **Organization** — `index.html` (`#organization`); referenced as publisher everywhere.
- **Author (Person)** — canonical record on `pages/about.html` (`#author`);
  referenced as author/composer across books, posts, news, and lyrics.
- **BookSeries / Book / Chapter** — on the books pages, with breadcrumbs.
- **BlogPosting**, **NewsArticle**, **MusicComposition** (lyrics) — on the
  respective detail pages.

## The lock on the front page

The lock sits dead-centre of the hero (`index.html`). On click it animates open
and routes to the Chapter One reader (`assets/js/site.js`). Pure CSS/SVG — no
images required.

## The "flip through Chapter One" reader

`books/chapter-1.html` holds the chapter text in a hidden `#chapter-source`
block. `assets/js/flipbook.js` paginates it to fit the page, shows a two-page
spread on desktop (single page on mobile), and flips with a 3D page-turn on
click, arrow keys, or swipe. To change the chapter, just edit the `<p>` tags in
`#chapter-source`.

## RSS feeds

Three RSS 2.0 feeds, auto-discoverable via `<link rel="alternate">` in the
relevant page heads:

- `feed.xml` — main site feed (newest Journal + News items)
- `blog/feed.xml` — Journal only
- `news/feed.xml` — News only

Add a new `<item>` at the **top** of the channel when you publish, and update
`<lastBuildDate>`. `pubDate` uses RFC-822 dates (e.g. `Sat, 30 May 2026
09:00:00 -0500`).

## ⚠️ One config step: set your domain

Every canonical URL, sitemap `<loc>`, and schema `@id` uses the placeholder
**`https://onthelistseries.com`**. Find-and-replace it with your real domain
before going live:

```bash
grep -rl "onthelistseries.com" . --include="*.html" --include="*.xml" \
  | xargs sed -i 's#https://onthelistseries.com#https://YOURDOMAIN.com#g'
```

## Google News sitemap note

`sitemap-news.xml` must only list articles **published in the last 48 hours** to
be valid for Google News. Prune older `<url>` entries as you publish new ones.

## Submitting sitemaps

Submit only the index — Google reads the rest from it:
`https://YOURDOMAIN.com/sitemap.xml` in Google Search Console.

## Deploying (GitHub Pages)

This repo ships with `.github/workflows/deploy.yml`, which publishes the site to
GitHub Pages on every push to `main`. One-time setup:

1. **Enable Pages:** repo **Settings → Pages → Build and deployment → Source =
   GitHub Actions**.
2. **Trigger it:** push to `main` (or run the workflow manually from the Actions
   tab). The first run publishes the site to
   `https://digital-identity-architects-git.github.io/on-the-list-series/`.
3. **Custom domain:** in **Settings → Pages → Custom domain**, enter your domain
   and save — this writes a `CNAME` file to the repo. Then at your DNS provider:
   - Apex domain (`example.com`): add four `A` records to GitHub's IPs
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and/or `AAAA` records for IPv6).
   - `www` subdomain: add a `CNAME` record pointing to
     `digital-identity-architects-git.github.io`.
4. **Enforce HTTPS:** tick the box in Settings → Pages once the cert is issued.

> The site uses absolute root-relative links (`/assets/...`, `/books/...`), so it
> must be served from a domain root — a custom domain (above) or an apex/`www`
> setup. The default project URL (`.../on-the-list-series/`) serves from a
> subpath and would break those links.

