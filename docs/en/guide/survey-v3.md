# Behavioural & Competency-Based v4.1

## Overview

The **Behavioural & Competency-Based v4.1** is the default survey of the Beyond Titles platform. It is a **Behavioural & Competency-Based** single-choice questionnaire, designed by Subsense to identify the user's professional archetype through 10 concrete situations, with a conditional tiebreaker question (Q11) for resolving ties.

**Version:** v4.1 — 27 February 2026
**Internal ID:** `bcb_v3`
**Access:** Open (no password)
**Status:** Default survey (only active survey)

## Technical Characteristics

| Parameter | Value |
|---|---|
| **Format** | Behavioural & Competency-Based (single-choice) |
| **Questions** | 10 (+1 conditional tiebreaker) |
| **Options per question** | 4 |
| **Balance** | 5 options × 8 archetypes = 40 total options |
| **MAX score per archetype** | 95 out of 190 (50%) — identical for all |
| **Completion time** | 3-5 minutes |
| **Language level** | A2-B1 (accessible to operational workers) |

### Target Audience

- **Profile:** Blue collar (specialised and non-specialised), generalist profiles, students, unemployed
- **Context:** Operational work environment, school, daily life
- **Language competency:** A2-B1 Italian
- **Inclusivity:** 10/10 questions accessible even to those who have never worked

## Dimensions Measured

The survey covers **10 distinct aspects** of professional behaviour:

| # | Question | Dimension | Archetypes involved |
|---|---------|-----------|-------------------|
| Q1 | New task with few instructions | Ambiguity management / Task start | Connector, Craftsman, Captain, Pragmatist |
| Q2 | Unexpected event changes plans | Problem solving / Unexpected management | Resolver, Pioneer, Collaborator, Craftsman |
| Q3 | Preparing something for other people | Shared responsibility / Preparation | Craftsman, Collaborator, Pragmatist, Pioneer |
| Q4 | Several tasks, little time | Priority management / Time management | Captain, Strategist, Pragmatist, Resolver |
| Q5 | Change in how a task is performed | Adaptation to change / Flexibility | Pioneer, Strategist, Connector, Craftsman |
| Q6 | Improvable procedure | Innovation / Continuous improvement | Pioneer, Pragmatist, Connector, Strategist |
| Q7 | Misunderstanding and tension | Conflict management / Tense relationships | Connector, Collaborator, Captain, Resolver |
| Q8 | Teamwork, lack of clarity | Group coordination / Team under pressure | Connector, Collaborator, Captain, Pragmatist |
| Q9 | Problem noticed before it becomes obvious | Proactive intervention / Problem prevention | Craftsman, Strategist, Resolver, Pioneer |
| Q10 | Thanks for work done | Values / Personal satisfaction | Collaborator, Strategist, Captain, Resolver |

### Experiential Flow

| Phase | Questions | Complexity | Function |
|---|---|---|---|
| Warm-up | Q1-Q2 | Low-Medium | Gradual entry |
| Growth | Q3-Q6 | Medium | Behaviour exploration |
| Peak | Q4, Q7, Q8 | High | Decision-making and interpersonal |
| Descent | Q9 | Medium | Proactivity |
| Close | Q10 | Low | Positive cool-down |

## Archetype Balance

Each archetype appears exactly **5 times** across 40 total options, ensuring perfect balance:

| Archetype | Occurrences | Questions |
|---|:---:|---|
| **Connector** | 5 | Q1-A, Q5-C, Q6-C, Q7-A, Q8-A |
| **Craftsman** | 5 | Q1-B, Q2-D, Q3-A, Q5-D, Q9-A |
| **Captain** | 5 | Q1-C, Q4-A, Q7-C, Q8-C, Q10-C |
| **Pragmatist** | 5 | Q1-D, Q3-C, Q4-C, Q6-B, Q8-D |
| **Pioneer** | 5 | Q2-B, Q3-D, Q5-A, Q6-A, Q9-D |
| **Strategist** | 5 | Q4-B, Q5-B, Q6-D, Q9-B, Q10-B |
| **Resolver** | 5 | Q2-A, Q4-D, Q7-D, Q9-C, Q10-D |
| **Collaborator** | 5 | Q2-C, Q3-B, Q7-B, Q8-B, Q10-A |

### Weight Balance

Every archetype has an identical maximum score = **95 points** out of 190 total (50%):

| Archetype | Available weights | MAX Score |
|---|---|:---:|
| Connector | 12+25+12+18+28 | **95** |
| Craftsman | 12+19+18+25+21 | **95** |
| Captain | 12+25+18+28+12 | **95** |
| Pragmatist | 12+18+25+12+28 | **95** |
| Pioneer | 19+18+25+12+21 | **95** |
| Strategist | 25+25+12+21+12 | **95** |
| Resolver | 19+25+18+21+12 | **95** |
| Collaborator | 19+18+18+28+12 | **95** |

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

## What's New from v3.5

v4.1 introduces:

1. **Complete rewrite of all questions** for maximum editorial quality and linguistic accessibility
2. **Redesigned Q10** — new "Values / Personal satisfaction" dimension (replaces "Situational leadership / Team under stress")
3. **Tiebreaker Q11 with prime number weight matrix** — completely eliminates the tie problem (verified through exhaustive enumeration of all 1,048,576 combinations)
4. **Compressed weights (Scenario C)** — range reduced from 6-38 to 12-28, spread from 2.88 pp to 1.18 pp (acceptable balance)
5. **Complete methodological validation** — perfect mathematical balance, semantic overlap verification, social desirability analysis

## Tiebreaker Q11

### Problem

Exhaustive enumeration (all 1,048,576 combinations):
- **95.87%** combinations: primary archetype emerges clearly
- **4.13%** combinations: 2+ archetypes have identical scores (43,282 cases)

The previous rule (alphabetical order) created structural bias (Craftsman favoured +12.48%, Resolver/Strategist penalised -12.50%).

### Solution

**Question:** "You're facing an important decision. What guides you most?"
- A: The outcome I ultimately want to achieve.
- B: The immediate, concrete result.
- C: The quality and rigour of the process.
- D: The involvement and contribution of others.

Q11 appears **only** when 2+ archetypes have identical scores after the first 10 questions. Each combination (answer, archetype) has a unique prime weight (32 distinct prime numbers, range 7-167) that guarantees mathematical resolution of the tie.

### Scoring Formula

**Q1-Q10:**
```
S(a) = Σ(i=1..10) [I(m(i) = a) × wᵢ]
```

**With Q11 (if tie):**
```
S'(a) = S(a) + [I(a ∈ Ex) × P[r][a]]
```

Where `Ex` = set of tied archetypes, `r` = Q11 answer, `P[r][a]` = prime weight from the matrix.

**Result:** 100% resolution verified on all 1,048,576 possible combinations (exhaustive enumeration).

## Validation

| Criterion | Status | Notes |
|---|:---:|---|
| Mathematical balance | OK | Identical MAX (95) for all archetypes, spread 1.18 pp |
| K8 v2.0 archetype mapping | OK | 100% coherence, perfect 5x8 balance |
| Target inclusivity | OK | 10/10 questions accessible to those who have never worked |
| Linguistic clarity | OK | A2-B1 level, accessible vocabulary |
| Semantic overlaps | OK | No critical overlaps (verified Q4 and Q8) |
| Social desirability | OK | Monitor Q8-C (Captain) in beta testing |
| Semantic completeness | OK | Each archetype expresses full range in its 5 occurrences |
| Tie resolution | OK | 100% on all 1,048,576 combinations |
| Italian naturalness | OK | Linear constructions, short sentences |
| Experiential flow | OK | Warm-up → Growth → Peak → Descent → Positive close |
| Completion time | OK | 3-5 minutes stated |

## Test Results

The automated test suite (`scripts/`) verifies the correct functioning of survey v4.1 through exhaustive enumeration of all 1,048,576 possible combinations (4^10) and Monte Carlo simulations.

### Exhaustive Enumeration (v4.1 weights: 12-28)

| Metric | Result |
|---|---|
| **Total combinations** | 1,048,576 |
| **Tie cases** | 43,282 (4.13%) |
| **Archetype spread** | **1.18 pp** (acceptable) |
| **Max/Min ratio** | 1.100x |
| **Most frequent archetype** | Captain (12.96%) |
| **Least frequent archetype** | Craftsman (11.78%) |

### Archetype Distribution (all combinations)

| Archetype | Probability | Deviation |
|---|---|---|
| Captain | 12.96% | +0.46 pp |
| Connector | 12.95% | +0.45 pp |
| Pragmatist | 12.95% | +0.45 pp |
| Strategist | 12.89% | +0.39 pp |
| Collaborator | 12.67% | +0.17 pp |
| Resolver | 11.97% | −0.53 pp |
| Pioneer | 11.83% | −0.67 pp |
| Craftsman | 11.78% | −0.72 pp |

### Tiebreaker Q11 Resolution

| Test | Result |
|---|---|
| **Ties × 4 Q11 answers** | 173,128 cases verified |
| **Resolution per answer** | 100% (43,282 / 43,282) |
| **Total resolution** | **100.0000%** |

### Prime Weight Matrix Validation

| Property | Result |
|---|---|
| **Total weights** | 32 (4 answers × 8 archetypes) |
| **All prime numbers** | Yes |
| **All unique** | Yes |
| **Range** | [7, 167] |

**Complete matrix:**

| Answer | Connector | Strategist | Pragmatist | Collaborator | Resolver | Pioneer | Captain | Craftsman |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **A** | 17 | 167 | 11 | 19 | 7 | 13 | 163 | 23 |
| **B** | 37 | 43 | 151 | 31 | 157 | 41 | 149 | 29 |
| **C** | 59 | 137 | 67 | 53 | 71 | 61 | 47 | 139 |
| **D** | 131 | 97 | 83 | 127 | 89 | 113 | 79 | 73 |

### Winner Distribution after Tiebreaker

When a tie occurs, the user's Q11 answer determines the winner:

| Q11 Answer | Most favoured archetypes |
|---|---|
| **A** — The ultimate outcome | Strategist (25.3%), Captain (20.3%), Craftsman (17.7%) |
| **B** — Immediate result | Resolver (25.1%), Captain (20.5%), Pragmatist (18.3%) |
| **C** — Quality and rigour | Strategist (25.1%), Craftsman (24.9%), Resolver (23.7%) |
| **D** — Involvement of others | Collaborator (24.9%), Connector (23.9%), Pioneer (14.5%) |

### Test Summary

| Test | Status |
|---|:---:|
| All weights are prime numbers | ✅ |
| All 32 weights are unique | ✅ |
| 100% tie resolution (exhaustive) | ✅ |
| Every archetype has tie cases | ✅ |

### Test Scripts

| Script | Description |
|---|---|
| `scripts/archetype_tiebreaker_test.js` | Full suite: tie search, 100% resolution verification, per-archetype scenarios, Monte Carlo with Q11 |
| `scripts/archetype_montecarlo.js` | Monte Carlo 100K simulations with integrated Q11 tiebreaker |
| `scripts/archetype_balance_test.js` | Exhaustive 4^10 enumeration with Q11 resolution |

```bash
node scripts/archetype_tiebreaker_test.js
node scripts/archetype_montecarlo.js
node scripts/archetype_balance_test.js
```

## Technical Implementation

### Files involved

| File | Role |
|---|---|
| `data/survey_archetypes.json` | Questions, options, archetype mapping and tiebreaker matrix (key `bcb_v3`) |
| `js/survey.js` | Survey logic, prefixMap `'bcb_v3': 'bcb3'`, tiebreaker Q11 |
| `js/i18n.js` | IT/EN translations with prefix `bcb3_` (including Q11) |

### Scoring

The system uses differentiated weights per question (weighted scoring) with compressed range 12-28 (Scenario C):

```
Q1: weight 12   Q6: weight 12
Q2: weight 19   Q7: weight 18
Q3: weight 18   Q8: weight 28
Q4: weight 25   Q9: weight 21
Q5: weight 25   Q10: weight 12
```

**Total weight:** 190 points — **Max/min ratio:** 2.3x (vs 6.3x in v3.5)

Questions with higher weights (Q8 = 28, Q4/Q5 = 25) have greater impact on the final archetype determination, but the compressed range ensures that even lighter questions (Q1/Q6/Q10 = 12) have significant impact. The result always returns a **single dominant archetype**. In case of a tie, the system presents the tiebreaker question Q11 with a prime number weight matrix for mathematically guaranteed resolution.

### Complete Technical Mapping

| Q | Weight | A | B | C | D |
|:---:|:---:|---|---|---|---|
| 1 | 12 | Connector | Craftsman | Captain | Pragmatist |
| 2 | 19 | Resolver | Pioneer | Collaborator | Craftsman |
| 3 | 18 | Craftsman | Collaborator | Pragmatist | Pioneer |
| 4 | 25 | Captain | Strategist | Pragmatist | Resolver |
| 5 | 25 | Pioneer | Strategist | Connector | Craftsman |
| 6 | 12 | Pioneer | Pragmatist | Connector | Strategist |
| 7 | 18 | Connector | Collaborator | Captain | Resolver |
| 8 | 28 | Connector | Collaborator | Captain | Pragmatist |
| 9 | 21 | Craftsman | Strategist | Resolver | Pioneer |
| 10 | 12 | Collaborator | Strategist | Captain | Resolver |

## Survey Evolution

| Version | Date | Notes |
|---|---|---|
| v3.0 | Feb 2026 | First Behavioural & Competency-Based version |
| v3.2 | 5 Feb 2026 | Linguistic corrections |
| v3.3 | 9 Feb 2026 | Q10 rewritten, legacy survey cleanup |
| v3.4 | 9 Feb 2026 | Linguistic refinements on 23 options/stems |
| v3.5 | 11 Feb 2026 | New #BeyondTitles intro text, stem differentiation Q3/Q8/Q10 |
| v4.0 | 20 Feb 2026 | Complete question rewrite, Q10 new dimension, tiebreaker Q11 with prime weights, compressed weights 12-28 (Scenario C), spread 1.18 pp |
| **v4.1** | **27 Feb 2026** | **Gi Group wording review: 8 Italian text changes, complete English translation rewrite** |
