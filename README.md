# PausaSegura – Landing Page

Landing Page of **PausaSegura**, a digital product by the startup **SeguridadTotal** (UPC – 1ASI0385 IHC y Tecnologías Móviles).
PausaSegura helps people pause and evaluate a suspicious call or message before answering, sharing data, paying or opening a link.

> *Detente. Verifica. Decide.*

## Tech stack

- HTML5 and CSS3 (mandatory base)
- Basic JavaScript for simple interactions only
- Deployed with GitHub Pages

## Project structure

```
pausasegura-landing-page/
├── index.html              # Single page with all landing sections
├── assets/
│   ├── css/styles.css      # Design tokens (from the Figma Style Guide) and styles
│   ├── js/main.js          # Simple interactions (mobile menu)
│   └── images/             # Optimized images (WebP / SVG)
├── .editorconfig           # Shared editor settings
├── .gitignore
├── CONTRIBUTING.md         # GitFlow, commit and coding conventions
└── .github/pull_request_template.md
```

## Run locally

1. Clone the repository: `git clone <repository-url>`
2. Open the folder in Visual Studio Code.
3. Open `index.html` in Google Chrome (or use the *Live Server* extension).

## Workflow

This repository follows **GitFlow**, **Semantic Versioning 2.0.0** and **Conventional Commits 1.0.0**.
Read [CONTRIBUTING.md](CONTRIBUTING.md) before creating a branch or a commit.

## Related repositories

- Acceptance tests (Gherkin `.feature` files): `pausasegura-acceptance-tests`
