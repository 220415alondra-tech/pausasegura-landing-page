# Contributing to the PausaSegura Landing Page

All technical names (files, branches, commits, classes, ids, variables and functions) are written in **English**.
Visible content for users stays in **Spanish** (`<html lang="es">`).

## 1. Branching model: GitFlow

Based on *A successful Git branching model* (Vincent Driessen): https://nvie.com/posts/a-successful-git-branching-model/

| Branch | Purpose | Created from | Merged into |
|---|---|---|---|
| `main` | Stable, published versions only. Every merge is tagged. | — | — |
| `develop` | Integration of finished features for the next release. | `main` | `release/*` |
| `feature/*` | One branch per User Story or functionality. | `develop` | `develop` (Pull Request) |
| `release/*` | Prepares a new version before publishing. | `develop` | `main` and `develop` |
| `hotfix/*` | Urgent fixes on the published version. | `main` | `main` and `develop` |

### Branch naming

| Type | Format | Example |
|---|---|---|
| Feature | `feature/<us-id>-<short-description>` | `feature/us05-hero-section` |
| Release | `release/v<MAJOR>.<MINOR>.<PATCH>` | `release/v1.0.0` |
| Hotfix | `hotfix/v<MAJOR>.<MINOR>.<PATCH>` | `hotfix/v1.0.1` |

Rules:

- Never commit directly to `main` or `develop`; every change goes through a Pull Request.
- Each Pull Request needs at least one approval from another team member.
- When a `release` or `hotfix` is finished, merge it with `--no-ff`, create the tag (`v1.0.0`) and delete the branch.

```bash
git checkout develop
git checkout -b feature/us05-hero-section
# ...work and commit...
git push -u origin feature/us05-hero-section
# open a Pull Request to develop on GitHub
```

## 2. Versioning: Semantic Versioning 2.0.0

https://semver.org/ — `MAJOR.MINOR.PATCH`

- **MAJOR**: changes that break the current structure of the Landing Page (full redesign).
- **MINOR**: new sections or functionalities that keep compatibility.
- **PATCH**: bug fixes without new functionalities.

Planned releases: `v1.0.0` first implementation (Sprint 1, AV2) and `v1.1.0` final implementation (Sprint 2, TB2).

## 3. Commit messages: Conventional Commits 1.0.0

https://www.conventionalcommits.org/

```
<type>(<scope>): <description>
```

| Type | Use |
|---|---|
| `feat` | New section or functionality |
| `fix` | Bug fix |
| `style` | Code formatting, no behavior change |
| `refactor` | Code restructuring, no behavior change |
| `docs` | Documentation |
| `test` | Acceptance tests |
| `chore` | Maintenance tasks |

Rules: English, imperative mood ("add", not "added"), lowercase, no final period, max. 72 characters in the first line.
Breaking changes use `!` after the type (`feat!: ...`).

Examples:

```
feat(hero): add download app call to action
fix(navbar): close mobile menu after selecting a link
docs(readme): add local setup steps
```

## 4. Coding conventions

### HTML

References: Google HTML/CSS Style Guide (https://google.github.io/styleguide/htmlcssguide.html) and
HTML Style Guide and Coding Conventions (https://www.w3schools.com/html/html5_syntax.asp).

- `<!DOCTYPE html>`, `<html lang="es">`, `<meta charset="UTF-8">` and the viewport meta tag.
- Lowercase element and attribute names; attribute values in double quotes; 2-space indentation.
- Semantic elements: `header`, `nav`, `main`, `section`, `article`, `footer`; only one `h1`.
- Accessibility (a11y): every image has `alt`; icon-only buttons have `aria-label`; the mobile menu uses `aria-expanded` and `aria-controls`.
- External links use `rel="noopener noreferrer"`. No inline JavaScript (`onclick`).
- File names in lowercase kebab-case: `pausasegura-logo.svg`.

### CSS

- Class names in English with **BEM**: `block__element--modifier` (`.plan-card`, `.plan-card__title`, `.plan-card--featured`).
- No `id` selectors and no `!important` for styling.
- One declaration per line, a space after `:`, always end with `;`.
- Lowercase hexadecimal colors; no units for zero values.
- Use the design tokens (custom properties) defined in `:root`; do not hardcode colors or fonts.
- Mobile first: base styles for mobile, then `@media (min-width: 600px)` (tablet) and `@media (min-width: 1024px)` (desktop).
- Font sizes in `rem`; spacing in multiples of 8 px.

### JavaScript (basic)

Reference: Google JavaScript Style Guide (https://google.github.io/styleguide/jsguide.html).

- `const` and `let` (never `var`); end statements with `;`.
- `camelCase` for variables and functions, `UPPER_SNAKE_CASE` for constants.
- Use `addEventListener`; load scripts with `defer`.

### Gherkin

See the `pausasegura-acceptance-tests` repository.

## 5. Quality checks before a Pull Request

- W3C Markup Validation Service: https://validator.w3.org
- W3C CSS Validation Service: https://jigsaw.w3.org/css-validator
- Lighthouse (Chrome DevTools): Accessibility and Best Practices ≥ 90
- WAVE accessibility tool: https://wave.webaim.org
