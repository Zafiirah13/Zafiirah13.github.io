/* Blog posts and scorecards. Each post opens in the reader.
   Text supports **bold**. Do not use long dashes in content. */
window.SERIES = {
  agentic: { name: "Agentic evals", color: "sage", icon: "check",
    note: "My learning notes on agent evaluation, an area I am curious about. Written in my own words from public material by Hugging Face and LangChain (sources at the end of each post)." },
  quant: { name: "Quant learning", color: "autumn", icon: "chart",
    note: "Learning notes based on the book <i>Deep Learning in Quantitative Trading</i> by Zihao Zhang and Stefan Zohren (Cambridge University Press, 2025). I worked through the companion notebooks; the explanations, extra diagnostics, plots and results here are mine. The book's text and code are not reproduced. Not investment advice." },
  splats: { name: "Gaussian splats", color: "sky", icon: "cube",
    note: "Notes from my work on 3D Gaussian Splatting and compression at Microsoft, plus the papers that inspired it." },
  research: { name: "Astro-ML & climate", color: "mustard", icon: "telescope",
    note: "Earlier research from my MSc, PhD and FinTech work." }
};

const BOOK = ["Deep Learning in Quantitative Trading, Zhang & Zohren (Cambridge University Press, 2025)", "https://www.cambridge.org/core/books/deep-learning-in-quantitative-trading/C39DE06D255470F6232BC97E2E5474E7"];
const Q = "assets/img/quant/", G = "assets/img/gallery/", P = "assets/img/posts/", S = "assets/img/splat/";

window.POSTS = [
  /* ======================= AGENTIC EVALS ======================= */
  { id: "agent-eval-levels", series: "agentic", n: 1, title: "Three levels of agent evaluation",
    card: "Grade the final answer, each step, and the whole path.", chips: ["3 levels", "LangChain"], read: 3,
    sections: [
      { h: "Goal", p: "A chatbot gives one answer. An agent plans, calls tools and loops before it answers. A correct final answer can hide a messy process, and a wrong answer can come from one bad tool call. I want a simple way to see both." },
      { h: "How", list: [
        "**Final response:** treat the agent as a black box and score only the answer (correct, helpful, well formatted).",
        "**Single step:** test one decision at a time. Did it pick the right tool with the right arguments?",
        "**Trajectory:** compare the full sequence of tool calls with an expected path.",
        "Use all three together. Each one catches a different kind of failure." ] },
      { h: "Conclusion", p: "Start with final-response checks because they are cheap. Add step and trajectory checks where a failure is expensive." }
    ],
    refs: [["LangSmith: evaluation approaches", "https://docs.langchain.com/langsmith/evaluation-approaches"], ["LangSmith: evaluate a complex agent", "https://docs.langchain.com/langsmith/evaluate-complex-agent"]] },

  { id: "llm-as-judge", series: "agentic", n: 2, title: "LLM-as-a-judge that agrees with humans",
    card: "Small scales and a reason before the score make judges reliable.", chips: ["1 to 4 scale", "~30 labels", "Hugging Face"], read: 3,
    sections: [
      { h: "Goal", p: "Agent outputs are often open-ended, so exact string matching fails. A second LLM can grade them, but a naive judge is not much better than guessing. The goal is a judge I can trust." },
      { h: "How", list: [
        "Label about 30 examples by hand first, and check how often two humans agree. In the Hugging Face cookbook, two people only reached 0.56 correlation.",
        "Write the judge prompt with the task, a clear rubric and an output format.",
        "Use a small integer scale (1 to 4) and describe what each score means.",
        "Ask for the rationale **before** the score, so the model reasons first.",
        "Measure the judge's correlation with the human labels before using it.",
        "For reusable judges, LangChain's openevals has ready-made prompts and score types." ] },
      { h: "Conclusion", p: "A judge is a model too. Calibrate it against people before trusting its numbers." }
    ],
    refs: [["Hugging Face cookbook: LLM-as-a-judge (A. Roucher)", "https://huggingface.co/learn/cookbook/en/llm_judge"], ["LangChain openevals", "https://github.com/langchain-ai/openevals"]] },

  { id: "trajectory-eval", series: "agentic", n: 3, title: "Grading the path, not only the destination",
    card: "Compare an agent's tool calls with a reference path.", chips: ["4 match modes", "agentevals"], read: 3,
    sections: [
      { h: "Goal", p: "Two agents can reach the same answer: one efficiently, one by luck after ten wasted calls. Trajectory evaluation checks the steps the agent actually took." },
      { h: "How", list: [
        "Store each run as a list of messages: user, assistant tool calls, tool outputs, final answer.",
        "Pick a match mode in LangChain's agentevals: **strict** (same calls, same order), **unordered** (same calls, any order), **subset** or **superset** (fewer or extra calls allowed).",
        "Decide how strictly the tool arguments must match.",
        "No single correct path? Use an LLM-as-judge trajectory evaluator that asks: was this a reasonable way to solve the task?" ] },
      { h: "Conclusion", p: "Exact matching suits stable workflows. An LLM judge suits open-ended tasks. Most real systems need both." }
    ],
    refs: [["LangChain agentevals", "https://github.com/langchain-ai/agentevals"]] },

  { id: "gaia-benchmark", series: "agentic", n: 4, title: "GAIA: a reality check for agents",
    card: "Real-world questions that are easy for people and hard for AI.", chips: ["466 questions", "Humans 92%", "HF + Meta"], read: 3,
    sections: [
      { h: "Goal", p: "Benchmarks show how far agents are from being truly useful. GAIA, built by Meta FAIR and Hugging Face, asks real-world questions that need browsing, reasoning, files and tools." },
      { h: "How", list: [
        "466 questions across 3 difficulty levels. People scored 92%; GPT-4 with plugins scored 15% when the paper came out.",
        "The test answers are held back to stop them leaking into training data.",
        "Hugging Face's open Deep Research agent (built with smolagents) reached 55% on the validation set, against 67% for OpenAI's Deep Research.",
        "A key lever: letting the agent write its actions as code instead of JSON lifted the score from about 33% to 55%." ] },
      { h: "Conclusion", p: "The scaffolding around a model matters as much as the model. Benchmark the whole agent, not only the LLM." }
    ],
    refs: [["GAIA paper", "https://huggingface.co/papers/2311.12983"], ["Hugging Face: open-source Deep Research", "https://huggingface.co/blog/open-deep-research"], ["Hugging Face Agents Course, Unit 4", "https://huggingface.co/learn/agents-course/unit4/introduction"]] },

  { id: "agent-observability", series: "agentic", n: 5, title: "Watching agents work: traces and live evals",
    card: "Traces, spans and online evaluators turn a black box into data.", chips: ["Offline + online", "OpenTelemetry"], read: 3,
    sections: [
      { h: "Goal", p: "Offline tests never cover everything users do. Observability records what the agent really did in production, so problems can be found and fixed." },
      { h: "How", list: [
        "Instrument the agent with OpenTelemetry (smolagents supports it) and send traces to a tool such as Langfuse or LangSmith.",
        "Read each run as a **trace** (the whole task) made of **spans** (each model or tool call).",
        "Track latency, cost, errors, user feedback (thumbs up, rephrased questions) and accuracy.",
        "**Offline:** run curated datasets before release. **Online:** attach LLM-as-judge or rule-based evaluators to a sample of live traces.",
        "Copy failing live traces back into the offline dataset." ] },
      { h: "Conclusion", p: "Observability gives the signal. Evaluation turns it into decisions, before and after shipping." }
    ],
    refs: [["HF Agents Course: observability and evaluation", "https://huggingface.co/learn/agents-course/bonus-unit2/what-is-agent-observability-and-evaluation"], ["HF Agents Course: bonus unit 2", "https://huggingface.co/learn/agents-course/bonus-unit2/introduction"], ["LangSmith: online LLM-as-judge evaluators", "https://docs.langchain.com/langsmith/online-evaluations-llm-as-judge"]] },

  { id: "eval-harness", series: "agentic", n: 6, title: "My blueprint for an agent eval harness",
    card: "Dataset, runner, evaluators, reliability and release gates.", chips: ["pass^k", "CI gates", "5 parts"], read: 4,
    sections: [
      { h: "Goal", p: "One-off notebooks do not scale. A harness makes evaluation repeatable, so every model or prompt change is tested the same way." },
      { h: "How", list: [
        "**Dataset:** curated cases plus real failures, with reference answers where possible.",
        "**Runner:** wrap the agent as a function and run it over the dataset (LangSmith evaluate(), or its pytest integration in CI).",
        "**Evaluators:** final-response, step and trajectory checks, plus calibrated LLM judges.",
        "**Reliability:** run each task k times. tau-bench's **pass^k** asks: does it succeed every time? GPT-4o solved under 50% of retail tasks, and under 25% at pass^8.",
        "**Report and gate:** compare with a baseline and block releases that regress. For model-level benchmarks, Hugging Face lighteval covers thousands of tasks." ] },
      { h: "Conclusion", p: "Treat evaluation like software testing: versioned data, automatic runs, a clear pass or fail. It is the same discipline I apply to VLM evaluation at work." }
    ],
    refs: [["LangSmith: evaluate an application", "https://docs.langchain.com/langsmith/evaluate-llm-application"], ["LangSmith: pytest integration", "https://docs.langchain.com/langsmith/pytest"], ["Hugging Face lighteval", "https://huggingface.co/docs/lighteval/index"], ["tau-bench (arXiv)", "https://arxiv.org/abs/2406.12045"]] },

  /* ======================= QUANT LEARNING ======================= */
  { id: "q-stats", series: "quant", ch: "Ch 2", title: "Do stock returns behave normally?",
    card: "Apple's daily returns: fat tails, little memory, clustered risk.", chips: ["Excess kurtosis 36.6", "ADF -18.0"], img: Q + "hist-normal.webp", read: 3,
    sections: [
      { h: "Objective", p: "Learn the basic statistical checks to run before modelling any price series: distribution shape, autocorrelation and stationarity." },
      { h: "What I did", list: ["Downloaded 6,287 daily Apple (AAPL) returns from 2000 to 2024.", "Plotted a histogram with a fitted normal curve, and a Q-Q plot.", "Ran the Jarque-Bera normality test, ACF/PACF plots and the Augmented Dickey-Fuller (ADF) test."] },
      { h: "Results", list: ["Skew -1.47 and excess kurtosis 36.6: much heavier tails than a normal distribution. Jarque-Bera rejects normality (p close to 0).", "ACF and PACF sit almost entirely inside the confidence band: past returns barely predict tomorrow.", "ADF statistic -18.0: the mean is stationary, but the variance is not (spikes in 2000, 2008 and 2020)."], img: Q + "acf-pacf.webp", cap: "ACF and PACF of daily returns (my run)." },
      { h: "Takeaway", p: "A normal assumption underestimates crashes. Returns have little linear memory, but volatility does, which leads straight to GARCH." }
    ] },
  { id: "q-arma", series: "quant", ch: "Ch 2", title: "AR, MA and ARMA on pure noise",
    card: "Why linear models forecast a flat line when there is no signal.", chips: ["3 models", "Flat forecast"], img: Q + "arma-forecast.webp", read: 2,
    sections: [
      { h: "Objective", p: "Understand what classical linear time-series models can and cannot learn." },
      { h: "What I did", list: ["Simulated 1,000 white-noise returns: 900 for training, 100 for testing.", "Fitted AR(2), MA(2) and ARMA(2,3) and forecast the test period."] },
      { h: "Results", list: ["All three forecast a flat line near zero.", "The fitted coefficients were close to zero, because there was nothing to learn.", "On noise, the long-run mean is the best possible linear forecast."] },
      { h: "Takeaway", p: "A flat forecast is not a bug; it is the honest answer. Testing on data with no signal shows what 'nothing' looks like." }
    ] },
  { id: "q-garch", series: "quant", ch: "Ch 2", title: "Volatility clustering with ARCH and GARCH",
    card: "GARCH remembers past volatility; ARCH overreacts.", chips: ["GARCH(1,1)", "AAPL forecast"], img: Q + "garch-vs-arch.webp", read: 3,
    sections: [
      { h: "Objective", p: "Model volatility that changes over time, since calm and stormy periods come in clusters." },
      { h: "What I did", list: ["Simulated a GARCH(1,1) market where the true volatility is known.", "Fitted ARCH(1) and GARCH(1,1) and compared in-sample and out-of-sample volatility.", "Applied GARCH(1,1) to Apple up to 2024 and forecast January 2025.", "Wrote step-by-step notes on every model parameter."] },
      { h: "Results", list: ["GARCH tracked both the spikes and the slow decay of the true volatility.", "ARCH(1) was noisy because it only sees yesterday's shock.", "For Apple, after a calm December, the forecast drifts back up towards its long-run level."], img: Q + "aapl-garch.webp", cap: "AAPL volatility: in-sample fit and out-of-sample forecast (my run)." },
      { h: "Takeaway", p: "The memory term (beta) is what captures clustering. Volatility is forecastable even when returns are not." }
    ] },
  { id: "q-losses", series: "quant", ch: "Ch 3", title: "Loss functions and metrics, compared",
    card: "MSE, MAE, Huber and F1 on toy data, and what each one hides.", chips: ["RMSE 3.82", "Macro F1 0.41"], img: Q + "regression-fit.webp", read: 2,
    sections: [
      { h: "Objective", p: "Choose the right loss and metric for regression and classification problems." },
      { h: "What I did", list: ["Simulated a linear regression and computed MSE, RMSE, MSLE, MAE, median absolute error and Huber loss.", "Simulated a 3-class problem with random predictions and computed accuracy, precision, recall, F1 and the confusion matrix."] },
      { h: "Results", list: ["RMSE 3.82 > MAE 2.96 > median error 2.59: a few large errors pull the average up. Huber (2.49) down-weights them.", "Random 3-class predictions: accuracy 0.42 and macro F1 0.41, with recall of only 0.35 on the smallest class."], img: Q + "confusion.webp", cap: "Confusion matrix of the toy classifier (my run)." },
      { h: "Takeaway", p: "Report more than one metric. The gap between RMSE and MAE is a quick outlier detector, and macro F1 exposes weak classes that accuracy hides." }
    ] },
  { id: "q-architectures", series: "quant", ch: "Ch 3", title: "Five neural networks on one sequence task",
    card: "MLP, CNN, WaveNet, LSTM and Transformer, head to head.", chips: ["LSTM MSE 0.012", "5 models"], img: Q + "architectures.webp", read: 3,
    sections: [
      { h: "Objective", p: "Understand how different architectures handle sequential data." },
      { h: "What I did", list: ["Generated sequences of 20 time steps with 3 features; 1,200 / 400 / 400 train, validation and test samples.", "Implemented five networks with one shared training loop and early stopping.", "Wrote notes on the maths and intuition behind each layer type."] },
      { h: "Results", table: { head: ["Model", "Test MSE"], rows: [["LSTM", "0.012"], ["Transformer", "0.016"], ["WaveNet-style", "0.100"], ["MLP", "0.178"], ["CNN", "4.49"]] } },
      { h: "Takeaway", p: "When data has temporal structure, the architecture matters more than tuning. Recurrent and attention models won; the plain CNN failed." }
    ] },
  { id: "q-workflow", series: "quant", ch: "Ch 4", title: "Tuning without peeking at the future",
    card: "Walk-forward cross-validation and Optuna search.", chips: ["Optuna", "CV MSE 0.30"], img: Q + "ch4-features.webp", read: 2,
    sections: [
      { h: "Objective", p: "Learn a full training workflow that avoids overfitting and look-ahead bias." },
      { h: "What I did", list: ["Built 1,000 synthetic samples with 10 features and a flexible feed-forward network.", "Used rolling-forward (walk-forward) cross-validation, which only ever trains on the past.", "Let Optuna search the number of layers, units, learning rate and batch size, then retrained the best model on all data."] },
      { h: "Results", list: ["Best trial: 1 hidden layer of 32 units, learning rate 6.4e-4, batch size 16, CV MSE 0.298.", "Deeper networks did not help; the worst trial scored 1.11."] },
      { h: "Takeaway", p: "With time series, the validation scheme matters as much as the model. Random K-fold leaks the future; walk-forward does not." }
    ] },
  { id: "q-tsmom", series: "quant", ch: "Ch 5", title: "Momentum and volatility targeting",
    card: "Less return, more Sharpe: scaling risk on Apple.", chips: ["Sharpe 0.58 → 0.85", "Vol 40% → 15%"], img: Q + "momentum.webp", read: 3,
    sections: [
      { h: "Objective", p: "Build classical trend-following strategies and learn volatility targeting." },
      { h: "What I did", list: ["Long-only Apple as the benchmark.", "A volatility-targeted version that scales the position to a 15% yearly volatility.", "Three trend signals: time-series momentum (TSMOM), moving-average crossover (SMA 10/40) and MACD, all volatility-targeted.", "Lagged every signal by one day to avoid look-ahead bias."] },
      { h: "Results", table: { head: ["Strategy", "Return", "Volatility", "Sharpe"], rows: [["Long-only", "23.2%", "40.0%", "0.58"], ["Long-only, vol-targeted", "13.1%", "15.3%", "0.85"], ["TSMOM", "8.1%", "15.0%", "0.54"], ["MACD", "8.1%", "15.0%", "0.54"], ["SMA crossover", "6.5%", "16.1%", "0.40"]] } },
      { h: "Takeaway", p: "Volatility targeting gave up raw return but improved risk-adjusted return and cut drawdowns. Trend strategies protect in downturns but lag in a strong bull market." }
    ] },
  { id: "q-xsmom", series: "quant", ch: "Ch 5", title: "Cross-sectional momentum: when the baseline wins",
    card: "Long the winners, short the losers, across 10 stocks.", chips: ["Sharpe 0.07", "Baseline 0.79"], img: Q + "cross-sectional.webp", read: 2,
    sections: [
      { h: "Objective", p: "Rank assets against each other instead of looking at each one alone." },
      { h: "What I did", list: ["Computed 12-month (252-day) momentum for 10 stocks.", "Each day: long the top 2 and short the bottom 2, only when the momentum sign agreed.", "Lagged weights by one day and added exposure diagnostics (net and gross exposure)."] },
      { h: "Results", list: ["Long-short: 5.1% return, 69.6% volatility, Sharpe 0.07.", "Equal-weight long-only: 16.2% return, 20.5% volatility, Sharpe 0.79.", "Net and gross exposure jumped around, making the PnL noisy."] },
      { h: "Takeaway", p: "Always compare with a simple baseline. Unstable exposure, not the momentum idea itself, sank this version. Next: volatility-scaled weights." }
    ] },
  { id: "q-deepmom", series: "quant", ch: "Ch 5", title: "Deep momentum: optimising Sharpe directly",
    card: "A neural network trained on a Sharpe-ratio loss, honestly diagnosed.", chips: ["Sharpe 0.76", "Vol 3.7%"], img: Q + "deep-momentum.webp", read: 3,
    sections: [
      { h: "Objective", p: "Train a network that outputs trading positions and is optimised end to end for the Sharpe ratio." },
      { h: "What I did", list: ["Built 6 features: 1-day return, TSMOM, SMA and three MACD speeds.", "Checked feature correlations before training.", "Trained an MLP with a negative-Sharpe loss and studied the positions it predicted."] },
      { h: "Results", list: ["Test Sharpe 0.76 (2.8% return at 3.7% volatility) against buy and hold at 0.79 (24.9% at 31.7%).", "SMA and fast MACD were 0.75 correlated, so largely redundant.", "Predicted positions clustered around +0.12: a small, steady long bias."], img: Q + "positions.webp", cap: "Distribution and time series of predicted positions (my run)." },
      { h: "Takeaway", p: "A good Sharpe, but mostly from market drift rather than timing. Inspect what the model does, not only its score." }
    ] },
  { id: "q-classic-port", series: "quant", ch: "Ch 6", title: "Classical portfolios: minimum variance wins",
    card: "Maximum diversification versus minimum variance.", chips: ["Min-var Sharpe 0.92", "Max-div 0.79"], img: Q + "classical-portfolio.webp", read: 2,
    sections: [
      { h: "Objective", p: "Understand classical portfolio construction before trying deep learning." },
      { h: "What I did", list: ["Estimated the covariance matrix from historical returns.", "Built maximum-diversification and minimum-variance portfolios and compared their performance."] },
      { h: "Results", list: ["Minimum variance: 13.0% return, 14.1% volatility, Sharpe 0.92.", "Maximum diversification: 16.4% return, 20.6% volatility, Sharpe 0.79."] },
      { h: "Takeaway", p: "The lowest-risk portfolio gave the best Sharpe of all my runs. Simple, well-understood methods set a high bar." }
    ] },
  { id: "q-deep-port", series: "quant", ch: "Ch 6", title: "Deep portfolio: an honest negative result",
    card: "An end-to-end allocator for 20 assets that found no edge.", chips: ["Sharpe 0.08", "20 assets"], img: Q + "deep-portfolio.webp", read: 3,
    sections: [
      { h: "Objective", p: "Learn portfolio weights directly from data by maximising Sharpe, skipping return and covariance estimates." },
      { h: "What I did", list: ["Fed 10-day windows of returns for 20 assets into a tiny MLP (200 → 4 → 20) with softmax weights.", "Used the negative Sharpe ratio as the loss.", "Trained on earlier years and tested on about 470 days from 2020 onwards."] },
      { h: "Results", list: ["Out of sample: 2.4% return, 30.8% volatility, Sharpe 0.08.", "A deep drawdown early in the test period, during the COVID-19 crash.", "Classical minimum variance reached 0.92 on similar data."] },
      { h: "Takeaway", p: "Sharpe objectives overfit easily, and a long-only softmax cannot hide in a crash. Negative results are results too." }
    ] },

  /* ======================= GAUSSIAN SPLATS ======================= */
  { id: "gs-intro", series: "splats", n: 1, title: "Gaussian splats in two minutes",
    card: "How millions of tiny 3D blobs turn a phone video into real-time 3D.", chips: ["Real-time 3D", "From video"], img: S + "mauritius-poster.webp", video: "assets/media/mauritius-splat", read: 2,
    sections: [
      { h: "What", p: "3D Gaussian Splatting (3DGS) represents a scene as millions of small, semi-transparent 3D Gaussians. Each one stores a position, a shape (scale and rotation), an opacity and a colour that changes with the viewing angle (spherical harmonics). Rendering simply 'splats' them onto the screen, so it runs in real time." },
      { h: "How I made the video above", list: ["Recorded a short video circling a souvenir from Mauritius.", "Estimated camera poses with structure-from-motion (COLMAP, or the faster GLOMAP).", "Optimised the Gaussians until rendered views matched the photos."] },
      { h: "Why it matters", p: "Photorealistic 3D from a phone video, rendered in real time. My team used splats for live 3D video calls (VoluMe, ICCV 2025)." },
      { h: "The catch", p: "Size. One scene can take hundreds of megabytes, roughly ten times more parameters than NeRF. That is too big for headsets and phones. The next posts show how to shrink them." }
    ],
    refs: [["3D Gaussian Splatting (Kerbl et al., 2023)", "https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/"], ["VoluMe (arXiv)", "https://arxiv.org/abs/2507.21311"], ["COLMAP", "https://colmap.github.io/"], ["GLOMAP", "https://github.com/colmap/glomap"]] },

  { id: "gs-compress", series: "splats", n: 2, title: "Compressing splats: three tricks",
    card: "Drop spherical harmonics, prune by opacity, and vector-quantise.", chips: ["40x to 50x smaller", "2x to 3x faster"], img: S + "filesize-glomap.webp", read: 3,
    sections: [
      { h: "Goal", p: "Make 3DGS small enough for low-memory devices and AR/VR headsets, without losing rendering speed or quality." },
      { h: "How", list: [
        "**Drop spherical harmonics.** Keep only the base colour (SH0). This removes about 75% of the data, at the cost of some view-dependent shine.",
        "**Opacity regulariser.** Add a loss term, L = L<sub>3DGS</sub> + λ Σ σ<sub>i</sub>, that pushes opacities towards zero, then prune the nearly invisible Gaussians. Fewer Gaussians means smaller files and faster rendering.",
        "**Vector quantisation.** Many Gaussians have similar parameters. Run K-means during training on colour, spherical harmonics, scale and rotation (4 codebooks), and store a small codebook plus one index per Gaussian. Position and opacity stay unquantised.",
        "**Sort and run-length encode** the indices to save even more." ] },
      { h: "Results reported in the paper", p: "CompGS (formerly Compact3D) reports models **40x to 50x smaller** and **2x to 3x faster** to render than standard 3DGS, with a very small drop in quality. After quantisation, almost all the remaining memory goes to the indices." },
      { h: "Conclusion", p: "Pruning removes waste; quantisation removes redundancy. Together they make splats practical on small devices." }
    ],
    refs: [["CompGS / Compact3D project page (UC Davis)", "https://ucdvision.github.io/compact3d/"], ["CompGS paper (arXiv)", "https://arxiv.org/abs/2311.18159"], ["Aras Pranckevičius: making Gaussian splats smaller", "https://aras-p.info/blog/2023/09/27/Making-Gaussian-Splats-more-smaller/"]] },

  { id: "gs-results", series: "splats", n: 3, title: "My splat compression results: 12x smaller, same quality",
    card: "Opacity pruning and K-means quantisation on about 80 real captures.", chips: ["Mean 12x smaller", "PSNR unchanged"], img: S + "filesize-colmap.webp", read: 3,
    sections: [
      { h: "Goal", p: "Check whether the compression ideas hold on real, everyday captures, not only on benchmark scenes." },
      { h: "How", list: ["Used about 80 short real-world video captures.", "Estimated camera poses with both COLMAP and GLOMAP.", "Trained three versions of each asset: vanilla 3DGS; 3DGS with the opacity loss; 3DGS with the opacity loss and K-means vector quantisation.", "Compared file size and test PSNR."] },
      { h: "Results", table: { head: ["Poses from", "Mean", "Min", "Max"], rows: [["COLMAP", "12x", "7x", "14x"], ["GLOMAP", "12x", "5x", "14x"]] } },
      { h: "", list: ["Files of 100 to 650 MB dropped to roughly 50 MB or less.", "Test PSNR for all three versions is almost identical: no visible quality loss.", "The lowest-quality assets were the ones where few images were registered, so capture quality mattered more than compression."], img: S + "psnr-colmap.webp", cap: "Test PSNR per asset for the three versions (COLMAP poses). The curves overlap." },
      { h: "Conclusion", p: "The opacity loss gives the first big drop and quantisation does the rest: about 12x smaller with the same quality. That makes splats realistic for lightweight 3D content on everyday devices." }
    ],
    figs: [[S + "imgcount-colmap.webp", "Registered images per asset (COLMAP)."], [S + "filesize-glomap.webp", "File size per asset with GLOMAP poses."]] },

  /* ======================= EARLIER RESEARCH ======================= */
  { id: "phd-thesis", series: "research", tag: "PhD · 2021", title: "PhD: machine learning for streaming astronomy",
    card: "Real-time classifiers now running on MeerKAT and MeerLICHT.", chips: ["IoP Prize 2022", "2 telescopes"], img: G + "iop-prize.webp", read: 3,
    sections: [
      { h: "What", p: "Modern telescopes produce data faster than astronomers can look at it. My PhD at the Jodrell Bank Centre for Astrophysics, University of Manchester, built automatic classifiers for streaming and stored astronomical data. Thesis: <i>Feature Detection and Classification in streaming and non-streaming astronomical datasets</i> (2021)." },
      { h: "How", list: ["**Variable stars:** information-theory feature selection, hierarchical classification and data augmentation for rare classes.", "**Optical transients:** MeerCRAB, a real-or-bogus classifier for MeerLICHT.", "**Radio transients:** FRBID on MeerKAT, and FABLE (Mask R-CNN) to detect and localise bursts."] },
      { h: "Results", list: ["Accurate variable-star classification with only 7 features; hierarchy plus augmentation added 1 to 4%.", "MeerCRAB: 99.5% accuracy. FRBID: under 1% false positives and new burst candidates. FABLE: 99.9% precision at 90% recall.", "First Prize, Institute of Physics Computational Physics Group Thesis Prize 2022."] }
    ],
    refs: [["Thesis (University of Manchester)", "https://research.manchester.ac.uk/en/studentTheses/feature-detection-and-classification-in-streaming-and-non-streami/"], ["IoP CPG Thesis Prize", "https://compphysics.org/2022/12/06/zafiirah-hosenie-awarded-iop-cpg-thesis-prize/"]] },

  { id: "msc-thesis", series: "research", tag: "MSc · 2018", title: "MSc: radio galaxies and the first GAN in radio astronomy",
    card: "Classifying FRI and FRII galaxies with CNNs and synthetic images.", chips: ["CNN + GAN 84%", "Random Forest 75%"], img: G + "dcgan.webp", read: 3,
    sections: [
      { h: "What", p: "The Square Kilometre Array will detect millions of radio sources, far too many to label by eye. My MSc (North-West University and University of Cape Town) asked whether machine learning can sort them: point versus extended sources, and Fanaroff-Riley class I versus class II galaxies." },
      { h: "How", list: ["Data: images from the Sydney University Molonglo Sky Survey (SUMSS).", "Extracted sources with morphological filters (LULU operators, Discrete Pulse Transform, Otsu thresholding).", "Classical models on shapelet features: MLP, Random Forest, kNN and Naive Bayes.", "A CNN, plus a Deep Convolutional GAN (DCGAN) to generate realistic FRI and FRII images, because real examples are rare. This was the first use of a GAN in radio astronomy."] },
      { h: "Results", table: { head: ["Task", "Best model", "Accuracy", "AUC"], rows: [["Point vs extended", "Neural network", "89%", "93%"], ["FRI vs FRII", "Random Forest", "75%", "74%"], ["FRI vs FRII", "CNN + GAN images", "84%", "85%"]] } },
      { h: "Conclusion", p: "Synthetic GAN images beat standard augmentation (flips and rotations) for rare classes, an idea I kept using throughout my PhD." }
    ],
    figs: [[G + "msc-summary.webp", "One-page summary of my MSc project."]],
    refs: [["Thesis: Source classification in deep radio surveys using machine learning techniques", "https://repository.nwu.ac.za/handle/10394/31250"], ["Thesis (archived copy)", "https://web.archive.org/web/20240616032147/https://repository.nwu.ac.za/handle/10394/31250"], ["My original GAN post", "https://zafiirah13.github.io/zafiirah-hosenie/2020-05-01-GAN/"], ["DCGAN paper (Radford et al.)", "https://arxiv.org/abs/1511.06434"]] },

  { id: "recurrence", series: "research", tag: "PhD · Exploration", title: "Recurrence plots: turning light curves into images",
    card: "Can a CNN 'see' the type of a variable star?", chips: ["11 star classes", "CRTS"], img: G + "recurrence.webp", read: 2,
    sections: [
      { h: "What", p: "Variable-star light curves are irregularly sampled time series. Instead of hand-crafting features, I turned each one into a recurrence plot: an image showing when the signal returns to similar states. Computer-vision models can then classify it." },
      { h: "How", list: ["Data: 11 classes of periodic variable stars from the Catalina Real-Time Transient Survey (CRTS).", "Fitted each light curve with a Gaussian process to get a smooth, evenly sampled signal.", "Built a recurrence plot from the distances between every pair of time points, and fed the images to a CNN."], img: G + "gp-lightcurve.webp", cap: "Light curves fitted with Gaussian processes." },
      { h: "Findings", p: "Each class produced a visually distinct texture (eclipsing binaries, RR Lyrae, Cepheids), showing that the images carry the information a CNN needs. This exploration fed into my later work on hierarchical classification." }
    ],
    refs: [["My original post", "https://zafiirah13.github.io/zafiirah-hosenie/2020-05-01-recurrence_plot_for_variable_stars_classification/"]] },

  { id: "hierarchical", series: "research", tag: "PhD · MNRAS 2019", title: "Variable stars: flat versus hierarchical classification",
    card: "Grouping classes into a tree beats one big classifier.", chips: ["~99% balanced acc.", "MNRAS"], img: P + "hierarchy.webp", read: 2,
    sections: [
      { h: "What", p: "Sorting 11 types of variable stars is hard because some classes are very rare. I compared three ways of framing the problem: one flat multiclass model, binary models, and a hierarchy that first separates superclasses and then subclasses." },
      { h: "How", list: ["Computed light-curve features and selected the most informative ones with information theory.", "Trained Random Forest and other classifiers with cross-validation.", "Designed a new hierarchical taxonomy of the CRTS classes."] },
      { h: "Results", list: ["Random Forest performed best (balanced accuracy and geometric mean).", "Binary δ Scuti versus anomalous Cepheid reached about 99% balanced accuracy.", "The hierarchy improved identification of Cepheid, RR Lyrae and eclipsing-binary subtypes."] }
    ],
    refs: [["arXiv:1907.08189", "https://arxiv.org/abs/1907.08189"], ["MNRAS", "https://doi.org/10.1093/mnras/stz1999"]] },

  { id: "gpfit", series: "research", tag: "PhD · MNRAS 2020", title: "Imbalanced learning: synthetic light curves for rare stars",
    card: "GpFit, RASLE and SMOTE to balance the classes.", chips: ["+1 to 4% accuracy", "GpFit best"], img: P + "gpfit.webp", read: 2,
    sections: [
      { h: "What", p: "Rare classes get ignored by classifiers. On top of the hierarchy (an algorithm-level fix), I added data-level fixes: creating realistic synthetic light curves for the rare classes." },
      { h: "How", list: ["**RASLE:** resample light curves using each point's measurement error.", "**GpFit:** fit a Gaussian process and draw new light curves from it.", "**SMOTE:** interpolate between real examples in feature space."] },
      { h: "Results", p: "Combining the hierarchy with augmentation improved accuracy by **1 to 4%**, and GpFit worked best of the three." }
    ],
    refs: [["arXiv:2002.12386", "https://arxiv.org/abs/2002.12386"], ["MNRAS", "https://doi.org/10.1093/mnras/staa642"], ["Code: ICVaS", "https://github.com/Zafiirah13/ICVaS"]] },

  { id: "meercrab", series: "research", tag: "PhD · Exp. Astronomy 2021", title: "MeerCRAB: real or bogus?",
    card: "A CNN that filters false detections for the MeerLICHT telescope.", chips: ["99.5% accuracy", "MCC 0.989"], img: P + "meercrab.webp", read: 2,
    sections: [
      { h: "What", p: "Transient surveys flag thousands of candidates, and most are artefacts ('bogus'). Even human volunteers disagree on the labels, so the ground truth is fuzzy." },
      { h: "How", list: ["CNN on image cutouts (new, reference, difference and significance images).", "Two labelling strategies: a simple vote threshold, and a latent class model that combines 10 volunteer votes per candidate.", "Compared network depths and image combinations."] },
      { h: "Results", list: ["Best network: 99.5% accuracy, Matthews correlation coefficient 0.989.", "Integrated into the live MeerLICHT vetting pipeline.", "Published in Experimental Astronomy (2021); shown at the NeurIPS 2020 Machine Learning and the Physical Sciences workshop."] }
    ],
    refs: [["arXiv:2104.13950", "https://arxiv.org/abs/2104.13950"], ["Experimental Astronomy", "https://doi.org/10.1007/s10686-021-09757-1"], ["Code: meercrab", "https://github.com/Zafiirah13/meercrab"], ["Code: latent class model", "https://github.com/Zafiirah13/latent-class-model"]] },

  { id: "frbid", series: "research", tag: "PhD · MeerKAT", title: "FRBID: spotting fast radio bursts in real time",
    card: "Deep learning that separates bursts from interference on MeerKAT.", chips: ["FPR < 1%", "New candidates"], img: P + "frbid.webp", read: 2,
    sections: [
      { h: "What", p: "Fast radio bursts are millisecond flashes from distant galaxies. MeerTRAP searches MeerKAT data in real time, but most candidates are radio interference. FRBID decides which ones are real." },
      { h: "How", list: ["Two views of each candidate: dispersion-measure versus time, and frequency versus time.", "Stacked them as input to a CNN and compared several architectures.", "A multi-input variant processes each view in its own branch before combining them."] },
      { h: "Results", list: ["False positive rate under 1%.", "Deployed in the MeerTRAP real-time pipeline, where it helped find more than half a dozen new burst candidates."] }
    ],
    refs: [["Code: FRBID", "https://github.com/Zafiirah13/FRBID"], ["Code: multi-input FRBID", "https://github.com/Zafiirah13/multi_input_frbid"], ["Zenodo release", "https://doi.org/10.5281/zenodo.4049946"]] },

  { id: "fable", series: "research", tag: "PhD · Mask R-CNN", title: "FABLE: detect and localise bursts",
    card: "One model to detect, outline and measure burst candidates.", chips: ["Precision 99.9%", "at 90% recall"], img: P + "fable.webp", read: 2,
    sections: [
      { h: "What", p: "Beyond saying 'real or not', it helps to know where a burst sits in the data and to estimate its properties. FABLE does detection, segmentation and localisation in one model." },
      { h: "How", list: ["Built an automatic annotation pipeline that draws masks around bursts.", "Trained a Mask R-CNN on DM-time images, in single-class and three-class (burst, interference, noise) versions.", "Used each predicted mask to estimate the burst's dispersion measure and arrival time."] },
      { h: "Results", list: ["99.9% precision at 90% recall (confidence of 0.5 or more).", "The idea lives on: a 2025 study with colleagues used Mask R-CNN on MeerKAT data for FRB 20240114A, recovering every burst above threshold plus two fainter ones."] }
    ],
    refs: [["Code: FABLE", "https://github.com/Zafiirah13/FABLE"], ["Belmonte Diaz et al. 2025 (arXiv)", "https://arxiv.org/abs/2511.19014"]] },

  { id: "climate", series: "research", tag: "FinTech · 2019 to 2021", title: "Climate risk with machine learning",
    card: "Satellite data, emissions and NLP for a FinTech (Arcturus ESG).", chips: ["Landsat 8", "Sentinel-5P"], img: G + "landcover.webp", read: 2,
    sections: [
      { h: "What", p: "As Lead Data Scientist at Arcturus ESG, I turned large climate and sustainability datasets into financial-risk insights." },
      { h: "How", list: ["**Land cover:** labelled Landsat 8 pixels in QGIS and classified water, farmland and forest with Random Forest, using NDVI, NDWI and NDBI features.", "**Emissions:** an automated Google Earth Engine pipeline for Sentinel-5P greenhouse-gas data, with Gaussian processes for trends and uncertainty.", "**Power plants:** NLP name-matching between World Resources Institute data and CDP climate disclosures, then emission-intensity grades.", "**Temperature:** anomaly trends at specific locations from NASA GISS data."] },
      { h: "Results", p: "Repeatable pipelines that gave each asset a measurable climate-risk profile, with uncertainty, ready for investment analysis." }
    ],
    figs: [[G + "temp-heatmap.webp", "Global temperature map."], [G + "temp-anomaly.webp", "Temperature-anomaly trend at one location."]] }
];
