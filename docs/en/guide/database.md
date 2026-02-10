# Database

Beyond Titles uses local JSON files as its database, loaded via Fetch API at application startup. There is no backend or relational database.

::: warning Note on Supabase
Although the project is designed to integrate with Supabase in the post-POC phase, the current version does not use Supabase. All data is served from static JSON files.
:::

## Roles Database

**File:** `data/mansioni_database.json`

### Metadata

| Field | Value |
|---|---|
| Version | 3.0.0 |
| Total entries | 604 |
| Last updated | 2026-02-04 |
| Source | `mansioni-softskills-dude-20260204.xlsx` |

### Entry Schema

```json
{
  "nome": "string",
  "id": "string",
  "numero_offerte": number,
  "url": "string | null",
  "soft_skills": ["string"] | null,
  "mapping_type": "categoria_principale" | "alias" | "profilo_incompleto",
  "has_custom_skills": boolean
}
```

| Field | Description |
|---|---|
| `nome` | Role name (canonical title) |
| `id` | Slug (lowercase, hyphens) |
| `numero_offerte` | Number of active offers on gigroup.it |
| `url` | Direct URL to job offers (null for incomplete profiles) |
| `soft_skills` | Array of transferable skills (null if not defined) |
| `mapping_type` | Type of match in the system |
| `has_custom_skills` | Whether it has custom skills in the source database |

### Mapping Types

| Type | Count | Description |
|---|---|---|
| `categoria_principale` | 445 | Direct match with active job offers |
| `alias` | 25 | Alternative name, inherits URL from main category |
| `profilo_incompleto` | 134 | Present in the skills DB but without active offers |

### Soft Skills Distribution

- **277** main categories with defined skills
- **168** main categories without skills
- **125** incomplete profiles with skills
- **9** incomplete profiles without skills
- **35** unique soft skills in the system

### Complete Soft Skills

Reliability, Analysis, Listening, Operational Autonomy, Engagement, Collaboration & Teamwork, Communication, Concreteness, Decision-Making, Flexibility / Alternative Thinking, Stress Management, Guidance & Team Leadership, Influence, Initiative, Innovation, Negotiation, Customer Orientation, Results Orientation, Planning & Organisation, Problem Solving, Thoroughness, Manual Dexterity, Sense of Belonging, Emotional Stability, Standing, Spatial Visualisation.

## Survey Database

**File:** `data/survey_archetypes.json`

### Metadata

| Field | Value |
|---|---|
| Version | v3.4 |
| Format | Behavioural & Competency-Based |
| Questions | 10 |
| Options per question | 4 |
| Scoring | Weighted single-choice |

### Survey

| ID | Name | Access |
|---|---|---|
| `bcb_v3` | Behavioural & Competency-Based v3.4 | Open (default) |

### 8 Professional Archetypes

| Archetype | Colour | Claim | Soft Skills |
|---|---|---|---|
| **Connector** | `#1abc9c` | Builds bridges between people | Communication, Listening, Customer Orientation, Engagement, Standing |
| **Strategist** | `#3498db` | Sees the big picture | Planning & Organisation, Analysis, Results Orientation, Synthesis |
| **Pragmatist** | `#e74c3c` | From ideas to action | Thoroughness, Planning & Organisation, Reliability, Concreteness, Execution |
| **Collaborator** | `#2ecc71` | The value of us | Collaboration & Teamwork, Flexibility, Thoroughness, Sense of Belonging |
| **Resolver** | `#f39c12` | Every problem has a solution | Problem Solving, Concreteness, Emotional Stability, Operational Flexibility |
| **Pioneer** | `#9b59b6` | Opens new paths | Flexibility, Initiative, Innovation, Problem Setting |
| **Captain** | `#c0392b` | Leads by example | Decision-Making, Initiative, Negotiation, Guidance & Team Leadership, Influence |
| **Craftsman** | `#34495e` | Perfection in detail | Thoroughness, Spatial Visualisation, Operational Autonomy, Manual Dexterity |

### Scoring Algorithm

```
For each answered question:
  weight = questionWeights[Qn] || W_BAR
  scores[selected_option_archetype] += weight

Ranking:
  sort archetypes by decreasing score
  tie-break: alphabetical order (deterministic)

Result:
  always a single dominant archetype
```

### Confidence Classification

The delta between the first and second archetype is logged in the System Activity Log as a diagnostic indicator:

| Delta | Level |
|---|---|
| ≥ 30 | Very defined |
| ≥ 20 | Defined |
| ≥ 10 | Multifaceted |
| < 10 | Very multifaceted |
