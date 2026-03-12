"""
Generate mock survey data for Beyond dashboard.
Produces ~200,000 records with realistic country/language/audience distribution.
"""

import json
import uuid
import random
from datetime import datetime, timedelta

# ─── Survey structure ────────────────────────────────────────────────────────

QUESTIONS = {
    "Q1":  {"weight": 12, "options": {"1A": "connettore", "1B": "artigiano",   "1C": "capitano",     "1D": "pragmatico"}},
    "Q2":  {"weight": 19, "options": {"2A": "risolutore", "2B": "pioniere",    "2C": "collaboratore","2D": "artigiano"}},
    "Q3":  {"weight": 18, "options": {"3A": "artigiano",  "3B": "collaboratore","3C": "pragmatico",  "3D": "pioniere"}},
    "Q4":  {"weight": 25, "options": {"4A": "capitano",   "4B": "stratega",    "4C": "pragmatico",   "4D": "risolutore"}},
    "Q5":  {"weight": 25, "options": {"5A": "pioniere",   "5B": "stratega",    "5C": "connettore",   "5D": "artigiano"}},
    "Q6":  {"weight": 12, "options": {"6A": "pioniere",   "6B": "pragmatico",  "6C": "connettore",   "6D": "stratega"}},
    "Q7":  {"weight": 18, "options": {"7A": "connettore", "7B": "collaboratore","7C": "capitano",    "7D": "risolutore"}},
    "Q8":  {"weight": 28, "options": {"8A": "connettore", "8B": "collaboratore","8C": "capitano",    "8D": "pragmatico"}},
    "Q9":  {"weight": 21, "options": {"9A": "artigiano",  "9B": "stratega",    "9C": "risolutore",   "9D": "pioniere"}},
    "Q10": {"weight": 12, "options": {"10A":"collaboratore","10B":"stratega",  "10C":"capitano",     "10D":"risolutore"}},
}

TIEBREAKER_WEIGHTS = {
    "11A": {"stratega":167,"capitano":163,"artigiano":23,"collaboratore":19,"connettore":17,"pioniere":13,"pragmatico":11,"risolutore":7},
    "11B": {"risolutore":157,"pragmatico":151,"capitano":149,"artigiano":29,"collaboratore":31,"connettore":37,"pioniere":41,"stratega":43},
    "11C": {"artigiano":139,"stratega":137,"capitano":47,"collaboratore":53,"connettore":59,"pioniere":61,"pragmatico":67,"risolutore":71},
    "11D": {"connettore":131,"collaboratore":127,"pioniere":113,"artigiano":73,"capitano":79,"pragmatico":83,"risolutore":89,"stratega":97},
}

ARCHETYPES = ["connettore","stratega","pragmatico","collaboratore","risolutore","pioniere","capitano","artigiano"]

# ─── Country / language config ───────────────────────────────────────────────

COUNTRIES = [
    # (country_code, count, language_distribution)
    # language_distribution = [(lang, weight), ...]
    ("it", 110000, [("it", 1.0)]),
    ("de",  10900, [("de", 1.0)]),
    ("fr",   9800, [("fr", 1.0)]),
    ("es",   8700, [("es", 1.0)]),
    ("gb",   7600, [("en", 1.0)]),
    ("pl",   6500, [("pl", 0.80), ("en", 0.20)]),
    ("br",   5400, [("pt", 1.0)]),
    ("in",   4400, [("en", 1.0)]),
    ("nl",   4400, [("nl", 1.0)]),
    ("pt",   3800, [("pt", 1.0)]),
    ("tr",   3300, [("tr", 1.0)]),
    ("ch",   3300, [("de", 0.45), ("fr", 0.30), ("en", 0.15), ("it", 0.10)]),
    ("be",   2700, [("en", 1.0)]),
    ("cn",   2200, [("zh", 0.75), ("en", 0.25)]),
    ("ar",   2000, [("es", 1.0)]),
    ("co",   1700, [("es", 1.0)]),
    ("ro",   1500, [("ro", 1.0)]),
    ("bg",   1500, [("bg", 1.0)]),
    ("cz",   1300, [("cs", 0.80), ("en", 0.20)]),
    ("hk",   1300, [("zh", 0.65), ("en", 0.35)]),
    ("ie",   1100, [("en", 1.0)]),
    ("hr",   1100, [("hr", 0.80), ("en", 0.20)]),
    ("rs",   1000, [("sr", 0.75), ("en", 0.25)]),
    ("sk",   1000, [("sk", 0.80), ("en", 0.20)]),
    ("hu",   1000, [("hu", 1.0)]),
    ("dk",    900, [("da", 1.0)]),
    ("no",    900, [("en", 1.0)]),
    ("lt",    650, [("lt", 1.0)]),
    ("me",    550, [("me", 0.70), ("en", 0.30)]),
]

# ─── Target distribution ─────────────────────────────────────────────────────
# target values: "0" (general public, untracked) 80–85%, rest split b2c / b2b
# Of the explicit 15–20%: b2c gets ~85%, b2b gets ~15%
# IT has slightly more b2b due to corporate LinkedIn campaigns (b2b share bumped)
# Per-country distributions are generated randomly within these ranges in main()
TARGET_DISTS: dict = {}  # populated in main() after seeding

# ─── Timestamp config ────────────────────────────────────────────────────────
PRELAUNCH_START = datetime(2026, 4, 25)   # stakeholder testing begins
LAUNCH_DATE     = datetime(2026, 5, 4)    # public launch — traffic ramp-up
END_DATE        = datetime(2026, 7, 25)   # end of 3-month window

PRELAUNCH_SECONDS  = int((LAUNCH_DATE - PRELAUNCH_START).total_seconds())  # 9 days
POSTLAUNCH_SECONDS = int((END_DATE - LAUNCH_DATE).total_seconds())          # 82 days

# ~500 stakeholder records total across all countries (~0.25% of total)
PRELAUNCH_PROBABILITY = 0.0025


def random_timestamp(prelaunch=False):
    if prelaunch:
        # Uniform distribution across the 9 pre-launch days
        return (PRELAUNCH_START + timedelta(seconds=random.randint(0, PRELAUNCH_SECONDS - 1))).strftime("%Y-%m-%dT%H:%M:%SZ")
    # Post-launch: exponential decay — heavy concentration in first ~3 weeks
    # expovariate(0.035) → mean ≈ 28 days; capped at 82 days
    day_offset = min(int(random.expovariate(0.035)), POSTLAUNCH_SECONDS // 86400)
    second_offset = day_offset * 86400 + random.randint(0, 86399)
    return (LAUNCH_DATE + timedelta(seconds=second_offset)).strftime("%Y-%m-%dT%H:%M:%SZ")


def pick_weighted(options):
    """options = [(value, weight), ...]"""
    values, weights = zip(*options)
    return random.choices(values, weights=weights, k=1)[0]


def random_archetype_weights():
    """Generate a random archetype distribution using Dirichlet-like sampling.
    Uses exponential sampling to produce naturally uneven distributions."""
    raw = [random.expovariate(1.0) for _ in ARCHETYPES]
    total = sum(raw)
    return {a: w / total for a, w in zip(ARCHETYPES, raw)}


# Per-country archetype weights — each country gets its own random distribution
# Populated in main() after seeding, so results are reproducible
COUNTRY_ARCHETYPE_WEIGHTS: dict = {}


def generate_answers(country, stop_after=None):
    """Generate answers up to stop_after questions (None = all 10)."""
    weights_map = COUNTRY_ARCHETYPE_WEIGHTS[country]
    answers = {}
    for i, (qid, q) in enumerate(QUESTIONS.items()):
        if stop_after is not None and i >= stop_after:
            break
        options = q["options"]
        option_keys = list(options.keys())
        weights = [weights_map[options[k]] for k in option_keys]
        answers[qid] = random.choices(option_keys, weights=weights, k=1)[0]
    return answers


def calculate_scores(answers):
    scores = {a: 0 for a in ARCHETYPES}
    for qid, option_id in answers.items():
        archetype = QUESTIONS[qid]["options"][option_id]
        scores[archetype] += QUESTIONS[qid]["weight"]
    return scores


def find_result(scores, tiebreaker_answer=None):
    max_score = max(scores.values())
    top = [a for a, s in scores.items() if s == max_score]
    if len(top) == 1:
        return top[0], None
    # Tie — apply tiebreaker
    if tiebreaker_answer is None:
        tiebreaker_answer = random.choice(list(TIEBREAKER_WEIGHTS.keys()))
    tb_weights = TIEBREAKER_WEIGHTS[tiebreaker_answer]
    winner = max(top, key=lambda a: tb_weights[a])
    return winner, tiebreaker_answer


def generate_record(country, language, target_dist, incomplete_rate):
    is_prelaunch = random.random() < PRELAUNCH_PROBABILITY
    timestamp    = random_timestamp(prelaunch=is_prelaunch)

    # Completion: drop-off weighted toward later questions (people who start tend to continue)
    # Drop-off point sampled from questions 1–9; weights favour later drop-offs
    completed = random.random() >= incomplete_rate
    if completed:
        answers   = generate_answers(country)
        scores    = calculate_scores(answers)
        result, tiebreaker = find_result(scores)
    else:
        # At least 1 answer, at most 9; weight toward later questions
        n_answered = random.choices(range(1, 10), weights=[1,2,3,4,5,6,7,8,9], k=1)[0]
        answers    = generate_answers(country, stop_after=n_answered)
        scores     = calculate_scores(answers)
        result     = None
        tiebreaker = None

    return {
        "id":           str(uuid.uuid4()),
        "timestamp":    timestamp,
        "country":      country,
        "completed":    completed,
        "language":     language,
        "target":       pick_weighted(target_dist),
        "is_prelaunch": is_prelaunch,
        "answers":      answers,
        "tiebreaker":   tiebreaker,
        "scores":       scores,
        "result":       result,
    }


def main():
    random.seed(42)

    # Generate independent random archetype distribution for each country
    for country_code, _, __ in COUNTRIES:
        COUNTRY_ARCHETYPE_WEIGHTS[country_code] = random_archetype_weights()

    # Generate per-country target distributions within defined ranges:
    #   0 = 80–85%, remaining split b2c (~85%) / b2b (~15%)
    #   IT gets slightly more b2b: b2b share bumped by 5–10pp
    for country_code, _, __ in COUNTRIES:
        zero_pct = random.uniform(0.80, 0.85)
        remaining = 1.0 - zero_pct
        if country_code == "it":
            b2b_share = random.uniform(0.20, 0.30)   # more corporate
        else:
            b2b_share = random.uniform(0.10, 0.20)
        b2b_pct = remaining * b2b_share
        b2c_pct = remaining - b2b_pct
        TARGET_DISTS[country_code] = [("0", zero_pct), ("b2c", b2c_pct), ("b2b", b2b_pct)]

    # Incomplete rate: random between 7% and 12%
    incomplete_rate = random.uniform(0.07, 0.12)
    print(f"Incomplete rate: {incomplete_rate*100:.1f}%")

    records = []
    total = sum(c[1] for c in COUNTRIES)
    print(f"Generating {total:,} records...")

    for country_code, count, lang_dist, in COUNTRIES:
        target_dist = TARGET_DISTS[country_code]
        for _ in range(count):
            lang = pick_weighted(lang_dist)
            records.append(generate_record(country_code, lang, target_dist, incomplete_rate))

        print(f"  {country_code.upper()}: {count:,} records done")

    # Shuffle so records aren't grouped by country
    random.shuffle(records)

    output_path = "data/mock_survey_results.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, separators=(",", ":"))

    print(f"\nDone. {len(records):,} records written to {output_path}")
    print(f"File size: ~{len(json.dumps(records, separators=(',',':'))) / 1_000_000:.1f} MB")


if __name__ == "__main__":
    main()
