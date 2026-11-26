# Changelog

All notable changes to the PausaSegura Landing Page are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-11-26

Final implementation of the Landing Page (Sprint 2), with the feedback from the professor.

### Added

- Register and sign in with the "Recordarme" option (`login.html`, US01, US02).
- The result of the 8-question evaluation is saved in the history of the signed-in user, including the decision and the feedback.
- "Mis resultados" page (`historial.html`, US46): summary by risk level, filter, delete one evaluation, the whole history or the account (US45).
- Vanilla JavaScript (`assets/js/`) with the Web Storage API and SHA-256 password hashing (Web Crypto API).
- New FAQ about where the results are stored; updated privacy policy.

### Changed

- Prevention color palette (red and orange) with a stronger hero, banner and download section.
- The full navigation bar starts at 1200 px; the "Inicio" link was removed (the logo goes to the start).
- Documentation: README, CONTRIBUTING (JavaScript conventions) and Pull Request template.

### Fixed

- Visible keyboard focus on "Letra grande" and "Alto contraste"; "Saltar al contenido" is now the first element of the keyboard order.

## [1.0.0] - 2026-11-03

First implementation of the Landing Page (Sprint 1).

### Added

- Landing Page built from the Figma mock-up with HTML and CSS only.
- Sections: hero, how it works, signals, inside PausaSegura, for whom, learn, plans, FAQ, contact and download.
- Guided evaluation demo (CSS only) with risk level, signals, recommendations and sharing.
- Reading preferences: large text and high contrast.
- Responsive layout (mobile, tablet and desktop) and accessible mobile menu.

### Fixed

- HTML validation errors reported by the W3C Markup Validation Service.
