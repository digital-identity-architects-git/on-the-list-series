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
