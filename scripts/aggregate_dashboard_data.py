#!/usr/bin/env python3
"""
aggregate_dashboard_data.py
Legge data/mock_survey_results.json e produce data/dashboard_data.json
ottimizzato per il caricamento nella dashboard (browser-friendly, ~500KB).

Uso: python3 scripts/aggregate_dashboard_data.py
"""

import json
import os
from datetime import datetime, timezone
from collections import defaultdict

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_PATH = os.path.join(BASE_DIR, "data", "mock_survey_results.json")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "dashboard_data.json")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
ARCHETYPES = [
    "capitano", "pioniere", "risolutore", "connettore",
    "pragmatico", "artigiano", "stratega", "collaboratore",
]
QUESTIONS = [f"Q{i}" for i in range(1, 11)]
ANSWER_OPTIONS = ["A", "B", "C", "D"]
TARGET_LABELS = {"b2b": "B2B", "b2c": "B2C", "0": "General"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def iso_to_week(ts: str) -> str:
    """Converte timestamp ISO in chiave settimana 'YYYY-WNN'."""
    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    return f"{dt.isocalendar()[0]}-W{dt.isocalendar()[1]:02d}"


def iso_to_date(ts: str) -> str:
    """Restituisce solo la data YYYY-MM-DD."""
    return ts[:10]


def empty_archetype_counts() -> dict:
    return {a: 0 for a in ARCHETYPES}


def empty_target_counts() -> dict:
    return {k: 0 for k in TARGET_LABELS}


def empty_question_counts() -> dict:
    return {q: {opt: 0 for opt in ANSWER_OPTIONS} for q in QUESTIONS}


def parse_answer_letter(raw: str) -> str:
    """Estrae la lettera A/B/C/D da valori tipo '1C', '2B', 'A', ecc."""
    if not raw:
        return None
    raw = raw.strip()
    # Formato numerico: "1C", "10D" → prendi l'ultimo carattere
    if raw and raw[-1] in ANSWER_OPTIONS:
        return raw[-1]
    return None


# ---------------------------------------------------------------------------
# Aggregation
# ---------------------------------------------------------------------------
def aggregate(records: list) -> dict:
    """Aggrega una lista di record in struttura dashboard."""
    by_archetype = empty_archetype_counts()
    by_target = empty_target_counts()
    by_country: dict[str, int] = defaultdict(int)
    weekly: dict[str, int] = defaultdict(int)
    weekly_by_target: dict[str, dict] = defaultdict(lambda: {k: 0 for k in TARGET_LABELS})
    weekly_by_archetype: dict[str, dict] = defaultdict(lambda: {a: 0 for a in ARCHETYPES})
    weekly_by_country: dict[str, dict] = defaultdict(lambda: defaultdict(int))
    question_answers = empty_question_counts()
    total = 0

    for r in records:
        total += 1
        result = r.get("result")
        if result in by_archetype:
            by_archetype[result] += 1

        target = r.get("target", "0")
        if target in by_target:
            by_target[target] += 1

        country = r.get("country", "??")
        by_country[country] += 1

        week = iso_to_week(r["timestamp"])
        weekly[week] += 1
        if target in TARGET_LABELS:
            weekly_by_target[week][target] += 1
        if result in ARCHETYPES:
            weekly_by_archetype[week][result] += 1
        weekly_by_country[week][country] += 1

        answers = r.get("answers", {})
        for q in QUESTIONS:
            letter = parse_answer_letter(answers.get(q, ""))
            if letter:
                question_answers[q][letter] += 1

    # Ordina settimane cronologicamente — include breakdown per target, archetype, country
    weekly_sorted = [
        {
            "week": w,
            "count": c,
            "by_target": dict(weekly_by_target[w]),
            "by_archetype": dict(weekly_by_archetype[w]),
            "by_country": dict(weekly_by_country[w]),
        }
        for w, c in sorted(weekly.items())
    ]

    # by_archetype suddiviso per target (per il filtro Audience)
    by_archetype_target: dict[str, dict] = {a: {t: 0 for t in TARGET_LABELS} for a in ARCHETYPES}
    for r in records:
        result = r.get("result")
        target = r.get("target", "0")
        if result in by_archetype_target and target in by_archetype_target[result]:
            by_archetype_target[result][target] += 1

    # question_answers suddiviso per target
    question_answers_by_target: dict = {
        q: {t: {opt: 0 for opt in ANSWER_OPTIONS} for t in TARGET_LABELS}
        for q in QUESTIONS
    }
    for r in records:
        target = r.get("target", "0")
        if target not in TARGET_LABELS:
            continue
        answers = r.get("answers", {})
        for q in QUESTIONS:
            letter = parse_answer_letter(answers.get(q, ""))
            if letter:
                question_answers_by_target[q][target][letter] += 1

    return {
        "total": total,
        "by_archetype": by_archetype,
        "by_archetype_target": by_archetype_target,
        "by_target": by_target,
        "by_country": dict(sorted(by_country.items(), key=lambda x: -x[1])),
        "weekly": weekly_sorted,
        "question_answers": question_answers,
        "question_answers_by_target": question_answers_by_target,
    }


def aggregate_country(records: list) -> dict:
    """Aggrega record per una singola country (omette by_country ridondante)."""
    agg = aggregate(records)
    del agg["by_country"]
    return agg


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print(f"Caricamento {INPUT_PATH} ...")
    with open(INPUT_PATH, encoding="utf-8") as f:
        all_records = json.load(f)

    total_raw = len(all_records)
    print(f"  Record totali: {total_raw:,}")

    # ---------------------------------------------------------------------------
    # 4 slice in base ai toggle: completed × is_prelaunch
    #
    #   key              completed   is_prelaunch
    #   "default"        True        False          ← default dashboard
    #   "incl_prelaunch" True        True/False
    #   "incl_abandoned" True/False  False
    #   "all"            True/False  True/False
    # ---------------------------------------------------------------------------
    slices_def = {
        "default":        lambda r: r.get("completed") and not r.get("is_prelaunch"),
        "incl_prelaunch": lambda r: r.get("completed"),
        "incl_abandoned": lambda r: not r.get("is_prelaunch"),
        "all":            lambda r: True,
    }
    record_slices = {k: [r for r in all_records if fn(r)] for k, fn in slices_def.items()}

    for k, recs in record_slices.items():
        print(f"  slice '{k}': {len(recs):,}")

    # Tasso di completamento per country (sempre su tutti i record)
    completion_by_country: dict[str, dict] = defaultdict(lambda: {"total": 0, "completed": 0})
    for r in all_records:
        c = r.get("country", "??")
        completion_by_country[c]["total"] += 1
        if r.get("completed"):
            completion_by_country[c]["completed"] += 1

    # ---------------------------------------------------------------------------
    # Analytics globali: dropout per domanda + analisi Q11 tiebreaker
    # Calcolati sempre su record non-prelaunch (indipendenti dai toggle slice)
    # ---------------------------------------------------------------------------
    non_prelaunch = [r for r in all_records if not r.get("is_prelaunch")]
    abandoned_non_pl = [r for r in non_prelaunch if not r.get("completed")]
    completed_non_pl = [r for r in non_prelaunch if r.get("completed")]

    # Dropout: per ogni record abbandonato trova l'ultima domanda risposta
    dropout_by_question = {f"Q{i}": 0 for i in range(1, 11)}
    for r in abandoned_non_pl:
        answers = r.get("answers", {})
        max_q = 0
        for q_key in answers:
            if q_key.startswith("Q"):
                try:
                    n = int(q_key[1:])
                    if n > max_q:
                        max_q = n
                except ValueError:
                    pass
        if 1 <= max_q <= 10:
            dropout_by_question[f"Q{max_q}"] += 1

    # Tiebreaker Q11: conta 11A/11B/11C/11D su record completati non-prelaunch
    tb_options = ["11A", "11B", "11C", "11D"]
    tiebreaker_answers = {k: 0 for k in tb_options}
    tiebreaker_count = 0
    for r in completed_non_pl:
        tb = r.get("tiebreaker")
        if tb in tiebreaker_answers:
            tiebreaker_answers[tb] += 1
            tiebreaker_count += 1

    tiebreaker_rate = round(tiebreaker_count / len(completed_non_pl) * 100, 1) if completed_non_pl else 0
    analytics = {
        "dropout_by_question": dropout_by_question,
        "tiebreaker_answers": tiebreaker_answers,
        "tiebreaker_count": tiebreaker_count,
        "tiebreaker_rate": tiebreaker_rate,
        "abandoned_count": len(abandoned_non_pl),
    }

    # Aggregazione globale — tutte e 4 le slice
    print("Aggregazione globale ...")
    global_slices = {}
    for k, recs in record_slices.items():
        agg = aggregate(recs)
        # by_country conservato solo nel default per il grafico top-10
        if k != "default":
            agg.pop("by_country", None)
        global_slices[k] = agg

    # Padding settimane: tutti gli slice devono avere le stesse settimane
    # (con count=0 dove non ci sono dati) così i toggle non cambiano il range temporale
    all_weeks = sorted(set(
        w["week"]
        for sl in global_slices.values()
        for w in sl["weekly"]
    ))
    empty_by_target = {k: 0 for k in TARGET_LABELS}
    empty_by_archetype = {a: 0 for a in ARCHETYPES}
    empty_weekly_entry = lambda wk: {
        "week": wk, "count": 0,
        "by_target": dict(empty_by_target),
        "by_archetype": dict(empty_by_archetype),
        "by_country": {},
    }
    for sl in global_slices.values():
        existing = {w["week"]: w for w in sl["weekly"]}
        sl["weekly"] = [
            existing.get(wk, empty_weekly_entry(wk))
            for wk in all_weeks
        ]

    # Aggregazione per country — tutte e 4 le slice
    print("Aggregazione per country ...")
    countries_in_data = sorted(set(r["country"] for r in record_slices["default"]))
    by_country_data: dict[str, dict] = {}
    for country in countries_in_data:
        country_slices = {}
        for k, recs in record_slices.items():
            country_recs = [r for r in recs if r["country"] == country]
            country_slices[k] = aggregate_country(country_recs)
        # Padding settimane per country (stesso set globale)
        for k in list(country_slices.keys()):
            if not isinstance(country_slices[k], dict) or "weekly" not in country_slices[k]:
                continue
            existing = {w["week"]: w for w in country_slices[k]["weekly"]}
            country_slices[k]["weekly"] = [
                existing.get(wk, empty_weekly_entry(wk))
                for wk in all_weeks
            ]
        country_slices["completion_rate"] = round(
            completion_by_country[country]["completed"] /
            completion_by_country[country]["total"] * 100, 1
        ) if completion_by_country[country]["total"] else 0
        by_country_data[country] = country_slices
        print(f"  {country}: {len([r for r in record_slices['default'] if r['country'] == country]):,} (default)")

    # Date range
    all_ts = sorted(r["timestamp"] for r in all_records)
    date_range = {"min": all_ts[0][:10], "max": all_ts[-1][:10]}

    # Output
    output = {
        "analytics": analytics,
        "meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source_records": total_raw,
            "slice_counts": {k: len(v) for k, v in record_slices.items()},
            "date_range": date_range,
            "countries": countries_in_data,
            "archetypes": ARCHETYPES,
            "targets": list(TARGET_LABELS.keys()),
            "target_labels": TARGET_LABELS,
        },
        "global": global_slices,
        "countries": by_country_data,
    }

    print(f"Scrittura {OUTPUT_PATH} ...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"Completato. Dimensione output: {size_kb:.0f} KB")


if __name__ == "__main__":
    main()
