/* Site data. Edit here to update text without touching layout. Avoid long dashes. */
window.SITE = {
  timeline: [
    {
      yr: "Sep 2026 to now", role: "Senior Research Scientist", org: "Microsoft · Teams AI Lab, UK",
      summary: "Evaluating vision-language models (VLMs) for meeting intelligence, and the vision systems around them.",
      points: [
        "VLM and multimodal LLM evaluation on video-based meeting inputs, measuring model performance across real meeting scenarios.",
        "Enrollment for meeting-room devices: quality scoring, outlier-detection metrics and dashboard-driven evaluation that replace active, UI-based enrollment.",
        "Face identity and multi-person tracking metrics: false positive and false negative analysis, and the impact of occlusion, head pose, resolution and frame rate."
      ]
    },
    {
      yr: "May 2022 to Aug 2026", role: "Research Scientist", org: "Microsoft Mixed Reality & AI Lab, Cambridge",
      summary: "Social presence in mixed reality: the technology behind Microsoft Mesh, from avatars to live 3D people.",
      points: [
        "3D Gaussian Splatting, including compression with vector quantisation (about 12x smaller files with no visible quality loss).",
        "Research that shipped into product, such as auto-generated avatars.",
        "Co-author of VoluMe (ICCV 2025): live, authentic 3D video calls from a single webcam using Gaussian splats.",
        "Co-author of Hairmony and markerless performance capture (SIGGRAPH Asia 2024), both trained on synthetic data.",
        "Industry mentor for a University of Cambridge Computer Science group project (2023)."
      ],
      link: ["Read: Gaussian splats series", "blog/splats"]
    },
    {
      yr: "Jul 2021 to Apr 2022", role: "Post-doctoral Researcher", org: "Microsoft Research, Cambridge",
      summary: "Classification models for facial attributes.",
      points: ["Predicted hairstyle, glasses, facial hair, eyebrows and headwear from face images."]
    },
    {
      yr: "Apr 2021 to Jun 2021", role: "Research Intern", org: "Microsoft Research, Cambridge",
      summary: "My first step from the stars to people.",
      points: ["Built temporal prior models (autoregressive forecasting) to improve a face-tracking API."]
    },
    {
      yr: "Nov 2019 to Jan 2021", role: "Lead Data Scientist (Consultant)", org: "Arcturus ESG, London",
      summary: "FinTech: measuring climate and sustainability risk with machine learning.",
      points: [
        "Land-cover classification from Landsat 8 imagery.",
        "Greenhouse-gas analysis from Sentinel-5P with Gaussian-process uncertainty.",
        "NLP name-matching of power plants to climate disclosures; temperature-anomaly analysis."
      ],
      link: ["Read: climate risk with ML", "post/climate"]
    },
    {
      yr: "2018 to 2021", role: "PhD, Machine Learning for Astronomy", org: "Jodrell Bank Centre for Astrophysics, University of Manchester",
      summary: "Supervised by Prof. Ben Stappers and Dr Rob Lyon, funded by the UK Newton Fund (DARA Big Data).",
      points: [
        "FRBID on MeerKAT: under 1% false positives. MeerCRAB on MeerLICHT: 99.5% accuracy.",
        "Hierarchical and imbalance-aware variable-star classification (two MNRAS papers).",
        "First Prize, IoP Computational Physics Group Thesis Prize 2022."
      ],
      link: ["Read: my PhD in brief", "post/phd-thesis"]
    },
    {
      yr: "2016 to 2018", role: "MSc Astrophysics & Space Science", org: "University of Cape Town & North-West University",
      summary: "Funded by the Square Kilometre Array (SKA) and North-West University bursaries.",
      points: [
        "Thesis: source classification in deep radio surveys using machine learning.",
        "First GAN used in radio astronomy: CNN + GAN reached 84% on FRI/FRII, beating Random Forest (75%)."
      ],
      link: ["Read: my MSc in brief", "post/msc-thesis"]
    },
    {
      yr: "2015 to 2016", role: "Education Officer", org: "OCEP College, Mauritius",
      summary: "Where my love of mentoring started.",
      points: ["Taught Physics, Mathematics, Biology and Physical Education to secondary students."]
    },
    {
      yr: "2011 to 2014", role: "BSc Physics", org: "University of Mauritius",
      summary: "Where it all began, on a small island with a big sky.",
      points: []
    }
  ],

  pubs: [
    { y: 2025, cat: "astro", t: "Enhancing Fast Radio Transient Detection with Mask R-CNN Image Segmentation", a: "S. Belmonte Diaz, R. P. Breton, Z. Hosenie, B. W. Stappers", v: "arXiv", links: [["arXiv", "https://www.arxiv.org/abs/2511.19014"]],
      abs: "A pipeline that skips the thresholding step of traditional single-pulse searches and analyses DM-time images directly. A Mask R-CNN finds the bow-tie signature of real dispersed signals and separates them from interference. Trained on simulated bursts in real MeerKAT noise, it recovered every burst of FRB20240114A above the usual threshold, found two fainter ones, and runs in real time." },
    { y: 2025, cat: "ai", t: "VoluMe: Authentic 3D Video Calls from Live Gaussian Splat Prediction", a: "M. de La Gorce, C. Hewitt, T. Takacs, R. Gerdisch, Z. Hosenie, G. Meishvili, M. Kowalski, T. J. Cashman, A. Criminisi", v: "ICCV 2025", links: [["arXiv", "https://arxiv.org/abs/2507.21311"]],
      abs: "The first method to predict 3D Gaussian reconstructions in real time from a single 2D webcam feed, live, realistic and authentic to the input video. A stability loss keeps reconstructions steady over time, enabling one-to-one 3D meetings with only a standard camera and display." },
    { y: 2024, cat: "ai", t: "Look Ma, no markers: holistic performance capture without the hassle", a: "C. Hewitt, F. Saleh, S. Aliakbarian, L. Petikam, S. Rezaeifar, L. Florentin, Z. Hosenie, T. J. Cashman, J. Valentin, D. Cosker, T. Baltrusaitis", v: "SIGGRAPH Asia 2024", links: [["arXiv", "https://arxiv.org/abs/2410.11520"]],
      abs: "Marker-free, high-quality capture of the whole human body, including eyes and tongue, with no calibration, manual work or custom hardware. Models trained only on synthetic data are combined with parametric models of human shape and motion, giving state-of-the-art results on body, face and hand benchmarks." },
    { y: 2024, cat: "ai", t: "Hairmony: Fairness-aware hairstyle classification", a: "G. Meishvili, J. Clemoes, C. Hewitt, Z. Hosenie, X. Xiao, M. de La Gorce, T. Takacs, T. Baltrusaitis, A. Criminisi, C. McRae, N. Jablonski, M. Wilczkowiak", v: "SIGGRAPH Asia 2024", links: [["arXiv", "https://arxiv.org/abs/2410.11528"]],
      abs: "Predicts a person's hairstyle from one image, trained only on synthetic data for full control over diversity and clean labels. A new hairstyle taxonomy, built with a diverse group of experts, balances the data, supervises the model and measures fairness. Much more robust on challenging hairstyles than parametric approaches." },
    { y: 2022, cat: "astro", t: "Investigation of a Machine Learning methodology for the SKA pulsar search pipeline", a: "S. S. Bhat, T. Prabu, B. Stappers, A. Ghalame, S. Saha, T. S. B. Sudarshan, Z. Hosenie", v: "arXiv", links: [["arXiv", "https://arxiv.org/abs/2209.04430"]],
      abs: "Tests Mask R-CNN object detection for finding candidate signatures in the SKA pulsar search pipeline, with a custom annotation tool to mark regions of interest in large datasets." },
    { y: 2021, cat: "astro", t: "MeerCRAB: MeerLICHT Classification of Real and Bogus Transients using Deep Learning", a: "Z. Hosenie, S. Bloemen, P. Groot, R. Lyon, B. Scheers, B. Stappers, et al.", v: "Experimental Astronomy", links: [["arXiv", "https://arxiv.org/abs/2104.13950"], ["Journal", "https://doi.org/10.1007/s10686-021-09757-1"], ["Blog", "#post/meercrab"]],
      abs: "A CNN pipeline that filters bogus detections from real astrophysical sources for the MeerLICHT telescope. Labels came from volunteers via thresholding and latent class models. The best model reached 99.5% accuracy (MCC 0.989) and runs in the MeerLICHT vetting pipeline." },
    { y: 2020, cat: "astro", t: "Imbalance Learning for Variable Star Classification", a: "Z. Hosenie, R. Lyon, B. Stappers, A. Mootoovaloo, V. McBride", v: "MNRAS", links: [["arXiv", "https://arxiv.org/abs/2002.12386"], ["Journal", "https://doi.org/10.1093/mnras/staa642"], ["Blog", "#post/gpfit"]],
      abs: "Combines hierarchical classification with data augmentation (RASLE, Gaussian-process GpFit and SMOTE) to handle rare variable-star classes, improving accuracy by 1 to 4%, with GpFit best." },
    { y: 2019, cat: "astro", t: "Comparing Multiclass, Binary, and Hierarchical Machine Learning Classification schemes for variable stars", a: "Z. Hosenie, R. Lyon, B. Stappers, A. Mootoovaloo", v: "MNRAS", links: [["arXiv", "https://arxiv.org/abs/1907.08189"], ["Journal", "https://doi.org/10.1093/mnras/stz1999"], ["Blog", "#post/hierarchical"]],
      abs: "Using 11 variable-star types from the Catalina Real-Time Transient Survey, this work uses information theory for feature selection and compares classifiers. Binary tasks reach about 99% balanced accuracy for δ Scuti versus anomalous Cepheids, and a new hierarchy enables accurate subtype identification." },
    { y: 2019, cat: "astro", t: "DeepSource: Point Source Detection using Deep Learning", a: "A. Vafaei Sadr, E. E. Vos, B. A. Bassett, Z. Hosenie, N. Oozeer, M. Lochner", v: "MNRAS", links: [["arXiv", "https://arxiv.org/abs/1807.02701"], ["Journal", "https://doi.org/10.1093/mnras/stz131"]],
      abs: "A CNN approach that boosts source signal-to-noise in radio maps and uses dynamic blob detection. On simulated MeerKAT images it is essentially perfect in purity and completeness down to SNR 4 and beats PyBDSF on every metric." },
    { y: 2017, cat: "cosmo", t: "No evidence for extensions to the standard cosmological model", a: "A. Heavens, Y. Fantaye, E. Sellentin, H. Eggers, Z. Hosenie, S. Kroon, A. Mootoovaloo", v: "Physical Review Letters", links: [["arXiv", "https://arxiv.org/abs/1704.03467"], ["Journal", "https://doi.org/10.1103/PhysRevLett.119.101301"]],
      abs: "Computes the Bayesian evidence for models in the Planck CMB analysis by reusing MCMC chains. Standard flat ΛCDM is favoured over every extension considered; only with newer Hubble-constant data does it become mildly disfavoured." },
    { y: 2017, cat: "cosmo", t: "Marginal Likelihoods from Monte Carlo Markov Chains", a: "A. Heavens, Y. Fantaye, A. Mootoovaloo, H. Eggers, Z. Hosenie, S. Kroon, E. Sellentin", v: "arXiv", links: [["arXiv", "https://arxiv.org/abs/1704.03472"]],
      abs: "A method to compute the marginal likelihood (Bayesian evidence) from MCMC samples using nearest-neighbour distances, effective up to about 20 dimensions with around 100,000 samples." }
  ],

  repos: [
    { n: "FRBID", d: "MeerKAT Fast Radio Burst Intelligent Distinguisher: real-time burst versus interference classification.", s: 8, lang: "Jupyter" },
    { n: "meercrab", d: "MeerLICHT Classification of Real And Bogus transients using deep learning.", s: 7, lang: "Jupyter" },
    { n: "ICVaS", d: "Imbalance learning for variable-star classification with hierarchical ML.", s: 8, lang: "Jupyter" },
    { n: "FABLE", d: "Fast rAdio Burst Localization & dEtection using Mask R-CNN.", s: 2, lang: "Python" },
    { n: "latent-class-model", d: "Latent class models for labelling astronomical images when ground truth is uncertain.", s: 2, lang: "Jupyter" },
    { n: "Prompt-Engineering", d: "Curated notes and exercises on prompting large language models.", s: 0, lang: "Jupyter" }
  ],

  scoreboard: [
    { g: "Single asset · Apple (Ch 5)" },
    { n: "Long-only", v: 0.58 },
    { n: "Long-only · vol-targeted", v: 0.85, hi: true },
    { n: "TSMOM · vol-targeted", v: 0.54 },
    { n: "MACD · vol-targeted", v: 0.54 },
    { n: "SMA crossover · vol-targeted", v: 0.40 },
    { g: "Deep momentum · test set (Ch 5)" },
    { n: "Deep momentum (Sharpe loss)", v: 0.76 },
    { n: "Buy & hold", v: 0.79 },
    { g: "Multi-asset portfolios (Ch 5 and 6)" },
    { n: "Minimum variance", v: 0.92, hi: true },
    { n: "Maximum diversification", v: 0.79 },
    { n: "Equal-weight long-only", v: 0.79 },
    { n: "Deep portfolio (MLP)", v: 0.08 },
    { n: "Cross-sectional long-short", v: 0.07 }
  ],

  awards: [
    { y: "2022", t: "First Prize, IoP Computational Physics Group Thesis Prize", d: "For PhD research on ML for the data challenges of modern astronomy, with algorithms deployed on MeerKAT and MeerLICHT.", img: "iop-prize.webp", link: "https://compphysics.org/2022/12/06/zafiirah-hosenie-awarded-iop-cpg-thesis-prize/" },
    { y: "2021", t: "Grand Prize Winner, Microsoft Global Hackathon", d: "Overall Grand Prize among thousands of hacking teams worldwide.", img: "hackathon.webp", contain: true, link: "https://www.credly.com/badges/dcc85600-ceef-495b-9fd0-0c332171658c" },
    { y: "2018", t: "DARA Big Data PhD Scholarship, UK Newton Fund", d: "Highly competitive, awarded to only three candidates, to build data skills for the SKA era across Africa.", img: "bdm-3.webp", link: "https://www.darabigdata.com/" },
    { y: "2017", t: "Best Poster, Deep Learning Indaba", d: "For CNN classification of radio galaxies and the first GAN for radio-image augmentation; prize book signed by Nando de Freitas.", img: "nando-book.webp", link: "https://deeplearningindaba.com/blog/2017/07/strengthening-african-machine-learning/" },
    { y: "MSc", t: "SKA & North-West University Bursaries", d: "Two prestigious bursaries funding my MSc in Astrophysics & Space Science.", img: "msc-summary.webp" },
    { y: "Ongoing", t: "Global Ambassador, WomenTech Network", d: "Championing women in technology and data science.", img: "women-in-ml.webp", link: "https://www.womentech.net/" }
  ],

  mentorship: [
    { img: "likeness.webp", tag: "2023 · Cambridge × Microsoft", t: "Likeness Trainer", d: "Mentored a Cambridge Computer Science team building a tool that draws the most essential lines onto faces.", link: "https://www.youtube.com/watch?v=WN4g5_n1qyk" },
    { img: "bdm-1.webp", tag: "2022 · Mauritius", t: "Big Data Mauritius", d: "Co-organised a mini data-science school and a 3-day hackathon on COVID-19 Twitter sentiment.", link: "https://www.darabigdata.com/big-data-mauritius" },
    { img: "wids-team4.webp", tag: "2022 · Pan-African", t: "Africa Women in Data Science", d: "Mentored two hackathon teams on data science and NLP.", link: "https://www.darabigdata.com/" },
    { img: "capetown.webp", tag: "2019 · Cape Town", t: "3rd Big Data Africa School", d: "Mentored a team on a sustainable-agriculture project using real datasets.", link: "https://www.sarao.ac.za/media-releases/sarao-upskilling-africas-bright-young-minds-in-big-data/" }
  ],

  events: [
    { img: "bdm-4.webp", tag: "2022 · Speaker", t: "From Astronomy to Mixed Reality", d: "Talk at Big Data Mauritius on neural rendering and synthetic human faces." },
    { img: "hackathon.webp", tag: "2021 · Microsoft", t: "Global Hackathon Grand Prize", d: "Three days of building with colleagues and nonprofits." },
    { img: "google-sandbox.webp", tag: "2020 · Manchester", t: "Google Sandbox", d: "Site reliability engineering and a hands-on Kubernetes workshop." },
    { img: "indaba.webp", tag: "2017 · Johannesburg", t: "First Deep Learning Indaba", d: "Presented CNN and GAN work on radio galaxies; best-poster selection." }
  ]
};
