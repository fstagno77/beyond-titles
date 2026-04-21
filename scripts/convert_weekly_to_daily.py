#!/usr/bin/env python3
"""
convert_weekly_to_daily.py
--------------------------
Converte gli array `weekly` del dashboard_data.json in array `daily`,
distribuendo il conteggio settimanale su 7 giorni con il pattern realistico:
  Lun 17%, Mar 18%, Mer 18%, Gio 16%, Ven 14%, Sab 9%, Dom 8%

I totali cumulativi (total, by_archetype, by_target, ecc.) rimangono invariati.
L'array `weekly` viene mantenuto nel JSON (non rimosso) per compatibilità futura.

Usage:
  python3 scripts/convert_weekly_to_daily.py
"""

import json
import os
from datetime import date, timedelta

# ---------------------------------------------------------------------------
# Pattern di distribuzione (lunedì → domenica)
# ---------------------------------------------------------------------------
DAY_WEIGHTS = [0.17, 0.18, 0.18, 0.16, 0.14, 0.09, 0.08]  # somma = 1.00

# ---------------------------------------------------------------------------
# Helper: converte ISO week string → lunedì della settimana (date)
# ---------------------------------------------------------------------------
def iso_week_to_monday(week_str: str) -> date:
    """'2026-W18' → date(2026, 4, 27)"""
    year_str, week_part = week_str.split('-W')
    year = int(year_str)
    week = int(week_part)
    # ISO 8601: il 4 gennaio è sempre nella settimana 1
    jan4 = date(year, 1, 4)
    jan4_weekday = jan4.isoweekday()  # 1=lun … 7=dom
    monday = jan4 - timedelta(days=jan4_weekday - 1) + timedelta(weeks=week - 1)
    return monday


# ---------------------------------------------------------------------------
# Distribuisce un intero `total` sui 7 giorni
# Il lunedì assorbe le differenze di arrotondamento
# ---------------------------------------------------------------------------
def distribute_count(total: int) -> list[int]:
    if total == 0:
        return [0] * 7
    raw = [total * w for w in DAY_WEIGHTS]
    floored = [int(v) for v in raw]
    remainder = total - sum(floored)
    floored[0] += remainder  # aggiusta sul lunedì
    return floored


# ---------------------------------------------------------------------------
# Distribuisce proporzionalmente un dizionario {key: int} sui 7 giorni
# ---------------------------------------------------------------------------
def distribute_dict(d: dict, total_week: int) -> list[dict]:
    """
    Ritorna lista di 7 dict (uno per giorno), stesso schema di d.
    Se total_week == 0 ogni giorno è tutto zero.
    """
    daily_dicts = [{k: 0 for k in d} for _ in range(7)]
    if total_week == 0:
        return daily_dicts

    for key, val in d.items():
        if val == 0:
            continue
        distributed = distribute_count(val)
        for i, v in enumerate(distributed):
            daily_dicts[i][key] = v

    return daily_dicts


# ---------------------------------------------------------------------------
# Converte un singolo array weekly → array daily
# ---------------------------------------------------------------------------
def weekly_to_daily(weekly: list[dict]) -> list[dict]:
    daily = []
    for entry in weekly:
        week_str = entry['week']
        total_count = entry.get('count', 0)
        monday = iso_week_to_monday(week_str)

        counts = distribute_count(total_count)

        by_target_days  = distribute_dict(entry.get('by_target', {}), total_count)
        by_arch_days    = distribute_dict(entry.get('by_archetype', {}), total_count)
        by_country_days = distribute_dict(entry.get('by_country', {}), total_count)

        for i in range(7):
            d = monday + timedelta(days=i)
            day_entry = {
                'date':        d.isoformat(),
                'count':       counts[i],
                'by_target':   by_target_days[i],
                'by_archetype': by_arch_days[i],
                'by_country':  by_country_days[i],
            }
            daily.append(day_entry)

    return daily


# ---------------------------------------------------------------------------
# Processa una slice (ha chiave 'weekly')
# ---------------------------------------------------------------------------
def process_slice(slice_data: dict) -> None:
    if 'weekly' not in slice_data:
        return
    slice_data['daily'] = weekly_to_daily(slice_data['weekly'])


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, '..', 'data', 'dashboard_data.json')
    json_path = os.path.normpath(json_path)

    print(f'Lettura: {json_path}')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # --- global.default ---
    print('  Processing global.default ...')
    process_slice(data['global']['default'])

    # --- global.incl_prelaunch ---
    if 'incl_prelaunch' in data['global']:
        print('  Processing global.incl_prelaunch ...')
        process_slice(data['global']['incl_prelaunch'])

    # --- countries ---
    for code, country_data in data['countries'].items():
        for slice_key in ('default', 'incl_prelaunch', 'incl_abandoned', 'all'):
            if slice_key in country_data and 'weekly' in country_data[slice_key]:
                print(f'  Processing countries.{code}.{slice_key} ...')
                process_slice(country_data[slice_key])

    print(f'Scrittura: {json_path}')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    # Verifica totali
    global_daily = data['global']['default']['daily']
    global_weekly = data['global']['default']['weekly']
    total_daily  = sum(e['count'] for e in global_daily)
    total_weekly = sum(e['count'] for e in global_weekly)
    print()
    print(f'Verifica global.default:')
    print(f'  Totale weekly: {total_weekly}')
    print(f'  Totale daily:  {total_daily}')
    print(f'  Match: {"OK" if total_daily == total_weekly else "ERRORE"}')
    print()
    print(f'Range date daily: {global_daily[0]["date"]} → {global_daily[-1]["date"]}')

    # Aggiorna meta.date_range con il range reale dei dati giornalieri
    first_date = next((e['date'] for e in global_daily if e['count'] > 0), global_daily[0]['date'])
    last_date  = next((e['date'] for e in reversed(global_daily) if e['count'] > 0), global_daily[-1]['date'])
    old_min = data['meta']['date_range']['min']
    old_max = data['meta']['date_range']['max']
    data['meta']['date_range']['min'] = first_date
    data['meta']['date_range']['max'] = last_date
    print(f'meta.date_range aggiornato: {old_min}→{first_date} / {old_max}→{last_date}')

    # Riscrivi il file con i metadati aggiornati
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    print('Conversione completata.')


if __name__ == '__main__':
    main()
