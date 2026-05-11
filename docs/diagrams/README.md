# SecureTrack — Diagrams Pack

This folder contains all the design diagrams for the **SecureTrack DevSecOps**
PFE project, written in [Mermaid](https://mermaid.js.org/) so they render
natively on GitHub, in VS Code (with the *Markdown Preview Mermaid Support*
extension), and inside the PFE report / slides via the Mermaid CLI.

## File index

| # | File | Diagram type | Use in deliverables |
|---|------|--------------|---------------------|
| 01 | `01-mcd-data-model.mmd` | MCD (entity-relationship, Merise) | Report Ch.2 §Data Model |
| 02 | `02-use-case-diagram.mmd` | UML Use Case | Report Ch.2 §Functional Analysis · Slide 3 |
| 03 | `03-class-diagram.mmd` | UML Class Diagram | Report Ch.2 §Object Design |
| 04 | `04-sequence-pipeline-blocking.mmd` | UML Sequence — pipeline gates blocking a vulnerable commit | Slide 7 (demo story), Report Ch.3 |
| 05 | `05-sequence-create-incident.mmd` | UML Sequence — runtime path through AWS | Report Ch.3 §Cloud Path |
| 06 | `06-deployment-diagram.mmd` | UML Deployment — full AWS architecture | Slide 4 (architecture), Report Ch.3 |
| 07 | `07-activity-pipeline.mmd` | UML Activity — 22-stage CI/CD with gates | Slide 6, Report Ch.3 |
| 08 | `08-component-backend.mmd` | UML Component — backend internals | Report Ch.2 §Component Design |

## How to render

### Quick preview (VS Code)
Install the extension **"Markdown Preview Mermaid Support"** (bierner) and open
any `.mmd` file inside a fenced code block, or import it into a markdown file:

````markdown
```mermaid
<paste content of any .mmd file here>
```
````

### Export to PNG / SVG / PDF for the report

```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i 06-deployment-diagram.mmd -o 06-deployment-diagram.png -w 1920 -H 1080
mmdc -i 06-deployment-diagram.mmd -o 06-deployment-diagram.svg
```

Loop over all files:
```bash
for f in *.mmd; do mmdc -i "$f" -o "${f%.mmd}.png" -w 1920 -H 1080; done
```

### Online render
Paste contents into <https://mermaid.live> for instant preview and export.

## Diagram-to-deliverable mapping

| Where it lives | Diagrams to include |
|----------------|---------------------|
| `README.md` (root) | 06 (deployment), 07 (activity) |
| `docs/architecture.md` | 06, 08, 02 |
| `docs/data-model.md` *(create this)* | 01, 03 |
| Slides — Architecture slide | 06 |
| Slides — Pipeline slide | 07 |
| Slides — Demo story | 04 |
| Slides — Application | 02, 03 |
| PFE report Ch.2 | 01, 02, 03, 08 |
| PFE report Ch.3 | 04, 05, 06, 07 |

## Defense talking points anchored to diagrams

- **MCD (01)** — "We model BUILD / SCAN_RESULT / SBOM / SIGNATURE as
  first-class entities so the DevSecOps audit trail is queryable, not just
  log-scraped. This is how the project is a DevSecOps platform and not just a
  CRUD app with a pipeline attached."
- **Sequence — vulnerable commit (04)** — "Three iterations, three blocking
  gates, three shift-left wins. Each remediation is a separate commit so the
  jury can replay the story from `git log`."
- **Deployment (06)** — "Zero static AWS credentials. GitHub Actions
  authenticates via IAM OIDC federation — same model that powers our Cosign
  keyless signing. One identity model, two purposes."
- **Activity (07)** — "Five blocking gates, twelve checks, one auto-rollback
  path. Average pipeline runtime: <X> minutes (measure & fill in)."
