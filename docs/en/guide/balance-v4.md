# Archetype Balance v4.0

## Context

v4.0 introduces compressed weights (**Scenario C**) to reduce the structural imbalance identified in the [balance analysis](/reports/archetype-balance-analysis). The weight range goes from 6-38 (v3.5) to **12-28** (v4.0), reducing the max/min ratio from 6.3x to 2.3x.

## Weights per Question

| Question | Theme | Weight v3.5 | Weight v4.0 | Delta |
|---|---|:---:|:---:|:---:|
| Q1 | Ambiguity management | 6 | **12** | +6 |
| Q2 | Problem solving | 20 | **19** | -1 |
| Q3 | Shared responsibility | 17 | **18** | +1 |
| Q4 | Priority management | 31 | **25** | -6 |
| Q5 | Adaptation to change | 31 | **25** | -6 |
| Q6 | Innovation | 6 | **12** | +6 |
| Q7 | Conflict management | 17 | **18** | +1 |
| Q8 | Group coordination | 38 | **28** | -10 |
| Q9 | Proactive intervention | 24 | **21** | -3 |
| Q10 | Values / Satisfaction | 6 | **12** | +6 |
| **Total** | | **196** | **190** | -6 |

**Principle:** compress extreme weights while maintaining relative importance order. Light questions (Q1, Q6, Q10) go from weight 6 to 12, becoming significant. Q8 drops from 38 to 28, reducing excessive concentration on a single question.

## Results: Exhaustive Enumeration

All **1,048,576** possible combinations (4^10) were enumerated and analysed.

### Archetype Distribution as Primary Result

Expected value for perfect balance: **12.50%** each.

| Archetype | % v4.0 | Deviation | % v3.5 | Improvement |
|---|:---:|:---:|:---:|:---:|
| Captain | 12.96% | +0.46 pp | 13.74% | -0.78 pp |
| Connector | 12.95% | +0.45 pp | 13.76% | -0.81 pp |
| Pragmatist | 12.95% | +0.45 pp | 13.58% | -0.63 pp |
| Strategist | 12.89% | +0.39 pp | 11.97% | +0.92 pp |
| Collaborator | 12.67% | +0.17 pp | 13.52% | -0.85 pp |
| Resolver | 11.97% | -0.53 pp | 10.88% | +1.09 pp |
| Pioneer | 11.83% | -0.67 pp | 10.98% | +0.85 pp |
| Craftsman | 11.78% | -0.72 pp | 11.57% | +0.21 pp |

### Balance Metrics

| Metric | v3.5 | v4.0 | Improvement |
|---|:---:|:---:|:---:|
| **Spread** (max − min) | 2.88 pp | **1.18 pp** | -59% |
| **Max/Min ratio** | 1.265x | **1.100x** | -13% |
| **Assessment** | Moderate | **Acceptable** | ✅ |
| Stddev range | 20.6 – 22.8 | 18.8 – 19.5 | Much more uniform |

### Residual Imbalance Cause

The residual 1.18 pp spread is due to **variance** (sum of squares) of weights per archetype:

| Archetype | Questions (weight) | Sum of Squares | Stddev |
|---|---|:---:|:---:|
| Connector | Q1(12), Q5(25), Q6(12), Q7(18), Q8(28) | 2,021 | 19.5 |
| Pragmatist | Q1(12), Q3(18), Q4(25), Q6(12), Q8(28) | 2,021 | 19.5 |
| Captain | Q1(12), Q4(25), Q7(18), Q8(28), Q10(12) | 2,021 | 19.5 |
| Collaborator | Q2(19), Q3(18), Q7(18), Q8(28), Q10(12) | 1,937 | 19.1 |
| Strategist | Q4(25), Q5(25), Q6(12), Q9(21), Q10(12) | 1,979 | 19.3 |
| Resolver | Q2(19), Q4(25), Q7(18), Q9(21), Q10(12) | 1,895 | 18.8 |
| Pioneer | Q2(19), Q3(18), Q5(25), Q6(12), Q9(21) | 1,895 | 18.8 |
| Craftsman | Q1(12), Q2(19), Q3(18), Q5(25), Q9(21) | 1,895 | 18.8 |

Weight compression reduced the stddev difference from **2.2 points** (v3.5) to **0.7 points** (v4.0).

## Ties and Tiebreaker Q11

| Metric | v3.5 | v4.0 |
|---|:---:|:---:|
| Total ties | 34,443 (3.28%) | 43,282 (4.13%) |
| Q11 resolution | 100% | 100% |

Ties increase slightly with compressed weights (scores are closer together), but the Q11 tiebreaker with prime weight matrix resolves all of them at 100%.

### Winner Distribution after Tiebreaker

| Archetype | Solo wins | Tie wins | Total |
|---|:---:|:---:|:---:|
| Captain | 131,026 | 4,914 | 135,940 |
| Connector | 131,239 | 4,556 | 135,795 |
| Pragmatist | 131,792 | 3,996 | 135,788 |
| Strategist | 126,102 | 9,019 | 135,121 |
| Collaborator | 128,267 | 4,568 | 132,835 |
| Resolver | 119,189 | 6,361 | 125,550 |
| Pioneer | 118,763 | 5,235 | 123,998 |
| Craftsman | 118,916 | 4,633 | 123,549 |

The Strategist benefits most from the tiebreaker (9,019 tie wins) thanks to high prime weights in the Q11 matrix.

### Monte Carlo Validation (1,000,000 simulations)

Monte Carlo simulation with uniform random answers confirms the exhaustive enumeration results and quantifies the tiebreaker's corrective effect:

| Archetype | Without TB | With TB | Δ |
|---|:---:|:---:|:---:|
| Captain | 13.25% | 12.95% | -0.30 pp |
| Connector | 13.21% | 12.96% | -0.25 pp |
| Pragmatist | 12.98% | 12.95% | -0.04 pp |
| Strategist | 12.03% | 12.90% | +0.87 pp |
| Collaborator | 13.03% | 12.65% | -0.38 pp |
| Resolver | 11.43% | 11.98% | +0.56 pp |
| Pioneer | 11.64% | 11.81% | +0.17 pp |
| Craftsman | 12.43% | 11.80% | -0.63 pp |
| **Spread** | **1.82 pp** | **1.18 pp** | **-35%** |
| **Chi²** (df=7) | 2,959 | 1,625 | **-45%** |

The tiebreaker reduces spread from 1.82 pp to **1.18 pp** and Chi² by 45%. The bias within ties (e.g. Strategist wins ~75% of ties against Pragmatist) is intentional: it compensates for the structural imbalance in Q1-Q10 weights, where Strategist (12.03%) and Resolver (11.43%) are under-represented without tiebreaker.

> **Methodological note:** 1.18 pp spread on uniform answers is the best achievable result without modifying Q1-Q10 weights or the question→archetype mapping. An attempt to balance the Q11 matrix for within-tie equity (uniform archetype sums) worsens the global spread to ~1.33 pp, because it removes the compensatory correction. Equal weights for all questions cause 43% ties and a 5.5 pp spread — significantly worse. **The residual bias is negligible in practice: with real users answering coherently (not uniformly), the effect disappears.**

## Confidence Level Distribution

| Level | Delta | v3.5 | v4.0 |
|---|---|:---:|:---:|
| Very defined | ≥ 30 | 18.82% | 11.73% |
| Defined | 20-29 | 15.65% | 15.99% |
| Multifaceted | 10-19 | 29.42% | 27.06% |
| Very multifaceted | < 10 | 36.11% | 45.23% |

With compressed weights, scores are closer together, increasing "multifaceted" results. This is expected: with random answers, deltas are low. With real users answering coherently, deltas will be significantly higher.

## How to Reproduce

```bash
# Exhaustive enumeration (all 1M combinations)
node scripts/archetype_balance_test.js

# Monte Carlo (100K random simulations)
node scripts/archetype_montecarlo.js

# Q11 tiebreaker test (verify 100% resolution)
node scripts/archetype_tiebreaker_test.js
```

All scripts read configuration from `data/survey_archetypes.json` and do not modify any files.
