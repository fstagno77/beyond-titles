# Decisions

Architecture Decision Records (ADR) to document important technical choices in the project.

## ADR-001: Vanilla JavaScript without frameworks

**Date:** 17 December 2025 | **Status:** Accepted

### Context
Needed to develop a rapid prototype to validate the concept of behavioural assessment for professional archetypes.

### Decision
Use HTML5, CSS3 and vanilla JavaScript (ES6+) without frameworks (React, Vue, Angular) and without build tools.

### Rationale
- Prototyping speed: no setup, no configuration
- Zero dependencies: no risk of breaking changes from third-party libraries
- Immediate deploy: static files servable from any web server
- Maintenance simplicity for a prototype with limited scope

### Consequences
- More verbose UI code compared to a component-based framework
- Manual state management (no reactive state management)
- No client-side routing (SPA based on hidden/visible panels)

---

## ADR-002: Local JSON database instead of Supabase

**Date:** 17 December 2025 | **Status:** Accepted

### Context
Role data comes from a periodically updated Excel file. A decision was needed on where and how to persist this data.

### Decision
Use static JSON files (`mansioni_database.json`, `survey_archetypes.json`) loaded via Fetch API, instead of a Supabase database.

### Rationale
- No dependency on external services for the prototype
- Simple update: regeneration of JSON from the source Excel file
- Performance: data loaded once and filtered in-memory
- No infrastructure cost

### Consequences
- No SQL queries or server-side filtering
- Data updates require re-deploy (or file replacement)
- All data downloaded by the client (acceptable size for a prototype)
- Migration to Supabase planned for the next phase

---

## ADR-004: Weighted single-choice scoring for survey

**Date:** 20 January 2026 | **Status:** Accepted (replaces binary system v0.8)

### Context
The initial system (v0.8) used a binary MORE/LESS approach for each question. It was not very discriminating and produced too many ambiguous results.

### Decision
Switch to a **single-choice** system with 4 options per question, each mapped to a different archetype, with configurable weights per question. The result always returns a **single dominant archetype**. In case of a perfect tie, the tie-break is deterministic (alphabetical order).

### Rationale
- Greater discrimination between archetypes
- Configurable weights allow balancing question importance
- Single-choice is more intuitive for the user compared to MORE/LESS
- Always clear and unambiguous result (one archetype)
- Deterministic tie-break ensures reproducible results

### Consequences
- Each question contributes to a single archetype (not all of them)
- Distribution must be balanced (5 occurrences per archetype across 40 total options)
- More polarised results compared to the binary system

---

## ADR-005: Multi-survey system with versioning

**Date:** 28 January 2026 | **Status:** Accepted

### Context
After validating the BCB v1.0 survey, reformulated versions (v2.0) and different formats (SJT) were tested. v4.0 (Behavioural & Competency-Based) proved to be the definitive version.

### Decision
Restructure `survey_archetypes.json` in v4.0 format with only the Behavioural & Competency-Based survey. Legacy surveys (BCB v1.0, v2.0, SJT v1.0) were removed after the A/B testing phase.

### Rationale
- The Behavioural & Competency-Based v4.0 is the validated and definitive version
- Code and data simplification by removing no-longer-needed surveys
- Reduction of translations and system complexity

### Consequences
- v4.0 format JSON structure (root object with survey keys)
- Selection persistence in localStorage for user convenience

---

## ADR-006: Custom internationalisation with data attributes

**Date:** 11 January 2026 | **Status:** Accepted

### Context
The application must support Italian and English, with the possibility of adding other languages.

### Decision
Implement a custom i18n system based on `data-i18n` attributes in HTML elements, with a centralised translations object in `i18n.js` and browser language auto-detection.

### Rationale
- No external dependencies (consistent with ADR-001)
- Data attributes keep the markup clean
- Auto-detection via `navigator.language` for immediate UX
- User choice persistence in localStorage

### Consequences
- All strings must have a translation key
- Language change requires explicit re-render of all translated elements
- CustomEvent `languageChanged` as notification mechanism between modules

