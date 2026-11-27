# PausaSegura – Landing Page

Landing Page of **PausaSegura**, a digital product by the startup **SeguridadTotal** (UPC – 1ASI0385 IHC y Tecnologías Móviles).
PausaSegura helps people pause and evaluate a suspicious call or message before answering, sharing data, paying or opening a link.

> *Detente. Verifica. Decide.*

**Live site:** https://220415alondra-tech.github.io/pausasegura-landing-page/

## Tech stack

- HTML5 and CSS3 for the structure, the design and the guided evaluation (steps and risk level).
- Vanilla JavaScript (ES6, no frameworks or libraries) only for the user account, the session and the evaluation history (since v1.1.0).
- Web Storage API (`localStorage` and `sessionStorage`) and Web Crypto API (SHA-256 password hashing).
- Deployed with GitHub Pages.

## Features

| Page | What it does | User Stories |
|---|---|---|
| `index.html` | Landing sections and the guided evaluation (8 questions). The result is saved in the history when the user is signed in. | US05–US32, US39, US48 |
| `login.html` | Register and sign in, with the "Recordarme" option. | US01, US02 |
| `historial.html` | List of saved evaluations, filter by risk level, delete an evaluation, the whole history or the account. | US45, US46 |

### Demo data storage

This version has no backend. Accounts, the session and the history are stored **only in the visitor's browser**:

| Key | Storage | Content |
|---|---|---|
| `pausasegura.users` | `localStorage` | Name, email, salt and SHA-256 password hash (never the plain password). |
| `pausasegura.session` | `localStorage` with "Recordarme", otherwise `sessionStorage` | Signed-in user id. |
| `pausasegura.history.<userId>` | `localStorage` | Saved evaluations: date, channel, sender, risk level, signals, decision. |
| `pausasegura.pendingEvaluation` | `sessionStorage` | Last result of a guest, saved after signing in. |

A real backend (API and database) is planned for a next version.

## Project structure

```
pausasegura-landing-page/
├── index.html              # Landing page with all sections and the guided evaluation
├── login.html              # Register and sign in (US01, US02)
├── historial.html          # Evaluation history (US45, US46)
├── assets/
│   ├── css/styles.css      # Design tokens (prevention palette) and styles
│   ├── js/
│   │   ├── account.js      # Accounts, session and history storage (shared)
│   │   ├── evaluation.js   # Saves the result of the guided evaluation
│   │   ├── login.js        # Register and sign-in forms
│   │   └── history.js      # Renders the history page
│   └── images/             # Optimized images (JPG / SVG)
├── .editorconfig           # Shared editor settings
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md         # GitFlow, commit and coding conventions
└── .github/pull_request_template.md
```

## Run locally

1. Clone the repository: `git clone https://github.com/220415alondra-tech/pausasegura-landing-page.git`
2. Open the folder in Visual Studio Code.
3. Start the *Live Server* extension and open `index.html` (sign in and history need `http://localhost` or `https` for the Web Crypto API).

## Workflow

This repository follows **GitFlow**, **Semantic Versioning 2.0.0** and **Conventional Commits 1.0.0**.
Read [CONTRIBUTING.md](CONTRIBUTING.md) before creating a branch or a commit.

## Related repositories

- Acceptance tests (Gherkin `.feature` files): `pausasegura-acceptance-tests`
