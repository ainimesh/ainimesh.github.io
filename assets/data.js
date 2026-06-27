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
      badge: "IJCAI",
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
      arxiv: "https://www.biorxiv.org/content/10.1101/2024.10.06.616807v2",
      openreview: "",
      code: "https://github.com/ainimesh/EQAGNN-PPIS",
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
      date: "Jun 2026",
      year: 2026,
      html: `Our paper was accepted at the <strong>Continual RL Workshop</strong>, Reinforcement Learning Conference (RLC) 2026, Montréal, Canada.`,
    },
    {
      date: "Jun 2026",
      year: 2026,
      html: `Awarded a travel grant by <strong>IJCAI 2026</strong>.`,
    },
    {
      date: "May 2026",
      year: 2026,
      html: `Short paper (Doctoral Consortium) accepted at <strong>IJCAI 2026</strong>.`,
    },
    {
      date: "Dec 2025",
      year: 2025,
      html: `Selected for a 6-month research internship at <strong>Ericsson Research</strong>, Bengaluru, India.`,
    },
    {
      date: "Jul 2025",
      year: 2025,
      html: `Attended <strong>MLSS<sup>D</sup> 2025</strong> in Kraków, Poland, and presented a research poster.`,
    },
    {
      date: "Jun 2025",
      year: 2025,
      html: `My PhD Consortium submission was accepted at <strong>KDD 2025</strong>.`,
    },
    {
      date: "Jun 2025",
      year: 2025,
      html: `Our paper was accepted in <strong>IEEE Transactions on Signal and Information Processing over Networks (TSIPN)</strong>.`,
    },
    {
      date: "Mar 2025",
      year: 2025,
      html: `Accepted to attend <strong>MLSS<sup>D</sup> 2025</strong> in Kraków, Poland.`,
    },
    {
      date: "Mar 2025",
      year: 2025,
      html: `Selected to attend the <strong>ELLIS Winter School on Foundation Models (FoMo)</strong> at the University of Amsterdam, Netherlands.`,
    },
    {
      date: "Dec 2023",
      year: 2023,
      html: `Delivered my PhD registration seminar successfully.`,
    },
    {
      date: "Oct 2023",
      year: 2023,
      html: `Invited as a guest lecturer for a 5-day Machine Learning workshop at D.Y. Patil University, Pune.`,
    },
    {
      date: "Jul 2023",
      year: 2023,
      html: `Selected for the prestigious <strong>TCS Research Fellowship</strong> for the next four years.`,
    },
    {
      date: "Jul 2022",
      year: 2022,
      html: `Our paper was accepted at <strong>IJCNN 2022</strong> — collaborative work with KTH Royal Institute of Technology, Sweden.`,
    },
    {
      date: "Aug 2021",
      year: 2021,
      html: `Joined the PhD program at the Department of Artificial Intelligence, <strong>IIT Kharagpur</strong>. 🎉`,
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
    {
      term: "Autumn 2025–26",
      course: "AI60213 — Foundation of Large Language Models (FLLMs)",
      role: "Teaching Assistant",
      institution: "IIT Kharagpur",
      points: [],
      url: "https://plaban.github.io/fllm-aut25/",
    },
    {
      term: "Autumn 2022–23, 2023–24, 2024–25",
      course: "AI60007 — Graph ML Foundations and Applications (GMLFA)",
      role: "Teaching Assistant · 3 offerings",
      institution: "IIT Kharagpur",
      points: [],
      url: "https://ainimesh.github.io/gmlfa_autumn_2024/",
    },
    {
      term: "Spring 2021–22",
      course: "AI42001 — Machine Learning Foundations and Applications (MLFA)",
      role: "Teaching Assistant",
      institution: "IIT Kharagpur",
      points: [],
      url: "",
    },
    {
      term: "Spring 2022–25",
      course: "AI60004 — Big Data Processing (BDP)",
      role: "Teaching Assistant",
      institution: "IIT Kharagpur",
      points: [],
      url: "",
    },
    {
      term: "Summer School",
      course: "Mathematics of Machine Learning (MOML)",
      role: "Teaching Assistant",
      institution: "IIT Kharagpur",
      points: [
        "Delivered coding tutorials on SVM, PCA, and their practical applications.",
      ],
      url: "",
    },
  ],
};
