# Behavioural & Competency-Based v3.5

## Overview

The **Behavioural & Competency-Based v3.5** is the default survey of the Beyond Titles platform. It is a **Behavioural & Competency-Based** single-choice questionnaire, designed by Subsense to identify the user's professional archetype through 10 concrete situations.

**Version:** v3.5 — 11 February 2026
**Internal ID:** `bcb_v3`
**Access:** Open (no password)
**Status:** Default survey (only active survey)

## Technical Characteristics

| Parameter | Value |
|---|---|
| **Format** | Behavioural & Competency-Based (single-choice) |
| **Questions** | 10 |
| **Options per question** | 4 |
| **Balance** | 5 options × 8 archetypes = 40 total options |
| **Completion time** | 3-5 minutes |
| **Language level** | A2-B1 (accessible to operational workers) |
| **Average STEM length** | 15-17 words (range: 11-24) |
| **Average option length** | 10-12 words (range: 6-21) |

### Target Audience

- **Profile:** Blue collar (specialised and non-specialised), generalist profiles, students, unemployed
- **Context:** Operational work environment, school, daily life
- **Language competency:** A2-B1 Italian
- **Inclusivity:** 10/10 questions accessible even to those who have never worked

## Dimensions Measured

The survey covers **10 distinct aspects** of professional behaviour, evenly distributed:

| # | Question | Dimension | Archetypes involved |
|---|---------|-----------|-------------------|
| Q1 | New task with few instructions | Ambiguity management / Task start | Connector, Craftsman, Captain, Pragmatist |
| Q2 | Unexpected event disrupting plans | Problem solving / Unexpected management | Resolver, Pioneer, Collaborator, Craftsman |
| Q3 | Preparing something for self and others | Shared responsibility / Preparation | Craftsman, Collaborator, Pragmatist, Pioneer |
| Q4 | Many things to do, little time | Priority management / Time management | Captain, Strategist, Pragmatist, Resolver |
| Q5 | Change in how a task is performed | Adaptation to change / Flexibility | Pioneer, Strategist, Connector, Craftsman |
| Q6 | Way to improve a routine task | Innovation / Continuous improvement | Pioneer, Pragmatist, Connector, Strategist |
| Q7 | Misunderstanding and tension with a colleague | Conflict management / Tense relationships | Connector, Collaborator, Captain, Resolver |
| Q8 | Misaligned group on a project | Group coordination / Misaligned team | Connector, Collaborator, Captain, Pragmatist |
| Q9 | Intervening on a noticed problem | Proactive intervention / Problem prevention | Craftsman, Strategist, Resolver, Pioneer |
| Q10 | Teamwork under pressure | Situational leadership / Team under stress | Collaborator, Strategist, Captain, Resolver |

### Distribution by Area

| Thematic area | Questions | Count |
|---|---|:---:|
| Individual tasks | Q1, Q3, Q4, Q6 | 4 |
| Problem solving | Q2, Q9 | 2 |
| Adaptation/change | Q5, Q6 | 2 |
| Group dynamics | Q7, Q8, Q10 | 3 |

## Archetype Balance

Each archetype appears exactly **5 times** across 40 total options, ensuring perfect balance:

| Archetype | Questions where it appears |
|---|---|
| **Connector** | Q1, Q5, Q6, Q7, Q8 |
| **Craftsman** | Q1, Q2, Q3, Q5, Q9 |
| **Captain** | Q1, Q4, Q7, Q8, Q10 |
| **Pragmatist** | Q1, Q3, Q4, Q6, Q8 |
| **Resolver** | Q2, Q4, Q7, Q9, Q10 |
| **Pioneer** | Q2, Q3, Q5, Q6, Q9 |
| **Collaborator** | Q2, Q3, Q7, Q8, Q10 |
| **Strategist** | Q4, Q5, Q6, Q9, Q10 |

## Introduction (Step 0)

**Title:** "Discover your #BeyondTitles profile"

**Tone of Voice:** Narrative, adventurous, reassuring

**Introductory text:**

> Through 10 situations that can happen to anyone at work, school, or in everyday life, discover which of the 8 #BeyondTitles profiles can tell a new story: yours. A story made of values, soft skills and human skills that are often missing from a CV. For each proposed situation, choose how you would react.

**Key elements communicated to the user:**
- Follow your instinct, without overthinking
- There are no right or wrong answers
- Everything remains anonymous
- Experience doesn't matter: even those who have never worked can answer
- Estimated time: 5 minutes

## Design Principles

1. **Maximum clarity** — Zero ambiguity, accessible vocabulary
2. **Total inclusivity** — Nobody excluded due to lack of work experience
3. **Naturalness** — Spoken language, not academic
4. **Brevity** — Maximum synthesis compatible with comprehension
5. **Consistency** — Uniform structure, constant tone of voice
6. **Reassurance** — Anonymity, no judgement, spontaneity

## Corrections from v3.4

v3.5 introduces refinements to differentiate question endings (avoiding repetition of "What do you do?") and a revised introductory text:

| Question | Element | Before (v3.4) | After (v3.5) |
|---|---|---|---|
| Intro | Title | "Discover your profile" | "Discover your #BeyondTitles profile" |
| Intro | Body | "discover your Human Skill's Profile" | "discover which of the 8 #BeyondTitles profiles can tell a new story: yours." + new paragraph |
| Intro | CTA | "Start the journey" | "Start" |
| Q3 | STEM ending | "What do you do?" | "How do you proceed?" |
| Q3 | Option D | "simpler or faster" | "clearer or faster" |
| Q8 | STEM ending | "What do you do?" | "How do you solve it?" |
| Q10 | STEM ending | "What do you do?" | "How do you step in?" |

### Corrections from v3.3 (historical)

v3.4 introduced linguistic refinements on 23 options/stems to maximise clarity and naturalness (details in v3.4 documentation).

## Validation

| Criterion | Status | Notes |
|---|:---:|---|
| K8 v2.0 archetype mapping | OK | 100% coherence, perfect 5x8 balance |
| Target inclusivity | OK | 10/10 questions accessible to those who have never worked |
| Linguistic clarity | OK | A2-B1 level, accessible vocabulary |
| Dimension balance | OK | 10 distinct aspects, no redundancy |
| Italian naturalness | OK | Linear constructions, short sentences |
| Anonymity and privacy | OK | Explicitly stated in Step 0 |
| Tone of Voice | OK | Narrative, reassuring, adventurous |
| Completion time | OK | 3-5 minutes stated |
| Mobile-first UX | OK | Short text, clear CTA button |

## Technical Implementation

### Files involved

| File | Role |
|---|---|
| `data/survey_archetypes.json` | Questions, options and archetype mapping (key `bcb_v3`) |
| `js/survey.js` | Survey logic, prefixMap `'bcb_v3': 'bcb3'` |
| `js/i18n.js` | IT/EN translations with prefix `bcb3_` |

### Scoring

The system uses differentiated weights per question (weighted scoring):

```
Q1: weight 6    Q6: weight 6
Q2: weight 20   Q7: weight 17
Q3: weight 17   Q8: weight 38
Q4: weight 31   Q9: weight 24
Q5: weight 31   Q10: weight 6
```

**Total weight:** 196 points

Questions with higher weights (Q8 = 38, Q4/Q5 = 31) have greater impact on the final archetype determination. The result always returns a **single dominant archetype**. In case of a perfect tie, the tie-break is deterministic (alphabetical order).

## Survey Evolution

| Version | Date | Notes |
|---|---|---|
| v3.0 | Feb 2026 | First Behavioural & Competency-Based version |
| v3.2 | 5 Feb 2026 | Linguistic corrections |
| v3.3 | 9 Feb 2026 | Q10 rewritten, legacy survey cleanup |
| v3.4 | 9 Feb 2026 | Linguistic refinements on 23 options/stems, CTA "Start the Journey" |
| **v3.5** | **11 Feb 2026** | **New #BeyondTitles intro text, stem differentiation Q3/Q8/Q10, CTA "Start"** |
