/* =============================================================================
   SITE CONTENT — this is the ONLY file you need to edit to add content.
   Everything (home previews + full pages) is generated from the data below.

   Rules of thumb:
   - Keep the commas between items and the { } braces intact.
   - Text inside "double quotes" is plain text.
   - Text inside `back-ticks` may span multiple lines (used for BibTeX & news).
   - To add an item, copy an existing block, paste it, and edit the values.
   - Newest entries go FIRST (top of the list).
   ============================================================================= */

window.SITE = {
  /* Your name — it is automatically shown in BOLD wherever it appears in an
     author list below. */
  me: "Animesh Sachan",

  /* ---------------------------------------------------------------------------
     SOCIAL LINKS  — shown as icons in the hero and footer.
     Put "#" to hide/disable a link for now and fill it in later.
     Available networks: email, github, googlescholar, linkedin, x,
                         youtube, researchgate, orcid.
     --------------------------------------------------------------------------- */
  socials: [
    { network: "email",         url: "mailto:animesh.sachan24794@gmail.com" },
    { network: "googlescholar", url: "https://scholar.google.com/citations?user=y61NKacAAAAJ&hl=en" }, 
    { network: "github",        url: "https://github.com/ainimesh" },
    { network: "linkedin",      url: "https://www.linkedin.com/in/animeshsachan" },
    { network: "researchgate",  url: "https://www.researchgate.net/profile/Animesh-Sachan/research" }, 
    { network: "x",             url: "https://x.com/ainimesh" }, 
    { network: "youtube",       url: "https://www.youtube.com/@ainimesh" },
  ],

  /* ---------------------------------------------------------------------------
     PUBLICATIONS  (newest first)
     badge   : short tag shown on the left (e.g. "Preprint", "IJCNN", journal name)
     authors : plain list; your name is auto-bolded
     links   : buttons — add/remove as needed
     bibtex  : the "Cite" button copies this to the clipboard
     --------------------------------------------------------------------------- */
  publications: [
    {
      year: 2024,
      badge: "Preprint",
      title: "E(Q)AGNN-PPIS: Attention Enhanced Equivariant Graph Neural Network for Protein–Protein Interaction Site Prediction",
      authors: "Animesh Sachan, Rishi Suvvada, Plaban Kumar Bhowmick, Pralay Mitra",
      venue: "bioRxiv (under review)",
      links: [
        { label: "PDF", url: "https://www.biorxiv.org/content/early/2024/10/06/2024.10.06.616807.full.pdf" },
        { label: "bioRxiv", url: "https://www.biorxiv.org/content/early/2024/10/06/2024.10.06.616807" },
        { label: "DOI", url: "https://doi.org/10.1101/2024.10.06.616807" },
      ],
      bibtex: `@article{sachan2024eqagnn,
  title   = {E(Q)AGNN-PPIS: Attention Enhanced Equivariant Graph Neural Network for Protein-Protein Interaction Site Prediction},
  author  = {Sachan, Animesh and Suvvada, Rishi and Bhowmick, Plaban Kumar and Mitra, Pralay},
  journal = {bioRxiv},
  year    = {2024},
  doi     = {10.1101/2024.10.06.616807},
  note    = {Preprint, under review}
}`,
    },

    {
      year: 2022,
      badge: "IJCNN",
      title: "Symbolic Hyperdimensional Vectors with Sparse Graph Convolutional Neural Networks",
      authors: "Filip Cornell, Jussi Karlgren, Animesh Sachan, Šarūnas Girdzijauskas",
      venue: "International Joint Conference on Neural Networks (IJCNN)",
      links: [
        { label: "IEEE", url: "https://ieeexplore.ieee.org/abstract/document/9892300" },
        { label: "DOI", url: "https://doi.org/10.1109/IJCNN55064.2022.9892300" },
      ],
      bibtex: `@inproceedings{cornell2022symbolic,
  title     = {Symbolic Hyperdimensional Vectors with Sparse Graph Convolutional Neural Networks},
  author    = {Cornell, Filip and Karlgren, Jussi and Sachan, Animesh and Girdzijauskas, {\\v{S}}ar{\\=u}nas},
  booktitle = {2022 International Joint Conference on Neural Networks (IJCNN)},
  pages     = {1--8},
  year      = {2022},
  doi       = {10.1109/IJCNN55064.2022.9892300}
}`,
    },

    {
      year: 2020,
      badge: "ICMICA",
      title: "Trajectory Tracking in a 3-DOF Robotic Manipulator using Sliding Mode Controller",
      authors: "Animesh Sachan, Jyoti Ohri",
      venue: "IEEE Int. Conf. on Measurement, Instrumentation, Control and Automation (ICMICA)",
      links: [
        { label: "IEEE", url: "https://ieeexplore.ieee.org/document/9242653" },
        { label: "DOI", url: "https://doi.org/10.1109/ICMICA48462.2020.9242653" },
      ],
      bibtex: `@inproceedings{sachan2020trajectory,
  title     = {Trajectory Tracking in a 3-DOF Robotic Manipulator using Sliding Mode Controller},
  author    = {Sachan, Animesh and Ohri, Jyoti},
  booktitle = {2020 First IEEE International Conference on Measurement, Instrumentation, Control and Automation (ICMICA)},
  pages     = {1--6},
  year      = {2020},
  doi       = {10.1109/ICMICA48462.2020.9242653}
}`,
    },
  ],

  /* ---------------------------------------------------------------------------
     NEWS  (newest first). "year" is used to group items on the News page.
     "html" may contain links, <em>, <strong>, etc.
     --------------------------------------------------------------------------- */
  news: [
    {
      date: "Oct 2024",
      year: 2024,
      html: `Our preprint <em>E(Q)AGNN-PPIS</em> is now available on <a href="https://doi.org/10.1101/2024.10.06.616807" target="_blank" rel="noopener">bioRxiv</a> (under review).`,
    },
    {
      date: "Jul 2022",
      year: 2022,
      html: `Presented work on sparse graph convolutional networks at <strong>IJCNN 2022</strong>.`,
    },
  ],

  /* ---------------------------------------------------------------------------
     EXPERIENCE  (newest first) — rendered as a vertical timeline.
     points: optional list of bullet lines.
     --------------------------------------------------------------------------- */
  experience: [
    {
      period: "20XX – Present",            // ← set your PhD start year
      role: "PhD Research Scholar (TCS Research Fellow)",
      org: "Department of Artificial Intelligence, IIT Kharagpur",
      location: "Kharagpur, India",
      points: [
        "Designing equivariant graph neural networks to analyse 3-D protein structures and predict binding sites.",
        "Advised by Prof. Plaban Kumar Bhowmick and Prof. Pralay Mitra.",
      ],
    },
    // ----- EXAMPLE entry — edit or delete -----
    {
      period: "YYYY – YYYY",
      role: "Your role / position",
      org: "Organisation or lab",
      location: "City, Country",
      points: [
        "What you worked on.",
        "A key achievement or outcome.",
      ],
    },
  ],

  /* ---------------------------------------------------------------------------
     TEACHING  (newest first) — rendered as tiles.
     url: course/web page (leave "" to hide the link).
     --------------------------------------------------------------------------- */
  teaching: [
    // ----- EXAMPLE tile — edit or delete -----
    {
      term: "Autumn 20XX",
      course: "AI21001 — Course Name",
      role: "Teaching Assistant",
      institution: "IIT Kharagpur",
      points: [
        "Conducted weekly tutorials and lab sessions.",
        "Designed and graded assignments and exams.",
      ],
      url: "",
    },
  ],
};
