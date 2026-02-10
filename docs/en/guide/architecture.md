# Architecture

## Overview

Beyond Titles is a static Single Page Application (SPA), without frameworks and without a build step. The architecture follows a modular pattern based on separate JavaScript files by responsibility, with state managed locally in each module via IIFE (Immediately Invoked Function Expression).

## Modules

```
index.html
  ├── css/style.css          → Design system and component styles
  ├── js/components.js       → Header, footer, language toggle
  ├── js/i18n.js             → Translations and language detection
  ├── js/app.js              → Role search module (IIFE)
  └── js/survey.js           → Survey module (IIFE)
```

### Initialisation Sequence

```
1. DOM Content Loaded
   ↓
2. components.js
   → Renders header (logo + language toggle)
   → Renders footer (version + changelog link)
   → Initialises event listeners
   ↓
3. i18n.js
   → Detects language (localStorage → browser → fallback 'en')
   → Creates global instance window.i18n
   ↓
4. app.js (IIFE)
   → Initialises DOM references
   → Loads mansioni_database.json via Fetch
   → Connects search/autocomplete events
   → Manages Role tab visibility (?internal=true)
   ↓
5. survey.js (IIFE)
   → Loads survey_archetypes.json via Fetch
   → Initialises survey selector
   → Configures SJT password modal
```

## Patterns Used

### IIFE for Encapsulation

Both `app.js` and `survey.js` use IIFEs to avoid polluting the global namespace:

```javascript
(function() {
    const state = { /* module local state */ };
    const CONFIG = { /* configuration */ };
    // ... module logic
})();
```

### Event-Driven Communication

Modules communicate via `CustomEvent` on the DOM:

- `languageChanged` — emitted by `i18n.js` when the user changes language, listened to by all modules to update translations

### Data-Driven UI

The interface is entirely driven by JSON data:

- Roles and their properties (URL, soft skills, mapping type) come from the database
- Questions, options, weights and archetype definitions come from the survey file

## State Management

### app.js — Search State

```javascript
state = {
    mansioniPadre: [],           // Full array from database
    isDataLoaded: boolean,       // Data loading flag
    activeSuggestionIndex: -1,   // Active suggestion index (keyboard nav)
    currentSuggestions: [],      // Current filtered suggestions
    selectedRole: null,          // User-selected role
    generatedUrl: null,          // Generated URL for the CTA
    currentScenario: null        // 'match' | 'no-match' | null
}
```

### survey.js — Survey State

```javascript
state = {
    surveyData: {},              // Contents of survey_archetypes.json
    selectedSurvey: string,      // 'bcb_v3'
    currentQuestion: 0,          // Current question index (0-9)
    answers: [],                 // Array of user answers
    scores: {}                   // { archetypeName: accumulatedScore }
}
```

### localStorage

| Key | Value | Module |
|---|---|---|
| `beyond-titles-lang` | `'it'` or `'en'` | i18n.js |
| `beyond-titles-survey-type` | `'bcb_v3'` | survey.js |

## Data Flows

### Role Search Flow

```
User input (typing)
    ↓
Filtering mansioni_database.json (case-insensitive, substring match)
    ↓
Rendering suggestions (max 15) with mapping type badges
    ↓
User selection
    ↓
Scenario determination:
  ├── mapping_type === "categoria_principale" or "alias"
  │   → Green CTA → Specific job offers URL
  ├── mapping_type === "profilo_incompleto"
  │   → Purple CTA → Generic search URL
  └── No match in database
      → Orange CTA → Free search URL
    ↓
Log to System Activity Log
```

### Survey Flow

```
Survey type selection → [Optional SJT password]
    ↓
For each of the 10 questions:
  → User selects 1 option (single-choice)
  → Score accumulation: scores[archetype] += weight
  → Live scores table update in log
    ↓
Results calculation:
  → Archetype ranking by decreasing score (tie-break: alphabetical order)
  → Always a clear profile: a single dominant archetype
    ↓
Results rendering:
  → Primary card with archetype, claim, profile and soft skills
```

## Configurations

### app.js

```javascript
CONFIG = {
    dataUrl: './data/mansioni_database.json',
    searchUrl: 'https://www.gigroup.it/offerte-lavoro/',
    maxSuggestions: 15,
    minQueryLength: 1,
    debounceDelay: 100
}
```

### survey.js

```javascript
CONFIG = {
    W_BAR: <average weight>,
    SJT_PASSWORD: 'gigroup2026'
}
```

## Accessibility

- ARIA attributes on all interactive controls (`role="tablist"`, `role="tabpanel"`, `role="listbox"`, `role="log"`, `role="dialog"`)
- Keyboard navigation in the suggestions dropdown (arrows + Enter + Escape)
- Focus management in modals
- `escapeHtml()` function for XSS prevention
