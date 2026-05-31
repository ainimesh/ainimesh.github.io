# ainimesh.github.io

Personal academic homepage of **Animesh Sachan** — PhD Scholar, Department of
Artificial Intelligence, IIT Kharagpur.

🔗 **Live site:** https://ainimesh.github.io

## What this is

A minimal, hand-built static site — **plain HTML + CSS + a little JavaScript**,
no Jekyll, no build step, no dependencies. Content is data-driven, so you add
publications / news / experience / teaching in **one file**.

```
index.html            ← home: hero, about, recent publications & news, contact
publications.html     ← full publications list
news.html             ← all news, grouped by year
experience.html       ← experience timeline
teaching.html         ← teaching tiles
assets/data.js        ← ★ EDIT THIS to add content (pubs, news, experience, teaching, social links)
assets/site.js        ← rendering engine (you don't need to touch this)
assets/style.css      ← all styling (blue theme, light/dark, responsive)
assets/img/           ← profile photo + favicon
assets/cv.pdf         ← your CV (the "CV" button links to it)
```

## How to edit

- **Add a publication / news item / experience / teaching / social link:**
  open **`assets/data.js`** and copy-paste an existing block. It appears on the
  home page (recent items) **and** the relevant full page automatically. Your
  name is auto-bolded in author lists, and the **Cite** button copies the BibTeX
  you put in each entry.
- **Colors / fonts / spacing:** edit the variables at the top of
  `assets/style.css` (e.g. `--accent` changes the theme color everywhere,
  `--maxw` changes the content width).
- **Profile photo:** replace the image and update the `<img>` in `index.html`.
- **CV:** drop your PDF at `assets/cv.pdf`.

## How it deploys

Pushing to `master` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which publishes the site to GitHub Pages.

**One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment** and set **Source** to **“GitHub Actions”**.

To preview locally, just open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```
