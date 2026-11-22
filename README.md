# ainimesh.github.io

Personal academic homepage of **Animesh Sachan** — PhD Scholar, Department of
Artificial Intelligence, IIT Kharagpur.

## How to edit

- **Add a publication / news item / experience / teaching / social link:**
  open **`assets/data.js`** and copy-paste an existing block. It appears on the
  home page (recent items) **and** the relevant full page automatically. Your
  name is auto-bolded in author lists, and the **Cite** button copies the BibTeX
  you put in each entry.
- **Add a project page:** put the self-contained page in `projects/<name>/`
  (it is served at `https://ainimesh.github.io/projects/<name>/`), then copy the
  `<li class="project">` block in **`projects.html`**. EquiSite lives in
  `projects/equisite/` (its Paper/Code buttons are marked `EDIT` in its index.html).
- **Colors / fonts / spacing:** edit the variables at the top of
  `assets/style.css` (e.g. `--accent` changes the theme color everywhere,
  `--maxw` changes the content width).
- **Profile photo:** replace the image and update the `<img>` in `index.html`.
- **CV:** drop your PDF at `assets/cv.pdf`.
