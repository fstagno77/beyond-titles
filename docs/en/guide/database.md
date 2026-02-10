# Database

Beyond Titles uses local JSON files as its database, loaded via Fetch API at application startup. There is no backend or relational database.

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
