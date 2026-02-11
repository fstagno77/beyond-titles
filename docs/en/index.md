# Overview

**Beyond Titles** is a behavioural assessment system for the Gi Group Digital Platform, designed to identify professional archetypes through competency-based surveys.

## Objectives

- Identify the user's professional profile through behavioural surveys
- Provide a multilingual experience (IT/EN) with automatic language detection

## Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, vanilla JavaScript (ES6+) |
| **Data** | Local JSON files loaded via Fetch API |
| **Persistence** | `localStorage` (language, survey type) |
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
│   ├── app.js                    # Application logic (~1200 lines)
│   └── survey.js                 # Survey system (~1465 lines)
├── data/
│   ├── mansioni_database.json    # Roles database (604 entries)
│   └── survey_archetypes.json   # Survey data (v3.5, Behavioural & Competency-Based)
├── assets/
│   ├── logoBeyondTitles.png      # Header logo
│   └── favicon.jpg               # Favicon
└── docs/                         # VitePress documentation
```

## Main Features

### 1. Behavioural Surveys

Assessment with 10 single-choice questions:

| Survey | Version | Access |
|---|---|---|
| Behavioural & Competency-Based | v3.5 | Open — **default** |

The system identifies 8 professional archetypes and always returns a **single dominant archetype**. In case of a tie, the tie-break is deterministic (alphabetical order).

### 2. System Activity Log

Side debug panel that shows all operations in real time: user input, matching logic, URL routing, UI state changes and live scores during surveys.

## Current Version

**v0.15.0** — Last updated: 11 February 2026
