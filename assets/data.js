/* =============================================================================
   SITE CONTENT — the ONLY file you edit to add content.
   Home previews + full pages are generated from the data below.

   - Plain text goes in "double quotes".
   - Multi-line text (BibTeX, news) goes in `back-ticks`.
   - To add an item, copy a block, paste it, edit the values. Newest first.
   ============================================================================= */

window.SITE = {
  /* Your name. Any of these spellings is auto-BOLDED in author lists. */
  me: "Animesh Sachan",
  meAliases: ["Animesh Sachan", "Animesh"],

  /* ---------------------------------------------------------------------------
     SOCIAL LINKS  — icons in the hero. Put "#" to grey-out a link for now.
     networks: email, github, googlescholar, linkedin, x, youtube,
               researchgate, orcid.
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
     PUBLICATIONS  (newest first) — shown grouped by year on publications.html.
     Every tile shows four link blocks: Paper · arXiv · OpenReview · Code.
       paste a URL to activate a block; leave "" and it shows greyed-out.
     bibtex: the "Cite" button opens a popup with this text to copy.
     --------------------------------------------------------------------------- */
  publications: [
    {
      year: 2026,
      badge: "IJCAI DC",
      title: "Equivariant Graph Neural Networks for Protein Interaction Modeling and Structure-Aware Molecular Design",
      authors: "Animesh Animesh",
      venue: "IJCAI — Doctoral Consortium (Short Paper)",
      paper: "",            // ← add the paper link when available
      arxiv: "",
      openreview: "",
      code: "",
      bibtex: `@inproceedings{animesh2026ijcaidc,
  title     = {Equivariant Graph Neural Networks for Protein Interaction Modeling and Structure-Aware Molecular Design},
  author    = {Animesh Animesh},
  booktitle = {International Joint Conference on Artificial Intelligence (IJCAI), Doctoral Consortium},
  year      = {2026}
}`,
    },

    {
      year: 2026,
      badge: "CRL @ RLC",
      title: "GCT-MARL: Graph-Based Contrastive Transfer for Sample-Efficient Cooperative Multi-Agent Reinforcement Learning",
      authors: "Animesh Animesh, Satheesh K. Perepu, Kaushik Dey",
      venue: "Continual Reinforcement Learning Workshop @ RLC",
      paper: "",
      arxiv: "https://arxiv.org/abs/2606.25073",
      openreview: "https://openreview.net/forum?id=Trc7ZxmNAM",
      code: "https://github.com/ainimesh/GCT-MARL",
      bibtex: `@inproceedings{animesh2026gctmarl,
  title={{GCT}-{MARL}: Graph-Based Contrastive Transfer for Sample-Efficient Cooperative Multi-Agent Reinforcement Learning},
  author={Animesh Animesh and Satheesh K Perepu and Kaushik Dey},
  booktitle={Continual Reinforcement Learning Workshop at RLC 2026},
  year={2026},
  url={https://openreview.net/forum?id=Trc7ZxmNAM}
}`,
    },

    {
      year: 2026,
      badge: "arXiv",
      title: "GDEGAN: Gaussian Dynamic Equivariant Graph Attention Network for Ligand Binding Site Prediction",
      authors: "Animesh, Plaban Kumar Bhowmick, Pralay Mitra",
      venue: "Preprint",
      paper: "",
      arxiv: "https://arxiv.org/abs/2603.19817",
      openreview: "",
      code: "",
      bibtex: `@misc{gdegan,
  title={GDEGAN: Gaussian Dynamic Equivariant Graph Attention Network for Ligand Binding Site Prediction},
  author={Animesh and Plaban Kumar Bhowmick and Pralay Mitra},
  year={2026},
  eprint={2603.19817},
  archivePrefix={arXiv},
  primaryClass={cs.LG},
  url={https://arxiv.org/abs/2603.19817}}`,
    },

    {
      year: 2025,
      badge: "IEEE TSIPN",
      title: "E(Q)AGNN-PPIS: Attention Enhanced Equivariant Graph Neural Network for Protein–Protein Interaction Site Prediction",
      authors: "Animesh, Rishi Suvvada, Plaban Kumar Bhowmick, Pralay Mitra",
      venue: "IEEE Transactions on Signal and Information Processing over Networks",
      paper: "https://doi.org/10.1109/TSIPN.2025.3587396",
      arxiv: "",
      openreview: "",
      code: "",
      bibtex: `@ARTICLE{eqagnn_ppis,
  author={Animesh and Suvvada, Rishi and Bhowmick, Plaban Kumar and Mitra, Pralay},
  journal={IEEE Transactions on Signal and Information Processing over Networks},
  title={E(Q)AGNN-PPIS: Attention Enhanced Equivariant Graph Neural Network for Protein-Protein Interaction Site Prediction},
  year={2025},
  volume={11},
  pages={740-751},
  doi={10.1109/TSIPN.2025.3587396}}`,
    },

    {
      year: 2022,
      badge: "IJCNN",
      title: "Symbolic Hyperdimensional Vectors with Sparse Graph Convolutional Neural Networks",
      authors: "Filip Cornell, Jussi Karlgren, Animesh, Šarūnas Girdzijauskas",
      venue: "International Joint Conference on Neural Networks (IJCNN)",
      paper: "https://doi.org/10.1109/IJCNN55064.2022.9892300",
      arxiv: "",
      openreview: "",
      code: "",
      bibtex: `@inproceedings{cornell2022symbolic,
  title     = {Symbolic Hyperdimensional Vectors with Sparse Graph Convolutional Neural Networks},
  author    = {Cornell, Filip and Karlgren, Jussi and Animesh and Girdzijauskas, {\\v{S}}ar{\\=u}nas},
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
      authors: "Animesh, Jyoti Ohri",
      venue: "IEEE Int. Conf. on Measurement, Instrumentation, Control and Automation (ICMICA)",
      paper: "https://doi.org/10.1109/ICMICA48462.2020.9242653",
      arxiv: "",
      openreview: "",
      code: "",
      bibtex: `@inproceedings{sachan2020trajectory,
  title     = {Trajectory Tracking in a 3-DOF Robotic Manipulator using Sliding Mode Controller},
  author    = {Animesh and Ohri, Jyoti},
  booktitle = {2020 First IEEE International Conference on Measurement, Instrumentation, Control and Automation (ICMICA)},
  pages     = {1--6},
  year      = {2020},
  doi       = {10.1109/ICMICA48462.2020.9242653}
}`,
    },
  ],

  /* ---------------------------------------------------------------------------
     NEWS  (newest first). "year" groups items on news.html.
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
     ACADEMIC SERVICE  — shown on the home page.
     Each group: a role + a list of venues/journals.
     --------------------------------------------------------------------------- */
  service: [
    {
      role: "Program Committee",
      items: ["ICDM 2026", "GCLR Workshop @ AAAI 2026", "CRL Workshop @ RLC 2026"],
    },
    {
      role: "Reviewer",
      items: [
        "ICDM 2026",
        "IJCNN 2027, 2025, 2024",
        "ACM Transactions on Knowledge Discovery from Data (TKDD), 2025",
      ],
    },
  ],

  /* ---------------------------------------------------------------------------
     JOURNEY SO FAR  (newest first) — vertical timeline of your path since B.Tech:
     education (B.Tech / M.Tech / PhD), internships, and positions.
     kind: a small tag — e.g. "Doctorate", "Education", "Internship", "Position".
     points: optional bullet lines.
     --------------------------------------------------------------------------- */
  journey: [
    {
      period: "20XX – Present",            // ← set your PhD start year
      kind: "Doctorate",
      role: "PhD Research Scholar (TCS Research Fellow)",
      org: "Department of Artificial Intelligence, IIT Kharagpur",
      location: "Kharagpur, India",
      points: [
        "Equivariant graph neural networks for protein structure analysis and binding-site prediction.",
        "Advised by Prof. Plaban Kumar Bhowmick and Prof. Pralay Mitra.",
      ],
    },
    // ----- EXAMPLE: internship — edit or delete -----
    {
      period: "20XX",
      kind: "Internship",
      role: "Research Intern",
      org: "Lab / company",
      location: "City, Country",
      points: ["What you worked on."],
    },
    // ----- EXAMPLE: M.Tech — edit or delete -----
    {
      period: "20XX – 20XX",
      kind: "Education",
      role: "M.Tech in <field>",
      org: "Your institute",
      location: "City, India",
      points: [],
    },
    // ----- EXAMPLE: B.Tech — edit or delete -----
    {
      period: "20XX – 20XX",
      kind: "Education",
      role: "B.Tech in <field>",
      org: "Your college",
      location: "City, India",
      points: [],
    },
  ],

  /* ---------------------------------------------------------------------------
     TEACHING  (newest first) — tiles. url: course page ("" to hide the link).
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
