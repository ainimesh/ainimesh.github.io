# ainimesh.github.io

Personal academic homepage of **Animesh Sachan** — PhD Scholar, Department of
Artificial Intelligence, IIT Kharagpur.

🔗 **Live site:** https://ainimesh.github.io

## What this is

A minimal, hand-built static site — just **plain HTML and CSS**, no Jekyll, no
build step, no dependencies. It loads instantly and is trivial to edit.

```
index.html        ← all page content (about, publications, news, contact)
assets/style.css  ← all styling (light/dark theme, responsive layout)
assets/img/       ← profile photo + favicon
assets/cv.pdf     ← add your CV here (the "CV" button links to it)
```

## How to edit

- **Text / publications / news:** open `index.html` and edit the relevant
  section. Each list item has a comment showing how to add a new one.
- **Colors / fonts / spacing:** edit the variables at the top of
  `assets/style.css` (e.g. `--accent` changes the theme color everywhere).
- **Profile photo:** replace `assets/img/ani.jpg`.
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
