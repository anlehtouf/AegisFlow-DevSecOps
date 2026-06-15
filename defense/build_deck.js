// AegisFlow defense deck builder
// Produces D:\AegisFlow\defense\AegisFlow_Defense.pptx

const pptxgen = require("pptxgenjs");
const path = require("path");

// ----- Brand palette -------------------------------------------------------
const C = {
  bg:        "1A1228",   // deep purple-tinted black
  bgAlt:     "241934",   // slightly lighter for cards
  primary:   "7B42BC",   // Terraform purple
  primaryLt: "9B6BD9",   // lighter purple for accents
  amber:     "FFB400",   // shield amber (accent)
  amberDim:  "C68900",
  text:      "F5F5F7",   // near-white body
  textMuted: "B8B5C0",   // muted gray-purple
  white:     "FFFFFF",
  good:      "10B981",   // emerald green (after column)
  bad:       "EF4444",   // red (before column)
};

const F = {
  title: "Arial Black",
  body:  "Calibri",
  mono:  "Consolas",
};

const DIAG = path.resolve(__dirname, "../docs/diagrams");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "AegisFlow PFE";
pres.title  = "AegisFlow — DevSecOps with a built-in shield";
pres.subject = "PFE end-of-studies defense";

// ----- Helpers -------------------------------------------------------------
const slideBg = (slide) => { slide.background = { color: C.bg }; };

// Thin left accent stripe — the visual motif repeated across content slides
const accentStripe = (slide) => {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.08, h: 5.625,
    fill: { color: C.primary }, line: { color: C.primary, width: 0 },
  });
};

// Small footer on content slides (right side)
const footerBrand = (slide, num) => {
  slide.addText("AegisFlow", {
    x: 8.4, y: 5.32, w: 1.0, h: 0.25,
    fontSize: 9, fontFace: F.body, color: C.textMuted,
    align: "right", margin: 0,
  });
  slide.addText(`${num} / 15`, {
    x: 9.4, y: 5.32, w: 0.5, h: 0.25,
    fontSize: 9, fontFace: F.body, color: C.amber,
    align: "right", margin: 0, bold: true,
  });
};

// Slide title block
const slideTitle = (slide, text) => {
  slide.addText(text, {
    x: 0.5, y: 0.35, w: 9.0, h: 0.7,
    fontSize: 32, fontFace: F.title, color: C.white,
    bold: true, align: "left", margin: 0,
  });
  // Amber underline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.02, w: 0.6, h: 0.05,
    fill: { color: C.amber }, line: { color: C.amber, width: 0 },
  });
};

// =============================================================================
// SLIDE 1 — Title
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s);

  // Big purple shield-like rounded rectangle as a hero block (top center)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.0, y: 0.65, w: 2.0, h: 2.0,
    fill: { color: C.primary },
    line: { color: C.amber, width: 3 },
    rectRadius: 0.4,
  });

  // "A" monogram inside the shield
  s.addText("A", {
    x: 4.0, y: 0.85, w: 2.0, h: 1.6,
    fontSize: 110, fontFace: F.title, color: C.white,
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Brand name
  s.addText("AegisFlow", {
    x: 0.5, y: 2.85, w: 9.0, h: 0.7,
    fontSize: 54, fontFace: F.title, color: C.white,
    bold: true, align: "center", margin: 0,
  });

  // Tagline in amber italic
  s.addText("DevSecOps with a built-in shield", {
    x: 0.5, y: 3.55, w: 9.0, h: 0.5,
    fontSize: 22, fontFace: F.body, color: C.amber,
    italic: true, align: "center", margin: 0,
  });

  // Subtle separator dot row
  s.addText("•  •  •", {
    x: 0.5, y: 4.10, w: 9.0, h: 0.3,
    fontSize: 14, color: C.primaryLt, align: "center", margin: 0,
  });

  // Footer block
  s.addText([
    { text: "End-of-studies project (PFE) · 2026",     options: { breakLine: true, color: C.text, fontSize: 14 } },
    { text: "Anlehtouf · Supervisor name · University", options: { breakLine: true, color: C.textMuted, fontSize: 12 } },
    { text: "github.com/anlehtouf/AegisFlow-DevSecOps", options: { color: C.amber, fontSize: 12, fontFace: F.mono } },
  ], {
    x: 0.5, y: 4.45, w: 9.0, h: 1.0,
    fontFace: F.body, align: "center", margin: 0,
  });

  s.addNotes("Good morning. I'm presenting AegisFlow, a DevSecOps platform I built to answer one question: can security be enforced automatically at every stage of software delivery, with measurable results? The short answer is yes — and I'll prove it in fifteen slides.");
}

// =============================================================================
// SLIDE 2 — The Problem
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "The Problem");

  // Three stat cards
  const cards = [
    { stat: "100×", title: "Cost multiplier", desc: "Fixing a vulnerability in production vs. development (IBM 2024)" },
    { stat: "100M+", title: "Commits scanned", desc: "GitHub finds millions of exposed secrets per year" },
    { stat: "1", title: "Library, global impact", desc: "Log4Shell compromised millions of systems in 2021" },
  ];

  const cardW = 2.9, cardH = 3.0, gap = 0.2;
  const startX = (10 - (cardW * 3 + gap * 2)) / 2;

  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.4, w: cardW, h: cardH,
      fill: { color: C.bgAlt }, line: { color: C.primary, width: 1 },
    });
    // Large stat
    s.addText(c.stat, {
      x, y: 1.55, w: cardW, h: 1.2,
      fontSize: 64, fontFace: F.title, color: C.amber,
      bold: true, align: "center", margin: 0,
    });
    // Title
    s.addText(c.title, {
      x, y: 2.75, w: cardW, h: 0.4,
      fontSize: 16, fontFace: F.body, color: C.white,
      bold: true, align: "center", margin: 0,
    });
    // Description
    s.addText(c.desc, {
      x: x + 0.2, y: 3.20, w: cardW - 0.4, h: 1.0,
      fontSize: 12, fontFace: F.body, color: C.textMuted,
      align: "center", margin: 0,
    });
  });

  // Footer quote
  s.addText("Security is bolted on, not built in.", {
    x: 0.5, y: 4.75, w: 9.0, h: 0.4,
    fontSize: 18, fontFace: F.body, color: C.primaryLt,
    italic: true, align: "center", margin: 0,
  });

  footerBrand(s, 2);
  s.addNotes("Three numbers tell the story. First: late fixes cost 100x more — every vulnerability that escapes the developer's machine compounds expensively. Second: secrets in code are a structural failure of trust — millions are exposed every year. Third: one vulnerable dependency in one library — Log4j — created a global incident response. The pattern: security is treated as audit, not as engineering.");
}

// =============================================================================
// SLIDE 3 — The Approach
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "The Approach — Shift-Left + Enforce");

  const quad = [
    { num: "01", h: "Every stage scanned",   d: "Secrets · SAST · SCA · container · DAST" },
    { num: "02", h: "Every artifact verifiable", d: "SBOM (SPDX) + cryptographic signature" },
    { num: "03", h: "Every gate blocks",     d: "No override path for insecure code" },
    { num: "04", h: "Every claim auditable", d: "Reports · attestations · transparency log" },
  ];

  const qw = 4.4, qh = 1.7, gx = 0.2, gy = 0.2;
  const sx = (10 - (qw * 2 + gx)) / 2, sy = 1.35;

  quad.forEach((q, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (qw + gx), y = sy + row * (qh + gy);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: qw, h: qh,
      fill: { color: C.bgAlt }, line: { color: C.primary, width: 1 },
    });
    // Number badge
    s.addText(q.num, {
      x: x + 0.2, y: y + 0.15, w: 0.9, h: 0.5,
      fontSize: 28, fontFace: F.title, color: C.amber,
      bold: true, margin: 0,
    });
    // Heading
    s.addText(q.h, {
      x: x + 1.1, y: y + 0.2, w: qw - 1.3, h: 0.5,
      fontSize: 17, fontFace: F.body, color: C.white,
      bold: true, margin: 0, valign: "middle",
    });
    // Description
    s.addText(q.d, {
      x: x + 0.25, y: y + 0.9, w: qw - 0.5, h: 0.7,
      fontSize: 13, fontFace: F.body, color: C.textMuted,
      margin: 0, valign: "top",
    });
  });

  footerBrand(s, 3);
  s.addNotes("AegisFlow takes four positions. First, scan at every stage so problems are found by the cheapest possible actor — the pipeline. Second, every release produces a Software Bill of Materials and a Sigstore signature, so it's verifiable downstream. Third, the gates are blocking, not advisory — there is no 'approve anyway' button. Fourth, every claim in this presentation maps to a committed artifact you can audit after I leave the room.");
}

// =============================================================================
// SLIDE 4 — Architecture (deployment diagram)
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Architecture");

  // diag 06: 1618 x 1468, aspect 1.102
  // Available area: ~9 wide x 3.5 tall, centered
  const maxH = 3.6;
  const ar = 1618 / 1468;
  const w = maxH * ar;  // 3.97"
  const x = (10 - w) / 2;

  s.addImage({
    path: path.join(DIAG, "06-deployment-diagram.png"),
    x, y: 1.20, w, h: maxH,
  });

  s.addText("Local Docker Compose staging — fully reproducible on a laptop. Images come from GHCR signed by Sigstore Fulcio.", {
    x: 0.5, y: 4.95, w: 9.0, h: 0.4,
    fontSize: 12, fontFace: F.body, color: C.textMuted,
    italic: true, align: "center", margin: 0,
  });

  footerBrand(s, 4);
  s.addNotes("The architecture has three planes. The developer plane uses pre-commit hooks and IDE linting for fast feedback. The GitHub plane runs the 22-stage CI/CD pipeline, signs images via OIDC keyless flow against Sigstore's public Fulcio CA, records the signature in Rekor's transparency log, and publishes to GitHub Container Registry. The staging plane is single-host Docker Compose with two networks — application and observability — and named volumes for persistence. The pipeline is portable: the same flow targets Kubernetes or ECS Fargate with no rewrite, which is on the Future Work slide.");
}

// =============================================================================
// SLIDE 5 — The Application: SecureTrack
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "The Application — SecureTrack");

  // Left column: text content
  const leftX = 0.5, leftW = 5.2;

  s.addText("Incident-reporting platform — the target of the security pipeline.", {
    x: leftX, y: 1.35, w: leftW, h: 0.5,
    fontSize: 15, fontFace: F.body, color: C.white, italic: true, margin: 0,
  });

  s.addText([
    { text: "Backend ", options: { bold: true, color: C.amber } },
    { text: "Node 20 · Express · Prisma · PostgreSQL 16", options: { color: C.text, breakLine: true } },
    { text: "Frontend ", options: { bold: true, color: C.amber } },
    { text: "React 18 · Vite · React Router", options: { color: C.text, breakLine: true } },
    { text: "Identity ", options: { bold: true, color: C.amber } },
    { text: "JWT auth · 3 roles (REPORTER · ADMIN · AUDITOR)", options: { color: C.text, breakLine: true } },
    { text: "Audit ", options: { bold: true, color: C.amber } },
    { text: "Append-only AUDIT_LOG on every mutation", options: { color: C.text } },
  ], {
    x: leftX, y: 2.0, w: leftW, h: 2.2,
    fontSize: 14, fontFace: F.body, margin: 0,
    paraSpaceAfter: 6,
  });

  // Highlight block: 15 vulnerabilities
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: 4.30, w: leftW, h: 0.75,
    fill: { color: C.bgAlt }, line: { color: C.amber, width: 2 },
  });
  s.addText([
    { text: "15", options: { fontSize: 28, bold: true, color: C.amber } },
    { text: "  intentional vulnerabilities (V1–V15) baked in", options: { fontSize: 14, color: C.white } },
  ], {
    x: leftX + 0.2, y: 4.32, w: leftW - 0.4, h: 0.7,
    fontFace: F.body, valign: "middle", margin: 0,
  });

  // Right column: use case diagram (very wide aspect 8.65, use as banner)
  // Better: show a stylized OWASP-Top-10 ribbon of the 15 vulns
  const rightX = 6.0, rightW = 3.6;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: 1.35, w: rightW, h: 3.7,
    fill: { color: C.bgAlt }, line: { color: C.primary, width: 1 },
  });
  s.addText("OWASP Top 10 coverage", {
    x: rightX, y: 1.40, w: rightW, h: 0.4,
    fontSize: 13, fontFace: F.body, color: C.amber,
    bold: true, align: "center", margin: 0,
  });

  const vulnList = [
    "A01  Broken access — RBAC tested",
    "A02  Crypto — V2 JWT secret",
    "A03  Injection — V3 SQLi · V4 XSS",
    "A05  Misconfig — V7 V8 V9 V10 V14",
    "A06  Vuln deps — V5 V6 V15",
    "A07  Auth failures — V1 V2 V11 V12",
    "A09  Logging — V13 password leak",
  ];
  s.addText(vulnList.map((v, i) => ({
    text: v,
    options: { breakLine: i < vulnList.length - 1, color: C.text, fontSize: 12 }
  })), {
    x: rightX + 0.2, y: 1.85, w: rightW - 0.4, h: 3.1,
    fontFace: F.mono, margin: 0, paraSpaceAfter: 4,
  });

  footerBrand(s, 5);
  s.addNotes("SecureTrack is intentionally simple — it's the target of the security platform, not the focus. What matters is that it's deliberately vulnerable. I planted 15 representative flaws across the OWASP Top 10: hardcoded secrets, SQL injection, XSS, vulnerable lodash, outdated base image, missing rate limiting, weak password policy, CORS wildcard, and others. The pipeline's job is to catch every single one and refuse to ship.");
}

// =============================================================================
// SLIDE 6 — The Pipeline (activity diagram is tall — use as left vertical bar)
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "The Pipeline");

  // diag 07: 1008 x 4352, aspect 0.232 — VERY TALL
  // Place on the LEFT side, 4.0" tall, width = 4.0 * 0.232 = 0.93"
  const diagH = 4.0;
  const diagW = diagH * (1008 / 4352);
  s.addImage({
    path: path.join(DIAG, "07-activity-pipeline.png"),
    x: 0.6, y: 1.15, w: diagW, h: diagH,
  });

  s.addText("22-stage activity flow", {
    x: 0.4, y: 5.18, w: diagW + 0.4, h: 0.3,
    fontSize: 10, fontFace: F.body, color: C.textMuted,
    italic: true, align: "center", margin: 0,
  });

  // Right side: 4 stat blocks stacked
  const stats = [
    { big: "22", small: "stages", caption: "checkout → ship → DAST" },
    { big: "5",  small: "blocking gates", caption: "Gitleaks · Semgrep · Sonar · Trivy · Conftest" },
    { big: "8",  small: "integrated tools", caption: "across 6 security categories" },
    { big: "<15", small: "min runtime", caption: "with caching + parallel jobs" },
  ];

  const rightX = 2.4, rightW = 7.1, statH = 0.85, statGap = 0.13;
  stats.forEach((st, i) => {
    const y = 1.20 + i * (statH + statGap);
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y, w: rightW, h: statH,
      fill: { color: C.bgAlt }, line: { color: C.primary, width: 1 },
    });
    s.addText(st.big, {
      x: rightX + 0.1, y: y + 0.05, w: 1.2, h: statH - 0.1,
      fontSize: 36, fontFace: F.title, color: C.amber,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    s.addText(st.small, {
      x: rightX + 1.45, y: y + 0.08, w: rightW - 1.6, h: 0.4,
      fontSize: 16, fontFace: F.body, color: C.white,
      bold: true, margin: 0, valign: "top",
    });
    s.addText(st.caption, {
      x: rightX + 1.45, y: y + 0.45, w: rightW - 1.6, h: 0.35,
      fontSize: 12, fontFace: F.body, color: C.textMuted,
      margin: 0, valign: "top",
    });
  });

  footerBrand(s, 6);
  s.addNotes("The pipeline runs 22 stages. Five are explicit blocking gates: Gitleaks, Semgrep SAST, SonarCloud quality, Trivy SCA, Trivy image scan plus Conftest policy. The chain is enforced — failure at gate 1 means the image never builds. Failure at gate 2 means the image never publishes. Eight security tools cover six categories — secrets, SAST, code quality, SCA, container CVE, and policy as code. Plus DAST and SBOM. The pipeline is committed in .github/workflows/ci-pipeline.yml — 794 lines, version-pinned, runnable on a fork.");
}

// =============================================================================
// SLIDE 7 — Demo Story (Red → Green)
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Demo Story — Red → Green");

  // diag 04: 1904 x 1195, aspect 1.59
  const maxH = 3.6;
  const ar = 1904 / 1195;
  const w = Math.min(maxH * ar, 9.0);
  const h = w / ar;
  const x = (10 - w) / 2;
  s.addImage({
    path: path.join(DIAG, "04-sequence-pipeline-blocking.png"),
    x, y: 1.20, w, h,
  });

  s.addText("3 iterations · 3 blocking gates · 3 shift-left wins — each red and each green commit is a real entry in git log.", {
    x: 0.5, y: 4.95, w: 9.0, h: 0.4,
    fontSize: 12, fontFace: F.body, color: C.textMuted,
    italic: true, align: "center", margin: 0,
  });

  footerBrand(s, 7);
  s.addNotes("This is the heart of the demonstration. Iteration 1: I push code with a hardcoded JWT secret. Gitleaks fires, gate 1 blocks, pipeline stops. Two minutes feedback to the developer instead of two weeks to a security auditor. Iteration 2: I remove the secret and push again. Gitleaks passes, Semgrep now finds the SQL injection on the incidents query. Gate 1 blocks again. Iteration 3: I parameterize the query, push, and now everything is green: Gitleaks, Semgrep, SonarCloud, Trivy filesystem, Trivy image, Hadolint, Conftest. Cosign signs the image, Syft generates the SBOM, GHCR receives the signed artifact, ZAP scans the running staging. Each red and each green commit is a real commit in the git log — the jury can replay this narrative deterministically.");
}

// =============================================================================
// SLIDE 8 — Live Demo (2x2 browser-tab mockups)
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Live Demo");

  const tabs = [
    { label: "GitHub Actions · RED",    icon: "✕", color: C.bad,  url: "github.com/anlehtouf/AegisFlow-DevSecOps/actions/runs/<red>" },
    { label: "GitHub Actions · GREEN",  icon: "✓", color: C.good, url: "github.com/anlehtouf/AegisFlow-DevSecOps/actions/runs/<green>" },
    { label: "Terminal · cosign verify", icon: "$", color: C.amber, url: "$ cosign verify --certificate-identity-regexp ..." },
    { label: "SecureTrack live",         icon: "▶", color: C.primaryLt, url: "http://localhost:3000" },
  ];

  const tw = 4.4, th = 1.7, gx = 0.2, gy = 0.2;
  const sx = (10 - (tw * 2 + gx)) / 2, sy = 1.30;

  tabs.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (tw + gx), y = sy + row * (th + gy);

    // Tab "window" rectangle
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: tw, h: th,
      fill: { color: C.bgAlt }, line: { color: C.primary, width: 1 },
    });
    // Top bar (window chrome)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: tw, h: 0.3,
      fill: { color: C.bg }, line: { color: C.primary, width: 0 },
    });
    // Window dots
    ["FF5F57", "FEBC2E", "28C840"].forEach((dotColor, k) => {
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.10 + k * 0.18, y: y + 0.08, w: 0.14, h: 0.14,
        fill: { color: dotColor }, line: { color: dotColor, width: 0 },
      });
    });
    // Status icon
    s.addText(t.icon, {
      x: x + 0.15, y: y + 0.40, w: 0.5, h: 0.5,
      fontSize: 28, fontFace: F.title, color: t.color,
      bold: true, align: "center", margin: 0,
    });
    // Label
    s.addText(t.label, {
      x: x + 0.7, y: y + 0.40, w: tw - 0.8, h: 0.4,
      fontSize: 15, fontFace: F.body, color: C.white,
      bold: true, margin: 0, valign: "middle",
    });
    // URL / command
    s.addText(t.url, {
      x: x + 0.15, y: y + 1.00, w: tw - 0.3, h: 0.6,
      fontSize: 10, fontFace: F.mono, color: C.textMuted,
      margin: 0, valign: "top",
    });
  });

  s.addText("Backup: 3-minute pre-recorded screen capture in case GitHub Actions is slow.", {
    x: 0.5, y: 4.95, w: 9.0, h: 0.4,
    fontSize: 11, fontFace: F.body, color: C.amber,
    italic: true, align: "center", margin: 0,
  });

  footerBrand(s, 8);
  s.addNotes("I'll walk through four windows. First, the red run — note the specific gates that fail. Second, the green run — every job green, signed image at the bottom. Third, the terminal — cosign verify against the image digest, the signature comes back valid, certificate identity matches the workflow. Fourth, the application running locally. If GitHub Actions is slow: switch to the backup video.");
}

// =============================================================================
// SLIDE 9 — Before vs After
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Before vs After");

  // Table data — manual layout (pptxgenjs tables render OK but custom looks better)
  const rows = [
    ["Hardcoded secrets",       "3",                  "0"],
    ["SAST findings",           "6",                  "0"],
    ["Dependency CVEs",         "2 HIGH",             "0"],
    ["Container critical CVEs", "16 + 385 HIGH",      "0 critical"],
    ["Policy violations",       "2 fail + 1 warn",    "0"],
    ["DAST high findings",      "2",                  "0"],
    ["Image size (backend)",    "~900 MB",            "~180 MB"],
    ["Signed images",           "0 / 2",              "2 / 2"],
  ];

  const tx = 0.6, ty = 1.30;
  const colW = [4.0, 2.4, 2.4];
  const rowH = 0.40;

  // Header row
  const headers = ["Metric", "Before", "After"];
  let cx = tx;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: ty, w: colW[i], h: 0.5,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText(h, {
      x: cx, y: ty, w: colW[i], h: 0.5,
      fontSize: 16, fontFace: F.body, color: C.white,
      bold: true, align: i === 0 ? "left" : "center",
      valign: "middle", margin: i === 0 ? 0.15 : 0,
    });
    cx += colW[i];
  });

  // Body rows with alternating fills
  rows.forEach((row, r) => {
    const yy = ty + 0.5 + r * rowH;
    const fill = r % 2 === 0 ? C.bgAlt : C.bg;
    cx = tx;
    row.forEach((cell, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: yy, w: colW[i], h: rowH,
        fill: { color: fill }, line: { color: C.primary, width: 0.5 },
      });
      const color = i === 0 ? C.text : (i === 1 ? C.bad : C.good);
      s.addText(cell, {
        x: cx, y: yy, w: colW[i], h: rowH,
        fontSize: 13, fontFace: i === 0 ? F.body : F.mono,
        color, bold: i !== 0,
        align: i === 0 ? "left" : "center",
        valign: "middle", margin: i === 0 ? 0.15 : 0,
      });
      cx += colW[i];
    });
  });

  s.addText("Numbers from reports/BASELINE_SUMMARY.md and reports/HARDENED_SUMMARY.md — not estimates.", {
    x: 0.5, y: 4.95, w: 9.0, h: 0.4,
    fontSize: 11, fontFace: F.body, color: C.textMuted,
    italic: true, align: "center", margin: 0,
  });

  footerBrand(s, 9);
  s.addNotes("These numbers come directly from the committed scan reports — reports/BASELINE_SUMMARY.md for the left column and reports/HARDENED_SUMMARY.md for the right. The most important row is image critical CVEs: 16 to zero, just by switching the base image from node:16 to node:20-alpine. The most defensible row is the bottom two: zero signed images becomes two-out-of-two, with the signatures cryptographically anchored to a public transparency log.");
}

// =============================================================================
// SLIDE 10 — Supply-Chain Proof
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Supply-Chain Proof");

  // Top: horizontal flow with 4 nodes
  const nodes = ["GitHub Actions", "Fulcio CA", "Cosign signature", "Rekor transparency log"];
  const nodeW = 2.1, nodeH = 0.7, nodeGap = 0.18;
  const totalW = nodeW * 4 + nodeGap * 3;
  const startX = (10 - totalW) / 2;

  nodes.forEach((n, i) => {
    const x = startX + i * (nodeW + nodeGap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.30, w: nodeW, h: nodeH,
      fill: { color: C.bgAlt }, line: { color: C.amber, width: 1.5 },
    });
    s.addText(n, {
      x, y: 1.30, w: nodeW, h: nodeH,
      fontSize: 12, fontFace: F.body, color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Arrow to next
    if (i < nodes.length - 1) {
      s.addText("→", {
        x: x + nodeW, y: 1.30, w: nodeGap, h: nodeH,
        fontSize: 18, color: C.amber,
        bold: true, align: "center", valign: "middle", margin: 0,
      });
    }
  });

  s.addText("OIDC token → ephemeral signing cert → public transparency log. No private keys.", {
    x: 0.5, y: 2.10, w: 9.0, h: 0.3,
    fontSize: 11, fontFace: F.body, color: C.textMuted,
    italic: true, align: "center", margin: 0,
  });

  // Bottom: terminal-style box with cosign verify output
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.65, w: 8.8, h: 2.4,
    fill: { color: "0D0814" }, line: { color: C.primary, width: 1 },
  });
  s.addText("$ cosign verify --certificate-identity-regexp '^https://github.com/anlehtouf/' \\\n    --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \\\n    ghcr.io/anlehtouf/aegisflow-devsecops/backend@sha256:<digest>", {
    x: 0.8, y: 2.78, w: 8.5, h: 1.0,
    fontSize: 11, fontFace: F.mono, color: C.amber, margin: 0,
  });
  s.addText([
    { text: "Verification for ghcr.io/anlehtouf/aegisflow-devsecops/backend ", options: { color: C.text, breakLine: true } },
    { text: "The following checks were performed on each signature:",                options: { color: C.text, breakLine: true } },
    { text: "  ✓ The cosign claims were validated",                                   options: { color: C.good, breakLine: true } },
    { text: "  ✓ Existence of the claims in the transparency log was verified offline", options: { color: C.good, breakLine: true } },
    { text: "  ✓ The code-signing certificate was verified using trusted certificate authority", options: { color: C.good } },
  ], {
    x: 0.8, y: 3.85, w: 8.5, h: 1.2,
    fontSize: 11, fontFace: F.mono, margin: 0,
  });

  footerBrand(s, 10);
  s.addNotes("The supply-chain story is what separates a DevOps project from a DevSecOps project. We don't ship anonymous images. The pipeline obtains a short-lived OIDC token from GitHub, exchanges it at Sigstore's Fulcio CA for a signing certificate tied to the specific workflow run, signs the image, records the signature in Rekor — a public transparency log. Anyone, anywhere, can independently verify that this exact image was built by this exact workflow on this exact commit. Zero private keys to manage, zero trust in opaque registries.");
}

// =============================================================================
// SLIDE 11 — Custom Semgrep Rule
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Custom Semgrep Rule — the +1 Differentiator");

  // Left column: feature bullets
  const leftX = 0.5, leftW = 3.6;
  s.addText([
    { text: "Hand-written, ", options: { bold: true, color: C.amber } },
    { text: "not from registry", options: { color: C.text, breakLine: true } },
    { text: "4 variants", options: { bold: true, color: C.amber } },
    { text: " of CORS misconfig", options: { color: C.text, breakLine: true } },
    { text: "OWASP A05 ", options: { bold: true, color: C.amber } },
    { text: "+ CWE-942", options: { color: C.text, breakLine: true } },
    { text: "ERROR severity ", options: { bold: true, color: C.amber } },
    { text: "— blocking gate", options: { color: C.text, breakLine: true } },
    { text: "Fires on V14 ", options: { bold: true, color: C.amber } },
    { text: "in vulnerable branch", options: { color: C.text } },
  ], {
    x: leftX, y: 1.40, w: leftW, h: 3.2,
    fontSize: 14, fontFace: F.body, margin: 0,
    paraSpaceAfter: 10,
  });

  // Right column: YAML code block
  const codeX = 4.4, codeW = 5.2, codeY = 1.30;
  s.addShape(pres.shapes.RECTANGLE, {
    x: codeX, y: codeY, w: codeW, h: 3.75,
    fill: { color: "0D0814" }, line: { color: C.primary, width: 1 },
  });
  s.addText([
    { text: "rules:",                                  options: { color: C.amber, breakLine: true } },
    { text: "  - id: aegisflow-cors-wildcard-origin",  options: { color: C.text, breakLine: true } },
    { text: "    languages: [javascript, typescript]", options: { color: C.text, breakLine: true } },
    { text: "    severity: ERROR",                     options: { color: C.bad, bold: true, breakLine: true } },
    { text: "    metadata:",                           options: { color: C.amber, breakLine: true } },
    { text: "      owasp: \"A05:2021\"",               options: { color: C.text, breakLine: true } },
    { text: "      cwe: \"CWE-942\"",                  options: { color: C.text, breakLine: true } },
    { text: "      confidence: HIGH",                  options: { color: C.text, breakLine: true } },
    { text: "    pattern-either:",                     options: { color: C.amber, breakLine: true } },
    { text: "      - pattern: cors({ ..., origin: \"*\", ... })",  options: { color: C.text, breakLine: true } },
    { text: "      - pattern: cors({ ..., origin: true, ... })",   options: { color: C.text, breakLine: true } },
    { text: "      - pattern: $RES.setHeader(",        options: { color: C.text, breakLine: true } },
    { text: "          \"Access-Control-Allow-Origin\", \"*\")", options: { color: C.text, breakLine: true } },
    { text: "      - patterns:",                       options: { color: C.amber, breakLine: true } },
    { text: "        - pattern: $APP.use(cors())",     options: { color: C.text, breakLine: true } },
    { text: "        - pattern-not: $APP.use(cors({...}))", options: { color: C.text } },
  ], {
    x: codeX + 0.15, y: codeY + 0.12, w: codeW - 0.3, h: 3.5,
    fontSize: 10, fontFace: F.mono, margin: 0,
  });

  footerBrand(s, 11);
  s.addNotes("Most students use Semgrep. I wrote a Semgrep rule. This one targets the CORS wildcard pattern in four variants: explicit star, origin true which Express interprets as reflect-origin and is just as bad, manual setHeader with a wildcard, and bare app.use(cors()) with no config. It carries OWASP A05 and CWE-942 metadata so it integrates with SARIF dashboards. This rule is also tagged confidence HIGH, likelihood HIGH, impact HIGH — meaning it will not be a false-positive warning, it will be a blocking failure.");
}

// =============================================================================
// SLIDE 12 — Compliance Mapping
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Compliance Mapping");

  const rows = [
    ["OWASP SAMM",      "Verification — Security Testing", "SAST · SCA · DAST · threat modeling"],
    ["NIST SSDF v1.1",  "PW.7 / PW.8 / PW.9 / RV.1",       "Review code · test · configure · identify vulns"],
    ["ISO/IEC 27001:2022", "A.8.25 / A.8.28",              "Secure development lifecycle · secure coding"],
  ];

  const tx = 0.6, ty = 1.45;
  const colW = [2.5, 3.0, 3.3];
  const headerH = 0.55;
  const rowH = 0.85;

  // Header
  const headers = ["Framework", "Domain", "Controls covered"];
  let cx = tx;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: ty, w: colW[i], h: headerH,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText(h, {
      x: cx + 0.15, y: ty, w: colW[i] - 0.2, h: headerH,
      fontSize: 16, fontFace: F.body, color: C.white,
      bold: true, valign: "middle", margin: 0,
    });
    cx += colW[i];
  });

  rows.forEach((row, r) => {
    const yy = ty + headerH + r * rowH;
    const fill = r % 2 === 0 ? C.bgAlt : C.bg;
    cx = tx;
    row.forEach((cell, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: yy, w: colW[i], h: rowH,
        fill: { color: fill }, line: { color: C.primary, width: 0.5 },
      });
      s.addText(cell, {
        x: cx + 0.15, y: yy, w: colW[i] - 0.2, h: rowH,
        fontSize: 13, fontFace: F.body,
        color: i === 0 ? C.amber : C.text,
        bold: i === 0, valign: "middle", margin: 0,
      });
      cx += colW[i];
    });
  });

  s.addText("Full mapping in docs/compliance-mapping.md", {
    x: 0.5, y: 4.95, w: 9.0, h: 0.4,
    fontSize: 11, fontFace: F.body, color: C.textMuted,
    italic: true, align: "center", margin: 0,
  });

  footerBrand(s, 12);
  s.addNotes("Three frameworks, ten controls. The mapping is in docs/compliance-mapping.md. This matters because it makes the project relevant beyond academic — it's how an organization would justify a DevSecOps investment to auditors and regulators.");
}

// =============================================================================
// SLIDE 13 — Limitations & Trade-offs
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Limitations & Trade-offs");

  const items = [
    { h: "Single-host Docker Compose",  d: "Not Kubernetes — deliberate scope" },
    { h: "ZAP baseline only",           d: "Not full active scan — runtime budget" },
    { h: "Demo-scale data",             d: "No load testing — focus is security, not performance" },
    { h: "One developer, one repo",     d: "No cross-team simulation — single-actor model" },
    { h: "Cloud deployment designed",   d: "But out of implementation scope — see Future Work" },
  ];

  const x = 0.7, w = 8.6, itemH = 0.62, startY = 1.40;

  items.forEach((it, i) => {
    const y = startY + i * (itemH + 0.08);
    // bullet badge
    s.addShape(pres.shapes.OVAL, {
      x, y: y + 0.10, w: 0.4, h: 0.4,
      fill: { color: C.bgAlt }, line: { color: C.amber, width: 1.5 },
    });
    s.addText(String(i + 1), {
      x, y: y + 0.10, w: 0.4, h: 0.4,
      fontSize: 14, fontFace: F.title, color: C.amber,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Heading
    s.addText(it.h, {
      x: x + 0.55, y, w: w - 0.6, h: 0.32,
      fontSize: 15, fontFace: F.body, color: C.white,
      bold: true, margin: 0, valign: "top",
    });
    // Description
    s.addText(it.d, {
      x: x + 0.55, y: y + 0.32, w: w - 0.6, h: 0.30,
      fontSize: 12, fontFace: F.body, color: C.textMuted,
      margin: 0, valign: "top",
    });
  });

  footerBrand(s, 13);
  s.addNotes("Every project has scope. Mine: single host, baseline DAST, demo-scale data. Why? Because the goal is to demonstrate methodology end-to-end, not to operate a fleet. The pipeline is portable — same workflow with three env-var changes targets ECS Fargate, which I designed in detail in the project blueprint. I prefer to ship a complete narrow scope than a half-built broad one.");
}

// =============================================================================
// SLIDE 14 — Future Work
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s); accentStripe(s);
  slideTitle(s, "Future Work");

  const quad = [
    { num: "01", h: "Cloud-native deployment",  d: "AWS ECS Fargate · RDS · ALB · WAF — Terraform-defined" },
    { num: "02", h: "Runtime threat detection", d: "Falco / GuardDuty for behavioral anomalies" },
    { num: "03", h: "GitOps promotion",         d: "ArgoCD multi-environment (staging → pre-prod → prod)" },
    { num: "04", h: "IAST instrumentation",     d: "Runtime SAST as second-line defence (Contrast-style)" },
  ];

  const qw = 4.4, qh = 1.7, gx = 0.2, gy = 0.2;
  const sx = (10 - (qw * 2 + gx)) / 2, sy = 1.35;

  quad.forEach((q, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (qw + gx), y = sy + row * (qh + gy);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: qw, h: qh,
      fill: { color: C.bgAlt }, line: { color: C.primary, width: 1 },
    });
    s.addText(q.num, {
      x: x + 0.2, y: y + 0.15, w: 0.9, h: 0.5,
      fontSize: 28, fontFace: F.title, color: C.amber,
      bold: true, margin: 0,
    });
    s.addText(q.h, {
      x: x + 1.1, y: y + 0.2, w: qw - 1.3, h: 0.5,
      fontSize: 16, fontFace: F.body, color: C.white,
      bold: true, margin: 0, valign: "middle",
    });
    s.addText(q.d, {
      x: x + 0.25, y: y + 0.9, w: qw - 0.5, h: 0.7,
      fontSize: 12, fontFace: F.body, color: C.textMuted,
      margin: 0, valign: "top",
    });
  });

  footerBrand(s, 14);
  s.addNotes("Four directions to extend. Cloud deployment is the closest — the architecture diagram already shows the target. Runtime threat detection adds the SIEM layer. GitOps adds the multi-environment promotion. IAST closes the gap between static and dynamic by instrumenting the running application. Each is a non-trivial engineering effort; each is unlocked by what's already built.");
}

// =============================================================================
// SLIDE 15 — Conclusion
// =============================================================================
{
  const s = pres.addSlide();
  slideBg(s);

  // Centered amber quote mark
  s.addText("“", {
    x: 0.5, y: 0.7, w: 9.0, h: 1.0,
    fontSize: 110, fontFace: F.title, color: C.amber,
    bold: true, align: "center", valign: "top", margin: 0,
  });

  // The quote
  s.addText([
    { text: "AegisFlow makes insecure delivery ", options: { color: C.text } },
    { text: "structurally difficult.", options: { color: C.amber, bold: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Every commit is scanned. Every artifact is inventoried.", options: { color: C.text, breakLine: true } },
    { text: "Every image is signed. Every claim is auditable.",       options: { color: C.text } },
  ], {
    x: 0.7, y: 1.95, w: 8.6, h: 2.2,
    fontSize: 22, fontFace: F.body, align: "center",
    valign: "middle", margin: 0, paraSpaceAfter: 8,
  });

  // Stat footer line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.0, y: 4.30, w: 6.0, h: 0.04,
    fill: { color: C.primary }, line: { color: C.primary, width: 0 },
  });

  s.addText([
    { text: "8 diagrams  ·  22 pipeline stages  ·  5 blocking gates  ·  100% critical findings remediated", options: { color: C.textMuted, fontSize: 12, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "github.com/anlehtouf/AegisFlow-DevSecOps", options: { color: C.amber, fontSize: 14, fontFace: F.mono, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Questions?", options: { color: C.white, fontSize: 20, italic: true, bold: true } },
  ], {
    x: 0.5, y: 4.45, w: 9.0, h: 1.1,
    fontFace: F.body, align: "center", margin: 0,
  });

  s.addNotes("One sentence summary: AegisFlow makes insecure delivery structurally difficult. Not discouraged, not audited — structurally difficult. The pipeline either ships a signed, scanned, SBOM-attested artifact, or it ships nothing. I welcome your questions.");
}

// ----- Write file ----------------------------------------------------------
pres.writeFile({ fileName: path.resolve(__dirname, "AegisFlow_Defense.pptx") })
  .then(f => console.log("Wrote:", f))
  .catch(err => { console.error("ERROR:", err); process.exit(1); });
