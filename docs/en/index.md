# Overview

**Beyond Titles** is a POC (Proof of Concept) for the Gi Group Digital Platform. The application enables intelligent matching between professional titles and job offers, combined with a behavioural assessment system for identifying professional archetypes.

## Objectives

- Match job titles entered by the user against a database of roles and active job offers
- Identify the user's professional profile through behavioural surveys
- Provide a multilingual experience (IT/EN) with automatic language detection

## Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, vanilla JavaScript (ES6+) |
| **Data** | Local JSON files loaded via Fetch API |
| **Persistence** | `localStorage` (language, SJT auth, survey type) |
| **i18n** | Custom system with `data-i18n` attributes and browser language auto-detection |
| **Build** | None — static files ready to deploy |
| **Docs** | VitePress |

::: info Zero runtime dependencies
The application does not use frameworks, CDN libraries or external dependencies. Everything is implemented in vanilla JavaScript.
:::

## Project Structure

```
beyond-titles/
├── index.html                    # Main page (SPA)
├── changelog.html                # Changelog page
├── css/
│   └── style.css                 # All styles (~1500+ lines)
├── js/
│   ├── components.js             # Header, footer, language toggle
│   ├── i18n.js                   # Translations and language detection
│   ├── app.js                    # Role search and autocomplete (~1200 lines)
│   └── survey.js                 # Survey system (~1465 lines)
├── data/
│   ├── mansioni_database.json    # Roles database (604 entries)
│   └── survey_archetypes.json   # Survey data (v3.4, Behavioural & Competency-Based)
├── assets/
│   ├── logoBeyondTitles.png      # Header logo
│   └── favicon.jpg               # Favicon
└── docs/                         # VitePress documentation
```

## Main Features

### 1. Role Search (Role Matching)

The user types a professional title and the system searches for matches in the database of 604 roles. Three possible scenarios:

- **Direct match** (main category or alias) → Green CTA with link to job offers
- **Incomplete profile** (role without active offers) → Purple CTA with generic search
- **No match** → Orange CTA with free search on gigroup.it

### 2. Behavioural Surveys

Assessment with 10 single-choice questions:

| Survey | Version | Access |
|---|---|---|
| Behavioural & Competency-Based | v3.4 | Open — **default** |

The system identifies 8 professional archetypes and always returns a **single dominant archetype**. In case of a tie, the tie-break is deterministic (alphabetical order).

### 3. System Activity Log

Side debug panel that shows all operations in real time: user input, matching logic, URL routing, UI state changes and live scores during surveys.

## Current Version

**v0.14.0** — Last updated: 10 February 2026
